// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { BadRequest } = require('feathers-errors');
const { validateCrawler } = require('../utils/Crawler');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    const crawlerConfig = hook.data;
    const validation = validateCrawler(crawlerConfig);

    if (validation.errors) {
      throw new BadRequest('Crawler is not valid.', {
        errors: validation.errors
      });
    }

    return Promise.resolve(hook);
  };
};
