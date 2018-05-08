import Route from '@ember/routing/route';
import { isBlank } from '@ember/utils';

export default Route.extend({
  model(params) {
    // TODO: `this.store.findRecord` fails for some reason
    return this.store.findAll('round').then((rounds) => {
      return rounds.findBy('id', params.id);
    });
  },

  afterModel(model) {
    if (isBlank(model)) {
      return this.transitionTo('rounds');
    }
  },

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.resetNewPlayer();
    }
  }
});
