    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var validation = require('backbone.validation');
    var BaseView = require('views/BaseView');
    var EventNamesEnum = require('enums/EventNamesEnum');
    var env = require('env');
    var utils = require('utils');
    var optionTemplate = require('hbs!templates/Option');
    var template = require('hbs!templates/CheckOutView');

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
         */
        loadingIconContainerId: 'check-out-view-loading-icon-container',

        /**
         *
         */
        alertsContainerId: 'check-out-view-alerts-container',

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
            currentContext.bindValidation();
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
            var duration = currentContext.$('#duration-input').val();
            currentContext.manualDurationEntry = true;
            return this;
        },

        /**
         *
         * @param event
         * @returns {CheckOutView}
         */
        submitCheckOut: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.updateModelFromView();
            currentContext.model.validate();
            return this;
        },

        /**
         *
         * @returns {CheckOutView}
         */
        updateModelFromView: function () {
            var currentContext = this;
            var attributes = {};

            attributes.additionalInfo = currentContext.$('#additional-info-input').val();

            currentContext.model.set(attributes);
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
                currentContext.checkOut();
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
            var locusId = currentContext.model.get('locusId');
            currentContext.dispatcher.trigger(EventNamesEnum.goToLocusWithId, locusId);
            return this;
        },

        /**
         *
         * @param event
         * @returns {CheckOutView}
         */
        checkOut: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.dispatcher.trigger(EventNamesEnum.checkOut, currentContext.model);
            return this;
        },

        /**
         *
         * @returns {CheckOutView}
         */
        onCheckOutSuccess: function() {
            var currentContext = this;
            var locusId = currentContext.model.get('locusId');
            currentContext.dispatcher.trigger(EventNamesEnum.goToLocusWithId, locusId);
            return this;
        },

        /**
         *
         * @returns {CheckOutView}
         */
        showLoading: function () {
            var currentContext = this;
            currentContext.$(currentContext.loadingIconContainerId).removeClass('hidden');
            return this;
        },

        /**
         *
         * @returns {CheckOutView}
         */
        hideLoading: function () {
            var currentContext = this;
            currentContext.$(currentContext.loadingIconContainerId).addClass('hidden');
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

    module.exports = CheckOutView;
