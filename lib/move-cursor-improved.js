'use babel';

import Controller from './controller.js';

class MoveCursorImproved {
  constructor() {
    this.controller = null;
  }

  activate() {
    this.controller = new Controller();
  }

  deactivate() {
    this.controller.destroy();
  }

  serialize() {
  }
}

export default new MoveCursorImproved();
