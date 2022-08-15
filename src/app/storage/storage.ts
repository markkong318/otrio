import bottle from '../../framework/bottle';

export class Storage {
  constructor() {
  }

  init() {
    bottle.setObject(this);
  }
}
