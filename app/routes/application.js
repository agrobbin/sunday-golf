import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  indexedDb: service(),

  beforeModel() {
    this._super(...arguments);

    return this.indexedDb.setup();
  },

  actions: {
    didTransition() {
      this.controller.set('mobileNavIsOpen', false);
    }
  }
});
