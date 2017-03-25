'use strict';

const hooks = require('feathers-hooks');

exports.before = {
  all: [],
  find: [],
  get: [],
  create: [
    hook => {
      hook.data.createdAt = new Date();
    }
  ],
  update: [
    hook => {
      hook.data.updatedAt = new Date();
    }
  ],
  patch: [],
  remove: []
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
