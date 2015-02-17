define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        validation = require('backbone.validation'),
        BaseView = require('views/BaseView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        globals = require('globals'),
        env = require('env'),
        utils = require('utils'),
        helpers = require('handlebars.helpers'),
        optionTemplate = require('hbs!templates/Option'),
        template = require('hbs!templates/CheckIn');

    var CheckInView = BaseView.extend({
        initialize: function (options) {
            console.trace('CheckInView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.locusModel = options.locusModel;

            this.listenTo(this.model, 'validated', this.onValidated);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('CheckInView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            validation.bind(this, {
                selector: 'name'
            });

            return this;
        },
        renderPurposes: function(purposes) {
            var optionsHtml = '';
            _.each(purposes, function (purpose) {
                optionsHtml += optionTemplate({
                    'value': purpose['defaultDuration'],
                    'text': purpose['purpose']
                });
            })
            this.$('#purpose-input').append(optionsHtml);
        },
        renderDurations: function(durations) {
            var optionsHtml = '';
            _.each(durations, function (duration) {
                optionsHtml += optionTemplate({
                    'value': duration['minutes'],
                    'text': duration['description']
                });
            })
            this.$('#duration-input').append(optionsHtml);
        },
        events: {
            'change #purpose-input': 'purposeChanged',
            'change #duration-input': 'durationChanged',
            'click #cancel-button': 'cancelCheckIn',
            'click #check-in-button': 'validateModelAndCheckIn'
        },
        updateViewFromModel: function () {
            if (this.locusModel.has('locusId') && this.locusModel.has('locusName')) {
                this.$('#locus-name-label').attr('data-locus-id', this.locusModel.get('locusId')).html(this.locusModel.get('locusName'));
            }
            if (this.locusModel.has('distance')) {
                this.$('#distance-label').html(utils.formatString(utils.getResource('distanceFormatString'), [this.locusModel.get('distance')]));
            }
            if (this.identityModel.has('contactNumber')) {
                this.$('#contact-number-input').val(helpers.formatPhone(this.identityModel.get('contactNumber')));
            }
            if (this.identityModel.has('email')) {
                this.$('#email-input').val(this.identityModel.get('email'));
            }
        },
        purposeChanged: function(event) {
            if (event) {
                event.preventDefault();
            }
            var purpose = this.$('#purpose-input option:selected').text();
            this.togglePurposeOther(purpose === 'Other');
            if (!this.manualDurationEntry) {
                var defaultDuration = this.$('#purpose-input').val();
                this.$('#duration-input').val(defaultDuration);
            }
        },
        togglePurposeOther: function(show) {
            if (show) {
                this.$('#purpose-other-input-container').removeClass('hidden');
            } else {
                this.$('#purpose-other-input-container').addClass('hidden');
            }
        },
        durationChanged: function(event) {
            if (event) {
                event.preventDefault();
            }

            var duration = this.$('#duration-input').val();
            this.manualDurationEntry = true;
        },
        validateModelAndCheckIn: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.updateModelFromView();
            this.model.validate();
        },
        updateModelFromView: function () {
            var attributes = {};

            if (this.locusModel.has('locusId')) {
                attributes.locusId = this.locusModel.get('locusId');
            }
            if (this.locusModel.has('locusName')) {
                attributes.locusName = this.locusModel.get('locusName');
            }
            if (this.locusModel.has('latitude')) {
                attributes.latitude = this.locusModel.get('latitude');
            }
            if (this.locusModel.has('longitude')) {
                attributes.longitude = this.locusModel.get('longitude');
            }
            if (this.identityModel.has('identityId')) {
                attributes.identityId = this.identityModel.get('identityId');
            }
            if (this.identityModel.has('identityName')) {
                attributes.identityName = this.identityModel.get('identityName');
            }
            var rawContactNumber = this.$('#contact-number-input').val();
            attributes.contactNumber = utils.cleanPhone(rawContactNumber);
            attributes.email = this.$('#email-input').val();
            attributes.purpose = this.$('#purpose-input option:selected').text();
            if (this.$('#purpose-input').prop('selectedIndex') === 0) {
                attributes.purpose = '';
            }
            if (attributes.purpose === 'Other') {
                attributes.purposeOther = this.$('#purpose-other-input').val();
            }
            attributes.duration = this.$('#duration-input').val();
            attributes.groupCheckIn = this.$('#group-check-in-input').is(':checked');
            attributes.additionalInfo = this.$('#additional-info-input').val();

            this.model.set(attributes);
        },
        onValidated: function(isValid, model, errors) {
            var currentContext = this;

            currentContext.$('.validate').each(function() {
                $(this).parent().parent().removeClass('invalid');
            })

            if (isValid) {
                this.dispatchCheckIn();
            } else {
                for(var error in errors) {
                    currentContext.$('[name="' + error + '"]').parent().parent().addClass('invalid');
                }
            }
        },
        cancelCheckIn: function (event) {
            if (event) {
                event.preventDefault();
            }

            var locusId = this.locusModel.get('locusId');
            this.dispatcher.trigger(AppEventNamesEnum.goToLocusWithId, locusId);
        },
        dispatchCheckIn: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.checkIn, this.model);
        },

        onLeave: function () {
            console.trace('LocusSearchView.onLeave');
        }
    });

    return CheckInView;
});
