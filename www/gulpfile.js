var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');

gulp.task('default', ['minify-css','compress'],function() {
    // place code for your default task here
});

gulp.task('minify-css', function() {
    return (gulp.src('./app/style/style.css'))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('./app/style/'));

});

gulp.task('compress', function() {
    return gulp.src(['app/app.js','app/service/*.js','app/view/**/*.js'])
        .pipe(uglify())
        .pipe(concat('all.js'))
        .pipe(gulp.dest('app'));
});