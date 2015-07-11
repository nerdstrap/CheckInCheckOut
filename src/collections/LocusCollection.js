'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var LocusModel = require('models/LocusModel');

/**
 *
 * @type {LocusCollection}
 */
var LocusCollection = Backbone.Collection.extend({
    model: LocusModel
});

module.exports = LocusCollection;