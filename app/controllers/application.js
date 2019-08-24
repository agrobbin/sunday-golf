import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  mobileNavIsOpen = false;

  @action
  createRound() {
    this.store.createRecord('round').save().then((round) => {
      this.transitionToRoute('round', round.id);
    });
  }
}
