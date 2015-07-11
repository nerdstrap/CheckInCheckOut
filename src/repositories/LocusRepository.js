'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var utils = require('lib/utils');
var config = require('lib/config');

var _loci = require('repositories/loci.json');

var _getById = function (locusId) {
    return _.where(_loci, {locusId: locusId});
};

var _getBySearchQuery = function (searchQuery) {
    return _.where(_loci, {locusName: searchQuery});
};

var _getByCoords = function (coords, distanceThreshold, searchResultsThreshold) {
    utils.computeDistances(coords, _loci);
    var nearbyLocusList = _.filter(_loci, function (locus) {
        return locus.distance <= distanceThreshold
    });
    if (nearbyLocusList.length > searchResultsThreshold) {
        nearbyLocusList = nearbyLocusList.slice(0, searchResultsThreshold);
    }
    return _.sortBy(nearbyLocusList, function (nearbyLocus) {
        return parseFloat(nearbyLocus.distance);
    });
};

var LocusRepository = function (options) {
    options || (options = {});
    this.initialize.apply(this, arguments);
};

_.extend(LocusRepository.prototype, {
    initialize: function (options) {
        console.trace('LocusRepository.initialize');
        options || (options = {});
    },
    getLoci: function (options) {
        options || (options = {});
        var currentContext = this;
        var deferred = $.Deferred();

        var loci;
        if (options.locusId) {
            loci = _getById(options.locusId);
        } else if (options.alphabetic) {
            loci = _getBySearchQuery(options.searchQuery);
        } else if (options.coords) {
            loci = _getByCoords(options.coords, config.app.distanceThreshold, config.app.searchResultsThreshold);
        } else if (options.admin) {
            loci = _loci;
        } else {
            loci = [];
        }

        var results = {
            loci: loci
        };

        window.setTimeout(function () {
            deferred.resolveWith(currentContext, [results]);
        }, 20);

        return deferred.promise();
    }
    //,
    //getLocusList: function(options) {
    //    options || (options = {});
    //    var currentContext = this;
    //    var data = $.param({'searchQuery': options.searchQuery});
    //
    //    return $.ajax({
    //        contentType: 'application/json',
    //        data: data,
    //        dataType: 'json',
    //        headers: {
    //            'X-ZUMO-APPLICATION': 'QyiVffdgpmSoNCrltoZqcHqJyOxrzY55'
    //        },
    //        type: 'GET',
    //        url: env.getApiUrl() + '/locus/find'
    //    });
    //},
    //postLocus: function (options) {
    //    options || (options = {});
    //    var data = JSON.stringify(options);
    //
    //    return $.ajax({
    //        contentType: 'application/json',
    //        data: data,
    //        dataType: 'json',
    //        headers: {
    //            'X-ZUMO-APPLICATION': 'QyiVffdgpmSoNCrltoZqcHqJyOxrzY55'
    //        },
    //        type: 'POST',
    //        url: config.app.apiUrl + '/locus/add'
    //    });
    //}
});

module.exports = LocusRepository;