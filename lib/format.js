'use strict';

/**
 * Format
 * @module format
 */
module.exports = {
  /**
   * Wrap the passed string in three ticks
   * @param  {String} str The string to format
   * @return {String}     The formatted string
   */
  pre(str) {
    return '```' + str + '```';
  },
  /**
   * Wrap the passed string in one tick
   * @param  {String} str The string to format
   * @return {String}     The formatted string
   */
  code(str) {
    return '`' + str + '`';
  },
  /**
   * Wrap the passed string in asterisks
   * @param  {String} str The string to format
   * @return {String}     The formatted string
   */
  bold(str) {
    return '*' + str + '*';
  },
  /**
   * Wrap the passed string in underscores
   * @param  {String} str The string to format
   * @return {String}     The formatted string
   */
  italic(str) {
    return '_' + str + '_';
  }
};
