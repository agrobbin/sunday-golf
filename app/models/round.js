import Stats from './stats';
import DS from 'ember-data';
import { isBlank } from '@ember/utils';
import { computed } from '@ember/object';
import { all } from 'rsvp';

export default DS.Model.extend({
  players: DS.hasMany({ dependent: 'destroy' }),

  scores: computed('players.@each', function() {
    const scoreChanged = () => {
      // ignore observer callbacks when the `Round` has been destroyed
      if (this.isDestroyed) return;

      this.notifyPropertyChange('scores');
    };

    return DS.PromiseArray.create({
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

  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),

  init() {
    this._super(...arguments);

    if (isBlank(this.createdAt)) { this.set('createdAt', new Date()); }
  },

  stats: computed('scores.@each', function() {
    return DS.PromiseObject.create({
      promise: this.scores.then((scores) => Stats.create({ scores }))
    });
  })
});
