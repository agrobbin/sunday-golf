import DS from 'ember-data';
import { isBlank } from '@ember/utils';

export default DS.Model.extend({
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),

  init() {
    this._super(...arguments);

    if (isBlank(this.get('createdAt'))) { this.set('createdAt', new Date()); }
  }
});
