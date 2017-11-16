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
      [`${NAMESPACE}:select-up`]             : () => { this.selectUp(); },
      [`${NAMESPACE}:select-down`]           : () => { this.selectDown(); },
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
    const cursorCtrlers = new Map(this.cursorCtrlers);
    const lineHeight    = this.editor.getLineHeightInPixels();
    const posInfo       = new Map();
    for (const [cursor, cursorCtrler] of cursorCtrlers) {
      posInfo.set(cursor, cursorCtrler.getPreviousLinePos(lineHeight, true));
    }
    for (const [cursor, cursorCtrler] of cursorCtrlers) {
      cursorCtrler.setPositionInfo(posInfo.get(cursor));
    }
    this.editor.mergeCursors();
  }

  moveDown() {
    const cursorCtrlers = new Map(this.cursorCtrlers);
    const lineHeight    = this.editor.getLineHeightInPixels();
    const posInfo       = new Map();
    for (const [cursor, cursorCtrler] of cursorCtrlers) {
      posInfo.set(cursor, cursorCtrler.getNextLinePos(lineHeight, true));
    }
    for (const [cursor, cursorCtrler] of cursorCtrlers) {
      cursorCtrler.setPositionInfo(posInfo.get(cursor));
    }
    this.editor.mergeCursors();
  }

  selectUp() {
    const cursorCtrlers = new Map(this.cursorCtrlers);
    const lineHeight    = this.editor.getLineHeightInPixels();
    const posInfo       = new Map();
    for (const [cursor, cursorCtrler] of cursorCtrlers) {
      posInfo.set(cursor, cursorCtrler.getPreviousLinePos(lineHeight, false));
    }
    this.editor.expandSelectionsBackward(selection => {
      const cursorCtrler = cursorCtrlers.get(selection.cursor);
      if (cursorCtrler) {
        selection.modifySelection(() => {
          cursorCtrler.setPositionInfo(posInfo.get(selection.cursor));
        });
      }
    });
  }

  selectDown() {
    const cursorCtrlers = new Map(this.cursorCtrlers);
    const lineHeight    = this.editor.getLineHeightInPixels();
    const posInfo       = new Map();
    for (const [cursor, cursorCtrler] of cursorCtrlers) {
      posInfo.set(cursor, cursorCtrler.getNextLinePos(lineHeight, false));
    }
    this.editor.expandSelectionsForward(selection => {
      const cursorCtrler = cursorCtrlers.get(selection.cursor);
      if (cursorCtrler) {
        selection.modifySelection(() => {
          cursorCtrler.setPositionInfo(posInfo.get(selection.cursor));
        });
      }
    });
  }

  moveLastCursorUp() {
    const cursorCtrler = this.cursorCtrlers.get(this.editor.getLastCursor());
    if (!cursorCtrler) {
      return;
    }
    const lineHeight = this.editor.getLineHeightInPixels();
    const posInfo    = cursorCtrler.getPreviousLinePos(lineHeight, true);
    cursorCtrler.setPositionInfo(posInfo);
    this.editor.mergeCursors();
  }

  moveLastCursorDown() {
    const cursorCtrler = this.cursorCtrlers.get(this.editor.getLastCursor());
    if (!cursorCtrler) {
      return;
    }
    const lineHeight = this.editor.getLineHeightInPixels();
    const posInfo    = cursorCtrler.getNextLinePos(lineHeight, true);
    cursorCtrler.setPositionInfo(posInfo);
    this.editor.mergeCursors();
  }

  moveLastCursorLeft() {
    const cursor = this.editor.getLastCursor();
    if (!cursor) {
      return;
    }
    cursor.moveLeft();
    this.editor.mergeCursors();
  }

  moveLastCursorRight() {
    const cursor = this.editor.getLastCursor();
    if (!cursor) {
      return;
    }
    cursor.moveRight();
    this.editor.mergeCursors();
  }

  addPreviousLine() {
    const cursorCtrlers = new Map(this.cursorCtrlers);
    const lineHeight    = this.editor.getLineHeightInPixels();
    const posInfo       = new Map();
    for (const [cursor, cursorCtrler] of cursorCtrlers) {
      posInfo.set(cursor, cursorCtrler.getPreviousLinePos(lineHeight, false));
    }
    for (const cursor of cursorCtrlers.keys()) {
      this.editor.addCursorAtScreenPosition(posInfo.get(cursor).newScreenPos);
    }
  }

  addNextLine() {
    const cursorCtrlers = new Map(this.cursorCtrlers);
    const lineHeight    = this.editor.getLineHeightInPixels();
    const posInfo       = new Map();
    for (const [cursor, cursorCtrler] of cursorCtrlers) {
      posInfo.set(cursor, cursorCtrler.getNextLinePos(lineHeight, false));
    }
    for (const cursor of cursorCtrlers.keys()) {
      this.editor.addCursorAtScreenPosition(posInfo.get(cursor).newScreenPos);
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
