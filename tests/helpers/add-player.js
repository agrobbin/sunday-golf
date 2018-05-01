import { find, fillIn, click } from '@ember/test-helpers';

export default async function({ name, handicap, bid }, assert) {
  assert.equal(find('form.scorecard-add-player input[type="submit"').disabled, true);

  await fillIn('form.scorecard-add-player input[name="player_name"]', name);
  await fillIn('form.scorecard-add-player input[name="player_handicap"]', handicap);
  await fillIn('form.scorecard-add-player input[name="player_bid"]', bid);
  await click('form.scorecard-add-player input[type="submit"]');

  assert.equal(find('form.scorecard-add-player input[name="player_name"]').value, '');
  assert.equal(find('form.scorecard-add-player input[name="player_handicap"]').value, '');
  assert.equal(find('form.scorecard-add-player input[name="player_bid"]').value, '');
  assert.equal(find('form.scorecard-add-player input[type="submit"').disabled, true);
}
