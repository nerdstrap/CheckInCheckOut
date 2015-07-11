'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var BaseView = require('views/BaseView');
var EntryLogCollection = require('collections/EntryLogCollection');
var ReportCollection = require('collections/EntryLogCollection');
var IssueCollection = require('collections/EntryLogCollection');
var EntryLogCollectionView = require('views/EntryLogCollectionView');
var IssueCollectionView = require('views/EntryLogCollectionView');
var ReportCollectionView = require('views/EntryLogCollectionView');
var EventNameEnum = require('enums/EventNameEnum');
var utils = require('lib/utils');
var template = require('templates/LocusDetailView.hbs');

var LocusDetailView = BaseView.extend({

    /**
     *
     * @param options
     */
    initialize: function (options) {
        console.trace('LocusDetailView.initialize');
        options || (options = {});
        this.controller = options.controller;
        this.dispatcher = options.dispatcher || this;

        this.myIdentityModel = options.myIdentityModel;
        this.openEntryLogModel = options.openEntryLogModel;

        this.openEntryLogCollection = options.openEntryLogCollection || new EntryLogCollection();
        this.recentEntryLogCollection = options.recentEntryLogCollection || new EntryLogCollection();
        this.openReportCollection = options.openReportCollection || new ReportCollection();
        this.activeIssueCollection = options.activeIssueCollection || new IssueCollection();

        this.listenTo(this.model, 'sync', this.onSync);
        this.listenTo(this.model, 'reset', this.onReset);
        this.listenTo(this, 'loaded', this.onLoaded);
        this.listenTo(this, 'leave', this.onLeave);
    },

    /**
     *
     * @returns {LocusDetailView}
     */
    render: function () {
        var currentContext = this;
        var renderModel = _.extend({}, currentContext.model.attributes);
        currentContext.setElement(template(renderModel));
        currentContext.renderOpenEntryLogCollectionView();
        currentContext.renderRecentEntryLogCollectionView();
        currentContext.renderOpenReportCollectionView();
        currentContext.renderActiveIssueCollectionView();
        return this;
    },

    /**
     *
     * @returns {LocusDetailView}
     */
    renderOpenEntryLogCollectionView: function () {
        var currentContext = this;
        currentContext.openEntryLogCollectionViewInstance = new EntryLogCollectionView({
            dispatcher: currentContext.dispatcher,
            collection: currentContext.openEntryLogCollection,
            showIdentity: true,
            showLocus: false,
            headerTextFormatString: currentContext.openEntryLogCollectionViewHeaderTextFormatString
        });
        currentContext.appendChildTo(currentContext.openEntryLogCollectionViewInstance, '#open-entry-log-collection-view-container');
        return this;
    },

    /**
     *
     * @returns {LocusDetailView}
     */
    renderRecentEntryLogCollectionView: function () {
        var currentContext = this;
        currentContext.recentEntryLogCollectionViewInstance = new EntryLogCollectionView({
            dispatcher: currentContext.dispatcher,
            collection: currentContext.recentEntryLogCollection,
            showIdentity: true,
            showLocus: false,
            headerTextFormatString: currentContext.recentEntryLogCollectionViewHeaderTextFormatString
        });
        currentContext.appendChildTo(currentContext.recentEntryLogCollectionViewInstance, '#recent-entry-log-collection-view-container');
        return this;
    },

    /**
     *
     * @returns {LocusDetailView}
     */
    renderOpenReportCollectionView: function () {
        var currentContext = this;
        currentContext.openReportCollectionViewInstance = new ReportCollectionView({
            dispatcher: currentContext.dispatcher,
            collection: currentContext.openReportCollection
        });
        currentContext.appendChildTo(currentContext.openReportCollectionViewInstance, '#open-report-collection-view-container');
        return this;
    },

    /**
     *
     * @returns {LocusDetailView}
     */
    renderActiveIssueCollectionView: function () {
        var currentContext = this;
        currentContext.activeIssueCollectionViewInstance = new IssueCollectionView({
            dispatcher: currentContext.dispatcher,
            collection: currentContext.activeIssueCollection
        });
        currentContext.appendChildTo(currentContext.activeIssueCollectionViewInstance, '#active-issue-collection-view-container');
        return this;
    },

    /**
     *
     */
    events: {
        'click #go-back-button': 'goBack',
        'click #go-to-map-button': 'goToMap',
        'click #toggle-favorite-button': 'toggleFavorite',
        'click #toggle-menu-button': 'toggleMenu',
        'click #go-to-check-in-button': 'goToCheckIn',
        'click #go-to-check-out-button': 'goToCheckOut',
        'click #go-to-open-check-in-button': 'goToLocus',
        'click #call-coordinator-button': 'callCoordinator',
        'click #go-to-parent-locus-button': 'goToLocus',
        'click #go-to-child-locus-button': 'goToLocus'
    },

    /**
     *
     * @returns {LocusDetailView}
     */
    updateViewFromModel: function () {
        var currentContext = this;
        currentContext.updateLocusNameLabel();
        currentContext.updateRegionNameLabel();
        currentContext.updateAreaNameLabel();
        currentContext.updateDistanceLabel();
        currentContext.updatePhoneLabel();
        return this;
    },

    /**
     *
     * @returns {LocusDetailView}
     */
    updateLocusNameLabel: function () {
        var currentContext = this;
        var locusName;
        if (currentContext.model.has('locusName')) {
            locusName = currentContext.model.get('locusName');
        }
        currentContext.$('#locus-name-label').html(locusName);
        return this;
    },

    /**
     *
     * @returns {LocusDetailView}
     */
    updateRegionNameLabel: function () {
        var currentContext = this;
        var regionName;
        if (currentContext.model.has('regionName')) {
            regionName = currentContext.model.get('regionName');
        }
        currentContext.$('#region-name-label').html(regionName);
        return this;
    },

    /**
     *
     * @returns {LocusDetailView}
     */
    updateAreaNameLabel: function () {
        var currentContext = this;
        var areaName;
        if (currentContext.model.has('areaName')) {
            areaName = currentContext.model.get('areaName');
        }
        currentContext.$('#area-name-label').html(areaName);
        return this;
    },

    /**
     *
     * @returns {LocusDetailView}
     */
    updatePhoneLabel: function () {
        var currentContext = this;
        var formattedLocusPhone;
        if (currentContext.model.has('phone')) {
            currentContext.hasLocusPhone = true;
            var phone = currentContext.model.get('phone');
            var cleanedLocusPhone = utils.cleanPhone(phone);
            formattedLocusPhone = utils.formatPhone(cleanedLocusPhone);
        } else {
            formattedLocusPhone = utils.getResource('phoneUnavailableErrorMessage');
        }
        currentContext.$('#phone-label').html(formattedLocusPhone);
        return this;
    },

    /**
     *
     * @returns {LocusDetailView}
     */
    updateDistanceLabel: function () {
        var currentContext = this;
        var formattedDistance;
        if (currentContext.model.has('distance') && currentContext.model.has('latitude') && currentContext.model.has('longitude')) {
            currentContext.hasCoordinates = true;
            var distance = currentContext.model.get('distance').toFixed(0);
            formattedDistance = utils.formatString(utils.getResource('distanceFormatString'), [distance]);
        } else {
            formattedDistance = utils.getResource('coordinatesUnavailableErrorMessage');
        }
        currentContext.$('#distance-label').html(formattedDistance);
        return this;
    },


    /**
     *
     * @returns {LocusDetailView}
     */
    updateCheckInControls: function () {
        var currentContext = this;

        if (currentContext.openEntryLogModel) {
            if (currentContext.openEntryLogModel.has('entryLogId')) {
                if (currentContext.openEntryLogModel.get('locusId') === currentContext.model.get('locusId')) {
                    currentContext.showCheckOut();
                } else {
                    currentContext.showGoToOpenCheckIn();
                }
            } else {
                currentContext.showCheckIn();
            }
        }

        return this;
    },

    updateCurrentCheckInLabel: function () {
        var currentContext = this;
        var formattedCurrentCheckInText = '';
        if (currentContext.openEntryLogModel) {
            var inTime = currentContext.openEntryLogModel.get('inTime');
            var formattedInTime = utils.formatDate(inTime);
            var purpose = currentContext.openEntryLogModel.get('purpose');
            var expectedOutTime = currentContext.openEntryLogModel.get('expectedOutTime');
            var formattedExpectedOutTime = utils.formatDate(expectedOutTime);
            formattedCurrentCheckInText = utils.formatString(utils.getResource('currentCheckInTextFormatString'), [formattedInTime, purpose, formattedExpectedOutTime]);
            currentContext.$('#current-check-in-label').html(formattedCurrentCheckInText);
        }
        return this;
    },

    /**
     *
     * @returns {LocusDetailView}
     */
    updateOpenCheckInLabel: function () {
        var currentContext = this;
        var formattedOpenCheckInText = '';
        if (currentContext.openEntryLogModel) {
            var locusName = currentContext.openEntryLogModel.get('locusName');
            var inTime = currentContext.openEntryLogModel.get('inTime');
            var formattedInTime = utils.formatDate(inTime);
            formattedOpenCheckInText = utils.formatString(utils.getResource('openCheckInTextFormatString'), [locusName, formattedInTime]);
            currentContext.$('#open-check-in-label').html(formattedOpenCheckInText);
        }
        return this;
    },

    /**
     *
     * @returns {LocusDetailView}
     */
    showLock: function () {
        var currentContext = this;
        var locusLockMessage = utils.getResource('locusLockMessage');
        currentContext.$('#lock-detail-label').html(locusLockMessage);
        currentContext.$('#lock-container').removeClass('hidden');
        currentContext.$('#check-in-container').addClass('hidden');
        currentContext.$('#check-out-container').addClass('hidden');
        currentContext.$('#open-check-in-container').addClass('hidden');
        return this;
    },

    /**
     *
     * @returns {LocusDetailView}
     */
    showCheckIn: function () {
        var currentContext = this;
        if (currentContext.model.has('hasLock') && currentContext.model.get('hasLock') === 'true') {
            currentContext.showLock();
        } else {
            currentContext.$('#lock-container').addClass('hidden');
            currentContext.$('#check-in-container').removeClass('hidden');
            currentContext.$('#check-out-container').addClass('hidden');
            currentContext.$('#open-check-in-container').addClass('hidden');

        }
        return this;
    },

    /**
     *
     * @returns {LocusDetailView}
     */
    showCheckOut: function () {
        var currentContext = this;
        if (currentContext.model.has('hasLock') && currentContext.model.get('hasLock') === 'true') {
            currentContext.showLock();
        } else {
            currentContext.$('#lock-container').addClass('hidden');
            currentContext.$('#check-in-container').addClass('hidden');
            currentContext.$('#check-out-container').removeClass('hidden');
            currentContext.$('#open-check-in-container').addClass('hidden');
            currentContext.updateCurrentCheckInLabel();
        }
        return this;
    },

    /**
     *
     * @returns {LocusDetailView}
     */
    showGoToOpenCheckIn: function () {
        var currentContext = this;
        if (currentContext.model.has('hasLock') && currentContext.model.get('hasLock') === 'true') {
            currentContext.showLock();
        } else {
            currentContext.$('#lock-container').addClass('hidden');
            currentContext.$('#check-in-container').addClass('hidden');
            currentContext.$('#check-out-container').addClass('hidden');
            currentContext.$('#open-check-in-container').removeClass('hidden');
            currentContext.updateOpenCheckInLabel();
        }
        return this;
    },

    /**
     *
     * @param event
     * @returns {LocusDetailView}
     */
    goBack: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;

        currentContext.dispatcher.trigger(EventNameEnum.goToLocusSearch);
        return this;
    },

    /**
     *
     * @param event
     * @returns {LocusDetailView}
     */
    goToMap: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        var latitude = currentContext.model.get('latitude');
        var longitude = currentContext.model.get('longitude');
        currentContext.dispatcher.trigger(EventNameEnum.goToMapWithLatLng, latitude, longitude);
        return this;
    },

    /**
     *
     * @param event
     * @returns {LocusDetailView}
     */
    toggleFavorite: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        var locusId = currentContext.model.get('locusId');
        currentContext.dispatcher.trigger(EventNameEnum.goToUpdateFavorite, locusId);
        return this;
    },

    /**
     *
     * @param event
     * @returns {LocusDetailView}
     */
    toggleMenu: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        currentContext.$('locus-detail-menu').toggleClass('hidden');
        return this;
    },

    /**
     *
     * @param event
     * @returns {LocusDetailView}
     */
    goToCheckIn: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        currentContext.dispatcher.trigger(EventNameEnum.goToCheckIn, currentContext.model.get('locusId'));
        return this;
    },

    /**
     *
     * @param event
     * @returns {LocusDetailView}
     */
    goToCheckOut: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        currentContext.dispatcher.trigger(EventNameEnum.goToCheckOut, currentContext.openEntryLogModel);
        return this;
    },

    /**
     *
     * @param event
     * @returns {LocusDetailView}
     */
    goToLocus: function (event) {
        if (event) {
            event.preventDefault();
            if (event.target) {
                var currentContext = this;
                var locusId = $(event.target).attr('data-locus-id');
                if (locusId) {
                    currentContext.dispatcher.trigger(EventNameEnum.goToLocusWithId, locusId);
                }
            }
        }
        return this;
    },

    /**
     *
     * @param event
     * @returns {LocusDetailView}
     */
    goToDirections: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        var latitude = currentContext.model.get('latitude');
        var longitude = currentContext.model.get('longitude');
        currentContext.dispatcher.trigger(EventNameEnum.goToDirectionsWithLatLng, latitude, longitude);
        return this;
    },

    /**
     *
     */
    onLoaded: function () {
        var currentContext = this;
        var options = {
            locusId: currentContext.model.get('locusId')
        };
        currentContext.updateViewFromModel();
        currentContext.updateCheckInControls();
        currentContext.dispatcher.trigger(EventNameEnum.refreshEntryLogCollection, currentContext.openEntryLogCollection, _.extend(options, {'open': true}));
        currentContext.dispatcher.trigger(EventNameEnum.refreshEntryLogCollection, currentContext.recentEntryLogCollection, _.extend(options, {'recent': true}));
        //currentContext.dispatcher.trigger(EventNameEnum.refreshReportList, currentContext.openReportCollection, _.extend(options, {'open': true}));
        //currentContext.dispatcher.trigger(EventNameEnum.refreshIssueList, currentContext.activeIssueCollection, _.extend(options, {'active': true}));
    },

    /**
     *
     */
    onLeave: function () {
        var currentContext = this;
        console.trace('LocusDetailView.onLeave');
    }
});

module.exports = LocusDetailView;