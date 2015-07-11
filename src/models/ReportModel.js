'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

/**
 *
 * @type {ReportModel}
 */
var ReportModel = Backbone.Model.extend({

    /**
     *
     */
    idAttribute: 'reportId'

});

module.exports = ReportModel;