import DS from 'ember-data';
import { isBlank } from '@ember/utils';

export default DS.Model.extend({
  player: DS.belongsTo(),

  hole: DS.attr(),
  gross: DS.attr('number'),

  init() {
    this._super(...arguments);

    if (isBlank(this.get('createdAt'))) { this.set('createdAt', new Date()); }
  }
});
