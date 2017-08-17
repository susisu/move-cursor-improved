'use babel';

export default class CursorController {
  constructor(editor, cursor) {
    this.editor = editor;
    this.cursor = cursor;

    this.goalLeft = undefined;
  }

  getPreviousLinePos(lineHeight) {
    if (this.cursor.goalColumn === null) {
      this.goalLeft = undefined;
    }
    const screenPos    = this.cursor.getScreenPosition();
    const pixelPos     = this.editor.element.pixelPositionForScreenPosition(screenPos);
    const left         = this.goalLeft !== undefined ? this.goalLeft : pixelPos.left;
    const newScreenPos = this.editor.element.screenPositionForPixelPosition({
      top : pixelPos.top - lineHeight,
      left: left
    });
    return { newScreenPos, left };
  }

  getNextLinePos(lineHeight) {
    if (this.cursor.goalColumn === null) {
      this.goalLeft = undefined;
    }
    const screenPos    = this.cursor.getScreenPosition();
    const pixelPos     = this.editor.element.pixelPositionForScreenPosition(screenPos);
    const left         = this.goalLeft !== undefined ? this.goalLeft : pixelPos.left;
    const newScreenPos = this.editor.element.screenPositionForPixelPosition({
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
