import Base from 'ember-indexeddb/services/indexed-db-configuration';
import { computed } from '@ember/object';

export default class IndexedDbConfigurationService extends Base {
  currentVersion = 1;

  version1 = {
    stores: {
      'round': '&id',
      'player': '&id,*round',
      'score': '&id,*player'
    }
  };

  @computed
  get mapTable() {
    return {
      round: (round) => {
        return {
          id: this._toString(round.id),
          json: this._cleanObject(round)
        };
      },
      player: (player) => {
        return {
          id: this._toString(player.id),
          json: this._cleanObject(player),
          round: this._toString(player.relationships.round.data.id)
        };
      },
      score: (score) => {
        return {
          id: this._toString(score.id),
          json: this._cleanObject(score),
          player: this._toString(score.relationships.player.data.id)
        };
      }
    };
  }
}
