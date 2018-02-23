//jshint ignore: start
var gulp=require('gulp');
var gutil=require('gulp-util');
var sourcemaps=require('gulp-sourcemaps');
var concat=require('gulp-concat');
var uglify=require('gulp-uglify');
var jshint=require ('gulp-jshint');


gulp.task('default', function(){
    return gutil.log('Gulp è in esecuzione');
});


gulp.task('jshint', function(){
    return gulp.src('weather.js').pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


