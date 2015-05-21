/// <binding Clean='clean' />

var gulp = require('gulp');
var bower = require('gulp-bower');
var del = require('del');
var fs = require('fs');
var browserify = require('browserify');
var pathmodify = require('pathmodify');
var source = require('vinyl-source-stream');

var mods = [
        pathmodify.mod.dir('collections', '../collections'),
        pathmodify.mod.dir('controllers', '../controllers'),
        pathmodify.mod.dir('enums', '../enums'),
        pathmodify.mod.dir('models', '../models'),
        pathmodify.mod.dir('routers', '../routers'),
        pathmodify.mod.dir('services', '../services'),
        pathmodify.mod.dir('templates', '../templates'),
        pathmodify.mod.dir('views', '../views')
    ];

gulp.task('browserify', function () {

    return browserify({
        entries: ['./wwwroot/js/app.js'],
        debug: true
    })

        .plugin(pathmodify(), {mods: mods})

        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest(paths.dest));
});

eval('var project = ' + fs.readFileSync('./project.json'));

var paths = {
    bower: './bower_components/',
    lib: './' + project.webroot + '/lib/',
    src: './src/',
    dest: './' + project.webroot + '/'
};

gulp.task('default', ['bower:install'], function () {
    return;
});

gulp.task('bower:install', function () {
    return bower({
        directory: paths.bower
    });
});

gulp.task('app:deploy', ['bower:deploy'], function () {
    gulp.src(paths.src + '/**/*.*')
        .pipe(gulp.dest(paths.dest));
});

gulp.task('bower:deploy', ['bower:clean'], function () {
    var components = {
        'jquery': 'jquery/jquery*.{js,map}',
        'materialize': 'materialize/**/*.{js,map,css,ttf,svg,woff,eot}',
        'fontawesome': 'fontawesome/**/*.{js,map,css,ttf,svg,woff,eot}',
        'handlebars': 'handlebars/**/handlebars*.{js,map}',
        'backbone': 'backbone/**/backbone*.{js,map}',
        'underscore': 'underscore/**/underscore*.{js,map}',
        'lodash': 'lodash/**/lodash*.{js,map}'
    }

    for (var componentDir in components) {
        gulp.src(paths.bower + components[componentDir])
            .pipe(gulp.dest(paths.lib + componentDir));
    }
});

gulp.task('bower:clean', function (done) {
    del(paths.lib, done);
});