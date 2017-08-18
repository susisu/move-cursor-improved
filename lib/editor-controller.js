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
      [`${NAMESPACE}:move-up`]               : () => { this.moveUp(); },
      [`${NAMESPACE}:move-down`]             : () => { this.moveDown(); },
      [`${NAMESPACE}:move-last-cursor-up`]   : () => { this.moveLastCursorUp(); },
      [`${NAMESPACE}:move-last-cursor-down`] : () => { this.moveLastCursorDown(); },
      [`${NAMESPACE}:move-last-cursor-left`] : () => { this.moveLastCursorLeft(); },
      [`${NAMESPACE}:move-last-cursor-right`]: () => { this.moveLastCursorRight(); },
      [`${NAMESPACE}:add-previous-line`]     : () => { this.addPreviousLine(); },
      [`${NAMESPACE}:add-next-line`]         : () => { this.addNextLine(); }
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

  moveLastCursorUp() {
    const cursorCtrler = this.cursorCtrlers.get(this.editor.getLastCursor());
    if (!cursorCtrler) {
      return;
    }
    const lineHeight = this.editor.getLineHeightInPixels();
    const posInfo    = cursorCtrler.getPreviousLinePos(lineHeight);
    cursorCtrler.setPositionInfo(posInfo);
  }

  moveLastCursorDown() {
    const cursorCtrler = this.cursorCtrlers.get(this.editor.getLastCursor());
    if (!cursorCtrler) {
      return;
    }
    const lineHeight = this.editor.getLineHeightInPixels();
    const posInfo    = cursorCtrler.getNextLinePos(lineHeight);
    cursorCtrler.setPositionInfo(posInfo);
  }

  moveLastCursorLeft() {
    const cursor = this.editor.getLastCursor();
    if (!cursor) {
      return;
    }
    cursor.moveLeft();
  }

  moveLastCursorRight() {
    const cursor = this.editor.getLastCursor();
    if (!cursor) {
      return;
    }
    cursor.moveRight();
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
