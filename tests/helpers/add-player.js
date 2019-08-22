import { fillIn, click } from '@ember/test-helpers';

export default async function({ name, handicap, bid }, assert) {
  assert.dom('form.scorecard-add-player input[type="submit"').isDisabled();

  await fillIn('form.scorecard-add-player input[name="player_name"]', name);
  await fillIn('form.scorecard-add-player input[name="player_handicap"]', handicap);
  await fillIn('form.scorecard-add-player input[name="player_bid"]', bid);
  await click('form.scorecard-add-player input[type="submit"]');

  assert.dom('form.scorecard-add-player input[name="player_name"]').hasValue('');
  assert.dom('form.scorecard-add-player input[name="player_handicap"]').hasValue('');
  assert.dom('form.scorecard-add-player input[name="player_bid"]').hasValue('');
  assert.dom('form.scorecard-add-player input[type="submit"').isDisabled();
}
