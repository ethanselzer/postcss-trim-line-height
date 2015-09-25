'use strict';

var _ = require('lodash');
var getRule = require('./helpers/get-rule');
var cssValues = require('./resources/css-values');
var font = require('../source/font');

describe('Font Parsing', function() {

    describe('getValues', function() {

        function test(scenarios) {
            _.forEach(scenarios, function(s) {
                expect(font.getValues(getRule(s.input))).toEqual(s.expected);
            });
        }

        it('returns an ordered value for family', function() {
            var scenarios = [
                {
                    input: 'a{font-family: monospace; font: bold 12px/2 Arial;}',
                    expected: { family: 'Arial', lineHeight: '2', size: '12px', weight: 'bold' }
                },
                {
                    input: 'a{font-family: sans-serif; font: bold 12px/2 Arial; font-family: "Gil Sans";}',
                    expected: { family: '"Gil Sans"', lineHeight: '2', size: '12px', weight: 'bold' }
                },
                {
                    input: 'a{font-family: Arial; font-weight: bold; font-size: 12px; line-height: 2; font-family: monospace; }',
                    expected: { family: 'monospace', lineHeight: '2', size: '12px', weight: 'bold' }
                },
                {
                    input: 'a{font-family: Arial;}',
                    expected: { family: 'Arial' }
                },
                {
                    input: 'a{font: bold 12px/2 Arial;}',
                    expected: { family: 'Arial', lineHeight: '2', size: '12px', weight: 'bold' }
                }
            ];

            test(scenarios);
        });

        it('returns an ordered value for line-height', function() {
            var scenarios = [
                {
                    input: 'a{line-height: 1.5; font: bold 12px/2 Arial;}',
                    expected: { lineHeight: '2', family: 'Arial', size: '12px', weight: 'bold' }
                },
                {
                    input: 'a{line-height: 1.5; font: bold 12px/2 Arial; line-height: 1.8;}',
                    expected: { lineHeight: '1.8', family: 'Arial', size: '12px', weight: 'bold' }
                },
                {
                    input: 'a{line-height: 1; font-weight: bold; font-size: 12px; font-family: Arial; line-height: 1.25 }',
                    expected: { lineHeight: '1.25', family: 'Arial', size: '12px', weight: 'bold' }
                },
                {
                    input: 'a{line-height: calc(24 / 16);}',
                    expected: { lineHeight: 'calc(24 / 16)' }
                },
                {
                    input: 'a{font: bold 12px/2 Arial;}',
                    expected: { lineHeight: '2', family: 'Arial', size: '12px', weight: 'bold' }
                }
            ];

            test(scenarios);
        });

        it('returns an ordered value for font size', function() {
            var scenarios = [
                {
                    input: 'a{font-size: 16px; font: bold 12px/2 Arial;}',
                    expected: { size: '12px', family: 'Arial', lineHeight: '2', weight: 'bold' }
                },
                {
                    input: 'a{line-height: 1.5; font: bold 12px/2 Arial; line-height: 1.8;}',
                    expected: { size: '12px', family: 'Arial', lineHeight: '1.8', weight: 'bold' }
                },
                {
                    input: 'a{font-size: 12px; line-height: 1; font-weight: bold; font-family: Arial; font-size: 16px; }',
                    expected: { size: '16px', lineHeight: '1', weight: 'bold', family: 'Arial' }
                },
                {
                    input: 'a{font-size: 12px;}',
                    expected: { size: '12px' }
                },
                {
                    input: 'a{font-size: 12px; font-family: Arial; line-height: 1.25; font-weight: bold; }',
                    expected: { size: '12px', family: 'Arial', lineHeight: '1.25', weight: 'bold' }
                }
            ];

            test(scenarios);
        });

        it('returns an ordered value for font weight', function() {
            var scenarios = [
                {
                    input: 'a{font-weight: normal; font: bold 12px/2 Arial;}',
                    expected: { weight: 'bold', size: '12px', family: 'Arial', lineHeight: '2' }
                },
                {
                    input: 'a{font-weight: 400; font: 300 12px/2 Arial; font-weight: bold;}',
                    expected: { weight: 'bold', size: '12px', family: 'Arial', lineHeight: '2' }
                },
                {
                    input: 'a{font-weight: 700; line-height: 1; font-size: 16px; font-family: Arial; font-weight: lighter; }',
                    expected: { weight: 'lighter', size: '16px', lineHeight: '1', family: 'Arial' }
                },
                {
                    input: 'a{font-weight: 300;}',
                    expected: { weight: '300' }
                },
                {
                    input: 'a{font-weight: bold; font-size: 12px; font-family: Arial; line-height: 1.25; }',
                    expected: { weight: 'bold', size: '12px', family: 'Arial', lineHeight: '1.25' }
                }
            ];

            test(scenarios);
        });
    });

    describe('parseFontShorthand', function() {
        it('returns undefined for invalid iput', function() {
            var inputs = [
                '',
                void(0)
            ];
            _.forEach(inputs, function(input) {
                expect(font.parseShorthand(input)).toEqual({
                    family: null,
                    stretch: null,
                    lineHeight: null,
                    size: null,
                    weight: null
                });
            });
        });

        it('returns family when size and line height are specified in various formats', function() {
            var scenarios = [
                ['bold 12px Georgia, Times New Roman', 'Georgia, Times New Roman'],
                ['bold xx-large Georgia, Times New Roman',  'Georgia, Times New Roman'],
                ['bold 12px/24px Georgia, Times New Roman',  'Georgia, Times New Roman'],
                ['bold calc(100px / 10) Georgia, Times New Roman',  'Georgia, Times New Roman'],
                ['bold calc(100px / 10)/calc(1 / 2) Georgia, Times New Roman',  'Georgia, Times New Roman'],
                ['bold calc(100px / 10) /calc(1 / 2) Georgia, Times New Roman',  'Georgia, Times New Roman'],
                ['bold calc(100px / 10)/ calc(1 / 2) Georgia, Times New Roman',  'Georgia, Times New Roman'],
                ['bold calc(100px / 10) / calc(1 / 2) Georgia, Times New Roman',  'Georgia, Times New Roman'],
                ['bold calc(100px / 10)/1.5 Georgia, Times New Roman',  'Georgia, Times New Roman'],
                ['bold calc(100px / 10) /1.5 Georgia, Times New Roman',  'Georgia, Times New Roman'],
                ['bold calc(100px / 10)/ 1.5 Georgia, Times New Roman',  'Georgia, Times New Roman'],
                ['bold calc(100px / 10) / 1.5 Georgia, Times New Roman',  'Georgia, Times New Roman'],
                ['bold inherit Georgia, Times New Roman',  'Georgia, Times New Roman'],
                ['bold xx-large ultra-condensed Georgia, Times New Roman',  'Georgia, Times New Roman'],
                ['bold xx-large unset Georgia, Times New Roman',  'Georgia, Times New Roman'],
                ['bold xx-large/ 1.5 Georgia, Times New Roman',  'Georgia, Times New Roman'],
                ['bold xx-large /1.5 Georgia, Times New Roman',  'Georgia, Times New Roman'],
                ['bold xx-large / 1.5 Georgia, Times New Roman',  'Georgia, Times New Roman'],
                ['bold xx-large/1.5 Georgia, Times New Roman',  'Georgia, Times New Roman'],
                ['bold xx-large / normal Georgia, Times New Roman',  'Georgia, Times New Roman'],
                ['bold xx-large /normal Georgia, Times New Roman',  'Georgia, Times New Roman'],
                ['bold xx-large/ normal Georgia, Times New Roman',  'Georgia, Times New Roman'],
                ['bold xx-large/normal Georgia, Times New Roman',  'Georgia, Times New Roman'],
                ['bold xx-large / normal Georgia, "Times New Roman"',  'Georgia, "Times New Roman"'],
                ['bold xx-large / normal Georgia, \'Times New Roman\'',  'Georgia, \'Times New Roman\''],
                ['bold xx-large monospace',  'monospace'],
                ['bold xx-large Georgia, Times, sans-serif',  'Georgia, Times, sans-serif']
            ];

            _.forEach(scenarios, function(scenario) {
                expect(font.parseShorthand(scenario[0]).family).toEqual(scenario[1]);
            });
        });

        it('returns family when size is specified as a length and line height is not specified', function() {
            var t = _.template('bold <%= length %> Georgia, Times New Roman');
            _.forEach(cssValues.lengths, function(length) {
                expect(font.parseShorthand(t({ length: length })).family).toEqual('Georgia, Times New Roman');
            });
        });

        it('returns stretch when specified in the 6th position', function() {
            var inputs = [
                'normal bold xx-large <%= stretch %> Georgia, Times New Roman',
                'normal bold xx-large/calc(2 / 1) <%= stretch %> Georgia, Times New Roman',
                'normal bold xx-large/ calc(2 / 1) <%= stretch %> Georgia, Times New Roman',
                'normal bold xx-large /calc(2 / 1) <%= stretch %> Georgia, Times New Roman',
                'normal bold xx-large / calc(2 / 1) <%= stretch %> Georgia, Times New Roman',
                'normal bold xx-large/1.5 <%= stretch %> Georgia, Times New Roman',
                'normal bold xx-large/ 1.5 <%= stretch %> Georgia, Times New Roman',
                'normal bold xx-large /1.5 <%= stretch %> Georgia, Times New Roman',
                'normal bold xx-large / 1.5 <%= stretch %> Georgia, Times New Roman'
            ];

            _.forEach(inputs, function(input) {
                var t = _.template(input);
                _.forEach(cssValues.stretchKeywords, function(stretch) {
                    expect(font.parseShorthand(t({ stretch: stretch })).stretch).toEqual(stretch);
                });
            });
        });

        it('returns a null property when stetch is not defined', function() {
            var inputs = [
                'bold xx-large / normal Georgia, Times New Roman',
                'bold xx-large /normal Georgia, Times New Roman',
                'bold xx-large/ normal Georgia, Times New Roman',
                'bold xx-large/normal Georgia, Times New Roman'
            ];

            _.forEach(inputs, function(input) {
                expect(font.parseShorthand(input).stretch).toBeNull();
            });
        });

        it('returns line height', function() {
            var inputs = [
                'bold xx-large / <%= lineHeight %> Georgia, Times New Roman',
                'bold xx-large /<%= lineHeight %> Georgia, Times New Roman',
                'bold xx-large/ <%= lineHeight %> Georgia, Times New Roman',
                'bold xx-large/<%= lineHeight %> Georgia, Times New Roman',
                'bold xx-large / <%= lineHeight %> normal Georgia, Times New Roman',
                'bold xx-large /<%= lineHeight %> normal Georgia, Times New Roman',
                'bold xx-large/ <%= lineHeight %> normal Georgia, Times New Roman',
                'bold xx-large/<%= lineHeight %> normal Georgia, Times New Roman',
                'bold calc( 20px / 2 ) / <%= lineHeight %> normal Georgia, Times New Roman',
                'bold calc( 20px / 2 ) /<%= lineHeight %> normal Georgia, Times New Roman',
                'bold calc( 20px / 2 )/ <%= lineHeight %> normal Georgia, Times New Roman',
                'bold calc( 20px / 2 )/<%= lineHeight %> normal Georgia, Times New Roman'
            ];

            _.forEach(inputs, function(input) {
                var t = _.template(input);
                _.forEach(cssValues.lineHeights, function(lineHeight) {
                    expect(font.parseShorthand(t({ lineHeight: lineHeight })).lineHeight).toEqual(lineHeight);
                });
            });
        });

        it('returns a null property if line height is not specified', function() {
            var inputs = [
                'bold 12px Georgia',
                'bold calc(40px / 2) Georgia, Times New Roman',
                'bold calc(40px/ 2) Georgia, Times New Roman',
                'bold calc(40px /2) Georgia, Times New Roman',
                'bold calc(40px/2) Georgia, Times New Roman'
            ];

            _.forEach(inputs, function(input) {
                expect(font.parseShorthand(input).lineHeight).toBeNull();
            });
        });

        it('returns size', function() {
            var inputs = [
                'bold <%= size %> / 1.5em Georgia, Times New Roman',
                'bold <%= size %>/ 1.5em Georgia, Times New Roman',
                'bold <%= size %> /1.5em Georgia, Times New Roman',
                'bold <%= size %>/1.5em Georgia, Times New Roman',
                'bold <%= size %> / 1.5em normal Georgia, Times New Roman',
                'bold <%= size %>/ 1.5em normal Georgia, Times New Roman',
                'bold <%= size %> /1.5em normal Georgia, Times New Roman',
                'bold <%= size %>/1.5em normal Georgia, Times New Roman',
                'bold <%= size %> / calc( 20px / 2 ) normal Georgia, Times New Roman',
                'bold <%= size %>/ calc( 20px / 2 ) normal Georgia, Times New Roman',
                'bold <%= size %> /calc( 20px / 2 ) normal Georgia, Times New Roman',
                'bold <%= size %>/calc( 20px / 2 ) normal Georgia, Times New Roman',
                'bold <%= size %> monospace',
                'bold <%= size %> Georgia, Times New Roman',
                'bold <%= size %> normal Georgia, Times New Roman'
            ];

            _.forEach(inputs, function(input) {
                var t = _.template(input);
                _.forEach(cssValues.fontSizes, function(size) {
                    expect(font.parseShorthand(t({ size: size })).size).toEqual(size);
                });
            });
        });

        it('returns a null property if size is not specified', function() {
            var inputs = [
                'bold Georgia',
                'bold Georgia, Times New Roman',
                'bold italic Georgia, Times New Roman'
            ];

            _.forEach(inputs, function(input) {
                expect(font.parseShorthand(input).lineHeight).toBeNull();
            });
        });

        it('returns weight', function() {
            var inputs = [
                '<%= weight %> xx-large / 1.5em Georgia, Times New Roman',
                '<%= weight %> condensed xx-large / 1.5em Georgia, Times New Roman',
                'small-caps <%= weight %> condensed xx-large / 1.5em Georgia, Times New Roman',
                'italic small-caps <%= weight %> xx-large / 1.5em Georgia, Times New Roman',
                'italic small-caps condensed <%= weight %> xx-large / 1.5em Georgia, Times New Roman',
                'italic small-caps condensed <%= weight %> xx-large Georgia, Times New Roman'
            ];

            _.forEach(inputs, function(input) {
                var t = _.template(input);
                _.forEach(cssValues.weights, function(weight) {
                    expect(font.parseShorthand(t({ weight: weight })).weight).toEqual('' + weight);
                });
            });
        });

        it('returns a null property when weight is not defined', function() {
            var inputs = [
                'xx-large / 1.5em Georgia, Times New Roman',
                'condensed xx-large / 1.5em Georgia, Times New Roman',
                'small-caps condensed xx-large / 1.5em Georgia, Times New Roman',
                'italic small-caps condensed xx-large / 1.5em Georgia, Times New Roman',
                'italic small-caps condensed xx-large Georgia, Times New Roman'
            ];

            _.forEach(inputs, function(input) {
                expect(font.parseShorthand(input).weight).toBeNull();
            });
        });
    });
});
