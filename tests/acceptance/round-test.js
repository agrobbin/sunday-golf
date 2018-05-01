import { module, test } from 'qunit';
import { visit, currentURL, find, click, findAll, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from '../helpers/setup-application-test';
import addPlayer from '../helpers/add-player';
import moment from 'moment';
import $ from 'jquery';

module('Acceptance | round', function(hooks) {
  setupApplicationTest(hooks);

  test('the round does not exist', async function(assert) {
    await visit('/rounds/123');

    assert.equal(currentURL(), '/rounds');
  });

  test('creating a round', async function(assert) {
    await visit('/rounds');

    assert.equal(find('nav button').textContent.trim(), 'New round');

    await click('nav button');

    const indexedDb = this.owner.lookup('service:indexed-db');
    const rounds = await indexedDb.findAll('round');

    assert.equal(rounds.length, 1);
    assert.equal(currentURL(), `/rounds/${rounds[0].id}`);
  });

  test('viewing a round', async function(assert) {
    await visit('/rounds');

    assert.equal(find('nav button').textContent.trim(), 'New round');

    await click('nav button');

    const indexedDb = this.owner.lookup('service:indexed-db');
    const rounds = await indexedDb.findAll('round');
    const round = rounds[0];

    const createdAt = round.json.attributes['created-at'];

    assert.equal(findAll('table.scorecard tr.scorecard-heading')[0].textContent.trim(), `TPC Boston - ${moment(createdAt).format('MMMM Do, YYYY')}`);
  });

  test('adding players to a round', async function(assert) {
    await visit('/rounds');

    assert.equal(find('nav button').textContent.trim(), 'New round');

    await click('nav button');

    await addPlayer({ name: 'Alex', handicap: 10, bid: 8 }, assert);
    await addPlayer({ name: 'Adam', handicap: 1, bid: 0 }, assert);

    assert.equal(findAll('table.scorecard tr.scorecard-heading')[1].textContent.trim(), 'Players (2)');
    assert.equal(findAll('tr.player-scorecard').length, 2);
    assert.equal($('tr.player-scorecard:eq(0) td:eq(0)').text().trim(), 'Alex (CH: 10, Bid: 8)');
    assert.equal($('tr.player-scorecard:eq(1) td:eq(0)').text().trim(), 'Adam (CH: 1, Bid: 0)');
  });

  test('inputting player scores', async function(assert) {
    await visit('/rounds');

    assert.equal(find('nav button').textContent.trim(), 'New round');

    await click('nav button');

    await addPlayer({ name: 'Alex', handicap: 10, bid: 8 }, assert);
    await addPlayer({ name: 'Adam', handicap: 1, bid: 0 }, assert);

    await fillIn($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(0) input').get(0), '4');
    await fillIn($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(1) input').get(0), '5');
    await fillIn($('tr.player-scorecard:eq(1) td.player-scorecard-score:eq(0) input').get(0), '3');
    await fillIn($('tr.player-scorecard:eq(1) td.player-scorecard-score:eq(1) input').get(0), '4');

    assert.equal($('tr.player-scorecard:eq(0) td').get(19).textContent.trim(), '9');
    assert.equal($('tr.player-scorecard:eq(1) td').get(19).textContent.trim(), '7');
  });
});
