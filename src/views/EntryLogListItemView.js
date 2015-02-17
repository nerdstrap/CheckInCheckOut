define(function (require) {

    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        CompositeView = require('views/CompositeView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        utils = require('utils'),
        handlebarsHelpers = require('handlebars.helpers'),
        template = require('hbs!templates/EntryLogListItem');

    var EntryLogListItemView = CompositeView.extend({
        initialize: function (options) {
            console.trace('EntryLogListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.showLocus = options.showLocus;
            this.showIdentity = options.showIdentity;

            this.listenTo(this.model, 'change', this.updateViewFromModel);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('EntryLogListItemView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            this.updateViewFromModel();

            return this;
        },
        events: {
            'click .go-to-locus-button': 'goToLocusWithId',
            'click .go-to-identity-button': 'goToIdentityWithId',
            'click .go-to-directions-button': 'goToDirectionsWithLatLng'
        },
        updateViewFromModel: function () {
            var currentContext = this;

            if (currentContext.showLocus) {
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
                    formattedDistance = utils.formatString(utils.getResource('distanceFormatString'), [distance]);
                    latitude = currentContext.model.get('latitude');
                    longitude = currentContext.model.get('longitude');
                }
                if (currentContext.hasCoordinates) {
                    currentContext.$('.coordinates-unavailable-label').addClass('hidden');
                    currentContext.$('.go-to-directions-button').attr('data-latitude', latitude).attr('data-longitude', longitude).removeClass('hidden');
                } else {
                    currentContext.$('.coordinates-unavailable-label').removeClass('hidden');
                    currentContext.$('.go-to-directions-button').addClass('hidden');
                }
                currentContext.$('.locus-container').removeClass('hidden');
            } else {
                currentContext.$('.locus-container').addClass('hidden');
            }

            if (currentContext.showIdentity) {
                var identityName;
                if (currentContext.model.has('identityName')) {
                    identityName = currentContext.model.get('identityName');
                }
                currentContext.$('.go-to-identity-button').html(identityName);

                var cleanedContactNumber;
                var formattedContactNumber;
                if (currentContext.model.has('contactNumber')) {
                    currentContext.hasContactNumber = true;
                    var contactNumber = currentContext.model.get('contactNumber');
                    cleanedContactNumber = utils.cleanPhone(contactNumber);
                    formattedContactNumber = utils.formatPhone(cleanedContactNumber);
                }
                if (currentContext.hasContactNumber) {
                    currentContext.$('.message-contact-number-button').attr('href', 'sms:' + cleanedContactNumber).removeClass('hidden');
                    currentContext.$('.call-contact-number-button').attr('href', 'tel:' + cleanedContactNumber).removeClass('hidden');
                } else {
                    currentContext.$('.message-contact-number-button').addClass('hidden');
                    currentContext.$('.call-contact-number-button').addClass('hidden');
                }
                currentContext.$('.identity-container').removeClass('hidden');
            } else {
                currentContext.$('.identity-container').addClass('hidden');
            }

            var purpose;
            if (this.model.has('purpose')) {
                purpose = this.model.get('purpose');
            }
            this.$('.purpose-label').html(purpose);

            var inTime;
            var inTimeFormatted;
            var duration;
            var outTime;
            var outTimeFormatted;
            if (this.model.has('inTime')) {
                inTime = this.model.get('inTime');
                inTimeFormatted = utils.formatDate(inTime);
                if (this.model.has('outTime')) {
                    outTime = this.model.get('outTime');
                    outTimeFormatted = utils.formatDate(outTime);
                } else {
                    if (this.model.has('duration')) {
                        duration = this.model.get('duration');
                        outTime = utils.addMinutes(inTime, duration);
                        outTimeFormatted = 'Estimated Check-out: ' + utils.formatDate(outTime);
                    }
                }
            }
            this.$('.in-time-label').html(inTimeFormatted);
            this.$('.out-time-label').html(outTimeFormatted);
        },
        goToLocusWithId: function (event) {
            if (event) {
                event.preventDefault();
            }

            var locusId = this.model.get('locusId');
            this.dispatcher.trigger(AppEventNamesEnum.goToLocusWithId, locusId);
        },
        goToIdentityWithId: function (event) {
            if (event) {
                event.preventDefault();
            }

            var identityId = this.model.get('identityId');
            this.dispatcher.trigger(AppEventNamesEnum.goToIdentityWithId, identityId);
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
            console.trace('EntryLogListItemView.onLeave');
        }
    });

    return EntryLogListItemView;

});