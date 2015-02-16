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
        template = require('hbs!templates/Identity');

    var IdentityView = BaseView.extend({
        initialize: function (options) {
            console.trace('IdentityView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.entryLogCollection = new EntryLogCollection();

            this.listenTo(this.model, 'reset', this.updateViewFromModel);
            this.listenTo(this.entryLogCollection, 'reset', this.updateEntryLogStatusView);
            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('IdentityView.render()');
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
            'click .go-to-linked-identity-button': 'goToLinkedIdentityWithId',
            'click .check-in-button': 'goToCheckIn',
            'click .check-out-button': 'goToCheckOut',
            'click .edit-check-in-button': 'goToEditCheckIn',
            'click .go-to-entry-log-with-id': 'goToIdentityWithId',
            'click .go-to-directions-button': 'goToDirectionsWithLatLng'
        },
        updateViewFromModel: function () {
            if (this.model.has('identityName')) {
                this.$('.identity-name-label').html(this.model.get('identityName'));
            }
            if (this.model.has('linkedIdentityId')) {
                this.$('.linked-identity-view').removeClass('hidden');
                this.$('.go-to-linked-identity-button').attr('data-linked-identity-id', this.model.get('linkedIdentityId')).html(this.model.get('linkedIdentityName'));
            } else {
                this.$('.linked-identity-view').addClass('hidden');
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
            //    this.$('.identity-name-label').parent().append('<i class="fa fa-warning"></i>');
            //}
            //if (this.model.has('hasOpenCheckIns') && this.model.get('hasOpenCheckIns') === "true") {
            //    this.$('.identity-name-label').parent().append('<i class="fa fa-user-plus"></i>');
            //}
            //if (this.model.has('linkedIdentityId')) {
            //    this.$('.identity-name-label').parent().append('<i class="fa fa-arrows-h"></i>');
            //}
        },
        updateEntryLogStatusView: function () {
            var currentContext = this;
            var userOpenEntryLog = currentContext.entryLogCollection.find(function (entryLog) {
                return entryLog.get('identityId') === currentContext.userId && !entryLog.hasOwnProperty('outTime');
            });

            if (userOpenEntryLog) {
                this.showCheckOutButton();
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
                this.$('.check-out-button').addClass('hidden');
                this.$('.edit-check-in-button').addClass('hidden');
                this.$('.go-to-entry-log-button').addClass('hidden');
            }
        },
        showCheckOutButton: function () {
            if (this.model.has('hasHazard') && this.model.get('hasHazard') === 'true') {
                this.showHazardView();
            } else {
                this.$('.entry-log-status-loading-view').addClass('hidden');
                this.$('.check-in-button').addClass('hidden');
                this.$('.check-out-button').removeClass('hidden');
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
        goToLinkedIdentityWithId: function (event) {
            if (event) {
                event.preventDefault();
            }

            var linkedIdentityId = this.model.get('linkedIdentityId');
            this.dispatcher.trigger(AppEventNamesEnum.goToIdentityWithId, linkedIdentityId);
        },
        goToCheckIn: function (event) {
            if (event) {
                event.preventDefault();
            }
        },
        goToCheckOut: function (event) {
            if (event) {
                event.preventDefault();
            }
        },
        goToEditCheckIn: function (event) {
            if (event) {
                event.preventDefault();
            }
        },
        goToIdentityWithId: function (event) {
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
                identityId: this.model.get('identityId')
            };

            this.dispatcher.trigger(AppEventNamesEnum.refreshEntryLogList, this.entryLogCollection, options);
        },
        onLeave: function () {
            console.trace('IdentityView.onLeave');
        }
    });

    return IdentityView;

});