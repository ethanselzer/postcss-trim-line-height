'use strict';

var _ = require('lodash');
var convert = require('../source/conversions');

function test(scenarios, op) {
    _.forEach(scenarios, function(s) {
        expect(op(s.input)).toEqual(s.expected);
    });
}

describe('fontValues integration', function() {
    it('converts family list to first family', function() {
        var input = { family: 'Arial, Sans-Serif' };
        expect(convert.fontValues(input)).toEqual({ family: 'Arial', size: undefined, lineHeight: undefined });
    });

    it('strips quotes from the first family name', function() {
        var input = { family: '"Gill Sans", Arial, Sans-Serif' };
        expect(convert.fontValues(input)).toEqual({ family: 'Gill Sans', size: undefined, lineHeight: undefined });
    });

    it('converts size from percentage to em', function() {
        var input = { size: '100%' };
        expect(convert.fontValues(input)).toEqual({ size: '1em', family: undefined, lineHeight: undefined });
    });

    it('converts size from calc to subroutine', function() {
        var input = { size: 'calc(20px + 10%)' };
        expect(convert.fontValues(input)).toEqual({ size: '(20px + 0.1em)', family: undefined, lineHeight: undefined });
    });

    it('computes line height expressed as unitless calc', function() {
        var input = { lineHeight: 'calc(24 / 16)' };
        expect(convert.fontValues(input)).toEqual({ lineHeight: '1.5em', size: undefined, family: undefined });
    });

    it('converts line height expressed as calc to subroutine', function() {
        var input = { lineHeight: 'calc(1em + 20%)' };
        expect(convert.fontValues(input)).toEqual({ lineHeight: '(1em + 0.2em)', size: undefined, family: undefined });

    });

    it('converts line height expressed as percentage to em', function() {
        var input = { lineHeight: '150%' };
        expect(convert.fontValues(input)).toEqual({ lineHeight: '1.5em', size: undefined, family: undefined });

    });

    it('converts line height expressed as unitless to em', function() {
        var input = { lineHeight: '1.65' };
        expect(convert.fontValues(input)).toEqual({ lineHeight: '1.65em', size: undefined, family: undefined });
    });
});

describe('percentageToEm', function() {
    it('converts percentage values to em values', function() {
        var scenarios = [
            { input: '100%', expected: '1em' },
            { input: '50%', expected: '0.5em' },
            { input: '120%', expected: '1.2em' },
            { input: '120.5%', expected: '1.205em' },
            { input: 'calc(100% + 10%)', expected: 'calc(1em + 0.1em)' }
        ];
        test(scenarios, convert.percentageToEm);
    });
});

describe('unitlessToEm', function() {
    it('converts unitless to em', function() {
        var scenarios = [
            { input: '2', expected: '2em' },
            { input: '0.234', expected: '0.234em' },
            { input: '-1.2', expected: '-1.2em' },
            { input: '+0.9', expected: '+0.9em'}
        ];
        test(scenarios, convert.unitlessToEm);
    });

    it('does not convert non-unitless to em', function() {
        var scenarios = [
            { input: 'calc ( 24 / 16 )', expected: 'calc ( 24 / 16 )' },
            { input: '24px', expected: '24px' },
            { input: '1.2em', expected: '1.2em' },
            { input: '14pt', expected: '14pt'}
        ];
        _.forEach(scenarios, function(s) {
            expect(convert.unitlessToEm(s.input)).toEqual(s.expected);
        });
    });
});

describe('computeCalc', function() {
    it('computes calc containing unitless equations', function() {
        var scenarios = [
            { input: 'calc( 24 * 0.25 )', expected: '6' },
            { input: 'calc( .1 * 2.0)', expected: '0.2' },
            { input: 'CALC(24/12)', expected: '2' },
            { input: 'calc( 2 + -1 )', expected: '1' },
            { input: 'calc (-2 - +1)', expected: '-3' }
        ];
        test(scenarios, convert.computeCalc);
    });

    it('does not compute calc containing units', function() {
        var scenarios = [
            { input: 'calc( 24px * 0.25 )', expected: 'calc( 24px * 0.25 )' },
            { input: 'calc( 1.5 * 2em)', expected: 'calc( 1.5 * 2em)' },
            { input: 'CALC(24px + 10%)', expected: 'CALC(24px + 10%)' },
            { input: 'calc ( 40pt / -2 )', expected: 'calc ( 40pt / -2 )'}
        ];
        test(scenarios, convert.computeCalc);
    });
});
