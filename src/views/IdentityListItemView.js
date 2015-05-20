'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var CompositeView = require('views/CompositeView');
var EventNamesEnum = require('enums/EventNamesEnum');
var utils = require('utils');
var template = require('hbs!templates/IdentityListItemView');

var IdentityListItemView = CompositeView.extend({
    /**
     *
     */
    tagName: 'li',

    /**
     *
     */
    className: 'identity-list-item-view',

    /**
     *
     * @param options
     */
    initialize: function (options) {
        console.trace('IdentityListItemView.initialize');
        options || (options = {});
        this.controller = options.controller;
        this.dispatcher = options.dispatcher || this;

        this.listenTo(this.model, 'reset', this.updateViewFromModel);
        this.listenTo(this, 'leave', this.onLeave);
    },

    /**
     *
     * @returns {IdentityListItemView}
     */
    render: function () {
        console.trace('IdentityListItemView.render()');
        var currentContext = this;
        var renderModel = _.extend({}, currentContext.model.attributes);
        currentContext.$el.html(template(renderModel));
        this.updateViewFromModel();
        return this;
    },

    /**
     *
     */
    events: {
        'click .go-to-identity-button': 'goToIdentity',
        'click .go-to-directions-button': 'goToDirections'
    },

    /**
     *
     * @returns {IdentityListItemView}
     */
    updateViewFromModel: function () {
        var currentContext = this;

        var identityName;
        if (currentContext.model.has('identityName')) {
            identityName = currentContext.model.get('identityName');
        }
        currentContext.$('.identity-name-label').html(identityName);

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
     * @returns {IdentityListItemView}
     */
    goToIdentity: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        var identityId = this.model.get('identityId');
        currentContext.dispatcher.trigger(EventNamesEnum.goToIdentityWithId, identityId);
        return this;
    },

    /**
     *
     * @param event
     * @returns {IdentityListItemView}
     */
    goToDirections: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        var latitude = currentContext.model.get('latitude');
        var longitude = currentContext.model.get('longitude');
        currentContext.dispatcher.trigger(EventNamesEnum.goToDirectionsWithLatLng, latitude, longitude);
        return this;
    },

    /**
     *
     */
    onLeave: function () {
        var currentContext = this;
        console.trace('IdentityListItemView.onLeave');
    }
});

module.exports = IdentityListItemView;