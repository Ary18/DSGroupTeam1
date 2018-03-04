//jshint ignore: start
var gulp=require('gulp');
var gutil=require('gulp-util');
var sourcemaps=require('gulp-sourcemaps');
var concat=require('gulp-concat');
var uglify=require('gulp-uglify');
var jshint=require ('gulp-jshint');
var replace =require('gulp-string-replace');
let cleanCSS = require('gulp-clean-css');

const sass =require('gulp-sass');


gulp.task('default', function(){
    return gutil.log('Gulp è in esecuzione');
});


gulp.task('jshint', function(){
    return gulp.src('source/javascript/*.js').pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


gulp.task('build', function () {
    gulp.src('source/html/*.html')
        .pipe(replace('../css/styleBootstrap.css', 'styleBootstrap.css'))
        .pipe(replace('../img/logo.png', 'img/logo.png'))
        .pipe(replace('<script src="../../node_modules/jquery/dist/jquery.js"></script>', '<script src="../node_modules/jquery/dist/jquery.js"></script>'))
        .pipe(replace('<script src="../javascript/index.js"></script>', '<script src="bundle.js"></script>'))
        .pipe(replace(' <script src="../../node_modules/tether/dist/js/tether.js"></script>', ' <script src="../node_modules/tether/dist/js/tether.js"></script>'))
        .pipe(replace('../../node_modules/bootstrap/dist/css/bootstrap.css', '../node_modules/bootstrap/dist/css/bootstrap.css'))
        .pipe(replace('<script src="../../node_modules/moment/locale/it.js"></script>', '<script src="../node_modules/moment/locale/it.js"></script>'))
        .pipe(replace('<script src="../../node_modules/moment/min/moment.min.js"></script>', ' <script src="../node_modules/moment/min/moment.min.js"></script>'))
        .pipe(replace('<script src="../../node_modules/bootstrap/dist/js/bootstrap.js"></script>', ' <script src="../node_modules/bootstrap/dist/js/bootstrap.js"></script>'))
        .pipe(gulp.dest('dist'));
    gulp.src('source/css/*.css')
    .pipe(replace('../img/load.gif', 'img/load.gif'))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('dist'));
    gulp.src('source/javascript/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(uglify()).pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'));
    gulp.src('source/img/*').pipe(gulp.dest('dist/img'));
});

    gulp.task('sass', function(){
        return gulp.src('./bootstrap/scss/*scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('.css'));
    });

    gulp.task('sass:watch', function(){
        gulp.watch('./bootstrap/scss/*scss', ['sass']);

    });
    


