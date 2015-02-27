define(function (require) {

    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        EntryLogCollection = require('collections/EntryLogCollection'),
        EntryLogListView = require('views/EntryLogListView'),
        EventNamesEnum = require('enums/EventNamesEnum'),
        utils = require('utils'),
        template = require('hbs!templates/Identity');

    var IdentityView = BaseView.extend({
        initialize: function (options) {
            console.trace('IdentityView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.entryLogCollection = new EntryLogCollection();
            this.openEntryLogCollection = new EntryLogCollection();
            this.recentEntryLogCollection = new EntryLogCollection();

            this.listenTo(this.entryLogCollection, 'reset', this.updateViewFromEntryLogCollection);
            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('IdentityView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            this.renderChildViews();

            return this;
        },
        renderChildViews: function() {
            var currentContext = this;

            currentContext.openEntryLogListViewInstance = new EntryLogListView({
                controller: currentContext.controller,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.openEntryLogCollection,
                headerTextFormatString: utils.getResource('openEntryLogList.headerTextFormatString'),
                showLocus: true,
                showIdentity: false
            });
            currentContext.appendChildTo(currentContext.openEntryLogListViewInstance, '#open-entry-log-list-view-container');

            currentContext.recentEntryLogListViewInstance = new EntryLogListView({
                controller: currentContext.controller,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.recentEntryLogCollection,
                headerTextFormatString: utils.getResource('recentEntryLogList.headerTextFormatString'),
                showLocus: true,
                showIdentity: false
            });
            currentContext.appendChildTo(currentContext.recentEntryLogListViewInstance, '#recent-entry-log-list-view-container');

            return this;
        },
        events: {
            'click #go-back-from-identity-button': 'goBackFromIdentity',
            'click #open-identity-menu-button': 'openIdentityMenu',
            'click #add-identity-to-favorites-button': 'addIdentityToFavorites',
            'click #show-open-check-ins-button': 'showOpenCheckIns',
            'click #show-recent-check-ins-button': 'showRecentCheckIns'
        },
        updateViewFromModel: function () {
            var currentContext = this;

            var identityFullName;
            if (currentContext.model.has('identityFullName')) {
                identityFullName = currentContext.model.get('identityFullName');
            }
            currentContext.$('#identity-name-header').html(identityFullName);

            var cleanedContactNumber;
            var formattedContactNumber;
            if (currentContext.model.has('contactNumber')) {
                currentContext.hasContactNumber = true;
                var contactNumber = currentContext.model.get('contactNumber');
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
                currentContext.hasEmail = true;
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
        updateViewFromEntryLogCollection: function (options) {
            var currentContext = this;

            var openEntryLogs = currentContext.entryLogCollection.filter(function (entryLog) {
                return !entryLog.has('outTime');
            });

            var recentEntryLogs = currentContext.entryLogCollection.filter(function (entryLog) {
                return entryLog.has('outTime');
            });

            currentContext.openEntryLogCollection.reset(openEntryLogs);
            currentContext.recentEntryLogCollection.reset(recentEntryLogs);
        },
        goBackFromIdentity: function (event) {
            if (event) {
                event.preventDefault();
            }

            this.dispatcher.trigger(EventNamesEnum.goToIdentitySearch);
        },
        openIdentityMenu: function (event) {
            if (event) {
                event.preventDefault();
            }
        },
        addIdentityToFavorites: function (event) {
            if (event) {
                event.preventDefault();
            }
        },
        onLoaded: function () {
            var currentContext = this;

            var options = {
                identityId: currentContext.model.get('identityId')
            };

            currentContext.openEntryLogListViewInstance.showLoading();
            currentContext.dispatcher.trigger(EventNamesEnum.refreshEntryLogList, currentContext.entryLogCollection, options);
        },
        showOpenCheckIns: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#show-open-check-ins-button').removeClass('secondary');
            this.$('#show-recent-check-ins-button').addClass('secondary');

            this.$('#open-entry-log-list-view-container').removeClass('hidden');
            this.$('#recent-entry-log-list-view-container').addClass('hidden');

            this.openEntryLogListViewInstance.showLoading();
            this.updateViewFromEntryLogCollection();
        },
        showRecentCheckIns: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#show-open-check-ins-button').addClass('secondary');
            this.$('#show-recent-check-ins-button').removeClass('secondary');

            this.$('#open-entry-log-list-view-container').addClass('hidden');
            this.$('#recent-entry-log-list-view-container').removeClass('hidden');

            this.recentEntryLogListViewInstance.showLoading();
            this.updateViewFromEntryLogCollection();
        },
        onLeave: function () {
            console.trace('IdentityView.onLeave');
        }
    });

    return IdentityView;

});