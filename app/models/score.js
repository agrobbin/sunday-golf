import Model, { belongsTo, attr } from '@ember-data/model';
import { isBlank } from '@ember/utils';
import { computed } from '@ember/object';

export default class Score extends Model {
  @belongsTo() player;

  @attr() hole;
  @attr('number') gross;

  init() {
    super.init(...arguments);

    if (isBlank(this.createdAt)) { this.set('createdAt', new Date()); }
  }

  @computed('player.bid', 'hole.handicap')
  get shots() {
    let shots = Math.floor(this.player.get('bid') / 18);

    const remainder = this.player.get('bid') % 18;

    if (this.hole.handicap <= remainder) {
      shots++;
    }

    return shots;
  }

  @computed('gross', 'shots')
  get net() {
    if (isBlank(this.gross)) { return undefined; }

    return this.gross - this.shots;
  }

  @computed('gross', 'hole.par')
  get grossToPar() {
    if (isBlank(this.gross)) { return undefined; }

    return this.gross - this.hole.par;
  }

  @computed('net', 'hole.par')
  get netToPar() {
    if (isBlank(this.net)) { return undefined; }

    return this.net - this.hole.par;
  }
}
