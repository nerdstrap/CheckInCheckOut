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

            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('IdentityListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            currentContext.identityCollection = new IdentityCollection();
            currentContext.identityListViewInstance = new IdentityListView({
                controller: currentContext.controller,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.identityCollection
            });
            this.appendChildTo(currentContext.identityListViewInstance, '#identity-list-view-container');

            return this;
        },
        events: {
            'click #gps-search-button': 'dispatchGpsSearch',
            'click #show-manual-search-button': 'showManualSearchForm',
            'keypress #user-name-input': 'dispatchManualSearch',
            'click #manual-search-button': 'dispatchManualSearch',
            'click #recent-search-button': 'dispatchRecentSearch'
        },
        dispatchGpsSearch: function (event) {
            if (event) {
                event.preventDefault();
            }

            this.identityCollection.reset();
            this.hideManualSearchForm();
            this.refreshIdentityListByGps();
        },
        showManualSearchForm: function (event) {
            if (event) {
                event.preventDefault();
            }

            this.identityCollection.reset();
            this.$('#manual-search-form').removeClass('hidden');
            this.$('#manual-search-input').focus();
        },
        hideManualSearchForm: function() {
            this.$('#manual-search-input').val('');
            this.$('#manual-search-form').addClass('hidden');
        },
        dispatchRecentSearch: function (event) {
            if (event) {
                event.preventDefault();
            }

            this.identityCollection.reset();
            this.hideManualSearchForm();
            this.refreshIdentityList();
        },
        dispatchManualSearch: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.identityCollection.reset();
            this.refreshIdentityList();
            //var validPattern = /^[A-Za-z0-9\s]*$/;
            //if (event) {
            //    if (event.keyCode === 13) {
            //        /* enter key pressed */
            //        this.refreshIdentityList();
            //    }
            //    var charCode = event.charCode || event.keyCode || event.which;
            //    var inputChar = String.fromCharCode(charCode);
            //    if (!validPattern.test(inputChar) && event.charCode !== 0) {
            //        event.preventDefault();
            //        return false;
            //    }
            //}
        },
        refreshIdentityList: function () {
            var identityName = this.$('#manual-search-input').val();
            if (identityName && identityName.length > 1) {
                var options = {
                    identityName: identityName
                }
                this.identityListViewInstance.showLoading();
                this.dispatcher.trigger(AppEventNamesEnum.refreshIdentityList, this.identityCollection, options);
            }
        },
        refreshIdentityListByGps: function () {
            var options = {
                gps: true
            }
            this.identityListViewInstance.showLoading();
            this.dispatcher.trigger(AppEventNamesEnum.refreshIdentityListByGps, this.identityCollection, options);
        },
        onLeave: function () {
            console.trace('IdentitySearchView.onLeave');
        }
    });

    return IdentitySearchView;
});
