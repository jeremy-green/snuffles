'use strict';

const url     = require('url');

const request = require('request');
const config  = require('config');

const replies = require('./replies');

const jenkins = config.get('jenkins');

/**
 * Get a formatted Jenkins URL
 * @param  {String} path The path for Jenkins
 * @return {String}      The formatted URL
 */
const getJenkinsUrl = (path) => {
  return url.format({
    protocol: jenkins.protocol,
    host:     jenkins.host,
    pathname: path,
    auth:     jenkins.username + ':' + jenkins.token
  });
};

/**
 * Make a request to the passed URL
 * @param  {String}   u      The URL of the request
 * @param  {Function} cb     The callback
 * @param  {Object}   params The params for the build
 */
const makeRequest = (u, cb, params) => {
  request.post({
    url: u,
    form: params
  }, cb);
};

/**
 * Deployments
 * @module deployments
 */
module.exports = {
  /**
   * Kick off a Jenkins build
   * @param  {Object} response The response object
   * @param  {Object} convo    The conversation object
   * @param  {Object} params   The params for the Jenkins job
   */
  buildWithParameters(response, convo, params) {
    const repository  = params.repository;
    const environment = params.environment;
    const buildPath   = jenkins.pipelines[repository];

    if (buildPath) {
      const releaseName  = params.releaseName;
      const slackChannel = params.slackChannel;
      const u            = getJenkinsUrl(buildPath);

      makeRequest(u, (e, r, b) => {
        console.log(r.statusCode);

        convo.say(replies.buildTriggered);
        convo.next();
      }, {
        release_name:  releaseName,
        slack_channel: slackChannel
      });
      return;
    }

    convo.say('Something went horribly wrong.');
    convo.next();
  }
};
