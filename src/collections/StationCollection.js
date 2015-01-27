define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        StationModel = require('models/StationModel');

    var StationCollection = Backbone.Collection.extend({
        model: StationModel,
        initialize: function (options) {
            options || (options = {});
        }
    });
    return StationCollection;
});
