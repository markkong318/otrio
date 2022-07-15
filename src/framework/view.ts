import * as PIXI from 'pixi.js';
import {Size} from "./size";
import {Point} from "pixi.js";

export class View extends PIXI.Container {
  public size: Size

  constructor() {
    super();
  }
}
