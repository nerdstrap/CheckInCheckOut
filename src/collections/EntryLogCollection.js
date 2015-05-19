'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var EntryLogModel = require('models/EntryLogModel');

var EntryLogCollection = Backbone.Collection.extend({
    model: EntryLogModel,
    initialize: function (options) {
        options || (options = {});
    }
});

module.exports = EntryLogCollection;