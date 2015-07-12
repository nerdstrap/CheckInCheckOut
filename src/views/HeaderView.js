'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var BaseView = require('views/BaseView');
var EventNameEnum = require('enums/EventNameEnum');
var template = require('templates/HeaderView.hbs');

var HeaderView = BaseView.extend({
    initialize: function (options) {
        console.trace('HeaderView.initialize');
        options || (options = {});
        this.dispatcher = options.dispatcher || this;

        this.listenTo(this.dispatcher, EventNameEnum.myIdentityReset, this.onMyIdentityReset);
        this.listenTo(this, 'loaded', this.onLoaded);
        this.listenTo(this, 'leave', this.onLeave);
    },

    /**
     *
     * @returns {HeaderView}
     */
    render: function () {
        var currentContext = this;
        var renderModel = _.extend({}, currentContext.model);
        currentContext.setElement(template(renderModel));
        return this;
    },

    /**
     *
     */
    events: {
        'click [data-toggle="menu"]': 'toggleMenu',
        'click #go-to-my-identity-button': 'goToMyIdentity',
        'click #go-to-locus-search-button': 'goToLocusSearch',
        'click #go-to-identity-search-button': 'goToIdentitySearch',
        'click #go-to-ad-hoc-entry-button': 'goToAdHocEntry',
        'click #go-to-settings-button': 'goToSettings'
    },

    toggleMenu: function (e) {
        e.preventDefault();
        e.stopPropagation();

        var $this = $(this),
            $thisLi = $this.parent(),
            $thisMenu = $(this.getTargetFromTrigger($this));

        if ($thisLi.hasClass('active')) {
            mReset();
        } else {
            mReset();

            if ($thisMenu.hasClass('nav-drawer')) {
                $('body').addClass('nav-drawer-open');
            }

            $thisLi.addClass('active');
            $thisMenu.addClass('open');
        }
    },

    getTargetFromTrigger: function (trigger) {
        var href;
        var target = trigger.attr('data-target') || (href = trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '');
        return target;
    },

    mReset: function () {
        var $bd = $('body');

        if ($bd.hasClass('nav-drawer-open')) {
            $bd.removeClass('nav-drawer-open');
        }

        $('[data-toggle="menu"]').closest('.active').removeClass('active');
        $('.menu.open').removeClass('open');
    },

    goToMyIdentity: function (event) {
        if (event) {
            event.preventDefault();
            if (event.target) {
                var identityId = $(event.target).attr('data-identity-id');
                if (identityId) {
                    this.dispatcher.trigger(EventNameEnum.goToIdentityWithId, identityId);
                }
                $(event.target).parent().addClass('active').siblings().removeClass('active');
            }
        }
    },
    goToLocusWithId: function (event) {
        if (event) {
            event.preventDefault();
            if (event.target) {
                var locusId = $(event.target).attr('data-locus-id');
                if (locusId) {
                    this.dispatcher.trigger(EventNameEnum.goToLocusWithId, locusId);
                }
                $(event.target).parent().addClass('active').siblings().removeClass('active');
            }
        }
    },
    goToLocusSearch: function (event) {
        if (event) {
            event.preventDefault();
            if (event.target) {
                $(event.target).parent().addClass('active').siblings().removeClass('active');
            }
        }
        this.dispatcher.trigger(EventNameEnum.goToLocusSearch);
    },
    goToIdentitySearch: function (event) {
        if (event) {
            event.preventDefault();
            if (event.target) {
                $(event.target).parent().addClass('active').siblings().removeClass('active');
            }
        }
        this.dispatcher.trigger(EventNameEnum.goToIdentitySearch);
    },
    goToSettings: function (event) {
        if (event) {
            event.preventDefault();
            if (event.target) {
                $(event.target).parent().addClass('active').siblings().removeClass('active');
            }
        }
        this.dispatcher.trigger(EventNameEnum.goToSettings);
    },
    onLoaded: function () {
        console.trace('HeaderView.onLoaded');
    },
    onLeave: function () {
        console.trace('HeaderView.onLeave');
    }
});

module.exports = HeaderView;