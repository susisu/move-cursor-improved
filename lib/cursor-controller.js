'use babel';

import { Point } from 'atom';

export default class CursorController {
  constructor(editor, cursor) {
    this.editor = editor;
    this.cursor = cursor;

    this.goalLeft = undefined;
  }

  getPreviousLinePos(lineHeight, moveToEndOfSelection = false) {
    if (this.cursor.goalColumn === null) {
      this.goalLeft = undefined;
    }
    const selection = this.cursor.marker.getScreenRange();
    const screenPos = moveToEndOfSelection && !selection.isEmpty()
      ? selection.start
      : this.cursor.getScreenPosition();
    const pixelPos     = this.editor.element.pixelPositionForScreenPosition(screenPos);
    const left         = this.goalLeft !== undefined ? this.goalLeft : pixelPos.left;
    const newScreenPos = screenPos.row === 0
      ? new Point(screenPos.row, 0)
      : this.editor.element.screenPositionForPixelPosition({
        top : pixelPos.top - lineHeight,
        left: left
      });
    return { newScreenPos, left };
  }

  getNextLinePos(lineHeight, moveToEndOfSelection = false) {
    if (this.cursor.goalColumn === null) {
      this.goalLeft = undefined;
    }
    const selection = this.cursor.marker.getScreenRange();
    const screenPos = moveToEndOfSelection && !selection.isEmpty()
      ? selection.end
      : this.cursor.getScreenPosition();
    const pixelPos     = this.editor.element.pixelPositionForScreenPosition(screenPos);
    const left         = this.goalLeft !== undefined ? this.goalLeft : pixelPos.left;
    const newScreenPos = screenPos.row === this.editor.getLastScreenRow()
      ? new Point(screenPos.row, this.editor.lineLengthForScreenRow(screenPos.row))
      : this.editor.element.screenPositionForPixelPosition({
        top : pixelPos.top + lineHeight,
        left: left
      });
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
