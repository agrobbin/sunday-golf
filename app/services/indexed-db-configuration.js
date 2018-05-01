import IndexedDbConfigurationService from 'ember-indexeddb/services/indexed-db-configuration';
import { computed } from '@ember/object';

export default IndexedDbConfigurationService.extend({
  currentVersion: 1,

  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  version1: {
    stores: {
      'round': '&id'
    }
  },

  mapTable: computed(function() {
    return {
      round: (round) => {
        return {
          id: this._toString(round.id),
          json: this._cleanObject(round)
        };
      }
    };
  })
});
