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
            if (this.model.has('identityName')) {
                this.$('.identity-name-label').html(this.model.get('identityName'));
            }
        },
        onLoaded: function () {
            var currentContext = this;

            currentContext.entryLogListViewInstance = new EntryLogListView({
                controller: currentContext.controller,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.entryLogCollection,
                showLocus: true,
                showIdentity: false,
                showPosition: true
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