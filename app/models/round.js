import Stats from './stats';
import Model, { hasMany, attr } from '@ember-data/model';
import DS from 'ember-data';
import { isBlank } from '@ember/utils';
import { computed } from '@ember/object';
import { all } from 'rsvp';

const { PromiseArray, PromiseObject } = DS;

export default Model.extend({
  players: hasMany({ dependent: 'destroy' }),

  scores: computed('players.@each', function() {
    const scoreChanged = () => {
      // ignore observer callbacks when the `Round` has been destroyed
      if (this.isDestroyed) return;

      this.notifyPropertyChange('scores');
    };

    return PromiseArray.create({
      promise: this.players.then((players) => {
        return all(players.mapBy('scores')).then((playerScores) => {
          // add observers for when a `Score` changes
          players.invoke('addObserver', 'scores.@each.isDeleted', this, scoreChanged);

          const flattenedScores = playerScores.flatMap((scores) => scores.toArray());

          return flattenedScores.rejectBy('isDeleted');
        });
      })
    });
  }),

  createdAt: attr('date'),
  updatedAt: attr('date'),

  init() {
    this._super(...arguments);

    if (isBlank(this.createdAt)) { this.set('createdAt', new Date()); }
  },

  stats: computed('scores.@each', function() {
    return PromiseObject.create({
      promise: this.scores.then((scores) => Stats.create({ scores }))
    });
  })
});
