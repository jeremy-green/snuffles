'use strict';

const url         = require('url');

const config      = require('config');
const moment      = require('moment');
const request     = require('request');

const deployments = require('./deployments');
const replies     = require('./replies');

const github      = config.get('github');

let releaseName;
let buildEntities;

/**
 * Make a request with the provided URL
 * @param  {String}   u  The URL
 * @param  {Function} cb The callback
 */
const makeRequest = (u, cb) => {
  request({
    headers: {
      'User-Agent': 'request'
    },
    url: u
  }, cb);
};

/**
 * Get the name of the release
 * @param  {Object} response The response object
 * @param  {Object} convo    The conversation object
 */
const getReleaseName = (response, convo) => {
  convo.ask(replies.getRelease, (response, convo) => {
    releaseName = response.text;

    if (releaseName.trim().toLowerCase() === 'quit') {
      handleQuit(response, convo);
      return;
    }

    convo.say(replies.validateRelease(releaseName));

    validateBranch(releaseName, (e, r, b) => {

      if (r.statusCode !== 404) {
        convo.say(replies.invalidRelease);
        convo.next();
        getReleaseName(response, convo);
        return;
      }

      convo.say(replies.validRelease);
      convo.next();
      handleCorrectBranch(response, convo);
    });
  });
};

/**
 * Get a formatted Github URL
 * @param  {String} path The path
 * @return {String}      The formatted URL
 */
const getGithubUrl = (path) => {
  return url.format({
    protocol: 'https',
    hostname: 'api.github.com',
    pathname: path,
    search:   'access_token=' + github.token
  });
};

/**
 * Validate the branch in Github
 * @param  {String}   branch The branch name
 * @param  {Function} cb     The callback
 */
const validateBranch = (branch, cb) => {
  const repoPath = github[getEntity('repository')];
  const u = getGithubUrl(repoPath + branch);
  makeRequest(u, cb);
};

/**
 * Handle when the user says "quit"
 * @param  {Object} response The response object
 * @param  {Object} convo    The conversation object
 */
const handleQuit = (response, convo) => {
  convo.say(replies.quit);
  convo.next();
};

/**
 * Get an entity value
 * @param  {String} prop The property of the entity
 * @return {String}      The value of the property
 */
const getEntity = (prop) => {
  console.log(prop);
  return buildEntities[prop][0].value;
};

/**
 * Handle when the branch is set and validated
 * @param  {Object} response The response object
 * @param  {Object} convo    The convo object
 */
const handleCorrectBranch = (response, convo) => {
  const params = {
    releaseName:  releaseName,
    slackChannel: response.channel,
    environment:  getEntity('environment'),
    repository:   getEntity('repository')
  };

  deployments.buildWithParameters(response, convo, params);
};

/**
 * Conversations
 * @module conversations
 */
module.exports = {
  /**
   * Start a build conversation
   * @param  {Object}   bot      The bot object
   * @param  {Object}   message  The message object
   * @param  {Object}   entities The entities
   * @param  {Function} cb       The callback
   */
  build(bot, message, entities, cb) {
    buildEntities = entities;

    bot.startConversation(message, (err, convo) => {
      convo.on('end', cb);
      convo.sayFirst(replies.firstReply);

      getReleaseName(null, convo);
    });
  }
};
