    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var EntryLogListView = require('views/EntryLogListView');
    var EventNamesEnum = require('enums/EventNamesEnum');
    var utils = require('utils');
    var template = require('hbs!templates/LocusDetailView');

    var LocusDetailView = BaseView.extend({
        /**
         *
         */
        tagName: 'div',

        /**
         *
         */
        className: 'locus-detail-view',

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
            console.trace('LocusDetailView.initialize');
            options || (options = {});
            this.controller = options.controller;
            this.dispatcher = options.dispatcher || this;

            this.openEntryLogCollection = options.openEntryLogCollection;
            this.recentEntryLogCollection = options.recentEntryLogCollection;
            this.openLocusReportCollection = options.openLocusReportCollection;
            this.currentLocusIssueCollection = options.currentLocusIssueCollection;

            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },

        /**
         *
         * @returns {LocusDetailView}
         */
        render: function () {
            console.trace('LocusDetailView.render()');
            var currentContext = this;
            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));
            this.renderChildViews();
            return this;
        },

        /**
         *
         * @returns {LocusDetailView}
         */
        renderChildViews: function () {
            var currentContext = this;
            currentContext.openEntryLogListViewInstance = new EntryLogListView({
                controller: currentContext.controller,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.openEntryLogCollection,
                showIdentity: true,
                showLocus: false,
                headerTextFormatString: currentContext.openEntryLogListViewHeaderTextFormatString
            });
            currentContext.appendChildTo(currentContext.openEntryLogListViewInstance, '#open-entry-log-results-container');
            currentContext.recentEntryLogListViewInstance = new EntryLogListView({
                controller: currentContext.controller,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.recentEntryLogCollection,
                showIdentity: true,
                showLocus: false,
                headerTextFormatString: currentContext.recentEntryLogListViewHeaderTextFormatString
            });
            currentContext.appendChildTo(currentContext.recentEntryLogListViewInstance, '#recent-entry-log-results-container');
            //currentContext.openLocusReportListViewInstance = new LocusReportListView({
            //    controller: currentContext.controller,
            //    dispatcher: currentContext.dispatcher,
            //    collection: currentContext.openLocusReportCollection
            //});
            //currentContext.appendChildTo(currentContext.openLocusReportListViewInstance, '#open-locus-report-results-container');
            //currentContext.openLocusIssueListViewInstance = new LocusIssueListView({
            //    controller: currentContext.controller,
            //    dispatcher: currentContext.dispatcher,
            //    collection: currentContext.currentLocusIssueCollection
            //});
            //currentContext.appendChildTo(currentContext.openLocusIssueListViewInstance, '#current-locus-issue-results-container');
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
            var locusName;
            if (currentContext.model.has('locusName')) {
                locusName = currentContext.model.get('locusName');
            }
            currentContext.$('#locus-name-header').html(locusName);

            //var childLocusId;
            //var childLocusName;
            //if (currentContext.model.has('childLocusId') && currentContext.model.has('childLocusName')) {
            //    currentContext.hasChildLocus = true;
            //    childLocusId = currentContext.model.get('childLocusId');
            //    childLocusName = currentContext.model.get('childLocusName');
            //}
            //if (currentContext.hasChildLocus) {
            //    currentContext.$('#go-to-child-locus-button').attr('data-locus-id', childLocusId).html(childLocusName);
            //    currentContext.$('#child-locus-container').removeClass('hidden');
            //} else {
            //    currentContext.$('#child-locus-container').addClass('hidden');
            //}
            //
            //var parentLocusId;
            //var parentLocusName;
            //if (currentContext.model.has('parentLocusId') && currentContext.model.has('parentLocusName')) {
            //    currentContext.hasParentLocus = true;
            //    parentLocusId = currentContext.model.get('parentLocusId');
            //    parentLocusName = currentContext.model.get('parentLocusName');
            //}
            //if (currentContext.hasParentLocus) {
            //    currentContext.$('#go-to-parent-locus-button').attr('data-locus-id', parentLocusId).html(parentLocusName);
            //    currentContext.$('#parent-locus-container').removeClass('hidden');
            //} else {
            //    currentContext.$('#parent-locus-container').addClass('hidden');
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

            currentContext.updateCheckInControls();
            return this;
        },

        /**
         *
         * @returns {LocusDetailView}
         */
        updateCheckInControls: function () {
            var currentContext = this;
            if (currentContext.identityModel.openEntryLogCollection.length > 0) {
                if (currentContext.identityModel.openEntryLogCollection.at(0).get('locusId') === currentContext.model.get('locusId')) {
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
         * @returns {LocusDetailView}
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
         * @returns {LocusDetailView}
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
         * @returns {LocusDetailView}
         */
        showGoToOpenCheckInButton: function (entryLogModel) {
            var currentContext = this;
            if (currentContext.model.has('hasLock') && currentContext.model.get('hasLock') === 'true') {
                currentContext.showCallCoordinatorButton();
            } else {
                currentContext.openEntryLogModel = entryLogModel;
                var formattedOpenCheckInDetail = '';
                if (currentContext.openEntryLogModel) {
                    var locusName = currentContext.openEntryLogModel.get('locusName');
                    var inTime = currentContext.openEntryLogModel.get('inTime');
                    formattedOpenCheckInDetail = utils.formatString(utils.getResource('openCheckInDetailLabelTextFormatString'), [locusName, inTime]);
                    currentContext.$('#check-in-detail-label').html(formattedOpenCheckInDetail);
                }
                currentContext.$('#go-to-check-in-button').addClass('hidden');
                currentContext.$('#go-to-check-out-button').addClass('hidden');
                currentContext.$('#go-to-open-check-in-button').attr('data-locus-id', currentContext.openEntryLogModel.get('locusId')).attr('data-locus-name', currentContext.openEntryLogModel.get('locusName')).removeClass('hidden');
            }
            return this;
        },

        /**
         *
         * @returns {LocusDetailView}
         */
        showCallCoordinatorButton: function () {
            var currentContext = this;
            if (currentContext.model.has('hasLock') && currentContext.model.get('hasLock') === 'true') {
                var locusLockMessage = utils.getResource('locusLockMessage');
                currentContext.$('#check-in-detail-label').html(locusLockMessage);
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
         * @returns {LocusDetailView}
         */
        goBack: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;

            currentContext.dispatcher.trigger(EventNamesEnum.goToLocusSearch);
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
            currentContext.dispatcher.trigger(EventNamesEnum.goToMapWithLatLng, latitude, longitude);
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
            currentContext.dispatcher.trigger(EventNamesEnum.goToUpdateFavorite, locusId);
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
            currentContext.dispatcher.trigger(EventNamesEnum.goToCheckIn, currentContext.model);
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
            currentContext.dispatcher.trigger(EventNamesEnum.goToCheckOut, currentContext.openEntryLogModel);
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
                        currentContext.dispatcher.trigger(EventNamesEnum.goToLocusWithId, locusId);
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
            currentContext.dispatcher.trigger(EventNamesEnum.goToDirectionsWithLatLng, latitude, longitude);
            return this;
        },

        /**
         *
         * @returns {LocusDetailView}
         */
        showLoading: function () {
            var currentContext = this;
            currentContext.$('#locus-detail-view-loading-icon-container').removeClass('hidden');
            return this;
        },

        /**
         *
         * @returns {LocusDetailView}
         */
        hideLoading: function () {
            var currentContext = this;
            currentContext.$('#locus-detail-view-loading-icon-container').addClass('hidden');
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
            currentContext.dispatcher.trigger(EventNamesEnum.refreshEntryLogList, currentContext.openEntryLogCollection, _.extend(options, {'open': true}));
            currentContext.dispatcher.trigger(EventNamesEnum.refreshEntryLogList, currentContext.recentEntryLogCollection, _.extend(options, {'recent': true}));
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