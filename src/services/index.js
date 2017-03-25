'use strict';

const message = require('./message');

module.exports = function() {
  const app = this;
  app.configure(message);
};
