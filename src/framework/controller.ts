import bottle from './bottle';

export class Controller {
  constructor() {
    const proxy = new Proxy(this, {
      get: function (oTarget, sKey) {
        if (String(sKey).endsWith('Model') || String(sKey).endsWith('Controller') || String(sKey).endsWith('View')) {
          if (typeof oTarget[sKey] !== 'function') {
            throw new Error('Not a function during injection')
          }
          return oTarget[sKey]();
        }
        return oTarget[sKey];
      },
    });

    bottle.setObject(proxy);
    return proxy;
  }

  init() {}
}
