'use strict';
var postcss = require('postcss');
var _ = require('lodash');
var u = require('./utilities');

function fontValues(font) {
    var f = _.clone(font);
    var q = [
        { prop: 'family', op: getFirstFamily },
        { prop: 'family', op: u.stripQuotes },
        { prop: 'size', op: percentageToEm },
        { prop: 'size', op: calcToSubroutine },
        { prop: 'lineHeight', op: computeCalc },
        { prop: 'lineHeight', op: calcToSubroutine },
        { prop: 'lineHeight', op: percentageToEm },
        { prop: 'lineHeight', op: unitlessToEm }
    ];

    _.forEach(q, function(e) {
        f[e.prop] = f[e.prop] && e.op(f[e.prop]);
    });

    return f;
}

function getFirstFamily(families) {
    return _.first(postcss.list.comma(families));
}

function percentageToEm(val) {
    return val.replace(/((\d+(\.\d*)?)|(\.\d+))%/g, function(m) {
        return (parseFloat(m) / 100) + 'em';
    });
}

function unitlessToEm(val) {
    var re = /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/;
    return val.replace(re, function(m) {
        return m + 'em';
    });
}

function calcToSubroutine(val) {
    return val.replace(/calc/i, '');
}

function computeCalc(val) {
    var re = /^calc\s*\(\s*([+-]?((\d+(\.\d*)?)|(\.\d+))\s*[+\-\/*]\s*[+-]?((\d+(\.\d*)?)|(\.\d+)))\s*\)$/i;
    var matches = val.match(re);
    return (matches && '' + eval(matches[1])) || val;
}

module.exports = {
    fontValues: fontValues,
    percentageToEm: percentageToEm,
    unitlessToEm: unitlessToEm,
    calcToSubroutine: calcToSubroutine,
    computeCalc: computeCalc
};
