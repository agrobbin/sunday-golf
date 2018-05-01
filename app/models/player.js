import DS from 'ember-data';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';

export default DS.Model.extend({
  round: DS.belongsTo(),

  scores: DS.hasMany(),

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
    return this.get('scores').mapBy('gross').compact().reduce((a, b) => a + b, 0);
  })
});
