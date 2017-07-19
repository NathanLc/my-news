

const sanitizeCreateArticle = require('../../hooks/sanitize-create-article');
const checkArticleExists = require('../../hooks/check-article-exists');

const processCreateArticle = require('../../hooks/process-create-article');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [sanitizeCreateArticle(), checkArticleExists(), processCreateArticle()],
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
