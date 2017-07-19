// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const moment = require('moment');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    const data = hook.data;

    hook.data = Object.assign({}, data, { createdAt: moment().valueOf() });
    return Promise.resolve(hook);
  };
};
