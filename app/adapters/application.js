import IndexedDbAdapter from 'ember-indexeddb/adapters/indexed-db';
import { v4 } from 'ember-uuid';

export default IndexedDbAdapter.extend({
  // ensure we can access `hasMany` relationship data like via an API
  findHasMany(store, snapshot, url, relationship) {
    const query = {};
    query[snapshot.modelName] = snapshot.id;

    return this.query(store, store.modelFor(relationship.type), query);
  },

  generateIdForRecord() {
    return v4();
  }
});
