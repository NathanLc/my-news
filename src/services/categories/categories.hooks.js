

const sanitizeCreateCategory = require('../../hooks/sanitize-create-category');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [sanitizeCreateCategory()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
