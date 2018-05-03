import Component from '@ember/component';

export default Component.extend({
  tagName: 'tr',
  classNames: ['player-scorecard'],

  actions: {
    save(score, gross) {
      const value = parseInt(gross);

      score.set('gross', isNaN(value) ? null : value);

      score.save();
    },

    selectAll(el) {
      this.$(el).select();
    }
  }
});
