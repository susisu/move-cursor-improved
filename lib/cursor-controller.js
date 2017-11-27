'use babel';

import { Point } from 'atom';

export default class CursorController {
  constructor(editor, cursor) {
    this.editor = editor;
    this.cursor = cursor;

    this.goalLeft = undefined;

    this.lastArgs = undefined;
    this.lastPixelPos = undefined;
    this.previousLinePosCache = undefined;
    this.nextLinePosCache = undefined;
  }

  cacheIsAvailable(args, pixelPos) {
    return this.lastArgs && this.lastPixelPos
      && this.lastArgs.lineHeight === args.lineHeight
      && this.lastArgs.moveToEndOfSelection === args.moveToEndOfSelection
      && this.lastPixelPos.top === pixelPos.top
      && this.lastPixelPos.left === pixelPos.left;
  }

  getPreviousLinePos(lineHeight, moveToEndOfSelection = false) {
    if (this.cursor.goalColumn === null) {
      this.goalLeft = undefined;
    }
    const args      = { lineHeight, moveToEndOfSelection };
    const selection = this.cursor.marker.getScreenRange();
    const screenPos = moveToEndOfSelection && !selection.isEmpty()
      ? selection.start
      : this.cursor.getScreenPosition();
    const pixelPos = this.editor.element.pixelPositionForScreenPosition(screenPos);
    const left     = this.goalLeft !== undefined ? this.goalLeft : pixelPos.left;
    const cacheIsAvailable = this.cacheIsAvailable(args, pixelPos);
    if (!cacheIsAvailable) {
      this.lastArgs             = args;
      this.lastPixelPos         = pixelPos;
      this.nextLinePosCache     = undefined;
      this.previousLinePosCache = undefined;
    }
    let newScreenPos;
    if (cacheIsAvailable && this.previousLinePosCache !== undefined) {
      newScreenPos = this.previousLinePosCache;
    }
    else {
      newScreenPos = screenPos.row === 0
        ? new Point(screenPos.row, 0)
        : this.editor.element.screenPositionForPixelPosition({
          top : pixelPos.top - lineHeight,
          left: left
        });
      if (this.previousLinePosCache === undefined) {
        this.previousLinePosCache = newScreenPos.copy();
      }
    }
    return { newScreenPos, left };
  }

  getNextLinePos(lineHeight, moveToEndOfSelection = false) {
    if (this.cursor.goalColumn === null) {
      this.goalLeft = undefined;
    }
    const args      = { lineHeight, moveToEndOfSelection };
    const selection = this.cursor.marker.getScreenRange();
    const screenPos = moveToEndOfSelection && !selection.isEmpty()
      ? selection.end
      : this.cursor.getScreenPosition();
    const pixelPos = this.editor.element.pixelPositionForScreenPosition(screenPos);
    const left     = this.goalLeft !== undefined ? this.goalLeft : pixelPos.left;
    const cacheIsAvailable = this.cacheIsAvailable(args, pixelPos);
    if (!cacheIsAvailable) {
      this.lastArgs             = args;
      this.lastPixelPos         = pixelPos;
      this.nextLinePosCache     = undefined;
      this.previousLinePosCache = undefined;
    }
    let newScreenPos;
    if (cacheIsAvailable && this.nextLinePosCache !== undefined) {
      newScreenPos = this.nextLinePosCache;
    }
    else {
      newScreenPos = screenPos.row === this.editor.getLastScreenRow()
        ? new Point(screenPos.row, this.editor.lineLengthForScreenRow(screenPos.row))
        : this.editor.element.screenPositionForPixelPosition({
          top : pixelPos.top + lineHeight,
          left: left
        });
      if (this.nextLinePosCache === undefined) {
        this.nextLinePosCache = newScreenPos.copy();
      }
    }
    return { newScreenPos, left };
  }

  setPositionInfo(posInfo) {
    const newScreenPos = posInfo.newScreenPos;
    const left         = posInfo.left;
    this.cursor.setScreenPosition(newScreenPos, { skipSoftWrapIndentation: true });
    this.cursor.goalColumn = newScreenPos.column;
    this.goalLeft          = left;
  }

  destroy() {
    this.editor = null;
    this.cursor = null;
  }
}
