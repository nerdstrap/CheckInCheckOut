define(function (require) {

    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        StationEntryLogCollection = require('collections/StationEntryLogCollection'),
        StationEntryLogListView = require('views/StationEntryLogListView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        utils = require('utils'),
        template = require('hbs!templates/Station');

    var StationView = BaseView.extend({
        initialize: function (options) {
            console.trace('StationView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.model, 'reset', this.updateViewFromModel);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('StationView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            currentContext.stationEntryLogCollection = new StationEntryLogCollection();
            currentContext.stationEntryLogListViewInstance = new StationEntryLogListView({
                controller: currentContext.controller,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.stationEntryLogCollection
            });
            this.appendChildTo(currentContext.stationEntryLogListViewInstance, '#station-entry-log-list-view-container');

            return this;
        },
        events: {
            'click .go-to-linked-station-button': 'goToLinkedStationWithId',
            'click .go-to-directions-button': 'goToDirectionsWithLatLng'
        },
        goToLinkedStationWithId: function (event) {
            if (event) {
                event.preventDefault();
            }

            var linkedStationId = this.model.get('linkedStationId');
            this.dispatcher.trigger(AppEventNamesEnum.goToStationWithId, linkedStationId);
        },
        goToDirectionsWithLatLng: function (event) {
            if (event) {
                event.preventDefault();
            }

            var latitude = this.model.get('latitude');
            var longitude = this.model.get('longitude');
            this.dispatcher.trigger(AppEventNamesEnum.goToDirectionsWithLatLng, latitude, longitude);
        },
        updateViewFromModel: function () {
            if (this.model.has('stationName')) {
                this.$('.station-name-label').html(this.model.get('stationName'));
            }
            if (this.model.has('linkedStationId')) {
                this.$('.linked-station-view').removeClass('hidden');
                this.$('.go-to-linked-station-button').attr('data-linked-station-id', this.model.get('linkedStationId')).html(this.model.get('linkedStationName'));
            } else {
                this.$('.linked-station-view').addClass('hidden');
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
            //    this.$('.station-name-label').parent().append('<i class="fa fa-warning"></i>');
            //}
            //if (this.model.has('hasOpenCheckIns') && this.model.get('hasOpenCheckIns') === "true") {
            //    this.$('.station-name-label').parent().append('<i class="fa fa-user-plus"></i>');
            //}
            //if (this.model.has('linkedStationId')) {
            //    this.$('.station-name-label').parent().append('<i class="fa fa-arrows-h"></i>');
            //}
        },
        onLeave: function () {
            console.trace('StationView.onLeave');
        }
    });

    return StationView;

});