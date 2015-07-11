'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var BaseView = require('views/BaseView');
var HeaderView = require('views/HeaderView');
var FooterView = require('views/FooterView');
var template = require('templates/ShellView.hbs');

/**
 *
 */
var ShellView = BaseView.extend({

    initialize: function (options) {
        console.trace('ShellView.initialize');
        options || (options = {});
        this.dispatcher = options.dispatcher || this;

        this.listenTo(this, 'loaded', this.onLoaded);
        this.listenTo(this, 'leave', this.onLeave);
    },
    render: function () {
        var currentContext = this;

        var renderModel = _.extend({}, currentContext.model);
        currentContext.setElement(template(renderModel));

        currentContext.headerViewInstance = new HeaderView({
            model: currentContext.model,
            dispatcher: currentContext.dispatcher
        });
        this.replaceWithChild(currentContext.headerViewInstance, '#header-view-container');

        currentContext.footerViewInstance = new FooterView({
            model: currentContext.model,
            dispatcher: currentContext.dispatcher
        });
        this.replaceWithChild(currentContext.footerViewInstance, '#footer-view-container');

        return this;
    },
    contentViewEl: function () {
        return $('#content-view-container', this.el);
    },
    onLoaded: function () {
        console.trace('ShellView.onLoaded');
    },
    onLeave: function () {
        console.trace('ShellView.onLeave');
    }
});

module.exports = ShellView;