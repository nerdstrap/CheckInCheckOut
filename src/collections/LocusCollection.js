define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        LocusModel = require('models/LocusModel');

    var LocusCollection = Backbone.Collection.extend({
        model: LocusModel,
        initialize: function (options) {
            options || (options = {});
        }
    });

    return LocusCollection;
});
