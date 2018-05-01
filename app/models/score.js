import DS from 'ember-data';
import { isBlank } from '@ember/utils';
import { computed } from '@ember/object';

export default DS.Model.extend({
  player: DS.belongsTo(),

  hole: DS.attr(),
  gross: DS.attr('number'),

  init() {
    this._super(...arguments);

    if (isBlank(this.get('createdAt'))) { this.set('createdAt', new Date()); }
  },

  shots: computed('player.bid', 'hole.handicap', function() {
    let shots = Math.floor(this.get('player.bid') / 18);

    const remainder = this.get('player.bid') % 18;

    if (this.get('hole.handicap') <= remainder) {
      shots++;
    }

    return shots;
  })
});
