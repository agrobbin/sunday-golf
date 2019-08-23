import { module, test } from 'qunit';
import { visit, currentURL, click, findAll, find, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from '../helpers/setup-application-test';
import addPlayer from '../helpers/add-player';

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

    const createdAt = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(round.json.attributes['created-at']));

    assert.dom(findAll('div.scorecard-heading')[0]).hasText(`Delete\n    \n\n    ${createdAt}`);
  });

  test('adding players to a round', async function(assert) {
    await visit('/rounds');

    assert.dom('nav button').hasText('New round');

    await click('nav button');

    await addPlayer({ name: 'Alex', handicap: 10, bid: 8 }, assert);

    assert.dom(findAll('table tr.scorecard-heading')[0]).hasText('Team (1 player)');

    await addPlayer({ name: 'Adam', handicap: 1, bid: 0 }, assert);

    assert.dom(findAll('table tr.scorecard-heading')[0]).hasText('Team (2 players)');
    assert.dom('tr.player-scorecard').exists({ count: 2 });
    assert.dom(find('tr.player-scorecard:nth-child(1) td')).hasText('Alex\n\n  \n    CH: 10 Bid: 8');
    assert.dom(find('tr.player-scorecard:nth-child(2) td')).hasText('Adam\n\n  \n    CH: 1 Bid: 0');
  });

  test('seeing the shots of a player', async function(assert) {
    await visit('/rounds');

    assert.dom('nav button').hasText('New round');

    await click('nav button');

    await addPlayer({ name: 'Alex', handicap: 20, bid: 19 }, assert);

    assert.dom('tr.player-scorecard:nth-child(1) td.player-scorecard-score:nth-child(2) .shots .shots-shot').exists({ count: 1 });
    assert.dom('tr.player-scorecard:nth-child(1) td.player-scorecard-score:nth-child(3) .shots .shots-shot').exists({ count: 1 });
    assert.dom('tr.player-scorecard:nth-child(1) td.player-scorecard-score:nth-child(4) .shots .shots-shot').exists({ count: 1 });
    assert.dom('tr.player-scorecard:nth-child(1) td.player-scorecard-score:nth-child(5) .shots .shots-shot').exists({ count: 1 });
    assert.dom('tr.player-scorecard:nth-child(1) td.player-scorecard-score:nth-child(6) .shots .shots-shot').exists({ count: 1 });
    assert.dom('tr.player-scorecard:nth-child(1) td.player-scorecard-score:nth-child(7) .shots .shots-shot').exists({ count: 1 });
    assert.dom('tr.player-scorecard:nth-child(1) td.player-scorecard-score:nth-child(8) .shots .shots-shot').exists({ count: 2 }); // 7th hole, #1 handicap hole
    assert.dom('tr.player-scorecard:nth-child(1) td.player-scorecard-score:nth-child(9) .shots .shots-shot').exists({ count: 1 });
    assert.dom('tr.player-scorecard:nth-child(1) td.player-scorecard-score:nth-child(10) .shots .shots-shot').exists({ count: 1 });
    assert.dom('tr.player-scorecard:nth-child(1) td.player-scorecard-score:nth-child(11) .shots .shots-shot').exists({ count: 1 });
    assert.dom('tr.player-scorecard:nth-child(1) td.player-scorecard-score:nth-child(12) .shots .shots-shot').exists({ count: 1 });
    assert.dom('tr.player-scorecard:nth-child(1) td.player-scorecard-score:nth-child(13) .shots .shots-shot').exists({ count: 1 });
    assert.dom('tr.player-scorecard:nth-child(1) td.player-scorecard-score:nth-child(14) .shots .shots-shot').exists({ count: 1 });
    assert.dom('tr.player-scorecard:nth-child(1) td.player-scorecard-score:nth-child(15) .shots .shots-shot').exists({ count: 1 });
    assert.dom('tr.player-scorecard:nth-child(1) td.player-scorecard-score:nth-child(16) .shots .shots-shot').exists({ count: 1 });
    assert.dom('tr.player-scorecard:nth-child(1) td.player-scorecard-score:nth-child(17) .shots .shots-shot').exists({ count: 1 });
    assert.dom('tr.player-scorecard:nth-child(1) td.player-scorecard-score:nth-child(18) .shots .shots-shot').exists({ count: 1 });
    assert.dom('tr.player-scorecard:nth-child(1) td.player-scorecard-score:nth-child(19) .shots .shots-shot').exists({ count: 1 });
  });

  test('inputting player scores and calculating totals', async function(assert) {
    await visit('/rounds');

    assert.dom('nav button').hasText('New round');

    await click('nav button');

    await addPlayer({ name: 'Alex', handicap: 10, bid: 8 }, assert);
    await addPlayer({ name: 'Adam', handicap: 1, bid: 0 }, assert);
    await addPlayer({ name: 'Aaron', handicap: 21, bid: 21 }, assert);

    assert.dom('tr.player-scorecard:nth-child(1) td:nth-child(20)').hasText('');
    assert.dom('tr.player-scorecard:nth-child(1) td:nth-child(21)').hasText('');
    assert.dom('tr.player-scorecard:nth-child(2) td:nth-child(20)').hasText('');
    assert.dom('tr.player-scorecard:nth-child(2) td:nth-child(21)').hasText('');
    assert.dom('tr.player-scorecard:nth-child(3) td:nth-child(20)').hasText('');
    assert.dom('tr.player-scorecard:nth-child(3) td:nth-child(21)').hasText('');

    // hole 1
    await fillIn('tr.player-scorecard:nth-child(1) td.player-scorecard-score:nth-child(2) input', '4');
    await fillIn('tr.player-scorecard:nth-child(2) td.player-scorecard-score:nth-child(2) input', '4');
    await fillIn('tr.player-scorecard:nth-child(3) td.player-scorecard-score:nth-child(2) input', '4');

    // hole 2
    await fillIn('tr.player-scorecard:nth-child(1) td.player-scorecard-score:nth-child(3) input', '5');
    await fillIn('tr.player-scorecard:nth-child(2) td.player-scorecard-score:nth-child(3) input', '5');
    await fillIn('tr.player-scorecard:nth-child(3) td.player-scorecard-score:nth-child(3) input', '5');

    // hole 3
    await fillIn('tr.player-scorecard:nth-child(1) td.player-scorecard-score:nth-child(4) input', '4');
    await fillIn('tr.player-scorecard:nth-child(2) td.player-scorecard-score:nth-child(4) input', '3');
    await fillIn('tr.player-scorecard:nth-child(3) td.player-scorecard-score:nth-child(4) input', '4');

    // hole 4
    await fillIn('tr.player-scorecard:nth-child(1) td.player-scorecard-score:nth-child(5) input', '3');
    await fillIn('tr.player-scorecard:nth-child(2) td.player-scorecard-score:nth-child(5) input', '3');
    await fillIn('tr.player-scorecard:nth-child(3) td.player-scorecard-score:nth-child(5) input', '3');

    // player totals
    assert.dom('tr.player-scorecard:nth-child(1) td:nth-child(20)').hasText('16');
    assert.dom('tr.player-scorecard:nth-child(1) td:nth-child(21)').hasText('15');
    assert.dom('tr.player-scorecard:nth-child(2) td:nth-child(20)').hasText('15');
    assert.dom('tr.player-scorecard:nth-child(2) td:nth-child(21)').hasText('15');
    assert.dom('tr.player-scorecard:nth-child(3) td:nth-child(20)').hasText('16');
    assert.dom('tr.player-scorecard:nth-child(3) td:nth-child(21)').hasText('11');

    // team nets
    assert.deepEqual(findAll('table tfoot tr:nth-child(2) td').map((el) => el.textContent.trim()), ['Per hole', '−1', '−3', '+1', '−4', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    assert.deepEqual(findAll('table tfoot tr:nth-child(3) td').map((el) => el.textContent.trim()), ['Total', '−1', '−4', '−3', '−7', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
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
