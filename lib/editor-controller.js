'use babel';

import { CompositeDisposable } from 'atom';

import CursorController from './cursor-controller.js';

const NAMESPACE = 'move-cursor-improved';

export default class EditorController {
  constructor(editor) {
    this.editor = editor;

    this.cursorCtrlers = new Map();

    this.subscriptions = new CompositeDisposable();

    // cursors
    this.subscriptions.add(this.editor.observeCursors(cursor => {
      this.addCursor(cursor);
    }));
    this.subscriptions.add(this.editor.onDidRemoveCursor(cursor => {
      this.removeCursor(cursor);
    }));

    // commands
    this.subscriptions.add(atom.commands.add(this.editor.element, {
      [`${NAMESPACE}:move-up`]          : () => { this.moveUp(); },
      [`${NAMESPACE}:move-down`]        : () => { this.moveDown(); },
      [`${NAMESPACE}:add-previous-line`]: () => { this.addPreviousLine(); },
      [`${NAMESPACE}:add-next-line`]    : () => { this.addNextLine(); }
    }));
  }

  addCursor(cursor) {
    const cursorCtrler = new CursorController(this.editor, cursor);
    this.cursorCtrlers.set(cursor, cursorCtrler);
  }

  removeCursor(cursor) {
    const cursorCtrler = this.cursorCtrlers.get(cursor);
    if (cursorCtrler) {
      cursorCtrler.destroy();
    }
    this.cursorCtrlers.delete(cursor);
  }

  moveUp() {
    const cursorCtrlers = [...this.cursorCtrlers.values()];
    const len           = cursorCtrlers.length;
    const lineHeight    = this.editor.getLineHeightInPixels();
    const posInfo       = new Array(len);
    for (let i = 0; i < len; i++) {
      posInfo[i] = cursorCtrlers[i].getPreviousLinePos(lineHeight);
    }
    for (let i = 0; i < len; i++) {
      cursorCtrlers[i].setPositionInfo(posInfo[i]);
    }
  }

  moveDown() {
    const cursorCtrlers = [...this.cursorCtrlers.values()];
    const len           = cursorCtrlers.length;
    const lineHeight    = this.editor.getLineHeightInPixels();
    const posInfo       = new Array(len);
    for (let i = 0; i < len; i++) {
      posInfo[i] = cursorCtrlers[i].getNextLinePos(lineHeight);
    }
    for (let i = 0; i < len; i++) {
      cursorCtrlers[i].setPositionInfo(posInfo[i]);
    }
  }

  addPreviousLine() {
    const cursorCtrlers = [...this.cursorCtrlers.values()];
    const len           = cursorCtrlers.length;
    const lineHeight    = this.editor.getLineHeightInPixels();
    const posInfo       = new Array(len);
    for (let i = 0; i < len; i++) {
      posInfo[i] = cursorCtrlers[i].getPreviousLinePos(lineHeight);
    }
    for (let i = 0; i < len; i++) {
      this.editor.addCursorAtScreenPosition(posInfo[i].newScreenPos);
    }
  }

  addNextLine() {
    const cursorCtrlers = [...this.cursorCtrlers.values()];
    const len           = cursorCtrlers.length;
    const lineHeight    = this.editor.getLineHeightInPixels();
    const posInfo       = new Array(len);
    for (let i = 0; i < len; i++) {
      posInfo[i] = cursorCtrlers[i].getNextLinePos(lineHeight);
    }
    for (let i = 0; i < len; i++) {
      this.editor.addCursorAtScreenPosition(posInfo[i].newScreenPos);
    }
  }

  destroy() {
    this.subscriptions.dispose();
    for (const cursorCtrler of this.cursorCtrlers.values()) {
      cursorCtrler.destroy();
    }
    this.editor = null;
  }
}
