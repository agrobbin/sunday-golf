import Controller from '@ember/controller';

export default Controller.extend({
  mobileNavIsOpen: false,

  actions: {
    createRound() {
      this.store.createRecord('round').save().then((round) => {
        this.transitionToRoute('round', round.id);
      });
    }
  }
});
