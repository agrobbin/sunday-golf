import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class PlayerScorecardComponent extends Component {
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
