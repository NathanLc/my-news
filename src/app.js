const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const configuration = require('@feathersjs/configuration');
const rest = require('@feathersjs/express/rest');
const socketio = require('@feathersjs/socketio');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

const { Crawler } = require('./utils/Crawler');
const Slacker = require('./utils/Slacker');

const app = express(feathers());

// Load app configuration
app.configure(configuration(path.join(__dirname, '..')));
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));

app.configure(rest());
app.configure(socketio());

// Set up our services (see `services/index.js`)
app.configure(services);
// Configure middleware (see `middleware/index.js`) - always has to be last
app.configure(middleware);
app.configure(channels);
app.hooks(appHooks);

const runCrawlers = () => {
  console.log('Running crawlers...');

  const crawlersConfiguration = require('./configuration/crawlers.json');

  const crawlers = crawlersConfiguration.map(config => Crawler(config));

  return Promise.all(
    crawlers.map(crawler => {
      return crawler.getArticles()
        .catch(() => []);
    })
  )
    .then(articlesList => {
      return articlesList.reduce((allArticles, articles) => {
        return [...allArticles, ...articles];
      }, []);
    })
    .then(articles => {
      articles.forEach(article => {
        app.service('articles').create(article)
          .then(article => {
            // Notif if article has notify category.
            const notifyCategories = article.categories
                  .filter(category => category.shortname === 'notify');

            if (notifyCategories.length !== 0) {
              Slacker.notifyNewArticle(article);
            }
          })
          .catch(err => {
            if (!err.message.includes('Article already exists.')) {
              console.warn('Error while creating article.', err.message);
            }
          });
      });
    })
    .catch(err => { console.warn('runCrawlers error:', err.message); });
};

runCrawlers();

setInterval(runCrawlers, 300000);

module.exports = app;
