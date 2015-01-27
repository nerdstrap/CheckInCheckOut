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

            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('StationView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model.attributes);
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
        onLeave: function () {
            console.trace('StationView.onLeave');
        }
    });

    return StationView;

});