'use strict';

var _ = require('lodash');
var postcss = require('postcss');
var adjust = require('../../index');

function _test(input, expected, options) {
    var p = postcss().use(adjust(options));
    var o;
    try {
        o = p.process(input).css;
    } catch(ex) {
        if (_.isRegExp(expected)) {
            expect(reThrow.bind(null, ex)).toThrowError(expected);
        } else {
            throw ex;
        }
        return;
    }
    expect(o).toEqual(expected);
}

function reThrow(err) {
    throw err;
}

module.exports = function(input, expected, options) {
    if (_.isArray(input)) {
        input.forEach(function(item) {
            _test(item, expected, options);
        });
    } else {
        _test(input, expected, options);
    }
};
