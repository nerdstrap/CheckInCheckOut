'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

var _purposes = require('repositories/purposes.json');
var _durations = require('repositories/durations.json');
var _areas = require('repositories/areas.json');

var LookupDataRepository = function (options) {
    console.trace('new LookupDataRepository()');
    options || (options = {});
    this.initialize.apply(this, arguments);
};

_.extend(LookupDataRepository.prototype, {
    initialize: function (options) {
        console.trace('LookupDataRepository.initialize');
        options || (options = {});
    },
    getPurposes: function (options) {
        options || (options = {});
        var currentContext = this;
        var deferred = $.Deferred();

        var results = {
            purposes: _purposes
        };

        window.setTimeout(function () {
            deferred.resolveWith(currentContext, [results]);
        }, 20);

        return deferred.promise();
    },
    getDurations: function (options) {
        options || (options = {});
        var currentContext = this;
        var deferred = $.Deferred();

        var results = {
            durations: _durations
        };

        window.setTimeout(function () {
            deferred.resolveWith(currentContext, [results]);
        }, 20);

        return deferred.promise();
    },
    getAreas: function (options) {
        options || (options = {});
        var currentContext = this;
        var deferred = $.Deferred();

        var results = {
            areas: _areas
        };

        window.setTimeout(function () {
            deferred.resolveWith(currentContext, [results]);
        }, 20);

        return deferred.promise();
    }
});

module.exports = LookupDataRepository;