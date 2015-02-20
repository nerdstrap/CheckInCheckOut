define(function (require) {

    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        CompositeView = require('views/CompositeView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        utils = require('utils'),
        template = require('hbs!templates/LocusListItem');

    var LocusListItemView = CompositeView.extend({
        initialize: function (options) {
            console.trace('LocusListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.model, 'reset', this.updateViewFromModel);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('LocusListItemView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            this.updateViewFromModel();

            return this;
        },
        events: {
            'click .go-to-locus-button': 'goToLocusWithId',
            'click .go-to-directions-button': 'goToDirectionsWithLatLng'
        },
        updateViewFromModel: function () {
            var currentContext = this;

            var locusName;
            if (currentContext.model.has('locusName')) {
                locusName = currentContext.model.get('locusName');
            }
            currentContext.$('.go-to-locus-button').html(locusName);

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
                currentContext.$('.distance-label').html(formattedDistance);
                currentContext.$('.go-to-directions-button').attr('data-latitude', latitude).attr('data-longitude', longitude);
                currentContext.$('.coordinates-unavailable-container').addClass('hidden');
                currentContext.$('.coordinates-container').removeClass('hidden');
            } else {
                currentContext.$('.go-to-directions-button').addClass('hidden');
                currentContext.$('.coordinates-unavailable-container').removeClass('hidden');
                currentContext.$('.coordinates-container').addClass('hidden');
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
                currentContext.$('.phone-label').html(formattedLocusPhone);
                currentContext.$('.call-phone-button').attr('href', 'tel:' + cleanedLocusPhone);
                currentContext.$('.phone-container').removeClass('hidden');
            } else {
                currentContext.$('.phone-container').addClass('hidden');
            }
        },
        goToLocusWithId: function (event) {
            if (event) {
                event.preventDefault();
            }

            var locusId = this.model.get('locusId');
            this.dispatcher.trigger(AppEventNamesEnum.goToLocusWithId, locusId);
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
            console.trace('LocusListItemView.onLeave');
        }
    });

    return LocusListItemView;

});