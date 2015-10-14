'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var LocusModel = require('models/LocusModel');
var IdentityModel = require('models/IdentityModel');
var EntryLogModel = require('models/EntryLogModel');
var EntryLogCollection = require('collections/EntryLogCollection');
var CheckInView = require('views/CheckInView');
var EditCheckInView = require('views/EditCheckInView');
var CheckOutView = require('views/CheckOutView');
var EventNameEnum = require('enums/EventNameEnum');
var CheckInTypeEnum = require('enums/CheckInTypeEnum');
var utils = require('lib/utils');

/**
 *
 * @param options
 * @constructor
 */
var EntryLogViewController = function (options) {
    options || (options = {});
    this.initialize.apply(this, arguments);
};

_.extend(EntryLogViewController.prototype, Backbone.Events, {
    /**
     *
     * @param options
     */
    initialize: function (options) {
        console.trace('EntryLogViewController.initialize');
        options || (options = {});
        this.router = options.router;
        this.dispatcher = options.dispatcher;
        this.persistenceContext = options.persistenceContext;
        this.geoLocationService = options.geoLocationService;

        this.listenTo(this.dispatcher, EventNameEnum.goToAdHocCheckIn, this.goToAdHocCheckIn);
        this.listenTo(this.dispatcher, EventNameEnum.goToCheckIn, this.goToCheckIn);
        this.listenTo(this.dispatcher, EventNameEnum.checkIn, this.checkIn);
        this.listenTo(this.dispatcher, EventNameEnum.goToCheckOut, this.goToCheckOut);
        this.listenTo(this.dispatcher, EventNameEnum.checkOut, this.checkOut);
    },

    /**
     *
     * @param locusId
     * @returns {promise}
     */
    goToAdHocCheckIn: function () {
        var currentContext = this;
        var deferred = $.Deferred();

        var myIdentityModel = new IdentityModel();
        var openEntryLogModel = new EntryLogModel();
        var entryLogModel = new EntryLogModel({checkInType: CheckInTypeEnum.locus});
        var purposeCollection = new Backbone.Collection();
        var durationCollection = new Backbone.Collection();
        var areaCollection = new Backbone.Collection();
        var checkInView = new CheckInView({
            dispatcher: currentContext.dispatcher,
            myIdentityModel: myIdentityModel,
            openEntryLogModel: openEntryLogModel,
            model: entryLogModel,
            purposeCollection: purposeCollection,
            durationCollection: durationCollection,
            areaCollection: areaCollection
        });

        currentContext.router.swapContent(checkInView);
        currentContext.router.navigate('adhoc/checkIn');

        currentContext.geoLocationService.getCurrentPosition()
            .done(function (position) {
                checkInView.updateGpsInput();
            })
            .error(function (getCurrentPositionError) {
                checkInView.updateGpsInput();
            });

        $.when(currentContext.persistenceContext.getMyIdentityAndOpenEntryLogs(myIdentityModel, openEntryLogModel), currentContext.persistenceContext.getOptions(purposeCollection, durationCollection, areaCollection))
            .done(function () {
                currentContext.dispatcher.trigger(EventNameEnum.myIdentityReset, myIdentityModel);
                checkInView.trigger('loaded');
                deferred.resolve(checkInView);
            })
            .fail(function (error) {
                checkInView.trigger('error');
                deferred.reject(error);
            });

        return deferred.promise();
    },

    /**
     *
     * @param locusId
     * @returns {promise}
     */
    goToCheckIn: function (locusId) {
        var currentContext = this;
        var deferred = $.Deferred();

        var myIdentityModel = new IdentityModel();
        var openEntryLogModel = new EntryLogModel();
        var entryLogModel = new EntryLogModel({checkInType: CheckInTypeEnum.locus});
        var locusModel = new LocusModel({locusId: locusId});
        var purposeCollection = new Backbone.Collection();
        var durationCollection = new Backbone.Collection();
        var checkInView = new CheckInView({
            dispatcher: currentContext.dispatcher,
            myIdentityModel: myIdentityModel,
            openEntryLogModel: openEntryLogModel,
            model: entryLogModel,
            locusModel: locusModel,
            purposeCollection: purposeCollection,
            durationCollection: durationCollection
        });

        currentContext.router.swapContent(checkInView);
        currentContext.router.navigate('locus/' + locusModel.get('locusId') + '/checkIn');

        $.when(currentContext.persistenceContext.getMyIdentityAndOpenEntryLogs(myIdentityModel, openEntryLogModel), currentContext.persistenceContext.getLocusById(locusModel), currentContext.persistenceContext.getOptions(purposeCollection, durationCollection))
            .done(function () {
                currentContext.dispatcher.trigger(EventNameEnum.myIdentityReset, myIdentityModel);
                checkInView.trigger('loaded');
                deferred.resolve(checkInView);
            })
            .fail(function (error) {
                checkInView.trigger('error');
                deferred.reject(error);
            });

        return deferred.promise();
    },

    /**
     *
     * @param entryLogModel
     * @returns {promise}
     */
    checkIn: function (entryLogModel) {
        var currentContext = this;
        var deferred = $.Deferred();

        currentContext.persistenceContext.checkIn(entryLogModel)
            .done(function () {
                currentContext.dispatcher.trigger(EventNameEnum.checkInSuccess, entryLogModel);
                deferred.resolve(entryLogModel);
            })
            .fail(function (error) {
                currentContext.dispatcher.trigger(EventNameEnum.checkInError, error);
                deferred.reject(error);
            });

        return deferred.promise();
    },

    /**
     *
     * @param entryLogId
     * @returns {promise}
     */
    goToEditCheckIn: function (entryLogModel) {
        var currentContext = this;
        var deferred = $.Deferred();

        var myIdentityModel = new IdentityModel();
        var openEntryLogModel = new EntryLogModel();
        var locusModel = new LocusModel({locusId: entryLogModel.get('locusId')});
        var purposeCollection = new Backbone.Collection();
        var durationCollection = new Backbone.Collection();
        var editCheckInView = new EditCheckInView({
            dispatcher: currentContext.dispatcher,
            myIdentityModel: myIdentityModel,
            openEntryLogModel: openEntryLogModel,
            locusModel: locusModel,
            purposeCollection: purposeCollection,
            durationCollection: durationCollection
        });

        currentContext.router.swapContent(editCheckInView);
        currentContext.router.navigate('entryLog/' + entryLogModel.get('entryLogId'));

        $.when(currentContext.persistenceContext.getMyIdentityAndOpenEntryLogs(myIdentityModel, openEntryLogModel), currentContext.persistenceContext.getLocusById(locusModel), currentContext.persistenceContext.getOptions(purposeCollection, durationCollection))
            .done(function () {
                currentContext.dispatcher.trigger(EventNameEnum.myIdentityReset, myIdentityModel);
                editCheckInView.trigger('loaded');
                deferred.resolve(editCheckInView);
            })
            .fail(function (error) {
                editCheckInView.trigger('error');
                deferred.reject(error);
            });

        return deferred.promise();
    },

    /**
     *
     * @param entryLogModel
     * @returns {promise}
     */
    editCheckIn: function (entryLogModel) {
        var currentContext = this;
        var deferred = $.Deferred();

        currentContext.persistenceContext.editCheckIn(entryLogModel)
            .done(function () {
                currentContext.dispatcher.trigger(EventNameEnum.editCheckInSuccess, entryLogModel);
                deferred.resolve(entryLogModel);
            })
            .fail(function (error) {
                currentContext.dispatcher.trigger(EventNameEnum.editCheckInError, error);
                deferred.reject(error);
            });

        return deferred.promise();
    },

    /**
     *
     * @param entryLogId
     * @returns {promise}
     */
    goToCheckOut: function (entryLogModel) {
        var currentContext = this;
        var deferred = $.Deferred();

        var myIdentityModel = new IdentityModel();
        var openEntryLogModel = new EntryLogModel();
        var locusModel = new LocusModel({locusId: entryLogModel.get('locusId')});
        var purposeCollection = new Backbone.Collection();
        var durationCollection = new Backbone.Collection();
        var checkOutView = new CheckOutView({
            dispatcher: currentContext.dispatcher,
            myIdentityModel: myIdentityModel,
            openEntryLogModel: openEntryLogModel,
            locusModel: locusModel,
            purposeCollection: purposeCollection,
            durationCollection: durationCollection
        });

        currentContext.router.swapContent(checkOutView);
        currentContext.router.navigate('entryLog/' + entryLogModel.get('entryLogId') + '/checkOut');

        $.when(currentContext.persistenceContext.getMyIdentityAndOpenEntryLogs(myIdentityModel, openEntryLogModel), currentContext.persistenceContext.getLocusById(locusModel), currentContext.persistenceContext.getOptions(purposeCollection, durationCollection))
            .done(function () {
                currentContext.dispatcher.trigger(EventNameEnum.myIdentityReset, myIdentityModel);
                checkOutView.trigger('loaded');
                deferred.resolve(checkOutView);
            })
            .fail(function (error) {
                checkOutView.trigger('error');
                deferred.reject(error);
            });

        return deferred.promise();
    },

    /**
     *
     * @param entryLogModel
     * @returns {promise}
     */
    checkOut: function (entryLogModel) {
        var currentContext = this;
        var deferred = $.Deferred();

        currentContext.persistenceContext.checkOut(entryLogModel)
            .done(function () {
                currentContext.dispatcher.trigger(EventNameEnum.checkOutSuccess, entryLogModel);
                deferred.resolve(entryLogModel);
            })
            .fail(function (error) {
                currentContext.dispatcher.trigger(EventNameEnum.checkOutError, error);
                deferred.reject(error);
            });

        return deferred.promise();
    }
});

module.exports = EntryLogViewController;