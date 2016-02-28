'use strict';

const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

function escapeHtml(string) {
  return String(string).replace(/[&<>]/g, function (s) {
    return entityMap[s];
  });
}

module.exports = escapeHtml;
