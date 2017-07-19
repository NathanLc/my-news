// Initializes the `crawlers` service on path `/crawlers`
const createService = require('feathers-nedb');
const createModel = require('../../models/crawlers.model');
const hooks = require('./crawlers.hooks');
const filters = require('./crawlers.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = false; // app.get('paginate');

  const options = {
    name: 'crawlers',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/crawlers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('crawlers');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
