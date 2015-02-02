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
            if (this.model.has('stationName')) {
                this.$('.station-name-label').html(this.model.get('stationName'));
            }
            if (this.model.has('distance')) {
                this.$('.distance-label').html(this.model.get('distance'));
            }
            if (this.model.has('latitude') && this.model.has('longitude')) {

                this.$('.directions-link').attr('data-latitude', this.model.get('latitude')).attr('data-longitude', this.model.get('longitude'));
            }
        },
        onLeave: function () {
            console.trace('StationView.onLeave');
        }
    });

    return StationView;

});