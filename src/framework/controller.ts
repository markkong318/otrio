import _ from 'lodash';
import bottle from './bottle';

export class Controller {
  constructor() {
    return new Proxy(this, {
      get: function (oTarget, sKey) {
        if (String(sKey).endsWith('Model') || String(sKey).endsWith('Controller') || String(sKey).endsWith('View')) {
          bottle.get(_.upperFirst(sKey));
        }
        return oTarget[sKey];
      },
    });
  }
}
