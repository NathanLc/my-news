'use strict';

const feathers = require('feathers/client');
const socketio = require('feathers-socketio/client');
const hooks = require('feathers-hooks');
const io = require('socket.io-client');
const moment = require('moment');

const socket = io('http://localhost:3030');
const app = feathers()
  .configure(socketio(socket))
  .configure(hooks());

const printArticle = article => {
  console.log(article.title.text);
  if (article.datetime) {
    console.log(moment(article.datetime).format('YYYY-MM-DD'));
  }
  console.log(article.link);
  console.log();
};

app.service('articles').find({
  query: {
    $sort: {
      datetime: 1,
      createdAt: 1
    }
  }
})
.then(articles => {
  articles.forEach(article => {
    printArticle(article);
  });
});

app.service('articles').on('created', printArticle);
