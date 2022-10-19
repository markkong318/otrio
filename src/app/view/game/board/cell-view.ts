import * as PIXI from 'pixi.js';

import {View} from '../../../../framework/view';
import bottle from '../../../../framework/bottle';
import {CellTexture} from '../../../texture/cell-texture';
import {CELL_LEVEL_1, CELL_LEVEL_2, CELL_LEVEL_3} from '../../../env/cell';
import rocket from '../../../../framework/rocket';
import {EVENT_CELL_VIEW_MOVE, EVENT_CELL_VIEW_OUT} from '../../../env/event';

export class CellView extends View {
  private background: PIXI.Sprite;

  private levelSprites: PIXI.Sprite[];
  private selectedSprite: PIXI.Sprite;
  private finishSprite: PIXI.Sprite;

  private isDragged: boolean = false;
  private dragPoint: PIXI.Point;

  private initX: number;
  private initY: number;

  private idx: number;
  private level: number;

  constructor() {
    super();
    this.on('pointerdown', this.onPointerDown)
    this.on('pointermove', this.onPointerMove);
    this.on('pointerup', this.onPointerOut)
  }

  public init() {
    this.background = new PIXI.Sprite(PIXI.Texture.EMPTY);
    this.background.width = this.size.width;
    this.background.height = this.size.height;
    this.addChild(this.background);

    const circleTexture = <CellTexture>bottle.getObject(CellTexture);

    this.selectedSprite = new PIXI.Sprite(circleTexture.RECT);
    this.selectedSprite.x = this.width / 2;
    this.selectedSprite.y = this.height / 2;
    this.selectedSprite.anchor.x = 0.5;
    this.selectedSprite.anchor.y = 0.5;
    this.selectedSprite.tint = 0xcccccc;
    this.selectedSprite.visible = false;
    this.addChild(this.selectedSprite);

    this.finishSprite = new PIXI.Sprite(circleTexture.RECT);
    this.finishSprite.x = this.width / 2;
    this.finishSprite.y = this.height / 2;
    this.finishSprite.anchor.x = 0.5;
    this.finishSprite.anchor.y = 0.5;
    this.finishSprite.tint = 0xeac5d8;
    this.finishSprite.visible = false;
    this.addChild(this.finishSprite);

    this.levelSprites = [];

    this.levelSprites[CELL_LEVEL_1] = new PIXI.Sprite(circleTexture.LEVEL_1);
    this.levelSprites[CELL_LEVEL_1].x = this.width / 2;
    this.levelSprites[CELL_LEVEL_1].y = this.height / 2;
    this.levelSprites[CELL_LEVEL_1].anchor.x = 0.5;
    this.levelSprites[CELL_LEVEL_1].anchor.y = 0.5;
    this.addChild(this.levelSprites[CELL_LEVEL_1]);

    this.levelSprites[CELL_LEVEL_2] = new PIXI.Sprite(circleTexture.LEVEL_2);
    this.levelSprites[CELL_LEVEL_2].x = this.width / 2;
    this.levelSprites[CELL_LEVEL_2].y = this.height / 2;
    this.levelSprites[CELL_LEVEL_2].anchor.x = 0.5;
    this.levelSprites[CELL_LEVEL_2].anchor.y = 0.5;
    this.addChild(this.levelSprites[CELL_LEVEL_2]);

    this.levelSprites[CELL_LEVEL_3] = new PIXI.Sprite(circleTexture.LEVEL_3);
    this.levelSprites[CELL_LEVEL_3].x = this.width / 2;
    this.levelSprites[CELL_LEVEL_3].y = this.height / 2;
    this.levelSprites[CELL_LEVEL_3].anchor.x = 0.5;
    this.levelSprites[CELL_LEVEL_3].anchor.y = 0.5;
    this.addChild(this.levelSprites[CELL_LEVEL_3]);

    this.initX = this.x;
    this.initY = this.y;
  }

  setColor(level: number, color: number) {
    if (level < 0 || level >  this.levelSprites.length - 1) {
      throw new Error('Not a valid level:' + level);
    }

    this.levelSprites[level].visible = !!color;

    if (color) {
      this.levelSprites[level].tint = color;
    }
  }

  setSelected(flag: boolean) {
    this.selectedSprite.visible = !!flag;
  }

  setWinner(flag: boolean) {
    this.finishSprite.visible = !!flag;
  }

  setMovable(flag: boolean) {
    this.interactive = !!flag;
    this.buttonMode = !!flag;
  }

  getLevel(): number {
    return this.level;
  }

  setLevel(level: number) {
    this.level = level;
  }

  getIdx(): number {
    return this.idx;
  }

  setIdx(idx: number) {
    this.idx = idx;
  }

  resetPosition() {
    this.x = this.initX;
    this.y = this.initY;
  }

  onPointerDown(event: PIXI.InteractionEvent) {
    const {
      data: {
        global,
      },
    } = event;

    const point = this.toLocal(global);

    this.isDragged = true;
    this.dragPoint = point;
    this.zIndex = 1;
  }

  onPointerMove(evt: PIXI.InteractionEvent) {
    if (!this.isDragged) {
      return;
    }

    const {
      data: {
        global,
      }
    } = evt;

    const point = this.parent.toLocal(global);

    this.position.x = point.x - this.dragPoint.x;
    this.position.y = point.y - this.dragPoint.y;

    rocket.emit(EVENT_CELL_VIEW_MOVE, {view: this});
  }

  onPointerOut(evt: PIXI.InteractionEvent) {
    if (!this.isDragged) {
      return;
    }

    this.zIndex = 0;
    this.isDragged = false;

    rocket.emit(EVENT_CELL_VIEW_OUT, {view: this});
  }
}
