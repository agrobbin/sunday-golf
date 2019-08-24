import Stats from './stats';
import Model, { hasMany, attr } from '@ember-data/model';
import DS from 'ember-data';
import { isBlank } from '@ember/utils';
import { computed } from '@ember/object';
import { all } from 'rsvp';

const { PromiseArray, PromiseObject } = DS;

export default class Round extends Model {
  @hasMany({ dependent: 'destroy' }) players;

  @attr('date') createdAt;
  @attr('date') updatedAt;

  init() {
    super.init(...arguments);

    if (isBlank(this.createdAt)) { this.set('createdAt', new Date()); }
  }

  @computed('players.@each')
  get scores() {
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
  }

  @computed('scores.@each')
  get stats() {
    return PromiseObject.create({
      promise: this.scores.then((scores) => new Stats(scores))
    });
  }
}
