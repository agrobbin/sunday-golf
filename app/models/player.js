import Model, { belongsTo, hasMany, attr } from '@ember-data/model';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';

export default class Player extends Model {
  @belongsTo() round;

  @hasMany({ dependent: 'destroy' }) scores;

  @attr() name;
  @attr('number') handicap;
  @attr('number') bid;
  @attr('date') createdAt;
  @attr('date') updatedAt;

  init() {
    super.init(...arguments);

    if (isBlank(this.createdAt)) { this.set('createdAt', new Date()); }
  }

  @computed('scores.@each.gross')
  get totalGross() {
    const scores = this.scores.mapBy('gross').compact();

    if (scores.length === 0) return undefined;

    return scores.reduce((a, b) => a + b, 0);
  }

  @computed('scores.@each.net')
  get totalNet() {
    const scores = this.scores.mapBy('net').compact();

    if (scores.length === 0) return undefined;

    return scores.reduce((a, b) => a + b, 0);
  }
}
