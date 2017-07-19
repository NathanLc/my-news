'use strict';

const request = require('request-promise-native');
const cheerio = require('cheerio');
const moment = require('moment');

const errorGeneric = 'Crawler, error:';

const performAction = (target, action = { action: '' }) => {
  const errorGeneric = 'performAction, error:';

  if (!target) {
    throw new Error(errorGeneric + ' target is missing.');
  }
  if (!action.action || action.action === '') {
    throw new Error(errorGeneric + ' action is missing.');
  } else if (action.action === 'regex' && !action.pattern) {
    throw new Error(errorGeneric + 'regex: pattern is missing.');
  }

  let value = null;
  switch (action.action) {
    case 'regex':
      const flags = action.flags ? action.flags : 'gi';
      const re = new RegExp(action.pattern, flags);
      const result = re.exec(target);
      return result === null ? '' : result[0];
      break;
    default:
      value = target;
  }

  return value;
};

const validate = (crawlerConfig = {}) => {
  const errors = {};

  if (!crawlerConfig.url) {
    errors.url = 'url is missing.';
  }
  if (!crawlerConfig.articleSelector) {
    errors.articleSelector = 'articleSelector is missing.';
  }
  if (!crawlerConfig.tags) {
    errors.tags = 'tags is missing.';
  } else if (!Array.isArray(crawlerConfig.tags)) {
    errors.tags = 'tags should be an array.';
  } else {
    const tagsErrors = [];

    crawlerConfig.tags.forEach(tag => {
      const tagErrors = {};

      if (!tag.name) {
        tagErrors.name = 'name is missing.';
      }
      if (!tag.selector) {
        tagErrors.selector = 'selector is missing.';
      }
      if (tag.type && tag.type === 'datetime' && !tag.format) {
        tagErrors.format = 'format is required for datetime type.';
      }
      if (tag.before) {
        if (!tag.before.action) {
          tagErrors.before = 'action is required for before.';
        } else if (tag.before.action === 'regex' && ! tag.before.pattern) {
          tagErrors.before = 'pattern is required for regex actions.';
        }
      }

      if (Object.keys(tagErrors).length !== 0) {
        tagsErrors.push(tagErrors);
      }
    });

    if (tagsErrors.length !== 0) {
      errors.tags = tagsErrors;
    }
  }

  return Object.keys(errors).length === 0 ? true : { errors: errors };
};

const Crawler = (crawlerConfig = {}) => {
  const validation = validate(crawlerConfig);

  if (validation.errors) {
    throw new Error('Crawler is not valid.' + JSON.stringify(validation.errors));
  }

  const url = crawlerConfig.url;
  const articleSelector = crawlerConfig.articleSelector;
  const tags = crawlerConfig.tags;

  const getHtml = () => {
    return request.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36'
      }
    })
      .catch(function (err) {
        console.warn(errorGeneric + 'getHtml:', err);
      });
  };

  const getArticles = () => {
    return getHtml()
      .then(html => {
        const $ = cheerio.load(html);
        const articles = $(articleSelector);
        // Reverse articles' order (older to newer)
        return articles.toArray().reverse()
          .map(el => {
            return formatArticle($(el));
          });
      })
  }

  const formatArticle = articleEl => {
    const formattedArticle = tags.reduce((article, tag) => {
      const element = articleEl.find(tag.selector);
      let value = null;

      if (!element || element.length === 0) {
        return article;
      }

      switch (tag.type) {
        case 'link':
          const href = element.attr('href');
          if (href.substr(0, 4) === 'http') {
            value = href;
          } else {
            const urlSplit = url.split('/');
            const protocol = urlSplit[0];
            const host = urlSplit[2];
            const origin = protocol + '//' + host;
            value = origin + (href.substr(0, 1) === '/' ? '' : '/') + href;
          }
          break;
        case 'image':
          value = element.attr('src');
          break;
        case 'datetime':
          let datetimeString = element.text().trim();
          if (tag.before && tag.before.action === 'regex') {
            datetimeString = performAction(datetimeString, tag.before);
          }
          let datetime;
          if (tag.format === 'subtract') {
            const subtractParams = datetimeString.split(' ');
            datetime = moment().subtract(subtractParams[0], subtractParams[1]);
          } else {
            const locale = tag.locale ? tag.locale : 'en';
            datetime = moment(datetimeString, tag.format, locale);
          }
          value = datetime.isValid() ? datetime.valueOf() : moment().valueOf();
          break;
        default:
          value = {
            html: element.html().trim(),
            text: element.text().trim()
          }
      }

      article[tag.name] = value;
      return article;
    }, {});

    if (crawlerConfig.categories) {
      formattedArticle.categories = crawlerConfig.categories;
    }

    return formattedArticle;
  };

  return {
    getHtml: getHtml,
    getArticles: getArticles
  };
};

module.exports = {
  validateCrawler: validate,
  Crawler: Crawler
};
