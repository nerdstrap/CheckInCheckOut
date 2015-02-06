define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        StationEntryLogModel = require('models/StationEntryLogModel');

    var StationEntryLogCollection = Backbone.Collection.extend({
        model: StationEntryLogModel,
        initialize: function (options) {
            options || (options = {});
        }
    });

    return StationEntryLogCollection;
});
