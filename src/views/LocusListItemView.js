define(function (require) {

    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        CompositeView = require('views/CompositeView'),
        EventNamesEnum = require('enums/EventNamesEnum'),
        utils = require('utils'),
        template = require('hbs!templates/LocusListItemView');

    var LocusListItemView = CompositeView.extend({
        /**
         *
         */
        tagName: 'li',

        /**
         *
         */
        className: 'locus-list-item-view',

        /**
         *
         * @param options
         */
        initialize: function (options) {
            console.trace('LocusListItemView.initialize');
            options || (options = {});
            this.controller = options.controller;
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.model, 'reset', this.updateViewFromModel);
            this.listenTo(this, 'leave', this.onLeave);
        },

        /**
         *
         * @returns {LocusListItemView}
         */
        render: function () {
            console.trace('LocusListItemView.render()');
            var currentContext = this;
            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));
            this.updateViewFromModel();
            return this;
        },

        /**
         *
         */
        events: {
            'click .go-to-locus-button': 'goToLocus',
            'click .go-to-directions-button': 'goToDirections'
        },

        /**
         *
         * @returns {LocusListItemView}
         */
        updateViewFromModel: function () {
            var currentContext = this;

            var locusName;
            if (currentContext.model.has('locusName')) {
                locusName = currentContext.model.get('locusName');
            }
            currentContext.$('.locus-name-label').html(locusName);

            var formattedDistance;
            if (currentContext.model.has('distance') && currentContext.model.has('latitude') && currentContext.model.has('longitude')) {
                currentContext.hasCoordinates = true;
                var distance = currentContext.model.get('distance').toFixed(0);
                formattedDistance = utils.formatString(utils.getResource('distanceFormatString'), [distance]);
            } else {
                formattedDistance = utils.getResource('coordinatesUnavailableErrorMessage');
            }
            currentContext.$('.distance-label').html(formattedDistance);

            return this;
        },

        /**
         *
         * @param event
         * @returns {LocusListItemView}
         */
        goToLocus: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            var locusId = this.model.get('locusId');
            currentContext.dispatcher.trigger(EventNamesEnum.goToLocusWithId, locusId);
            return this;
        },

        /**
         *
         * @param event
         * @returns {LocusListItemView}
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
         */
        onLeave: function () {
            var currentContext = this;
            console.trace('LocusListItemView.onLeave');
        }
    });

    return LocusListItemView;

});