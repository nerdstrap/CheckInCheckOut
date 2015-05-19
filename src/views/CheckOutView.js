define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        validation = require('backbone.validation'),
        BaseView = require('views/BaseView'),
        EventNamesEnum = require('enums/EventNamesEnum'),
        globals = require('globals'),
        env = require('env'),
        utils = require('utils'),
        optionTemplate = require('hbs!templates/Option'),
        template = require('hbs!templates/CheckOutView');

    var CheckOutView = BaseView.extend({
        /**
         *
         */
        tagName: 'div',

        /**
         *
         */
        className: 'check-out-view',

        /**
         *
         * @param options
         */
        initialize: function (options) {
            console.trace('CheckOutView.initialize');
            options || (options = {});
            this.controller = options.controller;
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.dispatcher, EventNamesEnum.checkOutSuccess, this.onCheckOutSuccess);
            this.listenTo(this.model, 'validated', this.onValidated);
            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },

        /**
         *
         * @returns {CheckOutView}
         */
        render: function () {
            console.trace('CheckOutView.render()');
            var currentContext = this;
            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model);
            currentContext.$el.html(template(renderModel));
            return this;
        },

        /**
         *
         */
        events: {
            'change #duration-input': 'durationChanged',
            'click #cancel-check-out-button': 'cancelCheckOut',
            'click #submit-check-out-button': 'submitCheckOut'
        },

        /**
         *
         * @returns {CheckOutView}
         */
        bindValidation: function() {
            var currentContext = this;
            validation.bind(this, {
                selector: 'name'
            });
            return this;
        },

        /**
         *
         * @returns {CheckOutView}
         */
        updateViewFromModel: function () {
            var currentContext = this;
            var locusId;
            if (currentContext.model.has('locusId')) {
                locusId = currentContext.model.get('locusId');
            }
            var locusName;
            if (currentContext.model.has('locusName')) {
                locusName = currentContext.model.get('locusName');
            }
            currentContext.$('#locus-name-label').attr('data-locus-id', locusId).html(locusName);

            var formattedDistance;
            if (currentContext.model.has('distance') && currentContext.model.has('latitude') && currentContext.model.has('longitude')) {
                currentContext.hasCoordinates = true;
                var distance = currentContext.model.get('distance').toFixed(0);
                formattedDistance = utils.formatString(utils.getResource('distanceFormatString'), [distance]);
            } else {
                formattedDistance = utils.getResource('coordinatesUnavailableErrorMessage');
            }
            currentContext.$('#distance-label').html(formattedDistance);

            var formattedContactNumber;
            if (currentContext.model.has('contactNumber')) {
                var contactNumber = currentContext.model.get('contactNumber');
                var cleanedContactNumber = utils.cleanPhone(contactNumber);
                formattedContactNumber = utils.formatPhone(cleanedContactNumber);
            }
            currentContext.$('#contact-number-label').val(formattedContactNumber);

            var email;
            if (currentContext.model.has('email')) {
                email = currentContext.model.get('email');
            }
            currentContext.$('#email-label').val(email);

            var purpose;
            if (currentContext.model.has('purpose')) {
                purpose = currentContext.model.get('purpose');
            }
            currentContext.$('#purpose-label').val(purpose);

            var duration;
            if (currentContext.model.has('duration')) {
                duration = currentContext.model.get('duration');
            }
            currentContext.$('#duration-input').val(duration);

            var additionalInfo;
            if (currentContext.model.has('additionalInfo')) {
                additionalInfo = currentContext.model.get('additionalInfo');
            }
            currentContext.$('#additional-info-input').val(additionalInfo);

            return this;
        },

        /**
         *
         * @param event
         * @returns {CheckOutView}
         */
        durationChanged: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            var duration = this.$('#duration-input').val();
            this.manualDurationEntry = true;
            return this;
        },

        /**
         *
         * @param event
         * @returns {CheckOutView}
         */
        validateModelAndCheckOut: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            this.updateModelFromView();
            this.model.validate();
            return this;
        },

        /**
         *
         * @returns {CheckOutView}
         */
        updateModelFromView: function () {
            var currentContext = this;
            var attributes = {};

            attributes.additionalInfo = this.$('#additional-info-input').val();

            this.model.set(attributes);
            return this;
        },

        /**
         *
         * @param isValid
         * @param model
         * @param errors
         * @returns {CheckOutView}
         */
        onValidated: function(isValid, model, errors) {
            var currentContext = this;

            currentContext.$('.validate').each(function() {
                $(this).parent().parent().removeClass('invalid');
            });

            if (isValid) {
                this.dispatchCheckOut();
            } else {
                for(var error in errors) {
                    currentContext.$('[name="' + error + '"]').parent().parent().addClass('invalid');
                }
            }
            return this;
        },

        /**
         *
         * @param event
         * @returns {CheckOutView}
         */
        cancelCheckOut: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            var locusId = this.model.get('locusId');
            this.dispatcher.trigger(EventNamesEnum.goToLocusWithId, locusId);
            return this;
        },

        /**
         *
         * @param event
         * @returns {CheckOutView}
         */
        dispatchCheckOut: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            this.dispatcher.trigger(EventNamesEnum.checkOut, this.model);
            return this;
        },

        /**
         *
         * @returns {CheckOutView}
         */
        onCheckOutSuccess: function() {
            var currentContext = this;
            var locusId = this.model.get('locusId');
            this.dispatcher.trigger(EventNamesEnum.goToLocusWithId, locusId);
            return this;
        },

        /**
         *
         */
        onLeave: function () {
            var currentContext = this;
            console.trace('LocusSearchView.onLeave');
        }
    });

    return CheckOutView;
});
