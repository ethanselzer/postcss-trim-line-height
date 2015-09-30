var _ = require('lodash');
var defaultOptions = {
    defaultFontWeight: '400',
    defaultAdjustments: {
        toAscender: '0.05em',
        toCapital: '-0.15em',
        toBaseline: '-0.15em',
        toDescender: '0.05em'
    },
    adjustmentsByTypeface: {}
};

module.exports = {
    pluginName: 'trim-line-height',
    topAdjustments: ['to-ascender', 'to-capital'],
    bottomAdjustments: ['to-baseline', 'to-descender'],
    getOptions: function(options) {
        return _.assign({}, defaultOptions, options);
    }
};
