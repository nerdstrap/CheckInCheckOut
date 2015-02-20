define(function (require) {

    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        CompositeView = require('views/CompositeView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        utils = require('utils'),
        template = require('hbs!templates/IdentityListItem');

    var IdentityListItemView = CompositeView.extend({
        initialize: function (options) {
            console.trace('IdentityListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.model, 'reset', this.updateViewFromModel);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('IdentityListItemView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            this.updateViewFromModel();

            return this;
        },
        events: {
            'click .go-to-identity-button': 'goToIdentityWithId'
        },
        updateViewFromModel: function () {
            var currentContext = this;

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
                currentContext.$('.contact-number-label').html(formattedContactNumber);
                currentContext.$('.message-contact-number-button').attr('href', 'sms:' + cleanedContactNumber);
                currentContext.$('.call-contact-number-button').attr('href', 'tel:' + cleanedContactNumber);
                currentContext.$('.contact-number-container').removeClass('hidden');
            } else {
                currentContext.$('.contact-number-container').addClass('hidden');
            }

            var email;
            if (currentContext.model.has('email')) {
                currentContext.hasEmail = true
                email = currentContext.model.get('email');
            }
            if (currentContext.hasEmail) {
                currentContext.$('.email-label').html(email);
                currentContext.$('.email-button').attr('href', 'mailto:' + email)
                currentContext.$('.email-container').removeClass('hidden');
            } else {
                currentContext.$('.email-container').addClass('hidden');
            }
        },
        goToIdentityWithId: function (event) {
            if (event) {
                event.preventDefault();
            }

            var identityId = this.model.get('identityId');
            this.dispatcher.trigger(AppEventNamesEnum.goToIdentityWithId, identityId);
        },
        onLeave: function () {
            console.trace('IdentityListItemView.onLeave');
        }
    });

    return IdentityListItemView;

});