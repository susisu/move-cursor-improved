'use babel';

import Controller from './controller.js';

export default {
  controller: null,

  activate() {
    this.controller = new Controller();
  },

  deactivate() {
    this.controller.destroy();
  },

  serialize() {
  }
};
