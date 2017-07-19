const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');

const axios = require('axios');
const { Crawler } = require('./utils/Crawler');

const app = feathers();

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
app.use('/', feathers.static(app.get('public')));

// Set up Plugins and providers
app.configure(hooks());
app.configure(rest());
app.configure(socketio());

// Set up our services (see `services/index.js`)
app.configure(services);
// Configure middleware (see `middleware/index.js`) - always has to be last
app.configure(middleware);
app.hooks(appHooks);

const runCrawlers = () => {
  console.log('Running crawlers...');

  return app.service('crawlers').find({})
    .then(crawlers => {
      return crawlers.map(crawler => Crawler(crawler));
    })
    .then(crawlers => {
      return axios.all(
        crawlers.map(crawler => {
          return crawler.getArticles()
            .catch(() => []);
        })
      );
    })
    .then(articlesList => {
      return articlesList.reduce((allArticles, articles) => {
        return [...allArticles, ...articles];
      }, []);
    })
    .then(articles => {
      return articles.map(article => {
        return app.service('articles').create(article)
          .catch(err => {
            if (!err.message.includes('Article already exists.')) {
              console.warn('Error while creating article:', err);
            }
          });
      })
    })
    .catch(err => { console.warn('runCrawlers error:', err); });
};

runCrawlers();
setInterval(runCrawlers, 300000);

module.exports = app;
