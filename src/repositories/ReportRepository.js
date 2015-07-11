'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

var _reports = require('repositories/reports.json');

var _getById = function (reportId) {
    return _.where(_reports, {reportId: reportId});
};

var _getByLocusId = function (locusId) {
    return _.where(_reports, {locusId: locusId});
};

var ReportRepository = function (options) {
    console.trace('new ReportRepository()');
    options || (options = {});
    this.initialize.apply(this, arguments);
};

_.extend(ReportRepository.prototype, {
    initialize: function (options) {
        console.trace('ReportRepository.initialize');
        options || (options = {});
    },
    getReports: function (options) {
        options || (options = {});
        var currentContext = this;
        var deferred = $.Deferred();

        var reports;
        if (options.reportId) {
            reports = _getById(options.reportId);
        } else if (options.locusId) {
            reports = _getByLocusId(options.locusId);
        } else {
            reports = [];
        }

        var results = {
            reports: reports
        };

        window.setTimeout(function () {
            deferred.resolveWith(currentContext, [results]);
        }, 20);

        return deferred.promise();
    }
});

module.exports = ReportRepository;