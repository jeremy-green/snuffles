'use strict';

const f = require('./format');

const dialog = [
  ''
];

/**
 * Get a random item from the passed array
 * @param  {Array}  arr  The array of items
 * @return {String}      The item from the array
 */
const getRandom = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Replace the token with the user's name
 * @param  {String} message  The reply message
 * @param  {String} username The user's name
 * @return {String}          The replaced string
 */
const replaceName = (message, username) => {
  username = username || '';
 return message.replace(/%%USER%%/g, username)
};

/**
 * Replies
 * @module replies
 */
module.exports = {
  /**
   * The bot joined
   * @type {String}
   */
  joined:         'Joined',
  /**
   * A failed string
   * @type {String}
   */
  failed:         'Failed',
  /**
   * A reply for when the user quits
   * @type {String}
   */
  quit:           'Kindly don\'t bother me next time.',
  /**
   * The first reply in the conversation
   * @type {String}
   */
  firstReply:     'Init',
  /**
   * The release has finished
   * @type {String}
   */
  releaseDone:    'Your build is finished',
  /**
   * The release is invalid
   * @type {String}
   */
  invalidRelease: 'Invalid release',
  /**
   * The release is valid
   * @type {String}
   */
  validRelease:   'Release is valid',
  /**
   * Ask for the name of the release
   * @type {String}
   */
  getRelease:     'What is the release called or say ' + f.bold('quit') + '?',
  /**
   * The build has been triggered
   * @type {String}
   */
  buildTriggered: 'I have triggered the :jenkins: build.',
  /**
   * Validating the release
   * @param  {String} releaseName The release name to bold
   * @return {String}             The bolded release name
   */
  validateRelease(releaseName) {
    return 'Validating release: ' + f.bold(releaseName)
  },
  /**
   * Greet the user
   * @param  {String} username The user's name
   * @return {String}          The replaced greeting string
   */
  greeting(username) {
    return replaceName('Greetings %%USER%%', username);
  },
  /**
   * Get a random piece of dialog
   * @param  {String} username The user's name
   * @return {String}          The replaced random string
   */
  random(username) {
    return replaceName(getRandom(dialog), username);
  }
};
