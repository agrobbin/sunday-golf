import EmberObject from '@ember/object';
import { computed } from '@ember/object';

export default EmberObject.extend({
  unsortedHoles: computed('scores.@each.hole', function() {
    return this.get('scores').mapBy('hole').uniqBy('number');
  }),

  sortedHoles: computed('unsortedHoles.@each.number', function() {
    return this.get('unsortedHoles').sortBy('number');
  }),

  holes: computed('sortedHoles', 'scores.@each.netToPar', function() {
    let netToParRunningTotal = 0;

    return this.get('sortedHoles').map((hole) => {
      const holeScores = this.get('scores').filterBy('hole.number', hole.number);

      if (holeScores.mapBy('gross').compact().get('length') === 0) { return { hole }; }

      const score = this._sumScoreForHole(hole, holeScores);

      netToParRunningTotal = netToParRunningTotal + score;

      return { hole, netToPar: this._formatScore(score), netToParRunningTotal: this._formatScore(netToParRunningTotal) };
    });
  }),

  _sumScoreForHole(hole, scores) {
    const values = scores.mapBy('netToPar').compact().sort();
    const maxScores = hole.par === 3 ? 3 : 2;
    let countedScores = 0;
    let score = 0;

    values.forEach((value) => {
      if (value < 0) { // net birdies or better
        score = score + value;
        countedScores++;
      } else if (countedScores < maxScores) {
        score = score + value;
        countedScores++;
      }
    });

    return score;
  },

  _formatScore(score) {
    if (score === 0) {
      return 'E';
    } else if (score > 0) {
      return `+${score}`;
    } else {
      return `−${Math.abs(score)}`;
    }
  }
});
