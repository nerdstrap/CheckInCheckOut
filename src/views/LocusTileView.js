'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var BaseView = require('views/BaseView');
var EventNameEnum = require('enums/EventNameEnum');
var utils = require('lib/utils');
var template = require('templates/LocusTileView.hbs');

var LocusTileView = BaseView.extend({
    /**
     *
     * @param options
     */
    initialize: function (options) {
        console.trace('LocusTileView.initialize');
        options || (options = {});
        this.dispatcher = options.dispatcher || this;

        this.listenTo(this, 'loaded', this.onLoaded);
        this.listenTo(this, 'leave', this.onLeave);
    },

    /**
     *
     * @returns {LocusTileView}
     */
    render: function () {
        var currentContext = this;
        var renderModel = _.extend({}, currentContext.model.attributes);
        currentContext.setElement(template(renderModel));
        currentContext.updateViewFromModel();
        return this;
    },

    /**
     *
     */
    events: {
        'click [data-toggle="tile"]': 'tileToggleCollapse',
        'click .add-favorite-locus-button': 'addFavoriteLocus',
        'click [data-toggle="dropdown"]': 'dropdownToggleCollapse',
        'click .go-to-map-button': 'goToMap',
        'click .go-to-locus-button': 'goToLocus',
        'click .share-locus-button': 'shareLocus',
        'click .dismiss-button': 'tileToggleCollapse'
    },

    /**
     *
     * @returns {LocusTileView}
     */
    updateViewFromModel: function () {
        var currentContext = this;
        currentContext.updateIcons();
        currentContext.updateLocusNameLabel();
        currentContext.updateDistanceLabel();
        currentContext.updatePhoneLabel();
        return this;
    },

    /**
     *
     * @returns {LocusTileView}
     */
    updateIcons: function () {
        var currentContext = this;

        if (currentContext.model.has('hasHazard') && currentContext.model.get('hasHazard') === true) {
            currentContext.$('.hazard-icon').removeClass('hidden');
        } else {
            currentContext.$('.hazard-icon').addClass('hidden');
        }

        if (currentContext.model.has('hasOpenReports') && currentContext.model.get('hasOpenReports') === true) {
            currentContext.$('.open-reports-icon').removeClass('hidden');
        } else {
            currentContext.$('.open-reports-icon').addClass('hidden');
        }

        if (currentContext.model.has('hasActiveIssues') && currentContext.model.get('hasActiveIssues') === true) {
            currentContext.$('.active-issues-icon').removeClass('hidden');
        } else {
            currentContext.$('.active-issues-icon').addClass('hidden');
        }

        if (currentContext.model.has('hasOpenCheckIns') && currentContext.model.get('hasOpenCheckIns') === true) {
            currentContext.$('.open-check-ins-icon').removeClass('hidden');
        } else {
            currentContext.$('.open-check-ins-icon').addClass('hidden');
        }

        return this;
    },

    /**
     *
     * @returns {LocusTileView}
     */
    updateLocusNameLabel: function () {
        var currentContext = this;
        var locusName;
        if (currentContext.model.has('locusName')) {
            locusName = currentContext.model.get('locusName');
        }
        currentContext.$('.locus-name-label').html(locusName);
        return this;
    },

    /**
     *
     * @returns {LocusTileView}
     */
    updatePhoneLabel: function () {
        var currentContext = this;
        var formattedLocusPhone;
        if (currentContext.model.has('phone')) {
            currentContext.hasLocusPhone = true;
            var phone = currentContext.model.get('phone');
            var cleanedLocusPhone = utils.cleanPhone(phone);
            formattedLocusPhone = utils.formatPhone(cleanedLocusPhone);
        } else {
            formattedLocusPhone = utils.getResource('phoneUnavailableErrorMessage');
        }
        currentContext.$('.phone-label').html(formattedLocusPhone);
        return this;
    },

    /**
     *
     * @returns {LocusTileView}
     */
    updateDistanceLabel: function () {
        var currentContext = this;
        var formattedDistance;
        if (currentContext.model.has('distance') && currentContext.model.has('latitude') && currentContext.model.has('longitude')) {
            currentContext.hasCoordinates = true;
            var distance = currentContext.model.get('distance').toFixed(0);
            formattedDistance = utils.formatString(utils.getResource('distanceFormatString'), [distance]);
        } else {
            formattedDistance = utils.getResource('coordinatesUnavailableErrorMessage');
        }
        currentContext.$('.distance-label').html(formattedDistance);
        return this;
    },

    /**
     *
     * @param event
     * @returns {LocusTileView}
     */
    shareLocus: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        var locusId = this.model.get('locusId');
        //currentContext.dispatcher.trigger(EventNameEnum.goToLocusWithId, locusId);
        return this;
    },

    /**
     *
     * @param event
     * @returns {LocusTileView}
     */
    addFavoriteLocus: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        var locusId = this.model.get('locusId');
        //currentContext.dispatcher.trigger(EventNameEnum.goToLocusWithId, locusId);
        return this;
    },

    /**
     *
     * @param event
     * @returns {LocusTileView}
     */
    goToMap: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        var locusId = this.model.get('locusId');
        currentContext.dispatcher.trigger(EventNameEnum.goToLocusWithId, locusId);
        return this;
    },

    /**
     *
     * @param event
     * @returns {LocusTileView}
     */
    goToLocus: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        var locusId = this.model.get('locusId');
        currentContext.dispatcher.trigger(EventNameEnum.goToLocusWithId, locusId);
        return this;
    },

    /**
     *
     * @param event
     * @returns {LocusTileView}
     */
    tileToggleCollapse: function (event) {
        if (event) {
            event.preventDefault();
            var $target = $(event.target);
            if ($target.is('[data-toggle="tile"], [data-toggle="tile"] *') && !$target.is('[data-ignore="tile"], [data-ignore="tile"] *')) {
                var $trigger = $target.closest('[data-toggle="tile"]');
                if ($trigger.attr('data-parent') != null) {
                    $($trigger.attr('data-parent')).find('.tile-active-show').collapse('hide');
                }
                $(this.getTargetFromTrigger($trigger)).collapse('toggle');
            } else if ($target.is('[data-dismiss="tile"]')) {
                $target.closest('.tile-collapse').find('.tile-active-show').collapse('hide');
            } else if (!$target.is('.tile-collapse, .tile-collapse *')) {
                this.tileReset();
            }
        }

        return this;
    },

    /**
     *
     * @param event
     * @returns {LocusTileView}
     */
    dropdownToggleCollapse: function (event) {
        if (event) {
            event.preventDefault();
            var $target = $(event.target);
            if ($target.is('[data-toggle="dropdown"], [data-toggle="dropdown"] *')) {
                $target.toggle();
            }
        }

        return this;
    },

    getTargetFromTrigger: function (trigger) {
        var href;
        var target = trigger.attr('data-target') || (href = trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '');
        return target;
    },

    tileReset: function () {
        $('.tile-collapse.active').each(function (index) {
            var $collapse = $('.tile-active-show', $(this));
            if (!$collapse.hasClass('tile-active-show-still')) {
                $collapse.collapse('hide');
            }
        });
    },

    /**
     *
     */
    onSync: function () {

    },

    /**
     *
     */
    onReset: function () {

    },

    /**
     *
     */
    onLoaded: function () {
        var currentContext = this;
        console.trace('LocusTileView.onLoaded');
    },

    /**
     *
     */
    onLeave: function () {
        var currentContext = this;
        console.trace('LocusTileView.onLeave');
    }
});

module.exports = LocusTileView;