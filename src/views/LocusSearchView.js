define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        LocusCollection = require('collections/LocusCollection'),
        LocusListView = require('views/LocusListView'),
        globals = require('globals'),
        env = require('env'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        template = require('hbs!templates/LocusSearch');

    var LocusSearchView = BaseView.extend({
        initialize: function (options) {
            console.trace('LocusSearchView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('LocusListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            currentContext.locusCollection = new LocusCollection();
            currentContext.locusListViewInstance = new LocusListView({
                controller: currentContext.controller,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.locusCollection
            });
            this.appendChildTo(currentContext.locusListViewInstance, '#locus-list-view-container');

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

            this.locusCollection.reset();
            this.hideManualSearchForm();
            this.refreshLocusListByGps();
        },
        showManualSearchForm: function (event) {
            if (event) {
                event.preventDefault();
            }

            this.locusCollection.reset();
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

            this.locusCollection.reset();
            this.hideManualSearchForm();
            this.refreshLocusList();
        },
        dispatchManualSearch: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.locusCollection.reset();
            this.refreshLocusList();
            //var validPattern = /^[A-Za-z0-9\s]*$/;
            //if (event) {
            //    if (event.keyCode === 13) {
            //        /* enter key pressed */
            //        this.refreshLocusList();
            //    }
            //    var charCode = event.charCode || event.keyCode || event.which;
            //    var inputChar = String.fromCharCode(charCode);
            //    if (!validPattern.test(inputChar) && event.charCode !== 0) {
            //        event.preventDefault();
            //        return false;
            //    }
            //}
        },
        refreshLocusList: function () {
            var locusName = this.$('#manual-search-input').val();
            if (locusName && locusName.length > 1) {
                var options = {
                    locusName: locusName
                }
                this.locusListViewInstance.showLoading();
                this.dispatcher.trigger(AppEventNamesEnum.refreshLocusList, this.locusCollection, options);
            }
        },
        refreshLocusListByGps: function () {
            var options = {
                gps: true
            }
            this.locusListViewInstance.showLoading();
            this.dispatcher.trigger(AppEventNamesEnum.refreshLocusListByGps, this.locusCollection, options);
        },
        onLeave: function () {
            console.trace('LocusSearchView.onLeave');
        }
    });

    return LocusSearchView;
});
