'use strict';

var _ = require('lodash');
var cssKeywords = require('../../source/css-keywords');

var lengths = [
    '1em',
    '1rem',
    '1%',
    '1px',
    '1pt',
    '1cm',
    '1mm',
    '1in',
    '1pc',
    '1ex',
    '1ch',
    '1vh',
    '1vw',
    '1vmin',
    '1vmax'
];

var calcsWithDivision = [
    'calc(2/1)',
    'calc(2 / 1)',
    'calc(2/ 1)',
    'calc(2 /1)',
    'calc( 2/1 )',
    'calc( 2 / 1 )',
    'calc( 2/ 1 )',
    'calc( 2 /1 )'
];

var lineHeights = lengths.concat('1', cssKeywords.lineHeightKeywords, calcsWithDivision);

var lineHeightKeywords = cssKeywords.lineHeightKeywords.concat(cssKeywords.globalKeywords);

var fontSizes = lengths.concat(cssKeywords.fontSizeKeywords, calcsWithDivision);

var weights = _.range(100, 1000, 100).concat('bold', 'bolder', 'lighter');

var margins = cssKeywords.marginKeywords.concat(cssKeywords.globalKeywords);

module.exports = {
    lengths: lengths,
    fontSizeKeywords: cssKeywords.fontSizeKeywords,
    stretchKeywords: cssKeywords.stretchKeywords,
    globalKeywords: cssKeywords.globalKeywords,
    lineHeightKeywords: lineHeightKeywords,
    calcsWithDivision: calcsWithDivision,
    lineHeights: lineHeights,
    fontSizes: fontSizes,
    weights: weights,
    margins: margins
};
