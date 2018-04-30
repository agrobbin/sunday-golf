import IndexedDbSerializer from 'ember-indexeddb/serializers/indexed-db';

export default IndexedDbSerializer.extend({
  // ensure we can access `hasMany` relationship data like via an API
  serializeHasMany(snapshot, json, relationship) {
    if (!json.hasOwnProperty('relationships')) {
      json.relationships = {};
    }

    let serializedKey = this._getMappedKey(relationship.key, snapshot.type);
    if (serializedKey === relationship.key && this.keyForRelationship) {
      serializedKey = this.keyForRelationship(relationship.key, relationship.kind, "serialize");
    }

    json.relationships[serializedKey] = { links: { related: '--indexeddb--' } };
  }
});
