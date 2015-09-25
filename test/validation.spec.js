'use strict';

var test = require('./helpers/test');
var _ = require('lodash');
var css = require('./resources/css-values');
var lineHeightKeywords = css.lineHeightKeywords;
var fontSizeKeywords = css.fontSizeKeywords;

describe('Input Validation', function() {
    it('throws an error if line height is not declared', function() {
        var input = 'a{trim-line-height: to-descender; font: 10em Arial;}';
        test(input, /Line height must be declared/);
    });

    it('throws an error if line height is declared in shorthand and is expressed as a keyword', function() {
        var t = 'a{font: 14px/<%= hl %> Georgia; trim-line-height: to-ascender;}';
        var shorthandTemplate = _.template(t);
        var inputs = _.map(lineHeightKeywords, function(hl) {
            return shorthandTemplate({ hl: hl });
        });
        test(inputs, /expressed as a keyword/);
    });

    it('throws an error if line height is declared in longhand and is expressed as a keyword', function() {
        var t = 'a{line-height: <%= lh %>; font: 14px Georgia; trim-line-height: to-ascender;}';
        var longhandTemplate = _.template(t);
        var inputs = _.map(lineHeightKeywords, function(lh) {
            return longhandTemplate({ lh: lh });
        });
        test(inputs, /Line height must be declared/);
    });

    it('throws an error if font size is not declared', function() {
        var input = 'a{line-height: 20px; trim-line-height: to-descender;}';
        test(input, /Font size must be declared/);
    });

    it('throws an error if font-size is declared in shorthand and value is expressed as a keyword', function() {
        var t = 'a{line-height: 20px; font: <%= size %>/2em Georgia; trim-line-height: to-ascender;}';
        var shorthandTemplate = _.template(t);
        var inputs = _.map(fontSizeKeywords, function(size) {
            return shorthandTemplate({ size: size });
        });
        test(inputs, /expressed as a keyword/);
    });

    it('throws an error if font size is declared in longhand and value is expressed as a keyword', function() {
        var t = 'a{line-height: 20px; font-size: <%= size %>; line-height: 1; trim-line-height: to-ascender;}';
        var longhandTemplate = _.template(t);
        var inputs = _.map(fontSizeKeywords, function(size) {
            return longhandTemplate({ size: size });
        });
        test(inputs, /expressed as a keyword/);
    });

    it('throws an error if unsupported value is specified for trim-line-height', function() {
        var unSupportedAdjustments = [
            '',
            'ascender',
            'to-ascender to-capital',
            'to-baseline to-descender',
            'to-capital to-baseline to-descender'
        ];
        var t = _.template('a{font: 20px/2 Georgia; trim-line-height: <%= adjust %>;}');
        var inputs = _.map(unSupportedAdjustments, function(adjustment) {
            return t({ adjust: adjustment });
        });
        test(inputs, /one of <to-ascender|to-capital> and or one of <to-baseline|to-descender>/);
    });

    it('throws an error if longhand and shorthand margins are specified', function() {
        var input = 'a{font: 20px/2 Georgia; trim-line-height: to-baseline; margin: 0; margin-top: 20px;}';
        test(input, /longhand and shorthand/);
    });
});
