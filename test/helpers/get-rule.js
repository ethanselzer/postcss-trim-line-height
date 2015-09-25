'use strict';

var postcss = require('postcss');

module.exports = function(css) {
    var root = postcss.parse(css);
    return root.first;
};
