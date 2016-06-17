'use strict';

const replies       = require('./replies');
const conversations = require('./conversations');
const users         = require('./users');

/**
 * Check if the user is allowed to deploy or is a bot
 * @param  {Object} user  The user object
 * @return {Boolean}      If the user is valid or not
 */
const isValidUser = (user) => {
  return !(user.is_bot || user.is_restricted || user.is_ultra_restricted);
};

/**
 * Check if user is in an allowed group
 * @param  {Object} user The user object
 * @return {Boolan}      If the user is in the allowed group
 */
const userInGroup = (user) => {
  const allowedUsers = users.getAllowedUsers();
  return allowedUsers.indexOf(user.id) !== -1;
};

/**
 * Messages
 * @module messages
 */
module.exports = {
  /**
   * Handle a message that comes into the bot
   * @param  {Object} bot     The bot object
   * @param  {Object} message The message object
   * @param  {Object} user    The user object
   */
  message(bot, message, user) {
    const wit      = message.wit;
    const entities = wit.entities;
    const intent   = wit.entities.intent;

    console.log(entities);

    if (wit && entities && intent) {
      if (intent[0].value === 'deploy' && userInGroup(user) && isValidUser(user)) {
        conversations.build(bot, message, entities, (convo) => { /* noop */ });
        return;
      }

      if (intent[0].value === 'greeting') {
        bot.reply(message, replies.greeting(user.real_name));
        return;
      }
    }
    bot.reply(message, replies.random(user.real_name));
  }
};
