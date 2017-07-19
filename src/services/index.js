const articles = require('./articles/articles.service.js');
const crawlers = require('./crawlers/crawlers.service.js');
const categories = require('./categories/categories.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(articles);
  app.configure(crawlers);
  app.configure(categories);
};
