import Stats from './stats';
import DS from 'ember-data';
import { isBlank } from '@ember/utils';
import { computed } from '@ember/object';
import hasManyThrough from 'ember-data-has-many-through/macros/has-many-through';

export default DS.Model.extend({
  players: DS.hasMany({ dependent: 'destroy' }),

  scores: hasManyThrough('players'),

  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),

  init() {
    this._super(...arguments);

    if (isBlank(this.get('createdAt'))) { this.set('createdAt', new Date()); }
  },

  stats: computed('scores.@each', function() {
    return DS.PromiseObject.create({
      promise: this.get('scores').then((scores) => Stats.create({ scores }))
    });
  })
});
