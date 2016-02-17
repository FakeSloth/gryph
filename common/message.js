'use strict';

/**
 * Shorthand message creator.
 *
 * @param {String} message
 * @param {Object} props
 * @return {Object}
 */

function m(message, props) {
  const object = {message};

  return Object.assign({}, object, props);
}

module.exports = m;
