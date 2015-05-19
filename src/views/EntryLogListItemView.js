define(function (require) {

    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        CompositeView = require('views/CompositeView'),
        EventNamesEnum = require('enums/EventNamesEnum'),
        utils = require('utils'),
        template = require('hbs!templates/EntryLogListItemView');

    var EntryLogListItemView = CompositeView.extend({
        /**
         *
         */
        tagName: 'li',

        /**
         *
         */
        className: 'entry-log-list-item-view',

        /**
         *
         */
        showIdentity: true,

        /**
         *
         */
        showLocus: false,

        /**
         *
         * @param options
         */
        initialize: function (options) {
            console.trace('EntryLogListItemView.initialize');
            options || (options = {});
            this.controller = options.controller;
            this.dispatcher = options.dispatcher || this;

            if (options.showIdentity) {
                this.showIdentity = options.showIdentity;
            }

            if (options.showLocus) {
                this.showLocus = options.showLocus;
            }

            this.listenTo(this.model, 'change', this.updateViewFromModel);
            this.listenTo(this, 'leave', this.onLeave);
        },

        /**
         *
         * @returns {EntryLogListItemView}
         */
        render: function () {
            console.trace('EntryLogListItemView.render()');
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
            'click .go-to-item-button': 'goToItem'
        },

        /**
         *
         * @returns {EntryLogListItemView}
         */
        updateViewFromModel: function () {
            var currentContext = this;

            var identityFullName;
            if (currentContext.model.has('identityFullName')) {
                identityFullName = currentContext.model.get('identityFullName');
            }
            currentContext.$('.identity-name-label').html(identityFullName);

            var locusName;
            if (currentContext.model.has('locusName')) {
                locusName = currentContext.model.get('locusName');
            }
            currentContext.$('.locus-name-label').html(locusName);

            if (currentContext.showIdentity) {
                currentContext.$('.identity-avatar').removeClass('hidden');
                currentContext.$('.identity-name-label').removeClass('hidden');
                currentContext.$('.locus-avatar').addClass('hidden');
                currentContext.$('.locus-name-label').addClass('hidden');
            } else {
                currentContext.$('.identity-avatar').addClass('hidden');
                currentContext.$('.identity-name-label').addClass('hidden');
                currentContext.$('.locus-avatar').removeClass('hidden');
                currentContext.$('.locus-name-label').removeClass('hidden');
            }

            var formattedDistance;
            if (currentContext.model.has('distance') && currentContext.model.has('latitude') && currentContext.model.has('longitude')) {
                currentContext.hasCoordinates = true;
                var distance = currentContext.model.get('distance').toFixed(0);
                formattedDistance = utils.formatString(utils.getResource('distanceFormatString'), [distance]);
            } else {
                formattedDistance = utils.getResource('coordinatesUnavailableErrorMessage');
            }
            currentContext.$('.distance-label').html(formattedDistance);
            
            var purpose;
            if (currentContext.model.has('purpose')) {
                purpose = currentContext.model.get('purpose');
            }
            currentContext.$('.purpose-label').html(purpose);

            var inTime;
            var inTimeFormatted;
            var duration;
            var outTime;
            var outTimeFormatted;
            if (currentContext.model.has('inTime')) {
                inTime = currentContext.model.get('inTime');
                inTimeFormatted = utils.formatDate(inTime);
                currentContext.$('.in-time-label').html(inTimeFormatted);
                if (currentContext.model.has('outTime')) {
                    outTime = currentContext.model.get('outTime');
                    outTimeFormatted = utils.formatDate(outTime);
                    currentContext.$('.out-time-label').html(outTimeFormatted);
                } else {
                    if (currentContext.model.has('duration')) {
                        duration = currentContext.model.get('duration');
                        outTime = utils.addMinutes(inTime, duration);
                        outTimeFormatted = utils.formatDate(outTime);
                        currentContext.$('.out-time-label').html('est. ' + outTimeFormatted);
                    }
                }
            }

            return this;
        },

        /**
         *
         * @param event
         * @returns {EntryLogListItemView}
         */
        goToItem: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            if (currentContext.showIdentity) {
                var identityId = currentContext.model.get('identityId');
                currentContext.dispatcher.trigger(EventNamesEnum.goToIdentityWithId, identityId);
            } else {
                var locusId = currentContext.model.get('locusId');
                currentContext.dispatcher.trigger(EventNamesEnum.goToLocusWithId, locusId);
            }
            return this;
        },

        /**
         *
         */
        onLoaded: function () {
            var currentContext = this;
        },

        /**
         *
         */
        onLeave: function () {
            var currentContext = this;
            console.trace('EntryLogListItemView.onLeave');
        }
    });

    return EntryLogListItemView;
});
