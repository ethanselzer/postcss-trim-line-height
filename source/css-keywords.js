'use strict';

var lineHeightKeywords = [
    'normal'
];

var fontSizeKeywords = [
    'xx-small',
    'x-small',
    'small',
    'medium',
    'large',
    'x-large',
    'xx-large',
    'smaller',
    'larger',
    'inherit'
];

var stretchKeywords = [
    'normal',
    'ultra-condensed',
    'extra-condensed',
    'condensed',
    'semi-condensed',
    'semi-expanded',
    'expanded',
    'extra-expanded',
    'ultra-expanded'
];

var weightKeywords = [
    'normal',
    'bold',
    'bolder',
    'lighter',
    'inherit'
];

var variantKeywords = [
    'normal',
    'small-caps',
    'inherit'
];

var styleKeywords = [
    'normal',
    'italic',
    'oblique',
    'inherit'
];

var marginKeywords = [
    'auto'
];

var globalKeywords = [
    'inherit',
    'initial',
    'unset'
];

module.exports = {
    fontSizeKeywords: fontSizeKeywords,
    stretchKeywords: stretchKeywords,
    globalKeywords: globalKeywords,
    lineHeightKeywords: lineHeightKeywords,
    weightKeywords: weightKeywords,
    variantKeywords: variantKeywords,
    styleKeywords: styleKeywords,
    marginKeywords: marginKeywords
};
