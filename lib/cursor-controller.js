'use babel';

import { Point } from 'atom';

export default class CursorController {
  constructor(editor, cursor) {
    this.editor = editor;
    this.cursor = cursor;

    this.goalLeft = undefined;

    this.lastLineHeight = undefined;
    this.lastScreenPos = undefined;
    this.lastLine = undefined;
    this.lastLeft = undefined;
    this.lastPrevLine = undefined;
    this.lastNextLine = undefined;

    this.pixelPosCache = undefined;
    this.prevScreenPosCache = undefined;
    this.nextScreenPosCache = undefined;
  }

  clearCaches() {
    this.pixelPosCache = undefined;
    this.prevScreenPosCache = undefined;
    this.nextScreenPosCache = undefined;
  }

  getPreviousLinePos(lineHeight, moveToEndOfSelection = false) {
    if (this.cursor.goalColumn === null) {
      this.goalLeft = undefined;
    }
    // get the current screen position
    const selection = this.cursor.marker.getScreenRange();
    const screenPos = moveToEndOfSelection && !selection.isEmpty()
      ? selection.start
      : this.cursor.getScreenPosition();
    const line = this.editor.lineTextForScreenRow(screenPos.row);
    const moved = this.lastLineHeight !== lineHeight
      || !(this.lastScreenPos !== undefined && this.lastScreenPos.isEqual(screenPos))
      || this.lastLine !== line;
    if (moved) {
      this.pixelPosCache = undefined;
    }
    // get the pixel position for the screen position
    let pixelPos;
    if (this.pixelPosCache !== undefined) {
      pixelPos = this.pixelPosCache;
    }
    else {
      pixelPos = this.editor.element.pixelPositionForScreenPosition(screenPos);
      this.pixelPosCache = pixelPos;
    }
    // left coordinate of the destination
    const left = this.goalLeft !== undefined ? this.goalLeft : pixelPos.left;
    if (moved || this.lastLeft !== left) {
      this.prevScreenPosCache = undefined;
      this.nextScreenPosCache = undefined;
    }
    // compute a new screen position
    let newScreenPos;
    if (screenPos.row === 0) {
      newScreenPos = new Point(screenPos.row, 0);
      this.prevScreenPosCache = newScreenPos.copy();
      this.lastPrevLine = undefined;
    }
    else {
      const prevLine = this.editor.lineTextForScreenRow(screenPos.row - 1);
      if (this.lastPrevLine === prevLine && this.prevScreenPosCache !== undefined) {
        newScreenPos = this.prevScreenPosCache;
      }
      else {
        newScreenPos = this.editor.element.screenPositionForPixelPosition({
          top: pixelPos.top - lineHeight,
          left
        });
        this.prevScreenPosCache = newScreenPos.copy();
      }
      this.lastPrevLine = prevLine;
    }
    this.lastLineHeight = lineHeight;
    this.lastScreenPos = screenPos;
    this.lastLine = line;
    this.lastLeft = left;
    return { newScreenPos, left };
  }

  getNextLinePos(lineHeight, moveToEndOfSelection = false) {
    if (this.cursor.goalColumn === null) {
      this.goalLeft = undefined;
    }
    // get the current screen position
    const selection = this.cursor.marker.getScreenRange();
    const screenPos = moveToEndOfSelection && !selection.isEmpty()
      ? selection.end
      : this.cursor.getScreenPosition();
    const line = this.editor.lineTextForScreenRow(screenPos.row);
    const moved = this.lastLineHeight !== lineHeight
      || !(this.lastScreenPos !== undefined && this.lastScreenPos.isEqual(screenPos))
      || this.lastLine !== line;
    if (moved) {
      this.pixelPosCache = undefined;
    }
    // get the pixel position for the screen position
    let pixelPos;
    if (this.pixelPosCache !== undefined) {
      pixelPos = this.pixelPosCache;
    }
    else {
      pixelPos = this.editor.element.pixelPositionForScreenPosition(screenPos);
      this.pixelPosCache = pixelPos;
    }
    // left coordinate of the destination
    const left = this.goalLeft !== undefined ? this.goalLeft : pixelPos.left;
    if (moved || this.lastLeft !== left) {
      this.prevScreenPosCache = undefined;
      this.nextScreenPosCache = undefined;
    }
    // compute a new screen position
    let newScreenPos;
    if (screenPos.row === this.editor.getLastScreenRow()) {
      newScreenPos = new Point(screenPos.row, this.editor.lineLengthForScreenRow(screenPos.row));
      this.nextScreenPosCache = newScreenPos.copy();
      this.lastNextLine = undefined;
    }
    else {
      const nextLine = this.editor.lineTextForScreenRow(screenPos.row + 1);
      if (this.lastNextLine === nextLine && this.nextScreenPosCache !== undefined) {
        newScreenPos = this.nextScreenPosCache;
      }
      else {
        newScreenPos = this.editor.element.screenPositionForPixelPosition({
          top: pixelPos.top + lineHeight,
          left
        });
        this.nextScreenPosCache = newScreenPos.copy();
      }
      this.lastNextLine = nextLine;
    }
    this.lastLineHeight = lineHeight;
    this.lastScreenPos = screenPos;
    this.lastLine = line;
    this.lastLeft = left;
    return { newScreenPos, left };
  }

  setPositionInfo(posInfo) {
    const { newScreenPos, left } = posInfo;
    this.cursor.setScreenPosition(newScreenPos, { skipSoftWrapIndentation: true });
    this.cursor.goalColumn = newScreenPos.column;
    this.goalLeft = left;
  }

  destroy() {
    this.editor = null;
    this.cursor = null;
  }
}
