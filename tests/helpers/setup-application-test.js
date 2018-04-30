import { setupApplicationTest as originalSetupApplicationTest } from 'ember-qunit';

const setup = function(hooks, options) {
  originalSetupApplicationTest(hooks, options);

  hooks.beforeEach(function() {
    this.owner.lookup('service:indexed-db').set('databaseName', 'ember-indexeddb-test');
  });

  hooks.afterEach(async function() {
    await this.owner.lookup('service:indexed-db').dropDatabase();
  });
};

export { setup as setupApplicationTest };
