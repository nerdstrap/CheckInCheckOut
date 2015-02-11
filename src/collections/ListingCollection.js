define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        ListingModel = require('models/ListingModel');

    var ListingCollection = Backbone.Collection.extend({
        model: ListingModel,
        initialize: function (options) {
            options || (options = {});
        }
    });

    return ListingCollection;
});
