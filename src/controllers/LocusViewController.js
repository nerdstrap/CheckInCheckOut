'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var IdentityModel = require('models/IdentityModel');
var LocusModel = require('models/LocusModel');
var EntryLogModel = require('models/EntryLogModel');
var LocusSearchView = require('views/LocusSearchView');
var LocusDetailView = require('views/LocusDetailView');
var EventNameEnum = require('enums/EventNameEnum');
var utils = require('lib/utils');

/**
 * Creates a new LocusViewController with the specified attributes.
 * @constructor
 * @param {object} options
 */
var LocusViewController = function (options) {
    options || (options = {});
    this.initialize.apply(this, arguments);
};

_.extend(LocusViewController.prototype, Backbone.Events, {
    /** @class LocusViewController
     * @constructs LocusViewController object
     * @param {object} options
     */
    initialize: function (options) {
        console.trace('LocusViewController.initialize');
        options || (options = {});
        this.router = options.router;
        this.dispatcher = options.dispatcher;
        this.persistenceContext = options.persistenceContext;

        this.listenTo(this.dispatcher, EventNameEnum.goToLocusSearch, this.goToLocusSearch);
        this.listenTo(this.dispatcher, EventNameEnum.goToLocusWithId, this.goToLocusWithId);
        this.listenTo(this.dispatcher, EventNameEnum.goToDirectionsWithLatLng, this.goToDirectionsWithLatLng);
    },

    /**
     *
     * @returns {promise}
     */
    goToLocusSearch: function () {
        var currentContext = this;
        var deferred = $.Deferred();

        var myIdentityModel = new IdentityModel();
        var openEntryLogModel = new EntryLogModel();
        var locusSearchView = new LocusSearchView({
            dispatcher: currentContext.dispatcher,
            myIdentityModel: myIdentityModel,
            openEntryLogModel: openEntryLogModel
        });

        currentContext.router.swapContent(locusSearchView);
        currentContext.router.navigate('locus');

        currentContext.persistenceContext.getMyIdentityAndOpenEntryLogs(myIdentityModel, openEntryLogModel)
            .done(function () {
                currentContext.dispatcher.trigger(EventNameEnum.myIdentityReset, myIdentityModel);
                currentContext.dispatcher.trigger(EventNameEnum.openEntryLogReset, openEntryLogModel);
                locusSearchView.trigger('loaded');
                deferred.resolve(locusSearchView);
            })
            .fail(function (error) {
                locusSearchView.trigger('error');
                deferred.reject(error);
            });

        return deferred.promise();
    },

    goToLocusWithId: function (locusId) {
        var currentContext = this,
            deferred = $.Deferred();

        var myIdentityModel = new IdentityModel();
        var openEntryLogModel = new EntryLogModel();
        var locusModel = new LocusModel({locusId: locusId});
        var locusDetailView = new LocusDetailView({
            controller: currentContext,
            dispatcher: currentContext.dispatcher,
            model: locusModel,
            myIdentityModel: myIdentityModel,
            openEntryLogModel: openEntryLogModel
        });
        currentContext.router.swapContent(locusDetailView);

        var routerFragment = 'locus/' + locusId;
        currentContext.router.navigate('locus/' + locusId);

        $.when(currentContext.persistenceContext.getMyIdentityAndOpenEntryLogs(myIdentityModel, openEntryLogModel), currentContext.persistenceContext.getLocusById(locusModel))
            .done(function () {
                currentContext.dispatcher.trigger(EventNameEnum.myIdentityReset, myIdentityModel);
                currentContext.dispatcher.trigger(EventNameEnum.openEntryLogReset, openEntryLogModel);
                locusDetailView.trigger('loaded');
                deferred.resolve(locusDetailView);
            })
            .fail(function (error) {
                locusDetailView.trigger('error');
                deferred.reject(error);
            });

        return deferred.promise();
    },

    /**
     *
     * @param latitude
     * @param longitude
     */
    goToDirectionsWithLatLng: function (latitude, longitude) {
        //var directionsUri = 'http://maps.google.com?daddr=' + latitude + ',' + longitude;
        //window.open(directionsUri);
    }
});

module.exports = LocusViewController;