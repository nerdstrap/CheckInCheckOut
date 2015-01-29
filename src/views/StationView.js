define(function (require) {

    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        template = require('hbs!templates/Station');

    var StationView = BaseView.extend({
        initialize: function (options) {
            console.trace('StationView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.model, 'reset', this.updateViewFromModel);
            this.listenTo(this.model, 'error', this.resetView);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('StationView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click .directions-link': 'goToDirectionsWithLatLng'
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
            this.$('.station-id-label').attr('data-station-id', this.model.get('stationId')).html(this.model.get('stationName'));
            this.$('.directions-link').attr('data-latitude', this.model.get('latitude')).attr('data-longitude', this.model.get('longitude'));
            this.$('.region-name-label').html(this.model.get('regionName'));
            this.$('.area-name-label').html(this.model.get('areaName'));
        },
        resetView: function () {
            this.$('.station-id-label').attr('data-station-id', '').html('');
            this.$('.directions-link').attr('data-latitude', '').attr('data-longitude', '');
            this.$('.region-name-label').html('');
            this.$('.area-name-label').html('');
        },
        onLeave: function () {
            console.trace('StationView.onLeave');
        }
    });

    return StationView;

});