const feathers = require('@feathersjs/feathers');
const sanitizeCreateArticle = require('../../hooks/sanitize-create-article');
const checkArticleExists = require('../../hooks/check-article-exists');
const processCreateArticle = require('../../hooks/process-create-article');
const { populate } = require('feathers-hooks-common');
const logger = require('winston');

const lightErrorLogger = () => {
  return async context => {
    logger.info(context.error.message);

    if (context.error.errors) {
      logger.info(context.error.errors);
    }

    return feathers.SKIP;
  };
};

const categoriesSchema = {
  include: {
    service: 'categories',
    parentField: 'categories',
    nameAs: 'categories',
    childField: '_id',
    asArray: true
  }
};

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
    all: [populate({ schema: categoriesSchema })],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [lightErrorLogger()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
