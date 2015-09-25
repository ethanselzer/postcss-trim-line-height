'use strict';

var _ = require('lodash');
var convert = require('./conversions');
var css = require('./css-keywords');
var marginKeywords = css.marginKeywords.concat(css.globalKeywords);
var a = require('./adjustments');
var getLineboxAdjustment = a.getLineboxAdjustment;

function getAdjustedLonghand(p, options) {
    return getCalc(p.fontSize, p.lineHeight, getLineboxAdjustment(p.fontFamily, p.fontWeight, p.adjustment, options), p.existing);
}

function getShorthandWithAdjustedTop(p, options) {
    var marginValues = p.values;
    var index = marginValues.length - 1;
    var topLineboxAdjustment = getLineboxAdjustment(p.fontFamily, p.fontWeight, p.topAdjustment, options);
    var calcTopByTopAdjustmentAndTopValue = getCalc(p.fontSize, p.lineHeight, topLineboxAdjustment, marginValues[0]);

    return join(index, [
        [calcTopByTopAdjustmentAndTopValue, marginValues[0],  marginValues[0]],
        [calcTopByTopAdjustmentAndTopValue, marginValues[1], marginValues[0]],
        [calcTopByTopAdjustmentAndTopValue, marginValues[1], marginValues[2]],
        [calcTopByTopAdjustmentAndTopValue, marginValues[1], marginValues[2], marginValues[3]]
    ]);
}

function getShorthandWithAdjustedBottom(p, options) {
    var marginValues = p.values;
    var index = marginValues.length - 1;
    var bottomLineboxAdjustment = getLineboxAdjustment(p.fontFamily, p.fontWeight, p.bottomAdjustment, options);
    var calcBottomByBottomAdjustmentAndTopValue = getCalc(p.fontSize, p.lineHeight, bottomLineboxAdjustment, marginValues[0]);
    var calcBottomByBottomAdjustmentAndBottomValue = getCalc(p.fontSize, p.lineHeight, bottomLineboxAdjustment, marginValues[2]);

    return join(index, [
        [marginValues[0], marginValues[0], calcBottomByBottomAdjustmentAndTopValue],
        [marginValues[0], marginValues[1], calcBottomByBottomAdjustmentAndTopValue],
        [marginValues[0], marginValues[1], calcBottomByBottomAdjustmentAndBottomValue],
        [marginValues[0], marginValues[1], calcBottomByBottomAdjustmentAndBottomValue, marginValues[3]]
    ]);
}

function getShorthandWithAdjustedTopAndBottom(p, options) {
    var marginValues = p.values;
    var index = marginValues.length - 1;
    var topLineboxAdjustment = getLineboxAdjustment(p.fontFamily, p.fontWeight, p.topAdjustment, options);
    var bottomLineboxAdjustment = getLineboxAdjustment(p.fontFamily, p.fontWeight, p.bottomAdjustment, options);
    var calcTopByTopAdjustmentAndTopValue = getCalc(p.fontSize, p.lineHeight, topLineboxAdjustment, marginValues[0]);
    var calcBottomByBottomAdjustmentAndTopValue = getCalc(p.fontSize, p.lineHeight, bottomLineboxAdjustment, marginValues[0]);
    var calcBottomByBottomAdjustmentAndBottomValue = getCalc(p.fontSize, p.lineHeight, bottomLineboxAdjustment, marginValues[2]);

    return join(index, [
        [calcTopByTopAdjustmentAndTopValue, marginValues[0], calcBottomByBottomAdjustmentAndTopValue],
        [calcTopByTopAdjustmentAndTopValue, marginValues[1], calcBottomByBottomAdjustmentAndTopValue],
        [calcTopByTopAdjustmentAndTopValue, marginValues[1], calcBottomByBottomAdjustmentAndBottomValue],
        [calcTopByTopAdjustmentAndTopValue, marginValues[1], calcBottomByBottomAdjustmentAndBottomValue, marginValues[3]]
    ]);
}

function getCalc(fontSize, lineHeight, adjustment, existing) {
    var calc = '((' + lineHeight + ' - ' + fontSize + ') / -2) + ' + adjustment;
    if (existing && !_.contains(marginKeywords, existing)) {
        return 'calc(' + convert.calcToSubroutine(existing) + ' + ' + calc + ')';
    }
    return 'calc(' + calc + ')';
}

function join(index, marginValues) {
    return marginValues[index].join(' ');
}

module.exports = {
    getAdjustedLonghand: getAdjustedLonghand,
    getShorthandWithAdjustedTop: getShorthandWithAdjustedTop,
    getShorthandWithAdjustedBottom: getShorthandWithAdjustedBottom,
    getShorthandWithAdjustedTopAndBottom: getShorthandWithAdjustedTopAndBottom
};
