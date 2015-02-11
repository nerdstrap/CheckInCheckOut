require.config({
    config: {
        'env': {
            apiUrl: '',
            siteRoot: '/src',
            distanceThreshold: 50,
            searchResultsThreshold: 20,
            expirationThreshold: 1800000
        },
        'hbs': {
            'extension': 'html'
        },
        'Locator': {
            'timeout': 30000, // 30 seconds
            'enableHighAccuracy': false,
            'maximumAge': 60000 // 1 minute
        }
    },
    paths: {
        /* Require */
        'require': 'libs/require',
        'text': 'libs/text',
        'hbs': 'libs/hbs',

        /* jQuery */
        'jquery': 'libs/jquery',

        /* Underscore */
        'underscore': 'libs/lodash',

        /* Backbone */
        'backbone': 'libs/backbone',

        /* Handlebars */
        'Handlebars': 'libs/handlebars',
        'handlebars.helpers': 'app/handlebars.helpers',

        /* Modernizr */
        'modernizr': 'libs/modernizr',

        /* FileSaver */
        'filesaver': 'libs/filesaver',

        /* Foundation */
        'foundation.core': 'libs/foundation',

        /* App */
        'console': 'app/console',
        'env': 'app/env',
        'EventBus': 'app/EventBus',
        'eventBusSingleton': 'app/eventBusSingleton',
        'globals': 'app/globals',
        'resources': 'app/resources',
        'utils': 'app/utils',

        /* Convenience */
        'collections': '../collections',
        'controllers': '../controllers',
        'enums': '../enums',
        'models': '../models',
        'routers': '../routers',
        'services': '../services',
        'templates': '../templates',
        'views': '../views'
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'foundation.core': {
            deps: [
                'jquery',
                'modernizr'
            ],
            exports: 'Foundation'
        },
        'Handlebars': {
            exports: 'Handlebars'
        }
    }
});

// Global error handler
requirejs.onError = function (err) {
    if (err) {
        console.log(err.message);
        if (err.originalError) {
            console.log(err.originalError.message);
        }
        if (err.requireType) {
            if (err.requireType === 'timeout') {
                console.log('modules: ' + err.requireModules);
            }
        }
    }

    throw err;
};

// Load our app module and pass it to our definition function
require(['console', 'app']);
