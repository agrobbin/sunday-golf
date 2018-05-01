import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    createRound() {
      this.get('store').createRecord('round').save().then((round) => {
        this.transitionToRoute('round', round.get('id'));
      });
    }
  }
});
