'use strict';

const axios = require('axios');
const moment = require('moment');

const channelUri = 'https://hooks.slack.com/services/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';

const sendMessage = message => {
  return axios.post(channelUri, {
    text: message
  })
  .then(response => {
    return response.data;
  })
  .catch(err => { console.warn('Slacker.sendMessage, error:', err.message); });
};

const notifyNewArticle = article => {
  const message = 'New article:' + "\n" +
    '<' + article.link + '|' + article.title.text + '>';
  return sendMessage(message)
    .catch(err => { console.warn('Slacker.notifyArticle, error:', err.message) });
};

module.exports = {
  sendMessage: sendMessage,
  notifyNewArticle: notifyNewArticle
};
