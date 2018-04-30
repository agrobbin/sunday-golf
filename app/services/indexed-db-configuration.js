import IndexedDbConfigurationService from 'ember-indexeddb/services/indexed-db-configuration';
import { computed } from '@ember/object';

export default IndexedDbConfigurationService.extend({
  currentVersion: 1,

  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  version1: {
    stores: {
    }
  },

  mapTable: computed(function() {
    return {
    };
  })
});
