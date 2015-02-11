define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        ListingListItemView = require('views/ListingListItemView'),
        globals = require('globals'),
        env = require('env'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        template = require('hbs!templates/ListingList');

    var ListingListView = BaseView.extend({
        initialize: function (options) {
            console.trace('ListingListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('ListingListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            this.hideLoading();

            return this;
        },
        addAll: function () {
            this.showLoading();
            this._leaveChildren();
            _.each(this.collection.models, this.addOne, this);
            this.hideLoading();
        },
        addOne: function (listing) {
            var currentContext = this;
            var listingListItemViewInstance = new ListingListItemView({
                model: listing,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(listingListItemViewInstance, '#locus-entry-log-list-item-view-container');
        },
        onLeave: function () {
            console.trace('ListingListView.onLeave');
        }
    });

    return ListingListView;
});
