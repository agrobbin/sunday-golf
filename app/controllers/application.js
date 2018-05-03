import Controller from '@ember/controller';

export default Controller.extend({
  mobileNavIsOpen: false,

  actions: {
    createRound() {
      this.get('store').createRecord('round').save().then((round) => {
        this.transitionToRoute('round', round.get('id'));
      });
    }
  }
});
