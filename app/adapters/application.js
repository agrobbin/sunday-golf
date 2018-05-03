import IndexedDbAdapter from 'ember-indexeddb/adapters/indexed-db';
import { v4 } from 'ember-uuid';

export default IndexedDbAdapter.extend({
  // support dependent: 'destroy' for `hasMany` relationships
  deleteRecord(store, type, snapshot) {
    return this._super(...arguments).then(() => {
      snapshot.record.eachRelationship((name, relationship) => {
        if (relationship.kind !== 'hasMany' && relationship.options.dependent !== 'destroy') { return; }

        const query = {};
        query[snapshot.modelName] = snapshot.id;

        // This is done asynchronously, so as to not hold up the initial destruction
        store.query(relationship.type, query).then((results) => results.invoke('destroyRecord'));
      });
    });
  },

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
