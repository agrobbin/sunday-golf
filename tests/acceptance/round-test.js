import { module, test } from 'qunit';
import { visit, currentURL, find, click } from '@ember/test-helpers';
import { setupApplicationTest } from '../helpers/setup-application-test';
import moment from 'moment';

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

    assert.equal(find('table.scorecard tr.scorecard-heading').textContent.trim(), `TPC Boston - ${moment(createdAt).format('MMMM Do, YYYY')}`);
  });
});
