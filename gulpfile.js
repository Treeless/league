(function() {
    // Gulpfile tasks, webserver, sass compiling etc
    var gulp = require('gulp'),
        sass = require('gulp-sass'),
        cssnano = require('gulp-cssnano'),
        concat = require('gulp-concat'),
        autoprefix = require('gulp-autoprefixer'),
        webserver = require('gulp-webserver'),
        del = require('del'),
        nodemon = require('gulp-nodemon');

    const BASE_DIRECTORY = "public/";

    //Compiles scss files to css
    gulp.task('style', function() {
        del.sync('./css/main.css');

        gulp.src('**/*.scss', {
                cwd: './src'
            })
            .pipe(concat('main.scss'))
            .pipe(sass().on('error', function(err) {
                console.log("SASS ERROR: " + err.message);
            }))
            .pipe(cssnano())
            .pipe(autoprefix())
            .pipe(gulp.dest(BASE_DIRECTORY + 'css'));
    });

    //Watch my scss files for changes
    gulp.task('watch-sass', function() {
        gulp.watch('**/*.scss', {
            cwd: "./src/"
        }, ['style']);
    });

    //Local webserver
    gulp.task('webserver', ['server'], function() {
        gulp.src('./')
            .pipe(webserver({
                livereload: {
                    enable: true
                },
                fallback: BASE_DIRECTORY + 'index.html',
                open: true,
                port: 80
            }));
    });

    //Run the node server on the backend (DEV only)
    gulp.task("server", function() {
        nodemon({
            script: 'index.js',
            ext: 'js',
            env: { 'NODE_ENV': 'development' },
            ignore: ["tests/*", "public/*"]
        });
    })

    //Default task
    gulp.task('default', ['style', 'watch-sass', 'webserver', 'server']);

}());