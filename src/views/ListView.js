define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        globals = require('globals'),
        env = require('env'),
        utils = require('utils'),
        EventNamesEnum = require('enums/EventNamesEnum'),
        template = require('hbs!templates/ListView');

    var ListView = BaseView.extend({
        headerTextFormatString: utils.getResource('listViewHeaderTextFormatString'),
        tileViewType: BaseView,
        initialize: function (options) {
            console.trace('ListView.initialize');
            options || (options = {});
            this._options = options;
            this.controller = options.controller;
            this.dispatcher = options.dispatcher || this;

            if (options.tileViewType) {
                this.tileViewType = options.tileViewType;
            }
            if (options.headerTextFormatString) {
                this.headerTextFormatString = options.headerTextFormatString;
            }

            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('ListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            this.hideLoading();

            return this;
        },

        updateHeader: function () {
            if (this.collection) {
                var headerText = utils.formatString(this.headerTextFormatString, [this.collection.length]);
                this.$('#list-view-header').html(headerText);
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
            var options = _.extend(currentContext._options, { 'model': model });
            var tileViewInstance = new currentContext.tileViewType(options);
            this.appendChildTo(tileViewInstance, '#rows-container');
        },

        removeAll: function () {
            this.showLoading();
            this._leaveChildren();
            this.hideLoading();
        },

        onLeave: function () {
            console.trace('ListView.onLeave');
        }
    });

    return ListView;
});
