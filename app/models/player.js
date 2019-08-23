import Model, { belongsTo, hasMany, attr } from '@ember-data/model';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';

export default Model.extend({
  round: belongsTo(),

  scores: hasMany({ dependent: 'destroy' }),

  name: attr(),
  handicap: attr('number'),
  bid: attr('number'),
  createdAt: attr('date'),
  updatedAt: attr('date'),

  init() {
    this._super(...arguments);

    if (isBlank(this.createdAt)) { this.set('createdAt', new Date()); }
  },

  totalGross: computed('scores.@each.gross', function() {
    const scores = this.scores.mapBy('gross').compact();

    if (scores.length > 0) {
      return scores.reduce((a, b) => a + b, 0);
    }
  }),

  totalNet: computed('scores.@each.net', function() {
    const scores = this.scores.mapBy('net').compact();

    if (scores.length > 0) {
      return scores.reduce((a, b) => a + b, 0);
    }
  })
});
