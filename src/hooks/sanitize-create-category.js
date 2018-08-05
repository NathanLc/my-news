// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { BadRequest } = require('@feathersjs/errors');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    const { data } = context;
    const errors = {};

    if (!data.shortname) {
      errors.shortname = 'Shortname is missing.';
    }
    if (!data.name) {
      errors.name = 'Name is missing.';
    }

    if (Object.keys(errors).length !== 0) {
      throw new BadRequest('Category is not valid.', {
        errors: errors
      });
    }

    return context;
  };
};
