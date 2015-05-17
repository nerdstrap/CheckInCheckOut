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
        template = require('hbs!templates/CheckOut');

    var CheckOutView = BaseView.extend({
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
        render: function () {
            console.trace('CheckOutView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            validation.bind(this, {
                selector: 'name'
            });

            return this;
        },
        events: {
            'change #duration-input': 'durationChanged',
            'click #cancel-button': 'cancelCheckOut',
            'click #check-out-button': 'validateModelAndCheckOut'
        },
        updateViewFromModel: function () {
            if (this.model.has('locusId') && this.model.has('locusName')) {
                this.$('#locus-name-label').attr('data-locus-id', this.model.get('locusId')).html(this.model.get('locusName'));
            }
            if (this.identityModel.has('contactNumber')) {
                this.$('#contact-number-input').val(utils.formatPhone(this.identityModel.get('contactNumber')));
            }
            if (this.identityModel.has('email')) {
                this.$('#email-input').val(this.identityModel.get('email'));
            }
            if (this.model.has('purpose')) {
                this.$('#purpose-input').html(this.model.get('purpose'));
            }
            if (this.model.has('duration')) {
                this.$('#duration-input').html(this.model.get('duration'));
            }
        },
        durationChanged: function(event) {
            if (event) {
                event.preventDefault();
            }

            var duration = this.$('#duration-input').val();
            this.manualDurationEntry = true;
        },
        validateModelAndCheckOut: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.updateModelFromView();
            this.model.validate();
        },
        updateModelFromView: function () {
            var attributes = {};

            attributes.additionalInfo = this.$('#additional-info-input').val();

            this.model.set(attributes);
        },
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
        },
        cancelCheckOut: function (event) {
            if (event) {
                event.preventDefault();
            }

            var locusId = this.model.get('locusId');
            this.dispatcher.trigger(EventNamesEnum.goToLocusWithId, locusId);
        },
        dispatchCheckOut: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(EventNamesEnum.checkOut, this.model);
        },
        onCheckOutSuccess: function() {
            var locusId = this.model.get('locusId');
            this.dispatcher.trigger(EventNamesEnum.goToLocusWithId, locusId);
        },
        onLeave: function () {
            console.trace('LocusSearchView.onLeave');
        }
    });

    return CheckOutView;
});
