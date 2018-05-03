import DS from 'ember-data';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';

export default DS.Model.extend({
  round: DS.belongsTo(),

  scores: DS.hasMany({ dependent: 'destroy' }),

  name: DS.attr(),
  handicap: DS.attr('number'),
  bid: DS.attr('number'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),

  init() {
    this._super(...arguments);

    if (isBlank(this.get('createdAt'))) { this.set('createdAt', new Date()); }
  },

  totalGross: computed('scores.@each.gross', function() {
    const scores = this.get('scores').mapBy('gross').compact();

    if (scores.get('length') > 0) {
      return scores.reduce((a, b) => a + b, 0);
    }
  }),

  totalNet: computed('scores.@each.net', function() {
    const scores = this.get('scores').mapBy('net').compact();

    if (scores.get('length') > 0) {
      return scores.reduce((a, b) => a + b, 0);
    }
  })
});
