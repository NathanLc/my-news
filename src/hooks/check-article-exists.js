// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { GeneralError } = require('@feathersjs/errors');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    const existingArticle = await context.app.service('articles').find({
      paginate: false,
      query: {
        $limit: 1,
        link: context.data.link
      }
    });

    if (existingArticle) {
      throw new GeneralError('Article already exists.', {
        errors: {
          link: 'Article with same link found.'
        }
      });
    }

    return context;
  };
};
