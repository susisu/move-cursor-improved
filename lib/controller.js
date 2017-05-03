'use babel';

import { CompositeDisposable } from 'atom';

import EditorController from './editor-controller.js';

export default class Controller {
  constructor() {
    this.editorCtrlers = new Map();

    // editor event subscriptions
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.workspace.observeTextEditors(editor => {
      this.addEditor(editor);
    }));
    this.subscriptions.add(atom.workspace.onDidDestroyPaneItem(item => {
      this.removeEditor(item);
    }));
  }

  addEditor(editor) {
    const editorCtrler = new EditorController(editor);
    this.editorCtrlers.set(editor, editorCtrler);
  }

  removeEditor(editor) {
    this.editorCtrlers.delete(editor);
  }

  destroy() {
    this.subscriptions.dispose();

    for (const editorCtrler of this.editorCtrlers.values()) {
      editorCtrler.destroy();
    }
  }
}
