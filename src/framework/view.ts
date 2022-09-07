import * as PIXI from 'pixi.js';

import {Size} from "./size";
import bottle from './bottle';

export class View extends PIXI.Container {
  public size: Size

  constructor() {
    super();
    bottle.setObject(this);
  }

  init() {}
}
