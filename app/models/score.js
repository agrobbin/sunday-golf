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
  }),

  net: computed('gross', 'shots', function() {
    if (isBlank(this.get('gross'))) { return; }

    return this.get('gross') - this.get('shots');
  }),

  grossToPar: computed('gross', 'hole.par', function() {
    if (isBlank(this.get('gross'))) { return; }

    return this.get('gross') - this.get('hole.par');
  }),

  netToPar: computed('net', 'hole.par', function() {
    if (isBlank(this.get('net'))) { return; }

    return this.get('net') - this.get('hole.par');
  })
});
