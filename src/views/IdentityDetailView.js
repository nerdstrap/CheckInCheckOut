'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var BaseView = require('views/BaseView');
var EntryLogListView = require('views/EntryLogListView');
var EventNamesEnum = require('enums/EventNamesEnum');
var utils = require('utils');
var template = require('hbs!templates/IdentityDetailView');

var IdentityDetailView = BaseView.extend({
    /**
     *
     */
    tagName: 'div',

    /**
     *
     */
    className: 'identity-detail-view',

    /**
     *
     */
    openEntryLogListViewHeaderTextFormatString: utils.getResource('openEntryLogListViewHeaderTextFormatString'),

    /**
     *
     */
    recentEntryLogListViewHeaderTextFormatString: utils.getResource('recentEntryLogListViewHeaderTextFormatString'),

    /**
     *
     * @param options
     */
    initialize: function (options) {
        console.trace('IdentityDetailView.initialize');
        options || (options = {});
        this.controller = options.controller;
        this.dispatcher = options.dispatcher || this;

        this.openEntryLogCollection = options.openEntryLogCollection;
        this.recentEntryLogCollection = options.recentEntryLogCollection;
        this.openIdentityReportCollection = options.openIdentityReportCollection;
        this.currentIdentityIssueCollection = options.currentIdentityIssueCollection;

        this.listenTo(this, 'loaded', this.onLoaded);
        this.listenTo(this, 'leave', this.onLeave);
    },

    /**
     *
     * @returns {IdentityDetailView}
     */
    render: function () {
        console.trace('IdentityDetailView.render()');
        var currentContext = this;
        var renderModel = _.extend({}, currentContext.model.attributes);
        currentContext.$el.html(template(renderModel));
        this.renderChildViews();
        return this;
    },

    /**
     *
     * @returns {IdentityDetailView}
     */
    renderChildViews: function () {
        var currentContext = this;
        currentContext.openEntryLogListViewInstance = new EntryLogListView({
            controller: currentContext.controller,
            dispatcher: currentContext.dispatcher,
            collection: currentContext.openEntryLogCollection,
            showIdentity: false,
            showLocus: true,
            headerTextFormatString: currentContext.openEntryLogListViewHeaderTextFormatString
        });
        currentContext.appendChildTo(currentContext.openEntryLogListViewInstance, '#open-entry-log-results-container');
        currentContext.recentEntryLogListViewInstance = new EntryLogListView({
            controller: currentContext.controller,
            dispatcher: currentContext.dispatcher,
            collection: currentContext.recentEntryLogCollection,
            showIdentity: false,
            showLocus: true,
            headerTextFormatString: currentContext.recentEntryLogListViewHeaderTextFormatString
        });
        currentContext.appendChildTo(currentContext.recentEntryLogListViewInstance, '#recent-entry-log-results-container');
        //currentContext.openIdentityReportListViewInstance = new IdentityReportListView({
        //    controller: currentContext.controller,
        //    dispatcher: currentContext.dispatcher,
        //    collection: currentContext.openIdentityReportCollection
        //});
        //currentContext.appendChildTo(currentContext.openIdentityReportListViewInstance, '#open-identity-report-results-container');
        //currentContext.openIdentityIssueListViewInstance = new IdentityIssueListView({
        //    controller: currentContext.controller,
        //    dispatcher: currentContext.dispatcher,
        //    collection: currentContext.currentIdentityIssueCollection
        //});
        //currentContext.appendChildTo(currentContext.openIdentityIssueListViewInstance, '#current-identity-issue-results-container');
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
        'click #go-to-open-check-in-button': 'goToIdentity',
        'click #call-coordinator-button': 'callCoordinator',
        'click #go-to-parent-identity-button': 'goToIdentity',
        'click #go-to-child-identity-button': 'goToIdentity'
    },

    /**
     *
     * @returns {IdentityDetailView}
     */
    updateViewFromModel: function () {
        var currentContext = this;
        var identityName;
        if (currentContext.model.has('identityName')) {
            identityName = currentContext.model.get('identityName');
        }
        currentContext.$('#identity-name-header').html(identityName);

        //var childIdentityId;
        //var childIdentityName;
        //if (currentContext.model.has('childIdentityId') && currentContext.model.has('childIdentityName')) {
        //    currentContext.hasChildIdentity = true;
        //    childIdentityId = currentContext.model.get('childIdentityId');
        //    childIdentityName = currentContext.model.get('childIdentityName');
        //}
        //if (currentContext.hasChildIdentity) {
        //    currentContext.$('#go-to-child-identity-button').attr('data-identity-id', childIdentityId).html(childIdentityName);
        //    currentContext.$('#child-identity-container').removeClass('hidden');
        //} else {
        //    currentContext.$('#child-identity-container').addClass('hidden');
        //}
        //
        //var parentIdentityId;
        //var parentIdentityName;
        //if (currentContext.model.has('parentIdentityId') && currentContext.model.has('parentIdentityName')) {
        //    currentContext.hasParentIdentity = true;
        //    parentIdentityId = currentContext.model.get('parentIdentityId');
        //    parentIdentityName = currentContext.model.get('parentIdentityName');
        //}
        //if (currentContext.hasParentIdentity) {
        //    currentContext.$('#go-to-parent-identity-button').attr('data-identity-id', parentIdentityId).html(parentIdentityName);
        //    currentContext.$('#parent-identity-container').removeClass('hidden');
        //} else {
        //    currentContext.$('#parent-identity-container').addClass('hidden');
        //}
        //

        var formattedDistance;
        if (currentContext.model.has('distance') && currentContext.model.has('latitude') && currentContext.model.has('longitude')) {
            currentContext.hasCoordinates = true;
            var distance = currentContext.model.get('distance').toFixed(0);
            formattedDistance = utils.formatString(utils.getResource('distanceFormatString'), [distance]);
        } else {
            formattedDistance = utils.getResource('coordinatesUnavailableErrorMessage');
        }
        currentContext.$('#distance-label').html(formattedDistance);

        var formattedIdentityPhone;
        if (currentContext.model.has('phone')) {
            currentContext.hasIdentityPhone = true;
            var phone = currentContext.model.get('phone');
            var cleanedIdentityPhone = utils.cleanPhone(phone);
            formattedIdentityPhone = utils.formatPhone(cleanedIdentityPhone);
        } else {
            formattedIdentityPhone = utils.getResource('phoneUnavailableErrorMessage');
        }
        currentContext.$('#phone-label').html(formattedIdentityPhone);

        currentContext.updateCheckInControls();
        return this;
    },

    /**
     *
     * @returns {IdentityDetailView}
     */
    updateCheckInControls: function () {
        var currentContext = this;
        if (currentContext.identityModel.openEntryLogCollection.length > 0) {
            if (currentContext.identityModel.openEntryLogCollection.at(0).get('identityId') === currentContext.model.get('identityId')) {
                currentContext.showCheckOutButton(currentContext.identityModel.openEntryLogCollection.at(0));
            } else {
                currentContext.showGoToOpenCheckInButton(currentContext.identityModel.openEntryLogCollection.at(0));
            }
        } else {
            currentContext.showCheckInButton();
        }
        return this;
    },

    /**
     *
     * @returns {IdentityDetailView}
     */
    showCheckInButton: function () {
        var currentContext = this;
        if (currentContext.model.has('hasLock') && currentContext.model.get('hasLock') === 'true') {
            currentContext.showCallCoordinatorButton();
        } else {
            currentContext.$('#go-to-check-in-button').removeClass('hidden');
            currentContext.$('#go-to-check-out-button').addClass('hidden');
            currentContext.$('#go-to-open-check-in-button').addClass('hidden');
        }
        return this;
    },

    /**
     *
     * @param entryLogModel
     * @returns {IdentityDetailView}
     */
    showCheckOutButton: function (entryLogModel) {
        var currentContext = this;
        if (currentContext.model.has('hasLock') && currentContext.model.get('hasLock') === 'true') {
            currentContext.showCallCoordinatorButton();
        } else {
            currentContext.openEntryLogModel = entryLogModel;
            var formattedOpenCheckInDetail = '';
            if (currentContext.openEntryLogModel) {
                var inTime = currentContext.openEntryLogModel.get('inTime');
                var purpose = currentContext.openEntryLogModel.get('purpose');
                var expectedOutTime = currentContext.openEntryLogModel.get('expectedOutTime');
                formattedOpenCheckInDetail = utils.formatString(utils.getResource('currentCheckInDetailLabelTextFormatString'), [inTime, purpose, expectedOutTime]);
                currentContext.$('#check-in-detail-label').html(formattedOpenCheckInDetail);
            }
            currentContext.$('#go-to-check-in-button').addClass('hidden');
            currentContext.$('#go-to-check-out-button').attr('data-entry-log-id', currentContext.openEntryLogModel.get('entryLogId')).removeClass('hidden');
            currentContext.$('#go-to-open-check-in-button').addClass('hidden');
        }
        return this;
    },

    /**
     *
     * @param entryLogModel
     * @returns {IdentityDetailView}
     */
    showGoToOpenCheckInButton: function (entryLogModel) {
        var currentContext = this;
        if (currentContext.model.has('hasLock') && currentContext.model.get('hasLock') === 'true') {
            currentContext.showCallCoordinatorButton();
        } else {
            currentContext.openEntryLogModel = entryLogModel;
            var formattedOpenCheckInDetail = '';
            if (currentContext.openEntryLogModel) {
                var identityName = currentContext.openEntryLogModel.get('identityName');
                var inTime = currentContext.openEntryLogModel.get('inTime');
                formattedOpenCheckInDetail = utils.formatString(utils.getResource('openCheckInDetailLabelTextFormatString'), [identityName, inTime]);
                currentContext.$('#check-in-detail-label').html(formattedOpenCheckInDetail);
            }
            currentContext.$('#go-to-check-in-button').addClass('hidden');
            currentContext.$('#go-to-check-out-button').addClass('hidden');
            currentContext.$('#go-to-open-check-in-button').attr('data-identity-id', currentContext.openEntryLogModel.get('identityId')).attr('data-identity-name', currentContext.openEntryLogModel.get('identityName')).removeClass('hidden');
        }
        return this;
    },

    /**
     *
     * @returns {IdentityDetailView}
     */
    showCallCoordinatorButton: function () {
        var currentContext = this;
        if (currentContext.model.has('hasLock') && currentContext.model.get('hasLock') === 'true') {
            var identityLockMessage = utils.getResource('identityLockMessage');
            currentContext.$('#check-in-detail-label').html(identityLockMessage);
            currentContext.$('#go-to-check-in-button').addClass('hidden');
            currentContext.$('#go-to-check-out-button').addClass('hidden');
            currentContext.$('#go-to-open-check-in-button').addClass('hidden');
            currentContext.$('#call-coordinator-button').removeClass('hidden');
        }
        return this;
    },

    /**
     *
     * @param event
     * @returns {IdentityDetailView}
     */
    goBack: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;

        currentContext.dispatcher.trigger(EventNamesEnum.goToIdentitySearch);
        return this;
    },

    /**
     *
     * @param event
     * @returns {IdentityDetailView}
     */
    goToMap: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        var latitude = currentContext.model.get('latitude');
        var longitude = currentContext.model.get('longitude');
        currentContext.dispatcher.trigger(EventNamesEnum.goToMapWithLatLng, latitude, longitude);
        return this;
    },

    /**
     *
     * @param event
     * @returns {IdentityDetailView}
     */
    toggleFavorite: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        var identityId = currentContext.model.get('identityId');
        currentContext.dispatcher.trigger(EventNamesEnum.goToUpdateFavorite, identityId);
        return this;
    },

    /**
     *
     * @param event
     * @returns {IdentityDetailView}
     */
    toggleMenu: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        currentContext.$('identity-detail-menu').toggleClass('hidden');
        return this;
    },

    /**
     *
     * @param event
     * @returns {IdentityDetailView}
     */
    goToCheckIn: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        currentContext.dispatcher.trigger(EventNamesEnum.goToCheckIn, currentContext.model);
        return this;
    },

    /**
     *
     * @param event
     * @returns {IdentityDetailView}
     */
    goToCheckOut: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        currentContext.dispatcher.trigger(EventNamesEnum.goToCheckOut, currentContext.openEntryLogModel);
        return this;
    },

    /**
     *
     * @param event
     * @returns {IdentityDetailView}
     */
    goToIdentity: function (event) {
        if (event) {
            event.preventDefault();
            if (event.target) {
                var currentContext = this;
                var identityId = $(event.target).attr('data-identity-id');
                if (identityId) {
                    currentContext.dispatcher.trigger(EventNamesEnum.goToIdentityWithId, identityId);
                }
            }
        }
        return this;
    },

    /**
     *
     * @param event
     * @returns {IdentityDetailView}
     */
    goToDirections: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        var latitude = currentContext.model.get('latitude');
        var longitude = currentContext.model.get('longitude');
        currentContext.dispatcher.trigger(EventNamesEnum.goToDirectionsWithLatLng, latitude, longitude);
        return this;
    },

    /**
     *
     * @returns {IdentityDetailView}
     */
    showLoading: function () {
        var currentContext = this;
        currentContext.$('#identity-detail-view-loading-icon-container').removeClass('hidden');
        return this;
    },

    /**
     *
     * @returns {IdentityDetailView}
     */
    hideLoading: function () {
        var currentContext = this;
        currentContext.$('#identity-detail-view-loading-icon-container').addClass('hidden');
        return this;
    },

    /**
     *
     */
    onLoaded: function () {
        var currentContext = this;
        var options = {
            identityId: currentContext.model.get('identityId')
        };
        currentContext.dispatcher.trigger(EventNamesEnum.refreshEntryLogList, currentContext.openEntryLogCollection, _.extend(options, {'open': true}));
        currentContext.dispatcher.trigger(EventNamesEnum.refreshEntryLogList, currentContext.recentEntryLogCollection, _.extend(options, {'recent': true}));
    },

    /**
     *
     */
    onLeave: function () {
        var currentContext = this;
        console.trace('IdentityDetailView.onLeave');
    }
});

module.exports = IdentityDetailView;