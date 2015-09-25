'use strict';

var postcss = require('postcss');
var _ = require('lodash');
var u = require('./utilities');
var cssValues = require('./css-keywords');

function getValues(rule) {
    var font = {};
    var props = [
        { css: 'font', js: 'font' },
        { css: 'font-family', js: 'family' },
        { css: 'line-height', js: 'lineHeight' },
        { css: 'font-size', js: 'size' },
        { css: 'font-weight', js: 'weight' }
    ];

    var nodes = _.compact(_.map(props, function(prop) {
        return u.findDeclaration(rule, prop.css, prop.js);
    }));

    nodes.sort(function(a, b) {
        return a.index - b.index;
    });

    var startIndex = Math.max(_.findIndex(nodes, { jsProp: 'font' }), 0);

    for (var i = startIndex, len = nodes.length; i < len; i++) {
        var node = nodes[i];
        if (node.jsProp === 'font') {
            font = _.omit(parseShorthand(node.value), ['stretch', 'variant', 'style']);
            continue;
        }
        font[node.jsProp] = node.value;
    }

    return font;
}

function parseShorthand(shorthand) {
    var parsed = {
        family: null,
        stretch: null,
        lineHeight: null,
        size: null,
        weight: null
    };

    if (!shorthand) { return parsed; }

    var list = postcss.list.space(shorthand);
    var queue = [
        { op: getFamily, prop: 'family' },
        { op: getStretchInSixthPosition, prop: 'stretch' },
        { op: getHeight, prop: 'lineHeight' },
        { op: getSize, prop: 'size' },
        { op: getWeight, prop: 'weight' }
    ];

    _.forEach(queue, function(el) {
        if (list.length) {
            var op = el.op(list);
            if (op.value) {
                parsed[el.prop] = op.value;
                list.splice(op.nextIndex + 1, op.count || list.length);
            }
        }
    });

    return parsed;
}

function getFamily(list) {
    var family = '';

    for (var len = list.length, i = len - 1; i >= 0; i--) {
        var current = list[i];
        var currentLower = current.toLowerCase();
        if (i === len - 1) {
            family += current;
        } else if (isStretchKeyWord(currentLower)) {
            break;
        } else if (includesNumber(currentLower)) {
            break;
        } else if (includes(currentLower, 'calc')) {
            break;
        } else if (isLhKeyword(currentLower)) {
            break;
        } else if (isFsKeyword(currentLower)) {
            break;
        } else if (isGlobalKeyword(currentLower)) {
            break;
        } else {
            family = list[i] + ' ' + family;
        }
    }

    return {
        value: family,
        nextIndex: i
    };
}

function getStretchInSixthPosition(list) {
    var stretch;
    var nextIndex;
    var index = list.length - 1;
    var current = list[index].toLowerCase();

    if (isStretchKeyWord(current)) {
        if (current === 'normal') {
            var next = list[index - 1];
            if (!_.endsWith(next, '/') ) {
                stretch = current;
                nextIndex = index -1;
            }

        } else {
            stretch = current;
            nextIndex = index -1;
        }
    }

    return {
        value: stretch,
        nextIndex: nextIndex
    };
}

function getHeight(list) {
    var height;
    var index = list.length - 1;
    var nextIndex = index;
    var current = list[index].toLowerCase();
    var next = list[index - 1];

    if (_.startsWith(current, '/')) {
        height = current.slice(1);
        nextIndex = index - 1;
    } else if (next && _.endsWith(next, '/')) {
        height = current;
        if (next === '/') {
            nextIndex = index - 2;
        } else {
            nextIndex = index - 1;
        }
    } else if (includes(current, '/calc')) {
        height = current.slice(current.indexOf('/calc') + 1);
    } else if (includes(current, '/', current.lastIndexOf(')'))) {
        height = current.slice(current.lastIndexOf('/') + 1);
    }

    return {
        value: height,
        nextIndex: nextIndex
    };
}

function getSize(list) {
    var size;
    var nextIndex;
    var index = list.length - 1;
    var current = list[index].toLowerCase();

    if (_.endsWith(current, '/')) {
        size = current.slice(0, current.length - 1);
        nextIndex = index - 1;
    } else if (!_.startsWith(current, 'calc') && includes(current, '/')) {
        size = current.slice(0, current.indexOf('/'));
        nextIndex = index - 1;
    } else if (includes(current, '/', current.indexOf(')'))) {
        size = current.slice(0, current.indexOf('/', current.indexOf(')')));
        nextIndex = index - 1;
    } else if (isFsKeyword(current) || isLength(current) || _.startsWith(current, 'calc')) {
        size = current;
        nextIndex = index - 1;
    }

    return {
        value: size,
        nextIndex: nextIndex
    };
}

function getWeight(list) {
    var weight;
    var nextIndex;
    for (var len = list.length, i = len - 1; i >= 0; i--) {
        var match = list[i].match(/^(bolder|lighter|bold|[1-9]00)$/i);
        if (match) {
            weight = match[0];
            nextIndex = i - 1;
            break;
        }
    }
    return {
        value: weight,
        nextIndex: nextIndex,
        count: 1
    };
}

function isLength(val) {
    return  /^((\d+(\.\d*)?)|(\.\d+))([a-z]+|%)$/i.test(val);
}

function includesNumber(val) {
    return /((\d+(\.\d*)?)|(\.\d+))/.test(val);
}

function includes(val, stringToFind, startPosition) {
    return val.indexOf(stringToFind, startPosition) !== -1;
}

function isLhKeyword(val) {
    return val.toLowerCase().indexOf('normal') !== -1;
}

function isFsKeyword(val) {
    return _.contains(cssValues.fontSizeKeywords, val);
}

function isGlobalKeyword(val) {
    return _.contains(cssValues.globalKeywords, val);
}

function isStretchKeyWord(val) {
    return _.contains(cssValues.stretchKeywords, val);
}

module.exports = {
    parseShorthand: parseShorthand,
    getValues: getValues
};
