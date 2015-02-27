define(function (require) {

    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        EntryLogCollection = require('collections/EntryLogCollection'),
        EntryLogListView = require('views/EntryLogListView'),
        EventNamesEnum = require('enums/EventNamesEnum'),
        utils = require('utils'),
        template = require('hbs!templates/Locus');

    var LocusView = BaseView.extend({
        initialize: function (options) {
            console.trace('LocusView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.entryLogCollection = new EntryLogCollection();
            this.openEntryLogCollection = new EntryLogCollection();
            this.recentEntryLogCollection = new EntryLogCollection();

            this.listenTo(this.entryLogCollection, 'reset', this.updateViewFromEntryLogCollection);
            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('LocusView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            this.renderChildViews();

            return this;
        },
        renderChildViews: function() {
            var currentContext = this;

            currentContext.openEntryLogListViewInstance = new EntryLogListView({
                controller: currentContext.controller,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.openEntryLogCollection,
                headerTextFormatString: utils.getResource('openEntryLogList.headerTextFormatString'),
                showLocus: false,
                showIdentity: true
            });
            currentContext.appendChildTo(currentContext.openEntryLogListViewInstance, '#open-entry-log-list-view-container');

            currentContext.recentEntryLogListViewInstance = new EntryLogListView({
                controller: currentContext.controller,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.recentEntryLogCollection,
                headerTextFormatString: utils.getResource('recentEntryLogList.headerTextFormatString'),
                showLocus: false,
                showIdentity: true
            });
            currentContext.appendChildTo(currentContext.recentEntryLogListViewInstance, '#recent-entry-log-list-view-container');

            return this;
        },
        events: {
            'click #go-back-from-locus-button': 'goBackFromLocus',
            'click #open-locus-menu-button': 'openLocusMenu',
            'click #add-locus-to-favorites-button': 'addLocusToFavorites',
            'click #go-to-directions-button': 'goToDirectionsWithLatLng',
            'click #go-to-child-locus-button': 'goToLocusWithId',
            'click #go-to-parent-locus-button': 'goToLocusWithId',
            'click #go-to-check-in-button': 'goToCheckIn',
            'click #go-to-check-out-button': 'goToCheckOut',
            'click #go-to-open-check-in-button': 'goToLocusWithId',
            'click #show-open-check-ins-button': 'showOpenCheckIns',
            'click #show-recent-check-ins-button': 'showRecentCheckIns'
        },
        updateViewFromModel: function () {
            var currentContext = this;

            var locusName;
            if (currentContext.model.has('locusName')) {
                locusName = currentContext.model.get('locusName');
            }
            currentContext.$('#locus-name-header').html(locusName);

            var childLocusId;
            var childLocusName;
            if (currentContext.model.has('childLocusId') && currentContext.model.has('childLocusName')) {
                currentContext.hasChildLocus = true;
                childLocusId = currentContext.model.get('childLocusId');
                childLocusName = currentContext.model.get('childLocusName');
            }
            if (currentContext.hasChildLocus) {
                currentContext.$('#go-to-child-locus-button').attr('data-locus-id', childLocusId).html(childLocusName);
                currentContext.$('#child-locus-container').removeClass('hidden');
            } else {
                currentContext.$('#child-locus-container').addClass('hidden');
            }
            
            var parentLocusId;
            var parentLocusName;
            if (currentContext.model.has('parentLocusId') && currentContext.model.has('parentLocusName')) {
                currentContext.hasParentLocus = true;
                parentLocusId = currentContext.model.get('parentLocusId');
                parentLocusName = currentContext.model.get('parentLocusName');
            }
            if (currentContext.hasParentLocus) {
                currentContext.$('#go-to-parent-locus-button').attr('data-locus-id', parentLocusId).html(parentLocusName);
                currentContext.$('#parent-locus-container').removeClass('hidden');
            } else {
                currentContext.$('#parent-locus-container').addClass('hidden');
            }

            var distance;
            var formattedDistance;
            var latitude;
            var longitude;
            if (currentContext.model.has('distance') && currentContext.model.has('latitude') && currentContext.model.has('longitude')) {
                currentContext.hasCoordinates = true;
                distance = currentContext.model.get('distance').toFixed(0);
                formattedDistance = utils.formatString(utils.getResource('distanceFormatString'), [distance]);
                latitude = currentContext.model.get('latitude');
                longitude = currentContext.model.get('longitude');
            }
            if (currentContext.hasCoordinates) {
                currentContext.$('#distance-label').html(formattedDistance);
                currentContext.$('#go-to-directions-button').attr('data-latitude', latitude).attr('data-longitude', longitude);
                currentContext.$('#coordinates-unavailable-container').addClass('hidden');
                currentContext.$('#coordinates-container').removeClass('hidden');
            } else {
                currentContext.$('#go-to-directions-button').addClass('hidden');
                currentContext.$('#coordinates-unavailable-container').removeClass('hidden');
                currentContext.$('#coordinates-container').addClass('hidden');
            }
            var cleanedLocusPhone;
            var formattedLocusPhone;
            if (currentContext.model.has('phone')) {
                currentContext.hasLocusPhone = true;
                var phone = currentContext.model.get('phone');
                cleanedLocusPhone = utils.cleanPhone(phone);
                formattedLocusPhone = utils.formatPhone(cleanedLocusPhone);
            }
            if (currentContext.hasLocusPhone) {
                currentContext.$('#phone-label').html(formattedLocusPhone);
                currentContext.$('#call-phone-button').attr('href', 'tel:' + cleanedLocusPhone);
                currentContext.$('#phone-container').removeClass('hidden');
            } else {
                currentContext.$('#phone-container').addClass('hidden');
            }

            if (currentContext.identityModel.openEntryLogCollection.length > 0) {
                if (currentContext.identityModel.openEntryLogCollection.at(0).get('locusId') === currentContext.model.get('locusId')) {
                    currentContext.showCheckOutButton(currentContext.identityModel.openEntryLogCollection.at(0));
                } else {
                    currentContext.showGoToOpenCheckInButton(currentContext.identityModel.openEntryLogCollection.at(0));
                }
            } else {
                this.showCheckInButton();
            }
        },
        updateViewFromEntryLogCollection: function (options) {
            var currentContext = this;

            var openEntryLogs = currentContext.entryLogCollection.filter(function (entryLog) {
                return !entryLog.has('outTime');
            });

            var recentEntryLogs = currentContext.entryLogCollection.filter(function (entryLog) {
                return entryLog.has('outTime');
            });

            currentContext.openEntryLogCollection.reset(openEntryLogs);
            currentContext.recentEntryLogCollection.reset(recentEntryLogs);
        },
        showCheckInButton: function () {
            if (this.model.has('hasHazard') && this.model.get('hasHazard') === 'true') {
                this.showHazardButton();
            } else {
                this.$('#entry-log-status-loading').addClass('hidden');
                this.$('#go-to-check-in-button').removeClass('hidden');
                this.$('#go-to-check-out-button').addClass('hidden');
                this.$('#go-to-open-check-in-button').addClass('hidden');
            }
        },
        showCheckOutButton: function (entryLogModel) {
            if (this.model.has('hasHazard') && this.model.get('hasHazard') === 'true') {
                this.showHazardButton();
            } else {
                this.openEntryLog = entryLogModel;
                this.$('#entry-log-status-loading').addClass('hidden');
                this.$('#go-to-check-in-button').addClass('hidden');
                this.$('#go-to-check-out-button').attr('data-entry-log-id', entryLogModel.get('entryLogId')).removeClass('hidden');
                this.$('#go-to-open-check-in-button').addClass('hidden');
            }
        },
        showGoToOpenCheckInButton: function (entryLogModel) {
            if (this.model.has('hasHazard') && this.model.get('hasHazard') === 'true') {
                this.showHazardButton();
            } else {
                this.$('#entry-log-status-loading').addClass('hidden');
                this.$('#go-to-check-in-button').addClass('hidden');
                this.$('#go-to-check-out-button').addClass('hidden');
                this.$('#go-to-open-check-in-button').attr('data-locus-id', entryLogModel.get('locusId')).attr('data-locus-name', entryLogModel.get('locusName')).removeClass('hidden');
            }
        },
        showHazardButton: function () {
            if (this.model.has('hasHazard') && this.model.get('hasHazard') === 'true') {
                this.$('#entry-log-status-loading').addClass('hidden');
                this.$('#go-to-check-in-button').addClass('hidden');
                this.$('#go-to-check-out-button').addClass('hidden');
                this.$('#go-to-open-check-in-button').addClass('hidden');
                this.$('#call-dispatch-phone-button').removeClass('hidden');
            }
        },
        goBackFromLocus: function (event) {
            if (event) {
                event.preventDefault();
            }

            this.dispatcher.trigger(EventNamesEnum.goToLocusSearch);
        },
        openLocusMenu: function (event) {
            if (event) {
                event.preventDefault();
            }
        },
        addLocusToFavorites: function (event) {
            if (event) {
                event.preventDefault();
            }
        },
        goToCheckIn: function (event) {
            var currentContext = this;
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(EventNamesEnum.goToCheckIn, currentContext.model);
        },
        goToCheckOut: function (event) {
            var currentContext = this;
            if (event) {
                event.preventDefault();
            }

            this.dispatcher.trigger(EventNamesEnum.goToCheckOut, currentContext.openEntryLog);
        },
        goToLocusWithId: function (event) {
            if (event) {
                event.preventDefault();
                if (event.target) {
                    var locusId = $(event.target).attr('data-locus-id');
                    if (locusId) {
                        this.dispatcher.trigger(EventNamesEnum.goToLocusWithId, locusId);
                    }
                }
            }
        },
        goToDirectionsWithLatLng: function (event) {
            if (event) {
                event.preventDefault();
            }

            var latitude = this.model.get('latitude');
            var longitude = this.model.get('longitude');
            this.dispatcher.trigger(EventNamesEnum.goToDirectionsWithLatLng, latitude, longitude);
        },
        onLoaded: function () {
            var currentContext = this;

            var options = {
                locusId: currentContext.model.get('locusId')
            };

            currentContext.openEntryLogListViewInstance.showLoading();
            currentContext.dispatcher.trigger(EventNamesEnum.refreshEntryLogList, currentContext.entryLogCollection, options);
        },
        showOpenCheckIns: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#show-open-check-ins-button').removeClass('secondary');
            this.$('#show-recent-check-ins-button').addClass('secondary');

            this.$('#open-entry-log-list-view-container').removeClass('hidden');
            this.$('#recent-entry-log-list-view-container').addClass('hidden');

            this.openEntryLogListViewInstance.showLoading();
            this.updateViewFromEntryLogCollection();
        },
        showRecentCheckIns: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#show-open-check-ins-button').addClass('secondary');
            this.$('#show-recent-check-ins-button').removeClass('secondary');

            this.$('#open-entry-log-list-view-container').addClass('hidden');
            this.$('#recent-entry-log-list-view-container').removeClass('hidden');

            this.recentEntryLogListViewInstance.showLoading();
            this.updateViewFromEntryLogCollection();
        },
        onLeave: function () {
            console.trace('LocusView.onLeave');
        }
    });

    return LocusView;

});