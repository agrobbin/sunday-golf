import Component from '@ember/component';
import { action } from '@ember/object';

export default class PlayerScorecardComponent extends Component {
  tagName = 'tr';
  classNames = ['player-scorecard'];

  @action
  save(score, gross) {
    const value = parseInt(gross);

    score.set('gross', isNaN(value) ? null : value);

    score.save();
  }

  @action
  selectAll(element) {
    element.select();
  }
}
