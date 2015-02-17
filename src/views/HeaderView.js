define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        CompositeView = require('views/CompositeView'),
        EntryLogCollection = require('collections/EntryLogCollection'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        UserRolesEnum = require('enums/UserRolesEnum'),
        template = require('hbs!templates/Header');

    var HeaderView = CompositeView.extend({
        initialize: function (options) {
            console.trace('HeaderView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.entryLogCollection = new EntryLogCollection();

            this.listenTo(this.dispatcher, AppEventNamesEnum.identityUpdated, this.onIdentityUpdated);
            this.listenTo(this.entryLogCollection, 'reset', this.updateHeaderControls);
            this.listenTo(this, 'leave', this.onLeave);
        },
        events: {
            'click #app-title-button': 'titleButtonClick',
            'click #go-to-locus-search-button': 'goToLocusSearch',
            'click #go-to-identity-search-button': 'goToIdentitySearch',
            'click #go-to-open-entry-button': 'goToLocusList'
        },
        render: function () {
            console.trace('HeaderView.render');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        updateHeaderControls: function() {
            if (this.entryLogCollection.length > 0) {
                this.$('.go-to-open-check-in-button-container').removeClass('hidden');
            }
        },
        onIdentityUpdated: function (identityModel) {
            var options = {
                identityId: identityModel.get('identityId')
            };
            this.dispatcher.trigger(AppEventNamesEnum.refreshEntryLogList, this.entryLogCollection, options);
        },
        titleButtonClick: function (event) {
            if (event) {
                event.preventDefault();
            }
        },
        goToLocusSearch: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.goToLocusSearch);
        },
        goToIdentitySearch: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.goToIdentitySearch);
        },
        goToLocusWithId: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.goToLocusWithId);
        },
        onLeave: function() {
            console.trace('HeaderView.onLeave');
        }
    });

    return HeaderView;
});