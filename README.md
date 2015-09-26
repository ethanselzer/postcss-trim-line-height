# postcss-trim-line-height

<img align="right" width="135" height="95"
     title="Philosopher’s stone, logo of PostCSS"
     src="http://postcss.github.io/postcss/logo-leftp.png">

A PostCSS plugin for automatically adjusting vertical margin to account for whitespace introduced by line height.

# Usage
```css
a{
    font: 600 2rem/3.2 Georgia, serif;
    margin: 20px 0;
    trim-line-height: <to-ascender | to-capital> <to-baseline | to-descender>
}
```
# Next Steps
1. [x] [bug] Important keyword (!important) is not honored when transforming target margin value(s)
1. [x] Upgrade to PostCSS 5x
1. [x] Implement custom typeface adjustment options for NR/HL typefaces
1. Research and document plugin order dependency
1. Verify source map interoperability
1. Review specs for gaps and enhancements
1. Consider supporting `x-height` linebox adjustment
1. Consider supporting nested selector syntax
1. Consider supporting mixed long and shorthand margin declarations
1. Consider options validation
1. Write documentation
1. Add examples
1. Consider automated test coverage
1. Travis CI
1. Publish NPM module

