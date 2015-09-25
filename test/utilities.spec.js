'use strict';

var _ = require('lodash');
var u = require('../source/utilities');
var getRule = require('./helpers/get-rule');

describe('findDeclaration', function() {
    it('returns undefined if property is not found in rule', function() {
        var rule = getRule('a{font-size: 12px}');
        var decl = u.findDeclaration(rule, 'font-weight');
        expect(decl).toBeUndefined();
    });

    it('returns found declaration', function() {
        var scenarios = [
            { input: 'a{font-size: 12px}', prop: 'font-size', value: '12px' },
            { input: 'a{font: 12px Arial}', prop: 'font', value: '12px Arial' },
            { input: 'a{font-family: Arial}', prop: 'font-family', value: 'Arial' },
            { input: 'a{font-weight: bold}', prop: 'font-weight', value: 'bold' },
            { input: 'a{line-height: 2}', prop: 'line-height', value: '2' }
        ];

        _.forEach(scenarios, function(s) {
            var rule = getRule(s.input);
            var decl = u.findDeclaration(rule, s.prop);
            expect(decl.prop).toEqual(s.prop);
            expect(decl.value).toEqual(s.value);
        });
    });

    it('returns declaration assigned a zero based index of declaration in rule', function() {
        var scenarios = [
            { css: 'a{font-size: 12px;}', prop: 'font-size', expected: 0 },
            { css: 'a{font-size: 12px; font-weight: 100;}', prop: 'font-weight', expected: 1 },
            { css: 'a{font-size: 12px; line-height: 1.5; font-weight: 100;}', prop: 'line-height', expected: 1 }
        ];

        _.forEach(scenarios, function(scenario) {
            var rule = getRule(scenario.css);
            var decl = u.findDeclaration(rule, scenario.prop);
            expect(decl.index).toBe(scenario.expected);
        });
    });

    it('returns last index for a declaration', function() {
        var scenarios = [
            { css: 'a{font-size: 12px; font-size: 14px;}', prop: 'font-size', expected: 1 },
            { css: 'a{font-weight: 700; font-size: 12px; font-weight: 100;}', prop: 'font-weight', expected: 2 }
        ];

        _.forEach(scenarios, function(scenario) {
            var rule = getRule(scenario.css);
            var decl = u.findDeclaration(rule, scenario.prop);
            expect(decl.index).toBe(scenario.expected);
        });
    });

    it('returns declaration assigned a custom property named jsProp', function() {
        var rule = getRule('a{font-size: 12px}');
        var decl = u.findDeclaration(rule, 'font-size', 'size');
        expect(decl.jsProp).toEqual('size');
    });
});
