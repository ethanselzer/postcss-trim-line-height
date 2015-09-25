var gulp = require('gulp');
var postcss = require('gulp-postcss');
var jasmine = require('gulp-jasmine');
var eslint = require('gulp-eslint');
var del = require('del');
var tlh = require('./source/trim-line-height');

gulp.task('build', ['clean'], function() {
    return gulp.src('./examples/source/*.css')
        .pipe(postcss([tlh]))
        .pipe(gulp.dest('./examples/build'));
});

gulp.task('lint', function() {
    return gulp.src(['./source/*.js', 'test/**/*.js'])
        .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failOnError());
});

gulp.task('test', function() {
    return gulp.src('./test/*.spec.js')
        .pipe(jasmine());
});

gulp.task('watch', function() {
    return gulp.watch(['./source/*.js', './test/**/*.js'], ['test']);
});

gulp.task('clean', function() {
    return del(['./examples/build/*.css']);
});
