import { module, test } from 'qunit';
import { visit, find, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from '../helpers/setup-application-test';

module('Acceptance | rounds', function(hooks) {
  setupApplicationTest(hooks);

  test('there are no rounds', async function(assert) {
    await visit('/rounds');

    assert.equal(find('.rounds-list').textContent.trim(), 'You have no saved rounds.');
  });

  test('the rounds are listed in reverse-chronological order', async function(assert) {
    const indexedDb = this.owner.lookup('service:indexed-db');

    await indexedDb.setup();
    await indexedDb.add('round', { type: 'rounds', id: '123', attributes: { 'created-at': '2018-06-09T01:49:14.602Z', 'updated-at': null }, relationships: { players: { links: { related: '--indexeddb--' } } } });
    await indexedDb.add('round', { type: 'rounds', id: '456', attributes: { 'created-at': '2018-06-10T01:49:14.602Z', 'updated-at': null }, relationships: { players: { links: { related: '--indexeddb--' } } } });

    await visit('/rounds');

    assert.deepEqual(findAll('.rounds-list-item').map((item) => item.textContent.trim()), ['June 9th, 2018 09:49pm', 'June 8th, 2018 09:49pm']);
  });
});
