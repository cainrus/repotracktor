(function() {
    'use strict';

    var gulp = require("gulp");
    var requirejsOptimize = require('gulp-requirejs-optimize');


    gulp.task('symlink-vendors', function () {
      var symlink = require('gulp-symlink');

        return gulp.src(['bower_components'])
            .pipe(symlink(['./public/vendors'], {force: true}));
    });

    gulp.task('setup', ['symlink-vendors']);

}());
