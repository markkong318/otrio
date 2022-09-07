import bottle from './bottle';

export class Model {
  constructor() {
    bottle.setObject(this);
  }
}
