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
            this.showPosition = options.showPosition;

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
            if (this.model.has('locusName')) {
                this.$('.go-to-locus-button').html(this.model.get('locusName'));
            }
            if (this.showLocus) {
                this.$('.go-to-locus-button').removeClass('hidden');
            } else {
                this.$('.go-to-locus-button').addClass('hidden');
            }

            if (this.model.has('identityName')) {
                this.$('.go-to-identity-button').attr('data-identity-id', this.model.get('identityId')).html(this.model.get('identityName'));
            }
            if (this.showIdentity) {
                this.$('.go-to-identity-button').removeClass('hidden');
            } else {
                this.$('.go-to-identity-button').addClass('hidden');
            }

            if (this.model.has('distance')) {
                this.$('.distance-label').html(utils.formatString(utils.getResource('distanceFormatString'), [this.model.get('distance')]));
            } else {
                this.$('.distance-label').html(utils.getResource('distanceUnknownErrorMessage'));
            }
            if (this.model.has('latitude') && this.model.has('longitude')) {
                this.hasCoordinates = true;
                this.$('.go-to-directions-button').attr('data-latitude', this.model.get('latitude')).attr('data-longitude', this.model.get('longitude'));
            } else {
                this.hasCoordinates = false;
                this.$('.go-to-directions-button').addClass('hidden');
            }
            if (this.showPosition) {
                this.$('.distance-label').removeClass('hidden');
                if (this.hasCoordinates) {
                    this.$('.go-to-directions-button').removeClass('hidden');
                }
            }
            else {
                this.$('.distance-label').addClass('hidden');
                this.$('.go-to-directions-button').addClass('hidden');
            }

            if (this.model.has('purpose')) {
                this.$('.purpose-label').html(this.model.get('purpose'));
            }
            if (this.model.has('duration')) {
                this.$('.duration-label').html(this.model.get('duration'));
            }
            if (this.model.has('inTime')) {
                this.$('.in-time-label').html(handlebarsHelpers.formatDateWithDefault(this.model.get('inTime'), 'dd-mm-YYYY hh:mm', '&nbsp;'));
            }
            if (this.model.has('outTime')) {
                this.$('.out-time-label').html(handlebarsHelpers.formatDateWithDefault(this.model.get('outTime'), 'dd-mm-YYYY hh:mm', '&nbsp;'));
            }
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