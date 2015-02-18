define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        IdentityCollection = require('collections/IdentityCollection'),
        IdentityListView = require('views/IdentityListView'),
        globals = require('globals'),
        env = require('env'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        template = require('hbs!templates/IdentitySearch');

    var IdentitySearchView = BaseView.extend({
        initialize: function (options) {
            console.trace('IdentitySearchView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.identityCollection = new IdentityCollection();

            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('IdentityListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            currentContext.identityListViewInstance = new IdentityListView({
                controller: currentContext.controller,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.identityCollection
            });
            this.appendChildTo(currentContext.identityListViewInstance, '#identity-list-view-container');

            return this;
        },
        events: {
            //'keypress #user-name-input': 'dispatchManualSearch',
            'click #open-manual-search-input-button': 'openManualSearchInput',
            'click #clear-manual-search-input-button': 'clearManualSearchInput',
            'click #search-button': 'dispatchManualSearch',
            'click #cancel-button': 'cancelManualSearch',
            'click #name-search-button': 'resetNameSearch',
            'click #gps-search-button': 'resetGpsSearch',
            'click #recent-search-button': 'resetRecentSearch'
        },
        openManualSearchInput: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#search-button').removeClass('hidden');
            this.$('#cancel-button').removeClass('hidden');
        },
        clearManualSearchInput: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#manual-search-input').val('');
        },
        dispatchManualSearch: function (event) {
            if (event) {
                event.preventDefault();
            }
        },
        cancelManualSearch: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#search-button').addClass('hidden');
            this.$('#cancel-button').addClass('hidden');
        },
        refreshIdentityList: function (options) {
            var identityName = this.$('#manual-search-input').val();
            if (identityName && identityName.length > 1) {
                options.identityName = identityName;
            }
            this.identityListViewInstance.showLoading();
            this.dispatcher.trigger(AppEventNamesEnum.refreshIdentityList, this.identityCollection, options);
        },
        onLeave: function () {
            console.trace('IdentitySearchView.onLeave');
        }
    });

    return IdentitySearchView;
});
