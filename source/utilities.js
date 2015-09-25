'use strict';

var _ = require('lodash');

module.exports = {
    findDeclaration: function(rule, cssProp, jsProp) {
        var nodes = rule.nodes;
        for (var len = nodes.length, i = len - 1; i >= 0; i--) {
            if (nodes[i].prop.toLowerCase() === cssProp.toLowerCase()) {
                return _.assign(nodes[i], {
                    jsProp: jsProp,
                    index: i
                });
            }
        }
    },

    stripQuotes: function(s) {
        return s.replace(/'|"/g, '');
    }
};
