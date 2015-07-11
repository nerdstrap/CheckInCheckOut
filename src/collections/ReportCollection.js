'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var ReportModel = require('models/ReportModel');

/**
 *
 * @type {ReportCollection}
 */
var ReportCollection = Backbone.Collection.extend({
    model: ReportModel
});

module.exports = ReportCollection;