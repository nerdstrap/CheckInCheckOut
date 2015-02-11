define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        globals = require('globals'),
        env = require('env'),
        utils = require('utils');

    var _listings = [
        {
            "listingId": "380",
            "locusId": "840",
            "personnelId": "S251201",
            "personnelName": "baltic, michael",
            "purpose": "milkawhat",
            "additionalInfo": "ermahgerd",
            "inTime": "1416959468287",
            "contactNumber": "6145551212",
            "email": "mebaltic@aep.com",
            "duration": "60",
            "locusName": "Locus One",
            "latitude": "40.45",
            "longitude": "-75.50",
            "hasCrew": "true"
        },
        {
            "listingId": "381",
            "locusId": "840",
            "personnelId": "S251202",
            "personnelName": "walden, heather",
            "purpose": "what a milk",
            "additionalInfo": "ermahgerd",
            "inTime": "1416959468487",
            "contactNumber": "6145551212",
            "email": "hmwalden@aep.com",
            "duration": "60",
            "locusName": "Locus One",
            "latitude": "40.45",
            "longitude": "-75.50",
            "hasCrew": "true"
        },
        {
            "listingId": "382",
            "locusId": "840",
            "personnelId": "S251203",
            "personnelName": "shu, shujing",
            "purpose": "burgers",
            "additionalInfo": "ermahgerd",
            "inTime": "1416959498287",
            "contactNumber": "6145551212",
            "email": "sshu@aep.com",
            "duration": "60",
            "locusName": "Locus One",
            "latitude": "40.45",
            "longitude": "-75.50",
            "hasCrew": "true"
        },
        {
            "listingId": "383",
            "locusId": "840",
            "personnelId": "S251204",
            "personnelName": "veit, alex",
            "purpose": "cake",
            "additionalInfo": "ermahgerd",
            "inTime": "1419959468287",
            "contactNumber": "6145551212",
            "email": "aaveit@aep.com",
            "duration": "60",
            "locusName": "Locus One",
            "latitude": "40.45",
            "longitude": "-75.50",
            "hasCrew": "true"
        }
    ];

    var _userId = 'S251201';
    var _userRole = 'Admin';

    var _getById = function (listingId) {
        return _.where(_listings, function (listing) {
            return listing.listingId === listingId;
        });
    };

    var _getByLocusId = function (locusId) {
        return _.where(_listings, function (listing) {
            return listing.locusId === locusId;
        });
    };

    var _getByPersonnelId = function (personnelId) {
        return _.where(_listings, function (listing) {
            return listing.personnelId === personnelId;
        });
    };

    var _getByStatus = function (listings, status) {
        return _.where(listings, function (listing) {
            return listing.hasOwnProperty('outTime') === status;
        });
    };

    var _postCheckIn = function (listing) {
        listing.id = utils.getNewGuid();
        listing.inTime = new Date().getTime();
        _listings.push(listing);
        return listing;
    };

    var _postEditCheckIn = function (listingId, duration, additionalInfo) {
        var match = _.find(_listings, function (listing) {
            return listing.listingId === listingId;
        })

        if (match) {
            match.duration = duration;
            match.additionalInfo = additionalInfo;
        }

        return match;
    };

    var _postCheckOut = function (listingId) {
        var match = _.find(_listings, function (listing) {
            return listing.listingId === listingId;
        })

        if (match) {
            match.outTime = new Date().getTime();
        }

        return match;
    };

    var _getByCoords = function (coords, distanceThreshold, searchResultsThreshold) {
        utils.computeDistances(coords, _listings);
        var nearbyListings = _.filter(_listings, function (listing) {
            return listing.distance <= distanceThreshold
        });
        if (nearbyListings.length > searchResultsThreshold) {
            nearbyListings = nearbyListings.slice(0, searchResultsThreshold);
        }
        var sortedNearbyListings = _.sortBy(nearbyListings, function (nearbyListing) {
            return parseFloat(nearbyListing.distance);
        });

        return sortedNearbyListings;
    };

    var ListingService = function (options) {
        console.trace('new ListingService()');
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(ListingService.prototype, {
        initialize: function (options) {
            console.trace('ListingService.initialize');
            options || (options = {});
        },
        getListingOptions: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var userId = _userId;
            var userRole = _userRole;

            var results = {
                userId: userId,
                userRole: userRole
            };

            globals.window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 50);

            return deferred.promise();
        },
        getListings: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var listings;
            if (options.listingId) {
                listings = _getById(options.listingId);
            } else if (options.locusId) {
                listings = _getByLocusId(options.locusId);
            } else if (options.personnelId) {
                listings = _getByPersonnelId(options.personnelId);
            } else if (options.coords) {
                listings = _getByCoords(options.coords, env.getDistanceThreshold(), env.getSearchResultsThreshold());
            } else {
                listings = _listings;
            }

            var userId = _userId;
            var userRole = _userRole;

            var results = _.extend(options, {
                listings: listings,
                userId: userId,
                userRole: userRole
            });

            globals.window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 50);

            return deferred.promise();
        },
        postCheckIn: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var listing = _postCheckIn(options);
            var userId = _userId;
            var userRole = _userRole;

            var results = {
                listing: listing,
                userId: userId,
                userRole: userRole
            };

            globals.window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 50);

            return deferred.promise();
        }
    });

    return ListingService;
});