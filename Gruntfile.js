module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        jasmine: {
            src: 'src/controllers/LocusController.js',
            options: {
                specs: 'src/specs/**/*.js',
                template: require('grunt-template-jasmine-requirejs'),
                templateOptions: {
                    requireConfigFile: 'src/js/spec-main.js',
                    requireConfig: {
                        baseUrl: 'src/js/'
                    }
                }
            }
        },
        jshint: {
            all: [
                'Gruntfile.js',
                'collections/*.js',
                'controllers/*.js',
                'enums/*.js',
                'fakes/*.js',
                'models/*.js',
                'js/app/*.js',
                'routers/*.js',
                'views/*.js',
                'specs/*.js'
            ],
            options: {
                "-W030": false
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'expanded',
                    loadPath: ['bower_components/foundation/scss', 'bower_components/font-awesome/scss' ]
                },
                files: [{
                    expand: true,
                    cwd: 'src/scss',
                    src: ['*.scss'],
                    dest: 'src/css',
                    ext: '.css'
                }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('validate', ['jshint']);
    grunt.registerTask('precompile', ['sass']);
    grunt.registerTask('test', ['jasmine']);
    grunt.registerTask('default', ['test']);
};