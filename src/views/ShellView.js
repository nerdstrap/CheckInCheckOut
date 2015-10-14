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
        options || (options = {});
        this.dispatcher = options.dispatcher || this;

        this.listenTo(this, 'loaded', this.onLoaded);
        this.listenTo(this, 'leave', this.onLeave);
    },

    /**
     *
     * @returns {ShellView}
     */
    render: function () {
        var currentContext = this;

        var renderModel = _.extend({}, currentContext.model);
        currentContext.setElement(template(renderModel));
        currentContext.renderHeaderView();
        currentContext.renderFooterView();
        return this;
    },

    /**
     *
     * @returns {ShellView}
     */
    renderHeaderView: function () {
        var currentContext = this;
        currentContext.headerViewInstance = new HeaderView({
            model: currentContext.model,
            dispatcher: currentContext.dispatcher
        });
        currentContext.replaceWithChild(currentContext.headerViewInstance, '#header-view-placeholder');
        return this;
    },

    /**
     *
     * @returns {ShellView}
     */
    renderFooterView: function () {
        var currentContext = this;
        currentContext.footerViewInstance = new FooterView({
            model: currentContext.model,
            dispatcher: currentContext.dispatcher
        });
        currentContext.replaceWithChild(currentContext.footerViewInstance, '#footer-view-placeholder');
        return this;
    },

    /**
     *
     * @returns {jquery element}
     */
    contentViewEl: function () {
        return $('#content-view-container', this.el);
    },

    /**
     *
     */
    onLoaded: function () {
        console.trace('ShellView.onLoaded');
    },

    /**
     *
     */
    onLeave: function () {
        console.trace('ShellView.onLeave');
    }
});

module.exports = ShellView;