import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ApplicationRoute extends Route {
  @service indexedDb;

  beforeModel() {
    super.beforeModel(...arguments);

    return this.indexedDb.setup();
  }

  @action
  didTransition() {
    this.controller.set('mobileNavIsOpen', false);
  }
}
