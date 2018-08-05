// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const moment = require('moment');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    context.data.createdAt = moment().valueOf();

    return context;
  };
};
