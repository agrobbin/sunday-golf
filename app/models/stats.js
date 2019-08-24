import { computed } from '@ember/object';

export default class Stats {
  constructor(scores) {
    this.scores = scores;
  }

  @computed('scores.@each.hole')
  get unsortedHoles() {
    return this.scores.mapBy('hole').uniqBy('number');
  }

  @computed('unsortedHoles.@each.number')
  get sortedHoles() {
    return this.unsortedHoles.sortBy('number');
  }

  @computed('sortedHoles', 'scores.@each.netToPar')
  get holes() {
    let netToParRunningTotal = 0;

    return this.sortedHoles.map((hole) => {
      const holeScores = this.scores.filterBy('hole.number', hole.number);

      if (holeScores.mapBy('gross').compact().length === 0) { return { hole }; }

      const score = this._sumScoreForHole(hole, holeScores);

      netToParRunningTotal = netToParRunningTotal + score;

      return { hole, netToPar: this._formatScore(score), netToParRunningTotal: this._formatScore(netToParRunningTotal) };
    });
  }

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
  }

  _formatScore(score) {
    if (score === 0) {
      return 'E';
    } else if (score > 0) {
      return `+${score}`;
    } else {
      return `−${Math.abs(score)}`;
    }
  }
}
