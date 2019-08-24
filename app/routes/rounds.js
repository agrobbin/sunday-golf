import Route from '@ember/routing/route';

export default class RoundsRoute extends Route {
  model() {
    return this.store.findAll('round');
  }
}
