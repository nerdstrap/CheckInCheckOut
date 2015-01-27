define(function(require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone');

    // these modules setup functions & configuration that are used elsewhere
    require('foundation.core');
    require('utils');
    require('routers/appRouterSingleton');
    require('handlebars.helpers');

    Backbone.history.start();

    var doc = $(document);
    if (doc.foundation) {
        doc.foundation();
    }
});
