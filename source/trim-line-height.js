'use strict';

var postcss = require('postcss');
var _ = require('lodash');
var config = require('./config');
var init = require('./init');
var validation = require('./validation');
var transforms = require('./transforms');
var getAdjustedLonghand = transforms.getAdjustedLonghand;
var getShorthandWithAdjustedTop = transforms.getShorthandWithAdjustedTop;
var getShorthandWithAdjustedBottom = transforms.getShorthandWithAdjustedBottom;
var getShorthandWithAdjustedTopAndBottom = transforms.getShorthandWithAdjustedTopAndBottom;

module.exports = postcss.plugin('trim-line-height', function(opts) {
    return function(root) {
        root.eachRule(function(rule) {
            rule.eachDecl('trim-line-height', function(adjustmentDeclaration) {
                var targetLonghandProp;
                var targetShorthandProp = 'margin';
                var options = config.getOptions(opts);
                var input = init.getInput(rule, adjustmentDeclaration);

                validation.validateInput(input);

                if (input.isTopAdjustment && input.isBottomAdjustment && input.isExistingMargin) {
                    input.margin.replaceWith(
                        postcss.decl({
                            prop: targetShorthandProp,
                            value: getShorthandWithAdjustedTopAndBottom(
                                _.assign({}, input, { values: postcss.list.space(input.margin.value) }),
                                options
                            )
                        })
                    );
                } else {
                    if (input.isTopAdjustment) {
                        targetLonghandProp = 'margin-top';
                        if (!input.isExistingMargin && !input.isExistingMarginTop) {
                            rule.append(
                                postcss.decl({
                                    prop: targetLonghandProp,
                                    value: getAdjustedLonghand(
                                        _.assign({}, input, { adjustment: input.topAdjustment }),
                                        options
                                    )
                                })
                            );
                        }

                        if (input.isExistingMarginTop) {
                            input.marginTop.replaceWith(
                                postcss.decl({
                                    prop: targetLonghandProp,
                                    value: getAdjustedLonghand(
                                        _.assign({}, input, {
                                            existing: input.marginTop.value,
                                            adjustment: input.topAdjustment
                                        }),
                                        options
                                    )
                                })
                            );
                        }

                        if (input.isExistingMargin) {
                            input.margin.replaceWith(
                                postcss.decl({
                                    prop: targetShorthandProp,
                                    value: getShorthandWithAdjustedTop(
                                        _.assign({}, input, { values: postcss.list.space(input.margin.value) }),
                                        options
                                    )
                                })
                            );
                        }
                    }
                    if (input.isBottomAdjustment) {
                        targetLonghandProp = 'margin-bottom';
                        if (!input.isExistingMargin && !input.isExistingMarginBottom) {
                            rule.append(
                                postcss.decl({
                                    prop: targetLonghandProp,
                                    value: getAdjustedLonghand(
                                        _.assign({}, input, { adjustment: input.bottomAdjustment }),
                                        options
                                    )
                                })
                            );
                        }

                        if (input.isExistingMarginBottom) {
                            input.marginBottom.replaceWith(
                                postcss.decl({
                                    prop: targetLonghandProp,
                                    value: getAdjustedLonghand(
                                        _.assign({}, input, {
                                            existing: input.marginBottom.value,
                                            adjustment: input.bottomAdjustment
                                        }),
                                        options
                                    )
                                })
                            );
                        }

                        if (input.isExistingMargin) {
                            input.margin.replaceWith(
                                postcss.decl({
                                    prop: targetShorthandProp,
                                    value: getShorthandWithAdjustedBottom(
                                        _.assign({}, input, { values: postcss.list.space(input.margin.value) }),
                                        options
                                    )
                                })
                            );
                        }
                    }
                }

                adjustmentDeclaration.removeSelf();
            });
        });
    };
});
