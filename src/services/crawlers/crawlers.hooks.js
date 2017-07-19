

const sanitizeCreateCrawler = require('../../hooks/sanitize-create-crawler');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [sanitizeCreateCrawler()],
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
