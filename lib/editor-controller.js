'use babel';

import { CompositeDisposable } from 'atom';

import CursorController from './cursor-controller.js';

export default class EditorController {
  constructor(editor) {
    this.editor = editor;

    this.cursorCtrlers = new Map();

    this.cursorsSub = new CompositeDisposable();
    this.cursorsSub.add(this.editor.observeCursors(cursor => {
      this.addCursor(cursor);
    }));
    this.cursorsSub.add(this.editor.onDidRemoveCursor(cursor => {
      this.removeCursor(cursor);
    }));

    this.commandsSub = atom.commands.add(this.editor.element, {
      'add-line:move-up'          : () => { this.moveUp(); },
      'add-line:move-down'        : () => { this.moveDown(); },
      'add-line:add-previous-line': () => { this.addPreviousLine(); },
      'add-line:add-next-line'    : () => { this.addNextLine(); }
    });
  }

  addCursor(cursor) {
    const cursorCtrler = new CursorController(this.editor, cursor);
    this.cursorCtrlers.set(cursor, cursorCtrler);
  }

  removeCursor(cursor) {
    this.cursorCtrlers.delete(cursor);
  }

  moveUp() {
    const lineHeight    = this.editor.getLineHeightInPixels();
    const cursorCtrlers = [...this.cursorCtrlers.values()];
    const len           = cursorCtrlers.length;
    const posInfo       = [];
    for (let i = 0; i < len; i++) {
      posInfo.push(cursorCtrlers[i].getPreviousLinePos(lineHeight));
    }
    for (let i = 0; i < len; i++) {
      cursorCtrlers[i].setPositionInfo(posInfo[i]);
    }
  }

  moveDown() {
    const lineHeight    = this.editor.getLineHeightInPixels();
    const cursorCtrlers = [...this.cursorCtrlers.values()];
    const len           = cursorCtrlers.length;
    const posInfo       = [];
    for (let i = 0; i < len; i++) {
      posInfo.push(cursorCtrlers[i].getNextLinePos(lineHeight));
    }
    for (let i = 0; i < len; i++) {
      cursorCtrlers[i].setPositionInfo(posInfo[i]);
    }
  }

  addPreviousLine() {
    const lineHeight    = this.editor.getLineHeightInPixels();
    const cursorCtrlers = [...this.cursorCtrlers.values()];
    const len           = cursorCtrlers.length;
    const posInfo       = [];
    for (let i = 0; i < len; i++) {
      posInfo.push(cursorCtrlers[i].getPreviousLinePos(lineHeight));
    }
    for (let i = 0; i < len; i++) {
      this.editor.addCursorAtScreenPosition(posInfo[i].newScreenPos);
    }
  }

  addNextLine() {
    const lineHeight    = this.editor.getLineHeightInPixels();
    const cursorCtrlers = [...this.cursorCtrlers.values()];
    const len           = cursorCtrlers.length;
    const posInfo       = [];
    for (let i = 0; i < len; i++) {
      posInfo.push(cursorCtrlers[i].getNextLinePos(lineHeight));
    }
    for (let i = 0; i < len; i++) {
      this.editor.addCursorAtScreenPosition(posInfo[i].newScreenPos);
    }
  }

  destroy() {
    this.cursorsSub.dispose();
    this.commandsSub.dispose();

    for (const cursorCtrler of this.cursorCtrlers.values()) {
      cursorCtrler.destroy();
    }
  }
}
