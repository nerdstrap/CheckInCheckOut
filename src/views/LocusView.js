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

            this.listenTo(this.model, 'change', this.updateViewFromModel);
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

            currentContext.entryLogListViewInstance = new EntryLogListView({
                controller: currentContext.controller,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.entryLogCollection
            });
            this.appendChildTo(currentContext.entryLogListViewInstance, '#entry-log-list-view-container');

            return this;
        },
        events: {
            'click .go-to-linked-locus-button': 'goToLinkedLocusWithId',
            'click .check-in-button': 'goToCheckIn',
            'click .check-out-button': 'goToCheckOut',
            'click .edit-check-in-button': 'goToEditCheckIn',
            'click .go-to-entry-log-with-id': 'goToLocusWithId',
            'click .go-to-directions-button': 'goToDirectionsWithLatLng'
        },
        updateViewFromModel: function () {
            if (this.model.has('locusName')) {
                this.$('.locus-name-label').html(this.model.get('locusName'));
            }
            if (this.model.has('linkedLocusId')) {
                this.$('.linked-locus-view').removeClass('hidden');
                this.$('.go-to-linked-locus-button').attr('data-linked-locus-id', this.model.get('linkedLocusId')).html(this.model.get('linkedLocusName'));
            } else {
                this.$('.linked-locus-view').addClass('hidden');
            }
            if (this.model.has('distance')) {
                this.$('.distance-label').html(utils.formatString(utils.getResource('distanceFormatString'), [this.model.get('distance')]));
            } else {
                this.$('.distance-label').html(utils.getResource('distanceUnknownErrorMessage'));
            }
            if (this.model.has('latitude') && this.model.has('longitude')) {
                this.$('.directions-unavailable-label').addClass('hidden');
                this.$('.go-to-directions-button').removeClass('hidden').attr('data-latitude', this.model.get('latitude')).attr('data-longitude', this.model.get('longitude'));
            } else {
                this.$('.go-to-directions-button').addClass('hidden');
                this.$('.directions-unavailable-label').removeClass('hidden');
            }
            //if (this.model.has('hasHazard') && this.model.get('hasHazard') === "true") {
            //    this.$('.locus-name-label').parent().append('<i class="fa fa-warning"></i>');
            //}
            //if (this.model.has('hasOpenCheckIns') && this.model.get('hasOpenCheckIns') === "true") {
            //    this.$('.locus-name-label').parent().append('<i class="fa fa-user-plus"></i>');
            //}
            //if (this.model.has('linkedLocusId')) {
            //    this.$('.locus-name-label').parent().append('<i class="fa fa-arrows-h"></i>');
            //}
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
        showCheckInButton: function () {
            if (this.model.has('hasHazard') && this.model.get('hasHazard') === 'true') {
                this.showHazardView();
            } else {
                this.$('.entry-log-status-loading-view').addClass('hidden');
                this.$('.check-in-button').removeClass('hidden');
                this.$('.check-out-button').removeAttr('data-entry-log-id').addClass('hidden');
                this.$('.edit-check-in-button').addClass('hidden');
                this.$('.go-to-entry-log-button').addClass('hidden');
            }
        },
        showCheckOutButton: function (entryLogModel) {
            if (this.model.has('hasHazard') && this.model.get('hasHazard') === 'true') {
                this.showHazardView();
            } else {
                this.$('.entry-log-status-loading-view').addClass('hidden');
                this.$('.check-in-button').addClass('hidden');
                this.$('.check-out-button').attr('data-entry-log-id', entryLogModel.get('entryLogId')).removeClass('hidden');
                this.$('.edit-check-in-button').removeClass('hidden');
                this.$('.go-to-entry-log-button').addClass('hidden');
            }
        },
        showGoToEntryLogButton: function () {
            if (this.model.has('hasHazard') && this.model.get('hasHazard') === 'true') {
                this.showHazardView();
            } else {
                this.$('.entry-log-status-loading-view').addClass('hidden');
                this.$('.check-in-button').addClass('hidden');
                this.$('.check-out-button').addClass('hidden');
                this.$('.edit-check-in-button').addClass('hidden');
                this.$('.go-to-entry-log-button').removeClass('hidden');
            }
        },
        showHazardView: function () {
            if (this.model.has('hasHazard') && this.model.get('hasHazard') === 'true') {
                this.$('.hazard-view').removeClass('hidden');
                this.$('.entry-log-status-view').addClass('hidden');
            } else {
                this.$('.hazard-view').addClass('hidden');
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
        goToEditCheckIn: function (event) {
            if (event) {
                event.preventDefault();
            }
        },
        goToLocusWithId: function (event) {
            if (event) {
                event.preventDefault();
            }
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
            this.entryLogListViewInstance.showLoading();

            var options = {
                locusId: this.model.get('locusId')
            };

            this.dispatcher.trigger(AppEventNamesEnum.refreshEntryLogList, this.entryLogCollection, options);
        },
        onLeave: function () {
            console.trace('LocusView.onLeave');
        }
    });

    return LocusView;

});