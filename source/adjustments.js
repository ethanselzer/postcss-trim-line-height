'use strict';

var _ = require('lodash');

function getTopAdjustment(adjustments, topAdjustments) {
    return _.find(adjustments, function(adjustment) {
        return _.contains(topAdjustments.split('|'), adjustment);
    });
}

function getBottomAdjustment(adjustments, bottomAdjustments) {
    return _.find(adjustments, function(adjustment) {
        return _.contains(bottomAdjustments.split('|'), adjustment);
    });
}

function getLineboxAdjustment(fontFamily, fontWeight, adjustment, options) {
    var defaultLineboxAdjustments = options.defaultAdjustments;
    var customFamily = options.adjustmentsByTypeface[fontFamily];
    var customLineboxAdjustments = customFamily && customFamily[fontWeight];
    adjustment = _.camelCase(adjustment);
    if (customLineboxAdjustments) {
        return _.assign({}, defaultLineboxAdjustments, customLineboxAdjustments)[adjustment];
    }
    return defaultLineboxAdjustments[adjustment];
}

module.exports = {
    getTopAdjustment: getTopAdjustment,
    getBottomAdjustment: getBottomAdjustment,
    getLineboxAdjustment: getLineboxAdjustment
};
