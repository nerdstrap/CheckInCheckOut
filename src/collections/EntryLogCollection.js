define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        EntryLogModel = require('models/EntryLogModel');

    var EntryLogCollection = Backbone.Collection.extend({
        model: EntryLogModel,
        initialize: function (options) {
            options || (options = {});
        }
    });

    return EntryLogCollection;
});
