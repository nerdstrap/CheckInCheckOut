define(function (require) {

    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        EntryLogCollection = require('collections/EntryLogCollection'),
        EntryLogListView = require('views/EntryLogListView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        utils = require('utils'),
        template = require('hbs!templates/Identity');

    var IdentityView = BaseView.extend({
        initialize: function (options) {
            console.trace('IdentityView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.entryLogCollection = new EntryLogCollection();

            this.listenTo(this.entryLogCollection, 'reset', this.updateEntryLogStatusView);
            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);

            this.listenTo(this.dispatcher, AppEventNamesEnum.checkInSuccess, this.updateEntryLogStatusView);
            this.listenTo(this.dispatcher, AppEventNamesEnum.editCheckInSuccess, this.updateEntryLogStatusView);
            this.listenTo(this.dispatcher, AppEventNamesEnum.checkOutSuccess, this.updateEntryLogStatusView);
        },
        render: function () {
            console.trace('IdentityView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
        },
        updateViewFromModel: function () {
            var currentContext = this;

            var identityName;
            if (currentContext.model.has('identityName')) {
                identityName = currentContext.model.get('identityName');
            }
            currentContext.$('#identity-name-header').html(identityName);

            var cleanedContactNumber;
            var formattedContactNumber;
            if (currentContext.model.has('contactNumber')) {
                currentContext.hasContactNumber = true;
                var contactNumber = currentContext.identityModel.get('contactNumber');
                cleanedContactNumber = utils.cleanPhone(contactNumber);
                formattedContactNumber = utils.formatPhone(cleanedContactNumber);
            }
            if (currentContext.hasContactNumber) {
                currentContext.$('#contact-number-label').html(formattedContactNumber);
                currentContext.$('#message-contact-number-button').attr('href', 'sms:' + cleanedContactNumber);
                currentContext.$('#call-contact-number-button').attr('href', 'tel:' + cleanedContactNumber);
                currentContext.$('#contact-number-container').removeClass('hidden');
            } else {
                currentContext.$('#contact-number-container').addClass('hidden');
            }
           
            var email;
            if (currentContext.model.has('email')) {
                currentContext.hasEmail = true
                email = currentContext.model.get('email');
            }
            if (currentContext.hasEmail) {
                currentContext.$('#email-label').html(email);
                currentContext.$('#email-button').attr('href', 'mailto:' + email)
                currentContext.$('#email-container').removeClass('hidden');
            } else {
                currentContext.$('#email-container').addClass('hidden');
            }
        },
        onLoaded: function () {
            var currentContext = this;

            currentContext.entryLogListViewInstance = new EntryLogListView({
                controller: currentContext.controller,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.entryLogCollection,
                showLocus: true,
                showIdentity: false
            });
            currentContext.appendChildTo(currentContext.entryLogListViewInstance, '#entry-log-list-view-container');

            var options = {
                identityId: currentContext.model.get('identityId')
            };

            currentContext.entryLogListViewInstance.showLoading();
            currentContext.dispatcher.trigger(AppEventNamesEnum.refreshEntryLogList, currentContext.entryLogCollection, options);
        },
        onLeave: function () {
            console.trace('IdentityView.onLeave');
        }
    });

    return IdentityView;

});