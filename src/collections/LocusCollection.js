'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var LocusModel = require('models/LocusModel');

var LocusCollection = Backbone.Collection.extend({
    model: LocusModel,
    initialize: function (options) {
        options || (options = {});
    }
});

module.exports = LocusCollection;