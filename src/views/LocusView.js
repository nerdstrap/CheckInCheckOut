define(function (require) {

    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        EntryLogCollection = require('collections/EntryLogCollection'),
        EntryLogListView = require('views/EntryLogListView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        utils = require('utils'),
        template = require('hbs!templates/Locus');

    var LocusView = BaseView.extend({
        initialize: function (options) {
            console.trace('LocusView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.entryLogCollection = new EntryLogCollection();

            this.listenTo(this.entryLogCollection, 'reset', this.updateEntryLogStatusView);
            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);

            this.listenTo(this.dispatcher, AppEventNamesEnum.checkInSuccess, this.updateEntryLogStatusView);
            this.listenTo(this.dispatcher, AppEventNamesEnum.editCheckInSuccess, this.updateEntryLogStatusView);
            this.listenTo(this.dispatcher, AppEventNamesEnum.checkOutSuccess, this.updateEntryLogStatusView);
        },
        render: function () {
            console.trace('LocusView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click #go-to-directions-button': 'goToDirectionsWithLatLng',
            'click #go-to-linked-locus-button': 'goToLinkedLocusWithId',
            'click #go-to-check-in-button': 'goToCheckIn',
            'click #go-to-check-out-button': 'goToCheckOut',
            'click #go-to-open-check-in-button': 'goToLocusWithId'
        },
        updateEntryLogStatusView: function () {
            var currentContext = this;
            currentContext.userOpenEntryLog = currentContext.entryLogCollection.find(function (entryLog) {
                return entryLog.get('identityId') === currentContext.identityModel.get('identityId') && !entryLog.has('outTime');
            });

            if (currentContext.userOpenEntryLog) {
                this.showCheckOutButton(currentContext.userOpenEntryLog);
            } else {
                this.showCheckInButton();
            }
        },
        updateViewFromModel: function () {
            var currentContext = this;
            
            var locusName;
            if (currentContext.model.has('locusName')) {
                locusName = currentContext.model.get('locusName');
            }
            currentContext.$('#locus-name-header').html(locusName);
            
            var linkedLocusId;
            var linkedLocusName;
            if (currentContext.model.has('linkedLocusId') && currentContext.model.has('linkedLocusName')) {
                currentContext.hasLinkedLocus = true;
                linkedLocusId = currentContext.model.get('linkedLocusId');
                linkedLocusName = currentContext.model.get('linkedLocusName');
            }
            if (currentContext.hasLinkedLocus) {
                currentContext.$('#go-to-linked-locus-button').attr('data-linked-locus-id', linkedLocusId).html(linkedLocusName);
                currentContext.$('#linked-locus-view').addClass('hidden');
            } else {
                currentContext.$('#linked-locus-view').addClass('hidden');
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
        },
        showCheckInButton: function () {
            if (this.model.has('hasHazard') && this.model.get('hasHazard') === 'true') {
                this.showHazardView();
            } else {
                this.$('#entry-log-status-loading').addClass('hidden');
                this.$('#go-to-check-in-button').removeClass('hidden');
                this.$('#go-to-check-out-button').addClass('hidden');
                this.$('#go-to-open-check-in-button').addClass('hidden');
            }
        },
        showCheckOutButton: function (entryLogModel) {
            if (this.model.has('hasHazard') && this.model.get('hasHazard') === 'true') {
                this.showHazardView();
            } else {
                this.$('#entry-log-status-loading').addClass('hidden');
                this.$('#go-to-check-in-button').addClass('hidden');
                this.$('#go-to-check-out-button').attr('data-entry-log-id', entryLogModel.get('entryLogId')).removeClass('hidden');
                this.$('#go-to-open-check-in-button').addClass('hidden');
            }
        },
        showGoToOpenCheckInButton: function (entryLogModel) {
            if (this.model.has('hasHazard') && this.model.get('hasHazard') === 'true') {
                this.showHazardView();
            } else {
                this.$('#entry-log-status-loading').addClass('hidden');
                this.$('#go-to-check-in-button').addClass('hidden');
                this.$('#go-to-check-out-button').addClass('hidden');
                this.$('#go-to-open-check-in-button').attr('data-locus-id', entryLogModel.get('locusId')).attr('data-locus-name', entryLogModel.get('locusName')).removeClass('hidden');
            }
        },
        showHazardView: function () {
            if (this.model.has('hasHazard') && this.model.get('hasHazard') === 'true') {
                this.$('#hazard-view').removeClass('hidden');
                this.$('#entry-log-controls-container').addClass('hidden');
            } else {
                this.$('#hazard-view').addClass('hidden');
                this.$('#entry-log-controls-container').removeClass('hidden');
            }
        },
        goToLinkedLocusWithId: function (event) {
            if (event) {
                event.preventDefault();
            }

            var linkedLocusId = this.model.get('linkedLocusId');
            this.dispatcher.trigger(AppEventNamesEnum.goToLocusWithId, linkedLocusId);
        },
        goToCheckIn: function (event) {
            var currentContext = this;
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.goToCheckIn, currentContext.model);
        },
        goToCheckOut: function (event) {
            var currentContext = this;
            if (event) {
                event.preventDefault();
            }

            this.dispatcher.trigger(AppEventNamesEnum.goToCheckOut, currentContext.userOpenEntryLog);
        },
        goToLocusWithId: function (event) {
            if (event) {
                event.preventDefault();
            }

            this.dispatcher.trigger(AppEventNamesEnum.goToLocusWithId);
        },
        goToDirectionsWithLatLng: function (event) {
            if (event) {
                event.preventDefault();
            }

            var latitude = this.model.get('latitude');
            var longitude = this.model.get('longitude');
            this.dispatcher.trigger(AppEventNamesEnum.goToDirectionsWithLatLng, latitude, longitude);
        },
        onLoaded: function () {
            var currentContext = this;

            currentContext.entryLogListViewInstance = new EntryLogListView({
                controller: currentContext.controller,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.entryLogCollection,
                showLocus: false,
                showIdentity: true
            });
            currentContext.appendChildTo(currentContext.entryLogListViewInstance, '#entry-log-list-view-container');

            var options = {
                locusId: currentContext.model.get('locusId')
            };

            currentContext.entryLogListViewInstance.showLoading();
            currentContext.dispatcher.trigger(AppEventNamesEnum.refreshEntryLogList, currentContext.entryLogCollection, options);
        },
        onLeave: function () {
            console.trace('LocusView.onLeave');
        }
    });

    return LocusView;

});