'use strict';

let users = [];

/**
 * Users
 * @module users
 */
module.exports = {
  /**
   * Set the allowed users
   * @param  {Object} err An error object from the Slack API
   * @param  {Object} res The response object from the Slack API
   */
  setAllowedUsers(err, res) {
    if (res.group && res.group.members) {
      users = res.group.members;
    }
  },
  /**
   * Return the allowed users
   * @return {Array} The array of allowed users
   */
  getAllowedUsers() {
    return users;
  }
};
