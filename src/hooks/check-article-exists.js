// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { GeneralError } = require('feathers-errors');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    const data = hook.data;

    return hook.app.service('articles').find({
      paginate: false,
      query: {
        $limit: 1,
        link: data.link
      }
    })
    .then(result => {
      if (result.length !== 0) {
        throw new GeneralError('Article already exists.', {
          errors: {
            link: 'Article with same link found.'
          }
        });
      }

      return hook;
    });
  };
};
