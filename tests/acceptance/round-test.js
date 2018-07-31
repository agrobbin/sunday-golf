import { module, test } from 'qunit';
import { visit, currentURL, click, findAll, fillIn } from '@ember/test-helpers';
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

    assert.dom('nav button').hasText('New round');

    await click('nav button');

    const indexedDb = this.owner.lookup('service:indexed-db');
    const rounds = await indexedDb.findAll('round');

    assert.equal(rounds.length, 1);
    assert.equal(currentURL(), `/rounds/${rounds[0].id}`);
  });

  test('viewing a round', async function(assert) {
    await visit('/rounds');

    assert.dom('nav button').hasText('New round');

    await click('nav button');

    const indexedDb = this.owner.lookup('service:indexed-db');
    const rounds = await indexedDb.findAll('round');
    const round = rounds[0];

    const createdAt = round.json.attributes['created-at'];

    assert.dom(findAll('div.scorecard-heading')[0]).hasText(`Delete\n    \n\n    ${moment(createdAt).format('MMMM Do, YYYY')}`);
  });

  test('adding players to a round', async function(assert) {
    await visit('/rounds');

    assert.dom('nav button').hasText('New round');

    await click('nav button');

    await addPlayer({ name: 'Alex', handicap: 10, bid: 8 }, assert);

    assert.dom(findAll('table tr.scorecard-heading')[0]).hasText('Team (1 player)');

    await addPlayer({ name: 'Adam', handicap: 1, bid: 0 }, assert);

    assert.dom(findAll('table tr.scorecard-heading')[0]).hasText('Team (2 players)');
    assert.equal(findAll('tr.player-scorecard').length, 2);
    assert.dom($('tr.player-scorecard:eq(0) td').get(0)).hasText('Alex\n\n  \n    CH: 10 Bid: 8');
    assert.dom($('tr.player-scorecard:eq(1) td').get(0)).hasText('Adam\n\n  \n    CH: 1 Bid: 0');
  });

  test('seeing the shots of a player', async function(assert) {
    await visit('/rounds');

    assert.dom('nav button').hasText('New round');

    await click('nav button');

    await addPlayer({ name: 'Alex', handicap: 20, bid: 19 }, assert);

    assert.equal($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(0) .shots .shots-shot').length, 1);
    assert.equal($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(1) .shots .shots-shot').length, 1);
    assert.equal($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(2) .shots .shots-shot').length, 1);
    assert.equal($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(3) .shots .shots-shot').length, 1);
    assert.equal($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(4) .shots .shots-shot').length, 1);
    assert.equal($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(5) .shots .shots-shot').length, 1);
    assert.equal($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(6) .shots .shots-shot').length, 2); // 7th hole, #1 handicap hole
    assert.equal($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(7) .shots .shots-shot').length, 1);
    assert.equal($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(8) .shots .shots-shot').length, 1);
    assert.equal($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(9) .shots .shots-shot').length, 1);
    assert.equal($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(10) .shots .shots-shot').length, 1);
    assert.equal($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(11) .shots .shots-shot').length, 1);
    assert.equal($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(12) .shots .shots-shot').length, 1);
    assert.equal($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(13) .shots .shots-shot').length, 1);
    assert.equal($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(14) .shots .shots-shot').length, 1);
    assert.equal($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(15) .shots .shots-shot').length, 1);
    assert.equal($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(16) .shots .shots-shot').length, 1);
    assert.equal($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(17) .shots .shots-shot').length, 1);
  });

  test('inputting player scores and calculating totals', async function(assert) {
    await visit('/rounds');

    assert.dom('nav button').hasText('New round');

    await click('nav button');

    await addPlayer({ name: 'Alex', handicap: 10, bid: 8 }, assert);
    await addPlayer({ name: 'Adam', handicap: 1, bid: 0 }, assert);
    await addPlayer({ name: 'Aaron', handicap: 21, bid: 21 }, assert);

    assert.dom($('tr.player-scorecard:eq(0) td').get(19)).hasText('');
    assert.dom($('tr.player-scorecard:eq(0) td').get(20)).hasText('');
    assert.dom($('tr.player-scorecard:eq(1) td').get(19)).hasText('');
    assert.dom($('tr.player-scorecard:eq(1) td').get(20)).hasText('');
    assert.dom($('tr.player-scorecard:eq(2) td').get(19)).hasText('');
    assert.dom($('tr.player-scorecard:eq(2) td').get(20)).hasText('');

    // hole 1
    await fillIn($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(0) input').get(0), '4');
    await fillIn($('tr.player-scorecard:eq(1) td.player-scorecard-score:eq(0) input').get(0), '4');
    await fillIn($('tr.player-scorecard:eq(2) td.player-scorecard-score:eq(0) input').get(0), '4');

    // hole 2
    await fillIn($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(1) input').get(0), '5');
    await fillIn($('tr.player-scorecard:eq(1) td.player-scorecard-score:eq(1) input').get(0), '5');
    await fillIn($('tr.player-scorecard:eq(2) td.player-scorecard-score:eq(1) input').get(0), '5');

    // hole 3
    await fillIn($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(2) input').get(0), '4');
    await fillIn($('tr.player-scorecard:eq(1) td.player-scorecard-score:eq(2) input').get(0), '3');
    await fillIn($('tr.player-scorecard:eq(2) td.player-scorecard-score:eq(2) input').get(0), '4');

    // hole 4
    await fillIn($('tr.player-scorecard:eq(0) td.player-scorecard-score:eq(3) input').get(0), '3');
    await fillIn($('tr.player-scorecard:eq(1) td.player-scorecard-score:eq(3) input').get(0), '3');
    await fillIn($('tr.player-scorecard:eq(2) td.player-scorecard-score:eq(3) input').get(0), '3');

    // player totals
    assert.dom($('tr.player-scorecard:eq(0) td').get(19)).hasText('16');
    assert.dom($('tr.player-scorecard:eq(0) td').get(20)).hasText('15');
    assert.dom($('tr.player-scorecard:eq(1) td').get(19)).hasText('15');
    assert.dom($('tr.player-scorecard:eq(1) td').get(20)).hasText('15');
    assert.dom($('tr.player-scorecard:eq(2) td').get(19)).hasText('16');
    assert.dom($('tr.player-scorecard:eq(2) td').get(20)).hasText('11');

    // team nets
    assert.deepEqual($('table tr:eq(8) td').map(function () { return $(this).text().trim() }).get(), ['Per hole', '−1', '−3', '+1', '−4', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    assert.deepEqual($('table tr:eq(9) td').map(function () { return $(this).text().trim() }).get(), ['Total', '−1', '−4', '−3', '−7', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  });

  test('deleting a round', async function(assert) {
    await visit('/rounds');

    assert.dom('nav button').hasText('New round');

    await click('nav button');

    // add dependent data
    await addPlayer({ name: 'Alex', handicap: 10, bid: 8 }, assert);

    await click('button.scorecoard-remove-round');

    const indexedDb = this.owner.lookup('service:indexed-db');
    const rounds = await indexedDb.findAll('round');
    const players = await indexedDb.findAll('player');
    const scores = await indexedDb.findAll('score');

    assert.equal(currentURL(), '/rounds');
    assert.equal(rounds.length, 0);
    assert.equal(players.length, 0);
    assert.equal(scores.length, 0);
  });
});
