'use strict';

var _ = require('lodash');
var test = require('./helpers/test');
var options = require('./resources/options');
var css = require('./resources/css-values');
var c = require('../source/config');

describe('PostCSS Trim Line Height', function() {

    describe('Degenerate Cases', function() {
        it('does nothing if trim-line-height is not declared', function() {
            var input = 'a{font: 20px/30px Georgia;}';
            var output = input;
            test(input, output);
        });
    });

    describe('Conversion and Cleanup Integration', function() {
        it('converts font size value, expressed as a percentage, to em length, when applying to output target', function() {
            var input = 'a{font: 100%/15mm Georgia; trim-line-height: to-capital;}';
            var output = 'a{font: 100%/15mm Georgia; margin-top: calc(((15mm - 1em) / -2) + -0.1em);}';
            test(input, output);
        });

        it('converts font size value, expressed as calc, to subroutine, when applying to output target', function() {
            var input = 'a{font: calc(100% + 10%)/2em Georgia; trim-line-height: to-ascender;}';
            var output = 'a{font: calc(100% + 10%)/2em Georgia; margin-top: calc(((2em - (1em + 0.1em)) / -2) + 0.05em);}';
            test(input, output);
        });


        it('converts line height value, expressed as a percentage, to em length, when applying to output target', function() {
            var input = 'a{font: 14px/150% Georgia; trim-line-height: to-capital;}';
            var output = 'a{font: 14px/150% Georgia; margin-top: calc(((1.5em - 14px) / -2) + -0.1em);}';
            test(input, output);
        });

        it('converts unitless line height value to em length, when applying to output target', function() {
            var input = 'a{font: 100%/2 Georgia; trim-line-height: to-ascender;}';
            var output = 'a{font: 100%/2 Georgia; margin-top: calc(((2em - 1em) / -2) + 0.05em);}';
            test(input, output);
        });

        it('converts line height value, expressed as calc, to subroutine, when applying to output target', function() {
            var input = 'a{font: 16px/calc(24px / 16px) Georgia; trim-line-height: to-ascender;}';
            var output = 'a{font: 16px/calc(24px / 16px) Georgia; margin-top: calc((((24px / 16px) - 16px) / -2) + 0.05em);}';
            test(input, output);
        });

        it('computes unitless line height value, expressed as calc, when applying to output target', function() {
            var input = 'a{font: 16px/calc(24 / 16) Georgia; trim-line-height: to-ascender;}';
            var output = 'a{font: 16px/calc(24 / 16) Georgia; margin-top: calc(((1.5em - 16px) / -2) + 0.05em);}';
            test(input, output);
        });

        it('accepts mixed case adjustment values', function() {
            var input = 'a{font: 16px/calc(24 / 16) Georgia; trim-line-height: To-Ascender;}';
            var output = 'a{font: 16px/calc(24 / 16) Georgia; margin-top: calc(((1.5em - 16px) / -2) + 0.05em);}';
            test(input, output);
        });

        it('removes trim-line-height declaration', function() {
            var input = 'a{font: 14px/150% Georgia; trim-line-height: to-ascender;}';
            var output = 'a{font: 14px/150% Georgia; margin-top: calc(((1.5em - 14px) / -2) + 0.05em);}';
            test(input, output);
        });
    });

    describe('Default Options', function() {
        it('applies default linebox options for to-ascender adjustment', function() {
            var defaultAscenderValue = c.getOptions().defaultAdjustments.toAscender;
            var input = 'a{font: 14px/150% Georgia; trim-line-height: to-ascender;}';
            var output = 'a{font: 14px/150% Georgia; margin-top: calc(((1.5em - 14px) / -2) + ' + defaultAscenderValue + ');}';
            test(input, output);
        });

        it('applies default linebox options for to-capital adjustment', function() {
            var defaultCaptialValue = c.getOptions().defaultAdjustments.toCapital;
            var input = 'a{font: 14px/150% Georgia; trim-line-height: to-capital;}';
            var output = 'a{font: 14px/150% Georgia; margin-top: calc(((1.5em - 14px) / -2) + ' + defaultCaptialValue + ');}';
            test(input, output);
        });

        it('applies default linebox options for to-baseline adjustment', function() {
            var defaultBaselineValue = c.getOptions().defaultAdjustments.toBaseline;
            var input = 'a{font: 14px/150% Georgia; trim-line-height: to-baseline;}';
            var output = 'a{font: 14px/150% Georgia; margin-bottom: calc(((1.5em - 14px) / -2) + ' + defaultBaselineValue + ');}';
            test(input, output);
        });

        it('applies default linebox options for to-descender adjustment', function() {
            var defaultDescenderValue = c.getOptions().defaultAdjustments.toDescender;
            var input = 'a{font: 14px/150% Georgia; trim-line-height: to-descender;}';
            var output = 'a{font: 14px/150% Georgia; margin-bottom: calc(((1.5em - 14px) / -2) + ' + defaultDescenderValue + ');}';
            test(input, output);
        });
    });

    describe('Custom Options', function() {
        it('applies cusom linebox options for to-ascender adjustment', function() {
            var customAscenderValue = options.adjustmentsByTypeface['source sans pro']['400'].toAscender;
            var input = 'a{font: 400 14px/150% "source sans pro"; trim-line-height: to-ascender;}';
            var output = 'a{font: 400 14px/150% "source sans pro"; margin-top: calc(((1.5em - 14px) / -2) + ' + customAscenderValue + ');}';
            test(input, output, options);
        });

        it('applies cusom linebox options for to-capital adjustment', function() {
            var customCapitalValue = options.adjustmentsByTypeface['source sans pro']['bold'].toCapital;
            var input = 'a{font: bold 14px/150% "source sans pro"; trim-line-height: to-capital;}';
            var output = 'a{font: bold 14px/150% "source sans pro"; margin-top: calc(((1.5em - 14px) / -2) + ' + customCapitalValue + ');}';
            test(input, output, options);
        });

        it('applies cusom linebox options for to-baseline adjustment', function() {
            var customBaselineValue = options.adjustmentsByTypeface['source sans pro']['400'].toBaseline;
            var input = 'a{font: 400 14px/150% "source sans pro"; trim-line-height: to-baseline;}';
            var output = 'a{font: 400 14px/150% "source sans pro"; margin-bottom: calc(((1.5em - 14px) / -2) + ' + customBaselineValue + ');}';
            test(input, output, options);
        });

        it('applies cusom linebox options for to-descender adjustment', function() {
            var customDescenderValue = options.adjustmentsByTypeface['source sans pro']['400'].toDescender;
            var input = 'a{font: 400 14px/150% "source sans pro"; trim-line-height: to-descender;}';
            var output = 'a{font: 400 14px/150% "source sans pro"; margin-bottom: calc(((1.5em - 14px) / -2) + ' + customDescenderValue + ');}';
            test(input, output, options);
        });
    });

    describe('Top Adjustments', function() {
        it('appends a top margin if margin is not specified', function() {
            var input = 'a{font: 400 20px/30px "Gill Sans"; trim-line-height: to-ascender;}';
            var output = 'a{font: 400 20px/30px "Gill Sans"; margin-top: calc(((30px - 20px) / -2) + 0.05em);}';
            test(input, output);
        });

        it('adjusts existing top margin if specified in longhand', function() {
            var input = 'a{font: 20px/30px Georgia; margin-top: 20px; trim-line-height: to-capital;}';
            var output = 'a{font: 20px/30px Georgia; margin-top: calc(20px + ((30px - 20px) / -2) + -0.1em);}';
            test(input, output);
        });

        it('adjusts existing top margin if specified in longhand and is expressed as calc', function() {
            var input = 'a{font: 20px/30px Georgia; margin-top: calc( 20px * 2 ); trim-line-height: to-capital;}';
            var output = 'a{font: 20px/30px Georgia; margin-top: calc(( 20px * 2 ) + ((30px - 20px) / -2) + -0.1em);}';
            test(input, output);
        });

        it('ignores existing top margin if specified in longhand, and expressed as a keyword', function() {
            var t = _.template('a{font: 20px/2 Georgia; trim-line-height: to-ascender; margin-top: <%= margin %>;}');
            var inputs = _.map(css.margins, function(margin) {
                return t({ margin: margin });
            });
            var output = 'a{font: 20px/2 Georgia; margin-top: calc(((2em - 20px) / -2) + 0.05em);}';
            test(inputs, output);
        });

        it('adjusts existing top margin if specified in shorthand with one value', function() {
            var input = 'a{font: 20px/30px Georgia; margin: 20px; trim-line-height: to-capital;}';
            var output = 'a{font: 20px/30px Georgia; margin: calc(20px + ((30px - 20px) / -2) + -0.1em) 20px 20px;}';
            test(input, output);
        });

        it('adjusts existing top margin if specified in shorthand with two values', function() {
            var input = 'a{font: 20px/30px Georgia; margin: 20px 10px; trim-line-height: to-capital;}';
            var output = 'a{font: 20px/30px Georgia; margin: calc(20px + ((30px - 20px) / -2) + -0.1em) 10px 20px;}';
            test(input, output);
        });

        it('adjusts existing top margin if specified in shorthand with three values', function() {
            var input = 'a{font: 20px/30px Georgia; margin: 20px 10px 30px; trim-line-height: to-capital;}';
            var output = 'a{font: 20px/30px Georgia; margin: calc(20px + ((30px - 20px) / -2) + -0.1em) 10px 30px;}';
            test(input, output);
        });

        it('adjusts existing top margin if specified in shorthand with four values', function() {
            var input = 'a{font: 20px/30px Georgia; margin: 20px 10px 30px 5px; trim-line-height: to-capital;}';
            var output = 'a{font: 20px/30px Georgia; margin: calc(20px + ((30px - 20px) / -2) + -0.1em) 10px 30px 5px;}';
            test(input, output);
        });

        it('adjusts existing top margin if specified in shorthand with four values, where all are expressed as calc', function() {
            var input = 'a{font: 20px/30px Georgia; margin: calc(20px + 5px) calc(10px -2px) calc(5px + 10%) calc(30px / 2); trim-line-height: to-capital;}';
            var output = 'a{font: 20px/30px Georgia; margin: calc((20px + 5px) + ((30px - 20px) / -2) + -0.1em) calc(10px -2px) calc(5px + 10%) calc(30px / 2);}';
            test(input, output);
        });

        it('ignores existing top margin if specified in shorthand with one value, and expressed as a keyword', function() {
            var ti = _.template('a{font: 20px/2 Georgia; trim-line-height: to-ascender; margin: <%= margin %>;}');
            var to = _.template('a{font: 20px/2 Georgia; margin: calc(((2em - 20px) / -2) + 0.05em) <%= margin %> <%= margin %>;}');
            var inputs = _.map(css.margins, function(margin) {
                return ti({ margin: margin });
            });
            var outputs = _.map(css.margins, function(margin) {
                return to({ margin: margin });
            });
            for (var i = 0, len = inputs.length; i < len; i++) {
                test(inputs[i], outputs[i]);
            }
        });
    });

    describe('Bottom Adjustments', function() {
        it('appends a bottom margin if margin is not specified', function() {
            var input = 'a{font: 100%/2 Georgia; trim-line-height: to-descender;}';
            var output = 'a{font: 100%/2 Georgia; margin-bottom: calc(((2em - 1em) / -2) + 0.05em);}';
            test(input, output);
        });

        it('adjusts existing longhand bottom margin', function() {
            var input = 'a{font: 100%/2 Georgia; margin-bottom: 40px; trim-line-height: to-descender;}';
            var output = 'a{font: 100%/2 Georgia; margin-bottom: calc(40px + ((2em - 1em) / -2) + 0.05em);}';
            test(input, output);
        });

        it('adjusts existing longhand bottom margin, when expressed as calc', function() {
            var input = 'a{font: 100%/2 Georgia; margin-bottom: calc(40px / 2); trim-line-height: to-descender;}';
            var output = 'a{font: 100%/2 Georgia; margin-bottom: calc((40px / 2) + ((2em - 1em) / -2) + 0.05em);}';
            test(input, output);
        });

        it('ignores existing bottom margin if specified in longhand, and expressed as a keyword', function() {
            var t = _.template('a{font: 20px/2 Georgia; trim-line-height: to-descender; margin-bottom: <%= margin %>;}');
            var inputs = _.map(css.margins, function(margin) {
                return t({ margin: margin });
            });
            var output = 'a{font: 20px/2 Georgia; margin-bottom: calc(((2em - 20px) / -2) + 0.05em);}';
            test(inputs, output);
        });

        it('adjusts existing shorthand bottom margin when one value is specified', function() {
            var input = 'a{font: 100%/2 Georgia; margin: 40px; trim-line-height: to-descender;}';
            var output = 'a{font: 100%/2 Georgia; margin: 40px 40px calc(40px + ((2em - 1em) / -2) + 0.05em);}';
            test(input, output);
        });

        it('adjusts existing shorthand bottom margin when one value is specified, and it is expressed as calc', function() {
            var input = 'a{font: 100%/2 Georgia; margin: calc(40px - 5px); trim-line-height: to-descender;}';
            var output = 'a{font: 100%/2 Georgia; margin: calc(40px - 5px) calc(40px - 5px) calc((40px - 5px) + ((2em - 1em) / -2) + 0.05em);}';
            test(input, output);
        });

        it('adjusts existing shorthand bottom margin when two values are specified', function() {
            var input = 'a{font: 100%/2 Georgia; margin: 40px 1em; trim-line-height: to-descender;}';
            var output = 'a{font: 100%/2 Georgia; margin: 40px 1em calc(40px + ((2em - 1em) / -2) + 0.05em);}';
            test(input, output);
        });

        it('adjusts existing shorthand bottom margin when three values are specified', function() {
            var input = 'a{font: 100%/2 Georgia; margin: 40px 1em 200%; trim-line-height: to-descender;}';
            var output = 'a{font: 100%/2 Georgia; margin: 40px 1em calc(200% + ((2em - 1em) / -2) + 0.05em);}';
            test(input, output);
        });

        it('adjusts existing shorthand bottom margin when four values are specified', function() {
            var input = 'a{font: 100%/2 Georgia; margin: 40px 1em 200% 3cm; trim-line-height: to-descender;}';
            var output = 'a{font: 100%/2 Georgia; margin: 40px 1em calc(200% + ((2em - 1em) / -2) + 0.05em) 3cm;}';
            test(input, output);
        });

        it('ignores existing bottom margin if specified in shorthand with one value, and expressed as a keyword', function() {
            var ti = _.template('a{font: 20px/2 Georgia; trim-line-height: to-descender; margin: <%= margin %>;}');
            var to = _.template('a{font: 20px/2 Georgia; margin: <%= margin %> <%= margin %> calc(((2em - 20px) / -2) + 0.05em);}');
            var inputs = _.map(css.margins, function(margin) {
                return ti({ margin: margin });
            });
            var outputs = _.map(css.margins, function(margin) {
                return to({ margin: margin });
            });
            for (var i = 0, len = inputs.length; i < len; i++) {
                test(inputs[i], outputs[i]);
            }
        });
    });

    describe('Transforming Top and Bottom Margins', function() {
        it('appends a top and bottom margin if margin is not specified', function() {
            var input = 'a{font: 100%/2 Georgia; trim-line-height: to-capital to-baseline;}';
            var output = 'a{font: 100%/2 Georgia; margin-top: calc(((2em - 1em) / -2) + -0.1em); margin-bottom: calc(((2em - 1em) / -2) + -0.2em);}';
            test(input, output);
        });

        it('adjusts existing longhand top and bottom margins', function() {
            var input = 'a{font: 100%/2 Georgia; margin-top: 60px; margin-bottom: 40px; trim-line-height: to-capital to-baseline;}';
            var output = 'a{font: 100%/2 Georgia; margin-top: calc(60px + ((2em - 1em) / -2) + -0.1em); margin-bottom: calc(40px + ((2em - 1em) / -2) + -0.2em);}';
            test(input, output);
        });

        it('adjusts existing longhand top and appends longhand bottom margins', function() {
            var input = 'a{font: 100%/2 Georgia; margin-top: 60px; trim-line-height: to-capital to-baseline;}';
            var output = 'a{font: 100%/2 Georgia; margin-top: calc(60px + ((2em - 1em) / -2) + -0.1em); margin-bottom: calc(((2em - 1em) / -2) + -0.2em);}';
            test(input, output);
        });

        it('adjusts existing longhand bottom and appends longhand top margins', function() {
            var input = 'a{font: 100%/2 Georgia; margin-bottom: 60px; trim-line-height: to-capital to-baseline;}';
            var output = 'a{font: 100%/2 Georgia; margin-bottom: calc(60px + ((2em - 1em) / -2) + -0.2em); margin-top: calc(((2em - 1em) / -2) + -0.1em);}';
            test(input, output);
        });

        it('adjusts existing longhand top and bottom margins, when expressed as calc', function() {
            var input = 'a{font: 100%/2 Georgia; margin-top: calc(60px * 05); margin-bottom: calc(40px + 10%); trim-line-height: to-capital to-baseline;}';
            var output = 'a{font: 100%/2 Georgia; margin-top: calc((60px * 05) + ((2em - 1em) / -2) + -0.1em); margin-bottom: calc((40px + 10%) + ((2em - 1em) / -2) + -0.2em);}';
            test(input, output);
        });

        it('ignores existing top and bottom margin if specified in longhand, and expressed as a keyword', function() {
            var t = _.template('a{font: 20px/2 Georgia; trim-line-height: to-capital to-descender; margin-top: <%= margin %>; margin-bottom: <%= margin %>;}');
            var inputs = _.map(css.margins, function(margin) {
                return t({ margin: margin });
            });
            var output = 'a{font: 20px/2 Georgia; margin-top: calc(((2em - 20px) / -2) + -0.1em); margin-bottom: calc(((2em - 20px) / -2) + 0.05em);}';
            test(inputs, output);
        });

        it('adjusts shorthand margin when one value is specified', function() {
            var input = 'a{font: 100%/2 Georgia; margin: 60px; trim-line-height: to-capital to-descender;}';
            var output = 'a{font: 100%/2 Georgia; margin: calc(60px + ((2em - 1em) / -2) + -0.1em) 60px calc(60px + ((2em - 1em) / -2) + 0.05em);}';
            test(input, output);
        });

        it('adjusts shorthand margin when two values are specified', function() {
            var input = 'a{font: 100%/2 Georgia; margin: 60px 40px; trim-line-height: to-capital to-descender;}';
            var output = 'a{font: 100%/2 Georgia; margin: calc(60px + ((2em - 1em) / -2) + -0.1em) 40px calc(60px + ((2em - 1em) / -2) + 0.05em);}';
            test(input, output);
        });

        it('adjusts shorthand margin when three values are specified', function() {
            var input = 'a{font: 100%/2 Georgia; margin: 60px 40px 50px; trim-line-height: to-capital to-descender;}';
            var output = 'a{font: 100%/2 Georgia; margin: calc(60px + ((2em - 1em) / -2) + -0.1em) 40px calc(50px + ((2em - 1em) / -2) + 0.05em);}';
            test(input, output);
        });

        it('adjusts shorthand margin when four values are specified', function() {
            var input = 'a{font: 100%/2 Georgia; margin: 60px 40px 50px 30px; trim-line-height: to-capital to-descender;}';
            var output = 'a{font: 100%/2 Georgia; margin: calc(60px + ((2em - 1em) / -2) + -0.1em) 40px calc(50px + ((2em - 1em) / -2) + 0.05em) 30px;}';
            test(input, output);
        });

        it('adjusts shorthand margin when four values are specified, and all are expressed as calc', function() {
            var input = 'a{font: 100%/2 Georgia; margin: calc(60px - 10xpx) calc(40px + .5em) calc(50px * .25) calc(30px / .5); trim-line-height: to-capital to-descender;}';
            var output = 'a{font: 100%/2 Georgia; margin: calc((60px - 10xpx) + ((2em - 1em) / -2) + -0.1em) calc(40px + .5em) calc((50px * .25) + ((2em - 1em) / -2) + 0.05em) calc(30px / .5);}';
            test(input, output);
        });

        it('ignores existing top and bottom margin if specified in shorthand with one value, and expressed as a keyword', function() {
            var ti = _.template('a{font: 20px/2 Georgia; trim-line-height: to-capital to-descender; margin: <%= margin %>;}');
            var to = _.template('a{font: 20px/2 Georgia; margin: calc(((2em - 20px) / -2) + -0.1em) <%= margin %> calc(((2em - 20px) / -2) + 0.05em);}');
            var inputs = _.map(css.margins, function(margin) {
                return ti({ margin: margin });
            });
            var outputs = _.map(css.margins, function(margin) {
                return to({ margin: margin });
            });
            for (var i = 0, len = inputs.length; i < len; i++) {
                test(inputs[i], outputs[i]);
            }
        });

        it('ignores existing top and bottom margin if specified in shorthand with four values, and expressed as a keyword', function() {
            var ti = _.template('a{font: 20px/2 Georgia; trim-line-height: to-capital to-descender; margin: <%= margin %> <%= margin %> <%= margin %> 20px;}');
            var to = _.template('a{font: 20px/2 Georgia; margin: calc(((2em - 20px) / -2) + -0.1em) <%= margin %> calc(((2em - 20px) / -2) + 0.05em) 20px;}');
            var inputs = _.map(css.margins, function(margin) {
                return ti({ margin: margin });
            });
            var outputs = _.map(css.margins, function(margin) {
                return to({ margin: margin });
            });
            for (var i = 0, len = inputs.length; i < len; i++) {
                test(inputs[i], outputs[i]);
            }
        });
    });
});
