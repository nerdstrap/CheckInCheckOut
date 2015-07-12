'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var BaseView = require('views/BaseView');
var EventNameEnum = require('enums/EventNameEnum');
var utils = require('lib/utils');
var template = require('templates/EntryLogTileView.hbs');

var EntryLogTileView = BaseView.extend({
    /**
     *
     */
    showIdentity: true,

    /**
     *
     */
    showLocus: false,

    /**
     *
     * @param options
     */
    initialize: function (options) {
        console.trace('EntryLogTileView.initialize');
        options || (options = {});
        this.controller = options.controller;
        this.dispatcher = options.dispatcher || this;

        this.myIdentityModel = options.myIdentityModel;
        if (options.showIdentity) {
            this.showIdentity = options.showIdentity;
        }
        if (options.showLocus) {
            this.showLocus = options.showLocus;
        }

        this.listenTo(this, 'loaded', this.onLoaded);
        this.listenTo(this, 'leave', this.onLeave);
    },

    /**
     *
     * @returns {EntryLogTileView}
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
        //'click [data-toggle="tile"]': 'tileToggleCollapse',
        //'click .share-locus-button': 'shareLocus',
        //'click .add-favorite-locus-button': 'addFavoriteLocus',
        //'click .dropdown-toggle-button': 'dropdownToggleCollapse',
        //'click .go-to-map-button': 'goToMap',
        //'click .go-to-locus-button': 'goToLocus',
        //'click .tile-toggle-button': 'tileToggleCollapse'
    },

    /**
     *
     * @returns {EntryLogTileView}
     */
    updateViewFromModel: function () {
        var currentContext = this;
        currentContext.updateIdentityNameLabel();
        currentContext.updateLocusNameLabel();
        currentContext.updateDistanceLabel();
        currentContext.updateLatitudeLabel();
        currentContext.updateLongitudeLabel();
        currentContext.updateContactNumberLabel();
        currentContext.updateEmailLabel();
        currentContext.updatePurposeLabel();
        currentContext.updateDurationLabel();
        currentContext.updateExpectedOutTimeLabel();
        currentContext.updateInTimeLabel();
        currentContext.updateOutTimeLabel();
        currentContext.updateActualDurationLabel();
        currentContext.updateHasGroupCheckInLabel();
        currentContext.updateAdditionalInfoLabel();

        if (currentContext.showIdentity) {
            currentContext.$('.entry-log-avatar').removeClass('mdi-maps-place').addClass('mdi-social-person');
            currentContext.$('.identity-name-label').removeClass('hidden');
            currentContext.$('.locus-name-label').addClass('hidden');
        } else {
            currentContext.$('.entry-log-avatar').removeClass('mdi-social-person').addClass('mdi-maps-place');
            currentContext.$('.identity-name-label').addClass('hidden');
            currentContext.$('.locus-name-label').removeClass('hidden');
        }

        return this;
    },

    /**
     *
     * @returns {EntryLogTileView}
     */
    updateIdentityNameLabel: function () {
        var currentContext = this;
        var identityId;
        if (currentContext.model.has('identityId')) {
            identityId = currentContext.model.get('identityId');
        }
        var identityName;
        if (currentContext.model.has('identityName')) {
            identityName = currentContext.model.get('identityName');
        }
        currentContext.$('#identity-name-label').attr('data-identity-id', identityId).val(identityName);
        return this;
    },

    /**
     *
     * @returns {EntryLogTileView}
     */
    updateLocusNameLabel: function () {
        var currentContext = this;
        var locusId;
        if (currentContext.model.has('locusId')) {
            locusId = currentContext.model.get('locusId');
        }
        var locusName;
        if (currentContext.model.has('locusName')) {
            locusName = currentContext.model.get('locusName');
        }
        currentContext.$('#locus-name-label').attr('data-locus-id', locusId).val(locusName);
        return this;
    },

    /**
     *
     * @returns {EntryLogTileView}
     */
    updateDistanceLabel: function () {
        var currentContext = this;
        var distance;
        if (currentContext.model.has('distance')) {
            distance = currentContext.model.get('distance');
        }
        return this;
    },

    /**
     *
     * @returns {EntryLogTileView}
     */
    updateLatitudeLabel: function () {
        var currentContext = this;
        var latitude;
        if (currentContext.model.has('latitude')) {
            latitude = currentContext.model.get('latitude');
        }
        currentContext.$('#latitude-label').val(latitude);
        return this;
    },

    /**
     *
     * @returns {EntryLogTileView}
     */
    updateLongitudeLabel: function () {
        var currentContext = this;
        var longitude;
        if (currentContext.model.has('longitude')) {
            longitude = currentContext.model.get('longitude');
        }
        currentContext.$('#longitude-label').val(longitude);
        return this;
    },

    /**
     *
     * @returns {EntryLogTileView}
     */
    updateContactNumberLabel: function () {
        var currentContext = this;
        var formattedContactNumber;
        if (currentContext.model.has('contactNumber')) {
            var contactNumber = currentContext.model.get('contactNumber');
            var cleanedContactNumber = utils.cleanPhone(contactNumber);
            formattedContactNumber = utils.formatPhone(cleanedContactNumber);
        }
        currentContext.$('#contact-number-label').val(formattedContactNumber);
        return this;
    },

    /**
     *
     * @returns {EntryLogTileView}
     */
    updateEmailLabel: function () {
        var currentContext = this;
        var email;
        if (currentContext.model.has('email')) {
            email = currentContext.model.get('email');
        }
        currentContext.$('#email-label').val(email);
        return this;
    },

    /**
     *
     * @returns {EntryLogTileView}
     */
    updatePurposeLabel: function () {
        var currentContext = this;
        var purpose;
        if (currentContext.model.has('purpose')) {
            purpose = currentContext.model.get('purpose');
        }
        currentContext.$('#purpose-label').val(purpose);
        return this;
    },

    /**
     *
     * @returns {EntryLogTileView}
     */
    updateDurationLabel: function () {
        var currentContext = this;
        var duration;
        if (currentContext.model.has('duration')) {
            duration = currentContext.model.get('duration');
        }
        currentContext.$('#duration-label').val(duration);
        return this;
    },

    /**
     *
     * @returns {EntryLogTileView}
     */
    updateExpectedOutTimeLabel: function () {
        var currentContext = this;
        var formattedExpectedOutTime;
        if (currentContext.model.has('expectedOutTime')) {
            var expectedOutTime = currentContext.model.get('expectedOutTime');
            formattedExpectedOutTime = utils.formatDate(expectedOutTime);
        }
        currentContext.$('#expected-out-time-label').val(formattedExpectedOutTime);

        return this;
    },

    /**
     *
     * @returns {EntryLogTileView}
     */
    updateInTimeLabel: function () {
        var currentContext = this;
        var formattedInTime;
        if (currentContext.model.has('inTime')) {
            var inTime = currentContext.model.get('inTime');
            formattedInTime = utils.formatDate(inTime);
        }
        currentContext.$('#in-time-label').val(formattedInTime);

        return this;
    },

    /**
     *
     * @returns {EntryLogTileView}
     */
    updateOutTimeLabel: function () {
        var currentContext = this;
        var formattedOutTime;
        if (currentContext.model.has('outTime')) {
            var outTime = currentContext.model.get('outTime');
            formattedOutTime = utils.formatDate(outTime);
        }
        currentContext.$('#out-time-label').val(formattedOutTime);

        return this;
    },

    /**
     *
     * @returns {EntryLogTileView}
     */
    updateActualDurationLabel: function () {
        var currentContext = this;
        var actualDuration;
        if (currentContext.model.has('actualDuration')) {
            actualDuration = currentContext.model.get('actualDuration');
        }
        currentContext.$('#actual-duration-label').val(actualDuration);

        return this;
    },

    /**
     *
     * @returns {EntryLogTileView}
     */
    updateHasGroupCheckInLabel: function () {
        var currentContext = this;
        var hasGroupCheckIn;
        if (currentContext.model.has('hasGroupCheckIn')) {
            hasGroupCheckIn = currentContext.model.get('hasGroupCheckIn');
        }
        currentContext.$('#has-group-check-in-label').val(hasGroupCheckIn);
        return this;
    },

    /**
     *
     * @returns {EntryLogTileView}
     */
    updateAdditionalInfoLabel: function () {
        var currentContext = this;
        var additionalInfo;
        if (currentContext.model.has('additionalInfo')) {
            additionalInfo = currentContext.model.get('additionalInfo');
        }
        currentContext.$('#additional-info-label').val(additionalInfo);
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
     * @returns {EntryLogTileView}
     */
    goToItem: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        if (currentContext.showIdentity) {
            var identityId = currentContext.model.get('identityId');
            currentContext.dispatcher.trigger(EventNameEnum.goToIdentityWithId, identityId);
        } else {
            var locusId = currentContext.model.get('locusId');
            currentContext.dispatcher.trigger(EventNameEnum.goToLocusWithId, locusId);
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
            if (event.target) {
                var dropdownToggleButton;
                if (event.target.nodeName === 'A') {
                    dropdownToggleButton = $(event.target);
                } else if (event.target.parentNode && event.target.parentNode.nodeName === 'A') {
                    dropdownToggleButton = $(event.target.parentNode);
                }
                if (dropdownToggleButton){
                    dropdownToggleButton.parent().addClass('active');
                    dropdownToggleButton.next().addClass('collapse in');
                }
            }
        }
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
            if (event.target) {
                if (event.target.nodeName === 'A') {
                    return this;
                } else if (event.target.parentNode && event.target.parentNode.nodeName === 'A') {
                    return this;
                }
            }
        }
        var currentContext = this;
        var entryLogId;
        if (currentContext.model.has('entryLogId')) {
            entryLogId = currentContext.model.get('entryLogId');
        }
        var tileCollapseId = 'tile-collapse-' + entryLogId;
        currentContext.$('#' + tileCollapseId).toggleClass('collapse');
        return this;
    },

    /**
     *
     */
    onLoaded: function () {
        var currentContext = this;
        console.trace('EntryLogTileView.onLoaded');
    },

    /**
     *
     */
    onLeave: function () {
        var currentContext = this;
        console.trace('EntryLogTileView.onLeave');
    }
});

module.exports = EntryLogTileView;
