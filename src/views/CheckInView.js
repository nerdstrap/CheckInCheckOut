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
        template = require('hbs!templates/CheckIn');

    var CheckInView = BaseView.extend({
        initialize: function (options) {
            console.trace('CheckInView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.locusModel = options.locusModel;

            this.listenTo(this.model, 'change', this.updateViewFromModel);
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
        events: {
            'click #cancel-button': 'cancelCheckIn',
            'click #check-in-button': 'validateModelAndCheckIn'
        },
        updateViewFromModel: function () {
            if (this.locusModel.has('locusId') && this.locusModel.has('locusName')) {
                this.$('#locus-name-input').attr('data-locus-id', this.locusModel.get('locusId')).val(this.locusModel.get('locusName'));
            }
            if (this.locusModel.has('latitude') && this.locusModel.has('longitude')) {
                this.$('#distance-input').attr('data-latitude', this.locusModel.get('latitude')).attr('data-longitude', this.locusModel.get('longitude')).val('determining distance');
            }
            if (this.identityModel.has('identityId') && this.identityModel.has('identityName')) {
                this.$('#identity-name-input').attr('data-identity-id', this.identityModel.get('identityId')).val(this.identityModel.get('identityName'));
            }
            if (this.identityModel.has('contactNumber')) {
                this.$('#contact-number-input').val(this.identityModel.get('contactNumber'));
            }
            if (this.identityModel.has('email')) {
                this.$('#email-input').val(this.identityModel.get('email'));
            }
            if (this.model.has('purpose')) {
                this.$('#purpose-input').val(this.identityModel.get('purpose'));
            }
            if (this.model.has('duration')) {
                this.$('#duration-input').val(this.model.get('duration'));
            }
            if (this.model.has('groupCheckIn')) {
                this.$('#group-check-in-input').val(this.model.get('groupCheckIn'));
            }
            if (this.model.has('additionalInfo')) {
                this.$('#additional-info-input').val(this.model.get('additionalInfo'));
            }
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
                attributes['locusId'] = this.locusModel.get('locusId');
            }
            if (this.locusModel.has('locusName')) {
                attributes['locusName'] = this.locusModel.get('locusName');
            }
            if (this.locusModel.has('latitude')) {
                attributes['latitude'] = this.locusModel.get('latitude');
            }
            if (this.locusModel.has('longitude')) {
                attributes['longitude'] = this.locusModel.get('longitude');
            }
            if (this.identityModel.has('identityId')) {
                attributes['identityId'] = this.identityModel.get('identityId');
            }
            if (this.identityModel.has('identityName')) {
                attributes['identityName'] = this.identityModel.get('identityName');
            }
            attributes['contactNumber'] = this.$('#contact-number-input').val();
            attributes['email'] = this.$('#email-input').val();

            this.model.set(attributes);
        },
        onValidated: function(isValid, model, errors) {
            var currentContext = this;
            if (isValid) {
                this.checkIn();
            } else {
                for(var error in errors) {
                    currentContext.$('.' + error + '-input').parent().parent().addClass('invalid');
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
