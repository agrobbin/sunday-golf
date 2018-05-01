import Controller from '@ember/controller';

export default Controller.extend({
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  course: {
    name: 'TPC Boston',
    holes: [
      { number: 1, par: 4, handicap: 15 },
      { number: 2, par: 5, handicap: 3 },
      { number: 3, par: 3, handicap: 13 },
      { number: 4, par: 4, handicap: 9 },
      { number: 5, par: 4, handicap: 7 },
      { number: 6, par: 4, handicap: 5 },
      { number: 7, par: 5, handicap: 1 },
      { number: 8, par: 3, handicap: 17 },
      { number: 9, par: 4, handicap: 11 },
      { number: 10, par: 4, handicap: 12 },
      { number: 11, par: 3, handicap: 16 },
      { number: 12, par: 5, handicap: 8 },
      { number: 13, par: 4, handicap: 2 },
      { number: 14, par: 5, handicap: 14 },
      { number: 15, par: 4, handicap: 10 },
      { number: 16, par: 3, handicap: 18 },
      { number: 17, par: 4, handicap: 6 },
      { number: 18, par: 5, handicap: 4 }
    ]
  }
});
