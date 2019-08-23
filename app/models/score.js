import Model, { belongsTo, attr } from '@ember-data/model';
import { isBlank } from '@ember/utils';
import { computed } from '@ember/object';

export default Model.extend({
  player: belongsTo(),

  hole: attr(),
  gross: attr('number'),

  init() {
    this._super(...arguments);

    if (isBlank(this.createdAt)) { this.set('createdAt', new Date()); }
  },

  shots: computed('player.bid', 'hole.handicap', function() {
    let shots = Math.floor(this.player.get('bid') / 18);

    const remainder = this.player.get('bid') % 18;

    if (this.hole.handicap <= remainder) {
      shots++;
    }

    return shots;
  }),

  net: computed('gross', 'shots', function() {
    if (isBlank(this.gross)) { return; }

    return this.gross - this.shots;
  }),

  grossToPar: computed('gross', 'hole.par', function() {
    if (isBlank(this.gross)) { return; }

    return this.gross - this.hole.par;
  }),

  netToPar: computed('net', 'hole.par', function() {
    if (isBlank(this.net)) { return; }

    return this.net - this.hole.par;
  })
});
