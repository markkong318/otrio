import {CellView} from '../view/game/board/cell-view';

export class EventUpdateBattleMsg {
  public view: CellView;
  public x: number;
  public y: number;
  constructor(view: CellView, x: number, y: number) {
    this.view = view;
    this.x = x;
    this.y = y;
  }
}


export class EventCellMoveMsg {
  public view: CellView;
  constructor(view: CellView) {
    this.view = view;
  }
}

export class EventCellOutMsg {
  public view: CellView;
  constructor(view: CellView) {
    this.view = view;
  }
}

export class EventClientStartMsg {
  public roomId: string;
  constructor(roomId: string) {
    this.roomId = roomId;
  }
}