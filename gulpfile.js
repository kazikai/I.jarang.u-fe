var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    connect = require('gulp-connect'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    extname = require('gulp-extname'),
    livereload = require('gulp-livereload'),
    del = require('del');

var usemin = require('gulp-usemin');
var cleanCss = require('gulp-clean-css');
var rev = require('gulp-rev');

var assemble = require('assemble');
var app = assemble();

var proxy = require('http-proxy-middleware');

var replace = require('gulp-replace');
var flatmap = require('gulp-flatmap');

var date = new Date();
var hour = date.getHours();
hour = (hour < 10 ? "0" : "") + hour;
var min  = date.getMinutes();
min = (min < 10 ? "0" : "") + min;
var sec  = date.getSeconds();
sec = (sec < 10 ? "0" : "") + sec;
var year = date.getFullYear();
var month = date.getMonth() + 1;
month = (month < 10 ? "0" : "") + month;
var day  = date.getDate();
day = (day < 10 ? "0" : "") + day;
var curtime = year + month + day + "_" + hour + min + sec;


gulp.task('load', function(cb) {
    app.partials('partials/*.hbs');
    app.layouts('layouts/*.hbs');
    app.pages('docs/*.hbs');
    cb();
});
gulp.task('devload', function(cb) {
    app.partials('partials/*.hbs');
    app.layouts('layouts/*.hbs');
    app.pages('docs/*.hbs');
    app.data('dev.json');
    cb();
});


gulp.task('clean', function() {
    return del(['dist/resources/css', 'dist/resources/js', 'dist/resources/img', 'dist/*.html']);
});
gulp.task( 'assemble', ['load'], function() {
    return app.toStream('pages')
        .pipe(app.renderFile())
        .pipe(extname())
        .pipe(app.dest('.tmp/'));
});

gulp.task( 'assembledev', ['devload'], function() {
    return app.toStream('pages')
        .pipe(app.renderFile())
        .pipe(extname())
        .pipe(app.dest('.tmp/'));
});


gulp.task('htmlcopy', function() {
    return gulp.src('.tmp/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(notify({ message: 'HTML Copy task complete' }));
});
gulp.task('copy', function() {
    return gulp.src('resources/*/*')
        .pipe(gulp.dest('.tmp/resources/'))
        .pipe(notify({ message: 'Coyp task complete' }));
});
gulp.task( 'js', function() {
    return gulp.src( 'resources/js/*.js')
        .pipe(rename({suffix: "." + curtime + '.min'}))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(gulp.dest('dist/resources/js'))
        .pipe(notify({ message: 'JS Scripts task complete' }));
});

gulp.task('css', function() {
    return gulp.src( 'resources/css/*.css' )
       .pipe(gulp.dest( 'dist/resources/css') )
        .pipe(rename({ suffix: "." + curtime + '.min' }))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/resources/css'))
        .pipe(notify({ message: 'CSS task complete' }));
});
// Images
gulp.task('img', function() {
    return gulp.src('resources/img/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/resources/img'))
        .pipe(notify({ message: 'Images task complete' }));
});
gulp.task('connect', function() {
    connect.server({
        name: 'I.jaran.U',
        port: 8888,
        root: '',
        livereload: true,
        https: false,
        middleware: function(connect, opt) {
            return [
                proxy(['/api'], {
                    target: 'http://139.162.71.151',
                    changeOrigin:true
                })
            ];
        }
    });
});



gulp.task('usemin', function() {
    return gulp.src('.tmp/*.html')
        .pipe(replace(/timestamp\.min\./g, curtime + ".min." ))
        .pipe(flatmap(function (stream) {
            return stream.pipe(usemin({
                css: [ cleanCss ],
                js: [ uglify( { mangle: false } ) ]
            }));
        }))
        .pipe(gulp.dest('./dist/'))
        .pipe(notify({ message: 'USEMIN Complete' }));
});


gulp.task('default', ['clean','assembledev'], function() {
    gulp.start( 'htmlcopy', 'img' );
});

gulp.task('dev', function(){
    gulp.start('default', 'connect', 'watch');
});

gulp.task('deploy', ['clean','assemble'], function() {
    gulp.start('usemin', 'img', 'js', 'css');
});

gulp.task('watch', function() {
    gulp.watch('gulpfile.js', ['default', 'connect']);
    gulp.watch('partials/*.hbs', ['default']);
    gulp.watch('layouts/*.hbs', ['default']);
    gulp.watch('docs/*.hbs', ['default']);
    // Watch .css files
    gulp.watch('resource/css/*.css', ['css']);
    // Watch .js files
    gulp.watch('resource/js/*.js', ['js']);
    // Watch image files
    gulp.watch('resource/img/*', ['img']);
    livereload.listen( 32423 );
    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);
});
