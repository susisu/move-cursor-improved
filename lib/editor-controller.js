'use babel';

import { CompositeDisposable } from 'atom';

import CursorController from './cursor-controller.js';

const NAMESPACE = 'move-cursor-improved';

export default class EditorController {
  constructor(editor) {
    this.editor = editor;

    this.cursorCtrlers = new Map();

    // event subscriptions
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
    this.subscriptions.dispose();

    for (const cursorCtrler of this.cursorCtrlers.values()) {
      cursorCtrler.destroy();
    }
  }
}
