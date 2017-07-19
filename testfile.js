'use strict';

const request = require('request-promise-native');
const cheerio = require('cheerio');
const { Crawler } = require('./src/utils/Crawler');

const crawlerConf = {
  "url": "http://eune.leagueoflegends.com/en/news/",
  "articleSelector": ".node-article",
  "categories": [
    "XcmUKIBVAtpSfwU2"
  ],
  "tags": [
    {
      "name": "title",
      "selector": "h4"
    },
    {
      "name": "link",
      "selector": "h4 a",
      "type": "link"
    },
    {
      "name": "datetime",
      "type": "datetime",
      "format": "substract",
      "selector": ".time-ago",
      "before": {
        "action": "regex",
        "pattern": "\\d{1,2} \\w+",
        "flags": "gi"
      }
    }
  ],
  "_id": "cKkvHM9OemqZKG8W"
};

const crawler = Crawler(crawlerConf);

crawler.getArticles()
  .then(articles => {
    console.log(articles);
  });
