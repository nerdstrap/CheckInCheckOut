define(function (require) {

    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        CompositeView = require('views/CompositeView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        utils = require('utils'),
        template = require('hbs!templates/StationListItem');

    var StationListItemView = CompositeView.extend({
        initialize: function (options) {
            console.trace('StationListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.model, 'reset', this.updateViewFromModel);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('StationListItemView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            this.updateViewFromModel();

            return this;
        },
        events: {
            'click .go-to-station-button': 'goToStationWithId',
            'click .go-to-directions-button': 'goToDirectionsWithLatLng'
        },
        updateViewFromModel: function () {
            if (this.model.has('stationName')) {
                this.$('.go-to-station-button').html(this.model.get('stationName'));
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
            if (this.model.has('hasHazard') && this.model.get('hasHazard') === "true") {
                this.$('.go-to-station-button').parent().append('<i class="fa fa-warning"></i>');
            }
            if (this.model.has('hasOpenCheckIns') && this.model.get('hasOpenCheckIns') === "true") {
                this.$('.go-to-station-button').parent().append('<i class="fa fa-user-plus"></i>');
            }
            if (this.model.has('linkedStationId')) {
                this.$('.go-to-station-button').parent().append('<i class="fa fa-arrows-h"></i>');
            }
        },
        goToStationWithId: function (event) {
            if (event) {
                event.preventDefault();
            }

            var stationId = this.model.get('stationId');
            this.dispatcher.trigger(AppEventNamesEnum.goToStationWithId, stationId);
        },
        goToDirectionsWithLatLng: function (event) {
            if (event) {
                event.preventDefault();
            }

            var latitude = this.model.get('latitude');
            var longitude = this.model.get('longitude');
            this.dispatcher.trigger(AppEventNamesEnum.goToDirectionsWithLatLng, latitude, longitude);
        },
        onLeave: function () {
            console.trace('StationListItemView.onLeave');
        }
    });

    return StationListItemView;

});