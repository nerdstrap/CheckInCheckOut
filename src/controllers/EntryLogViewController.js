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
var CheckOutView = require('views/CheckOutView');
var EventNameEnum = require('enums/EventNameEnum');
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

        this.listenTo(this.dispatcher, EventNameEnum.goToCheckIn, this.goToCheckIn);
        this.listenTo(this.dispatcher, EventNameEnum.goToCheckOut, this.goToCheckOut);
    },

    /**
     *
     * @returns {*}
     */
    goToCheckIn: function (locusId) {
        var currentContext = this;
        var deferred = $.Deferred();

        var myIdentityModel = new IdentityModel();
        var openEntryLogModel = new EntryLogModel();
        var locusModel = new LocusModel({locusId: locusId});
        var purposeCollection = new Backbone.Collection();
        var durationCollection = new Backbone.Collection();
        var checkInView = new CheckInView({
            dispatcher: currentContext.dispatcher,
            myIdentityModel: myIdentityModel,
            openEntryLogModel: openEntryLogModel,
            locusModel: locusModel,
            purposeCollection: purposeCollection,
            durationCollection: durationCollection
        });

        currentContext.router.swapContent(checkInView);
        currentContext.router.navigate('locus/' + locusModel.get('locusId') + '/checkIn');

        $.when(currentContext.persistenceContext.getMyIdentityAndOpenEntryLogs(myIdentityModel, openEntryLogModel), currentContext.persistenceContext.getLocusById(locusModel), currentContext.persistenceContext.getOptions(purposeCollection, durationCollection))
            .done(function () {
                currentContext.dispatcher.trigger(EventNameEnum.myIdentityReset, myIdentityModel);
                currentContext.dispatcher.trigger(EventNameEnum.openEntryLogReset, openEntryLogModel);
                checkInView.trigger('loaded');
                deferred.resolve(checkInView);
            })
            .fail(function (error) {
                checkInView.trigger('error');
                deferred.reject(error);
            });

        //$.when(currentContext.locusService.getLoci(), currentContext.identityService.getMyIdentity(), currentContext.entryLogService.getOptions())
        //    .then(function (getCheckInOptionsResponse) {
        //        identityModel.set(getCheckInOptionsResponse.identity);
        //        currentContext.dispatcher.trigger(EventNameEnum.myIdentityReset, identityModel);
        //
        //        if (locusModel) {
        //            entryLogModel.set({'locusId': locusModel.get('locusId')});
        //            entryLogModel.set({'locusName': locusModel.get('locusName')});
        //            entryLogModel.set({'distance': locusModel.get('distance')});
        //            entryLogModel.set({'latitude': locusModel.get('latitude')});
        //            entryLogModel.set({'longitude': locusModel.get('longitude')});
        //
        //            currentContext.geoLocationService.getCurrentPosition()
        //                .then(function (position) {
        //                    var distance = utils.computeDistanceBetween(position.coords, locusModel.attributes);
        //                    if (distance) {
        //                        locusModel.set({
        //                            'distance': distance
        //                        });
        //                        checkInView.trigger('change:distance');
        //                    }
        //                })
        //                .fail(function (error) {
        //                });
        //        }
        //        entryLogModel.set({'identityId': identityModel.get('identityId')});
        //        entryLogModel.set({'identityName': identityModel.get('identityName')});
        //        entryLogModel.set({'contactNumber': identityModel.get('contactNumber')});
        //        entryLogModel.set({'email': identityModel.get('email')});
        //
        //        purposeCollection.reset(getCheckInOptionsResponse.purposes);
        //        durationCollection.reset(getCheckInOptionsResponse.durations);
        //        checkInView.completeLoading();
        //        deferred.resolve(checkInView);
        //    })
        //    .fail(function (error) {
        //        checkInView.showError(utils.getResource('criticalSystemErrorMessage'));
        //        checkInView.completeLoading();
        //        deferred.reject(checkInView);
        //    });

        return deferred.promise();
    },

    goToCheckOut: function (entryLogModel) {
        var currentContext = this,
            deferred = $.Deferred();

        var identityModel = new IdentityModel();
        var purposeCollection = new Backbone.Collection();
        var durationCollection = new Backbone.Collection();
        var checkOutViewInstance = new CheckOutView({
            controller: currentContext,
            dispatcher: currentContext.dispatcher,
            model: entryLogModel,
            identityModel: identityModel,
            purposeCollection: purposeCollection,
            durationCollection: durationCollection
        });

        currentContext.router.swapContent(checkOutViewInstance);

        checkOutViewInstance.showLoading();
        currentContext.entryLogService.getCheckOutOptions()
            .then(function (getCheckOutOptionsResponse) {
                identityModel.set(getCheckOutOptionsResponse.identity);
                currentContext.dispatcher.trigger(EventNameEnum.myIdentityReset, identityModel);
                checkOutViewInstance.updateViewFromModel();
                purposeCollection.reset(getCheckOutOptionsResponse.purposes);
                durationCollection.reset(getCheckOutOptionsResponse.durations);
                checkOutViewInstance.completeLoading();
                deferred.resolve(checkOutViewInstance);
            })
            .fail(function (error) {
                checkOutViewInstance.showError(utils.getResource('criticalSystemErrorMessage'));
                checkOutViewInstance.completeLoading();
                deferred.reject(checkOutViewInstance);
            });

        return deferred.promise();
    }
});

module.exports = EntryLogViewController;