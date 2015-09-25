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
    var _default = options.defaultAdjustments;
    var customFamily = options.adjustmentsByTypeface[fontFamily];
    var customWeight = customFamily && customFamily[fontWeight];
    adjustment = _.camelCase(adjustment);
    if (customWeight) {
        return _.assign({}, _default, customWeight)[adjustment];
    }
    return _default[adjustment];
}

module.exports = {
    getTopAdjustment: getTopAdjustment,
    getBottomAdjustment: getBottomAdjustment,
    getLineboxAdjustment: getLineboxAdjustment
};
