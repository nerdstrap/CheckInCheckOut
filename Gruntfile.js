'use strict';

var browserify = require('browserify');
var path = require('path');
var pathmodify = require('pathmodify');

var opts = {
    mods: [
        pathmodify.mod.dir('collections', '/src/collections'),
        pathmodify.mod.dir('controllers', '/src/controllers'),
        pathmodify.mod.dir('enums', '/src/enums'),
        pathmodify.mod.dir('models', '/src/models'),
        pathmodify.mod.dir('routers', '/src/routers'),
        pathmodify.mod.dir('services', '/src/services'),
        pathmodify.mod.dir('templates', '/src/templates'),
        pathmodify.mod.dir('views', '/src/views')
    ]
};

browserify('./src/entry').plugin(pathmodify(), opts);

module.exports = function (grunt) {
    grunt.initConfig({
        bower: {
            install: {
                options: {
                    targetDir: 'build/lib',
                    layout: 'byComponent',
                    cleanTargetDir: false
                }
            }
        },

        clean: {
            build: {
                src: ['./bower_components']
            }
        }
    });

    grunt.registerTask('initialize', ['bower:install']);
    grunt.registerTask('clean:bower', ['clean']);
    grunt.registerTask('default', ['initialize']);
    grunt.registerTask('browserify', function(){

    });

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
}