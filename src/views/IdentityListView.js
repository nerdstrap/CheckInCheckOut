define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        IdentityListItemView = require('views/IdentityListItemView'),
        globals = require('globals'),
        env = require('env'),
        utils = require('utils'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        template = require('hbs!templates/IdentityList');

    var IdentityListView = BaseView.extend({
        headerTextFormatString: utils.getResource('identityList.headerTextFormatString'),
        listItemView: IdentityListItemView,
        initialize: function (options) {
            console.trace('IdentityListView.initialize');
            options || (options = {});
            this._options = options;
            this.controller = options.controller;
            this.dispatcher = options.dispatcher || this;
            if (options.listItemView) {
                this.listItemView = options.listItemView;
            }
            if (options.headerTextFormatString) {
                this.headerTextFormatString = options.headerTextFormatString;
            }

            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('IdentityListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            this.hideLoading();

            return this;
        },
        updateHeader: function () {
            if (this.collection) {
                var headerText = utils.formatString(this.headerTextFormatString, [this.collection.length]);
                this.$('#list-header').html(headerText);
            }
        },
        addAll: function () {
            this.showLoading();
            this._leaveChildren();
            _.each(this.collection.models, this.addOne, this);
            this.updateHeader();
            this.hideLoading();
        },
        addOne: function (model) {
            var currentContext = this;
            var listItemViewInstance = new currentContext.listItemView(_.extend(currentContext._options, { 'model': model }));
            this.appendChildTo(listItemViewInstance, '#list-item-view-container');
        },
        removeAll: function () {
            this.showLoading();
            this._leaveChildren();
            this.hideLoading();
        },
        onLeave: function () {
            console.trace('IdentityListView.onLeave');
        }
    });

    return IdentityListView;
});
