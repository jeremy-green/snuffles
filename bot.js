'use strict';

// core modules
const url       = require('url');

// package modules
const Botkit    = require('botkit');
const request   = require('request');
const config    = require('config');

// wit
const Logger    = require('node-wit').Logger;
const levels    = require('node-wit').logLevels;
const Wit       = require('node-wit').Wit;

// custom modules
const users     = require('./lib/users');
const replies   = require('./lib/replies');
const messages  = require('./lib/messages');

// config
const token     = config.token;
const witConfig = config.get('wit');


const actions = {
  say(sessionId, context, message, cb) {
    cb();
  },
  merge(sessionId, context, entities, message, cb) {
    cb(context);
  },
  error(sessionId, context, error) { /* noop */ },
};

let logger;
if (witConfig.debug) {
  logger = new Logger(levels.DEBUG);
}

const client = new Wit(witConfig.token, actions, logger);

if (!token) {
  console.log(replies.failed);
  process.exit(1);
}

const controller = Botkit.slackbot({
  debug: config.debug
});

const bot = controller.spawn({
  token: token
}).startRTM((err, bot, payload) => {
  bot.api.groups.info({
    token:   token,
    channel: config.deployChannel
  }, users.setAllowedUsers);
});

controller.middleware.receive.use((bot, message, next) => {
  if (message.type !== 'message') { return next(); }
  if (message.subtype === 'bot_message') { return next(); }
  if (message.reply_to) { return next(); }

  const context = {};
  client.message(message.text, context, (error, data) => {
    if (error) {
      return next();
    }

    message.wit = data;
    next();
  });
});

controller.on([
  'bot_group_join',
  'bot_channel_join'
], (bot, message) => {
  bot.reply(message, replies.joined);
});

controller.on([
  'direct_message',
  'direct_mention',
  'mention'
], (bot, message) => {
  bot.api.users.info({
    token: token,
    user: message.user
  }, (err, res) => {
    let user = {};
    if (res.user) {
      user = res.user;
    }
    messages.message(bot, message, user);
  });
});

controller.on(['bot_message'], (bot, message) => {
  try {
    var obj = JSON.parse(message.text);

    bot.say({
      text: replies.releaseDone,
      channel: obj.slack_channel
    });
  } catch (e) { /* noop */ }
});

controller.on([
  'rtm_close'
], () => {
  console.log('rtm_close');

  setTimeout(() => {
    console.log('restarting');
    process.exit(0);
  }, config.restartTimeout);
});
