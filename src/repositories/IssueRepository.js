'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

var _issues = require('repositories/issues.json');

var _getById = function (issueId) {
    return _.where(_issues, {issueId: issueId});
};

var _getByLocusId = function (locusId) {
    return _.where(_issues, {locusId: locusId});
};

var IssueRepository = function (options) {
    console.trace('new IssueRepository()');
    options || (options = {});
    this.initialize.apply(this, arguments);
};

_.extend(IssueRepository.prototype, {
    initialize: function (options) {
        console.trace('IssueRepository.initialize');
        options || (options = {});
    },
    getIssues: function (options) {
        options || (options = {});
        var currentContext = this;
        var deferred = $.Deferred();

        var issues;
        if (options.issueId) {
            issues = _getById(options.issueId);
        } else if (options.locusId) {
            issues = _getByLocusId(options.locusId);
        } else {
            issues = [];
        }

        var results = {
            issues: issues
        };

        window.setTimeout(function () {
            deferred.resolveWith(currentContext, [results]);
        }, 20);

        return deferred.promise();
    }
});

module.exports = IssueRepository;