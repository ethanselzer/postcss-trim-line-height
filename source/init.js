'use strict';

var postcss = require('postcss');
var u = require('./utilities');
var config = require('./config');
var font = require('./font');
var convert = require('./conversions');
var adjust = require('./adjustments');

function getInput(rule, adjustmentDeclaration) {
    var adjustments = postcss.list.space(adjustmentDeclaration.value.toLowerCase());
    var m = u.findDeclaration(rule, 'margin');
    var mt = u.findDeclaration(rule, 'margin-top');
    var mb = u.findDeclaration(rule, 'margin-bottom');
    var f = convert.fontValues(font.getValues(rule));
    var topAdjustment = adjust.getTopAdjustment(adjustments, config.topAdjustments);
    var bottomAdjustment = adjust.getBottomAdjustment(adjustments, config.bottomAdjustments);

    return {
        fontFamily: f.family,
        fontSize: f.size,
        fontWeight: f.weight,
        lineHeight: f.lineHeight,
        adjustmentDeclaration: adjustmentDeclaration,
        adjustments: adjustments,
        topAdjustment: topAdjustment,
        bottomAdjustment: bottomAdjustment,
        margin: m,
        marginTop: mt,
        marginBottom: mb,
        isTopAdjustment: !!topAdjustment,
        isBottomAdjustment: !!bottomAdjustment,
        isExistingMargin: !!m,
        isExistingMarginTop: !!mt,
        isExistingMarginBottom: !!mb
    };
}

module.exports = {
    getInput: getInput
};
