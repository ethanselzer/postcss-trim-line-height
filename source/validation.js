'use strict';

var _ = require('lodash');
var c = require('./config');
var css = require('./css-keywords');
var pluginName = c.pluginName;
var throwError;

function validateInput(input) {
    throwError = _.partial(_throwError, input.adjustmentDeclaration, pluginName);
    validateLineHeight(input);
    validateFontSize(input);
    validateAdjustments(input);
    validateMargin(input);
}

function validateLineHeight(input) {
    if (!input.lineHeight) {
        throwError('Line height must be declared.');
    } else if (isLineHeightKeyword(input.lineHeight)) {
        throwError('Line height must not be expressed as a keyword.');
    }
}

function validateFontSize(input) {
    if (!input.fontSize) {
        throwError('Font size must be declared.');
    } else if (isFontSizeKeyword(input.fontSize)) {
        throwError('Font size must not be expressed as a keyword.');
    }
}

function validateAdjustments(input) {
    if (!areAdjustmentsValid(input.adjustments, c.topAdjustments, c.bottomAdjustments)) {
        throwError('Value must be one of <' + c.topAdjustments.join('|') + '> and or one of <'+ c.bottomAdjustments.join('|') + '>');
    }
}

function validateMargin(input) {
    if (input.isExistingMargin && input.isExistingMarginTop || input.isExistingMargin && input.isExistingMarginBottom) {
        throwError('Combined longhand and shorthand margin declarations are not supported');
    }
}

function areAdjustmentsValid(adjustments, topAdjustments, bottomAdjustments) {
    if (adjustments.length === 0) {
        return false;
    }
    if (adjustments.length > 2) {
        return false;
    }
    var hasTopAdjustment;
    var hasBottomAdjustment;
    for (var i = 0, len = adjustments.length; i < len; i++) {
        if (_.includes(topAdjustments, adjustments[i])) {
            if (hasTopAdjustment) {
                return false;
            }
            hasTopAdjustment = true;
        } else if(_.includes(bottomAdjustments, adjustments[i])) {
            if (hasBottomAdjustment) {
                return false;
            }
            hasBottomAdjustment = true;
        } else {
            return false;
        }
    }
    return true;
}

function _throwError(adjDecl, pluginName, msg) {
    throw adjDecl.error(msg, { plugin: pluginName });
}

function isFontSizeKeyword(f) {
    return _.includes(_.union(css.fontSizeKeywords, css.globalKeywords), f);
}

function isLineHeightKeyword(lh) {
    return _.includes(_.union(css.lineHeightKeywords, css.globalKeywords), lh);
}

module.exports = {
    validateInput: validateInput
};
