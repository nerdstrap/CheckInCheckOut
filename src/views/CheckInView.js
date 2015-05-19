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
        template = require('hbs!templates/CheckInView');

    var CheckInView = BaseView.extend({
        /**
         *
         */
        tagName: 'div',

        /**
         *
         */
        className: 'check-in-view',

        /**
         *
         */
        loadingIconContainerId: 'check-in-view-loading-icon-container',

        /**
         *
         */
        alertsContainerId: 'check-in-view-alerts-container',

        /**
         *
         * @param options
         */
        initialize: function (options) {
            console.trace('CheckInView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.locusModel = options.locusModel;

            this.listenTo(this.dispatcher, EventNamesEnum.checkInSuccess, this.onCheckInSuccess);
            this.listenTo(this.model, 'validated', this.onValidated);
            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },

        /**
         *
         * @returns {CheckInView}
         */
        render: function () {
            console.trace('CheckInView.render()');
            var currentContext = this;
            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));
            currentContext.bindValidation();
            return this;
        },

        /**
         *
         * @returns {CheckInView}
         */
        bindValidation: function() {
            var currentContext = this;
            validation.bind(currentContext, {
                selector: 'name'
            });
            return this;
        },

        /**
         *
         * @param purposes
         * @returns {CheckInView}
         */
        renderPurposes: function (purposes) {
            var currentContext = this;
            var optionsHtml = '';
            _.each(purposes, function (purpose) {
                optionsHtml += optionTemplate({
                    'value': purpose['defaultDuration'],
                    'text': purpose['purpose']
                });
            })
            currentContext.$('#purpose-input').append(optionsHtml);
            return this;
        },

        /**
         *
         * @param durations
         * @returns {CheckInView}
         */
        renderDurations: function (durations) {
            var currentContext = this;
            var optionsHtml = '';
            _.each(durations, function (duration) {
                optionsHtml += optionTemplate({
                    'value': duration['minutes'],
                    'text': duration['description']
                });
            })
            currentContext.$('#duration-input').append(optionsHtml);
            return this;
        },

        /**
         *
         */
        events: {
            'change #purpose-input': 'purposeChanged',
            'change #duration-input': 'durationChanged',
            'click #cancel-check-in-button': 'cancelCheckIn',
            'click #submit-check-in-button': 'submitCheckIn'
        },

        /**
         *
         * @returns {CheckInView}
         */
        updateViewFromModel: function () {
            var currentContext = this;

            var locusId;
            if (currentContext.locusModel.has('locusId')) {
                locusId = currentContext.locusModel.get('locusId');
            }
            var locusName;
            if (currentContext.locusModel.has('locusName')) {
                locusName = currentContext.locusModel.get('locusName');
            }
            currentContext.$('#locus-name-label').attr('data-locus-id', locusId).html(locusName);

            var formattedDistance;
            if (currentContext.locusModel.has('distance') && currentContext.locusModel.has('latitude') && currentContext.locusModel.has('longitude')) {
                currentContext.hasCoordinates = true;
                var distance = currentContext.locusModel.get('distance').toFixed(0);
                formattedDistance = utils.formatString(utils.getResource('distanceFormatString'), [distance]);
            } else {
                formattedDistance = utils.getResource('coordinatesUnavailableErrorMessage');
            }
            currentContext.$('#distance-label').html(formattedDistance);

            var formattedContactNumber;
            if (currentContext.identityModel.has('contactNumber')) {
                var contactNumber = currentContext.identityModel.get('contactNumber');
                var cleanedContactNumber = utils.cleanPhone(contactNumber);
                formattedContactNumber = utils.formatPhone(cleanedContactNumber);
            }
            currentContext.$('#contact-number-input').val(formattedContactNumber);

            var email;
            if (currentContext.identityModel.has('email')) {
                email = currentContext.identityModel.get('email');
            }
            currentContext.$('#email-input').val(email);

            return this;
        },

        /**
         *
         * @param event
         * @returns {CheckInView}
         */
        purposeChanged: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            var purpose = currentContext.$('#purpose-input option:selected').text();
            currentContext.togglePurposeOther(purpose === 'Other');
            if (!currentContext.manualDurationEntry) {
                var defaultDuration = currentContext.$('#purpose-input').val();
                currentContext.$('#duration-input').val(defaultDuration);
            }
            return this;
        },

        /**
         *
         * @param show
         * @returns {CheckInView}
         */
        togglePurposeOther: function (show) {
            var currentContext = this;
            if (show) {
                currentContext.$('#purpose-other-input-container').removeClass('hidden');
            } else {
                currentContext.$('#purpose-other-input-container').addClass('hidden');
            }
            return this;
        },

        /**
         *
         * @param event
         */
        durationChanged: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            var duration = currentContext.$('#duration-input').val();
            currentContext.manualDurationEntry = true;
        },

        /**
         *
         * @param event
         * @returns {CheckInView}
         */
        submitCheckIn: function (event) {
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
         * @returns {CheckInView}
         */
        updateModelFromView: function () {
            var currentContext = this;
            var attributes = {};
            if (currentContext.locusModel.has('locusId')) {
                attributes.locusId = currentContext.locusModel.get('locusId');
            }
            if (currentContext.locusModel.has('locusName')) {
                attributes.locusName = currentContext.locusModel.get('locusName');
            }
            if (currentContext.locusModel.has('latitude')) {
                attributes.latitude = currentContext.locusModel.get('latitude');
            }
            if (currentContext.locusModel.has('longitude')) {
                attributes.longitude = currentContext.locusModel.get('longitude');
            }
            if (currentContext.identityModel.has('identityId')) {
                attributes.identityId = currentContext.identityModel.get('identityId');
            }
            if (currentContext.identityModel.has('identityName')) {
                attributes.identityName = currentContext.identityModel.get('identityName');
            }
            var rawContactNumber = currentContext.$('#contact-number-input').val();
            attributes.contactNumber = utils.cleanPhone(rawContactNumber);
            attributes.email = currentContext.$('#email-input').val();
            attributes.purpose = currentContext.$('#purpose-input option:selected').text();
            if (currentContext.$('#purpose-input').prop('selectedIndex') === 0) {
                attributes.purpose = '';
            }
            if (attributes.purpose === 'Other') {
                attributes.purposeOther = currentContext.$('#purpose-other-input').val();
            }
            attributes.duration = currentContext.$('#duration-input').val();
            attributes.groupCheckIn = currentContext.$('#group-check-in-input').is(':checked');
            attributes.additionalInfo = currentContext.$('#additional-info-input').val();

            currentContext.model.set(attributes);
            return this;
        },

        /**
         *
         * @param event
         * @returns {CheckInView}
         */
        cancelCheckIn: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            var locusId = currentContext.locusModel.get('locusId');
            currentContext.dispatcher.trigger(EventNamesEnum.goToLocusWithId, locusId);
            return this;
        },

        /**
         *
         * @param event
         * @returns {CheckInView}
         */
        checkIn: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.dispatcher.trigger(EventNamesEnum.checkIn, currentContext.model);
            return this;
        },

        /**
         *
         * @param isValid
         * @param model
         * @param errors
         * @returns {CheckInView}
         */
        onValidated: function (isValid, model, errors) {
            var currentContext = this;
            currentContext.$('.validate').each(function () {
                $(this).parent().parent().removeClass('invalid');
            });
            if (isValid) {
                currentContext.checkIn();
            } else {
                for (var error in errors) {
                    currentContext.$('[name="' + error + '"]').parent().parent().addClass('invalid');
                }
            }
            return this;
        },

        /**
         *
         * @returns {CheckInView}
         */
        onCheckInSuccess: function () {
            var currentContext = this;
            var locusId = currentContext.locusModel.get('locusId');
            currentContext.dispatcher.trigger(EventNamesEnum.goToLocusWithId, locusId);
            return this;
        },

        /**
         *
         * @returns {CheckInView}
         */
        showLoading: function () {
            var currentContext = this;
            currentContext.$(currentContext.loadingIconContainerId).removeClass('hidden');
            return this;
        },

        /**
         *
         * @returns {CheckInView}
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

    return CheckInView;
});
