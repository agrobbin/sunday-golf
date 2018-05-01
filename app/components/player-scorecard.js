import Component from '@ember/component';

export default Component.extend({
  tagName: 'tr',
  classNames: ['player-scorecard'],

  actions: {
    save(score, gross) {
      score.set('gross', parseInt(gross));

      score.save();
    },

    selectAll(el) {
      this.$(el).select();
    }
  }
});
