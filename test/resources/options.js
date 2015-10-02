'use strict';

var georgiaNormal = {
    toAscender: '0.064em',
    toCapital: '-0.154em',
    toBaseline: '-0.152em',
    toDescender: '0.064em'
};

module.exports = {
    defaultAdjustments: {
        toAscender: '0.05em',
        toCapital: '-0.15em',
        toBaseline: '-0.15em',
        toDescender: '0.05em'
    },
    adjustmentsByTypeface: {
        'source sans pro': {
            '400': {
                toAscender: '0.036em',
                toCapital: '-0.198em',
                toBaseline: '-0.146em',
                toDescender: '0.07em'
            },
            'bold': {
                toAscender: '.034em',
                toCapital: '-0.200em',
                toBaseline: '-0.146em',
                toDescender: '0.06em'
            }
        },
        'Georgia': {
            'normal': georgiaNormal,
            '400': georgiaNormal
        }
    }
};
