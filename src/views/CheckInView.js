'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var BaseView = require('views/BaseView');
var EntryLogModel = require('models/EntryLogModel');
var EventNameEnum = require('enums/EventNameEnum');
var CheckInTypeEnum = require('enums/CheckInTypeEnum');
var validation = require('backbone-validation');
var utils = require('lib/utils');
var optionTemplate = require('templates/Option.hbs');
var template = require('templates/CheckInView.hbs');

var CheckInView = BaseView.extend({

    /**
     *
     * @param options
     */
    initialize: function (options) {
        console.trace('CheckInView.initialize');
        options || (options = {});
        this.controller = options.controller;
        this.dispatcher = options.dispatcher || this;

        this.myIdentityModel = options.myIdentityModel;
        this.openEntryLogyModel = options.openEntryLogyModel;
        this.locusModel = options.locusModel;
        this.purposeCollection = options.purposeCollection;
        this.durationCollection = options.durationCollection;

        this.listenTo(this.model, 'validated', this.onValidated);
        this.listenTo(this.purposeCollection, 'reset', this.renderPurposes);
        this.listenTo(this.durationCollection, 'reset', this.renderDurations);
        this.listenTo(this.dispatcher, EventNameEnum.checkInSuccess, this.onCheckInSuccess);
        this.listenTo(this.dispatcher, EventNameEnum.checkInError, this.onCheckInError);
        this.listenTo(this, 'loaded', this.onLoaded);
        this.listenTo(this, 'leave', this.onLeave);
    },

    /**
     *
     * @returns {CheckInView}
     */
    render: function () {
        var currentContext = this;
        currentContext.setElement(template());
        currentContext.bindValidation();
        return this;
    },

    /**
     *
     */
    events: {
        'change #purpose-input': 'purposeChanged',
        'change #duration-input': 'durationChanged',
        'click #submit-check-in-button': 'submitCheckIn',
        'click #cancel-check-in-button': 'cancelCheckIn'
    },

    /**
     *
     * @param purposes
     * @returns {CheckInView}
     */
    renderPurposes: function () {
        var currentContext = this;
        var optionsHtml = '';
        currentContext.purposeCollection.forEach(function (purposeModel) {
            optionsHtml += optionTemplate({
                'value': purposeModel.get('value'),
                'text': purposeModel.get('text')
            });
        });
        currentContext.$('#purpose-input').append(optionsHtml);
        return this;
    },

    /**
     *
     * @param durations
     * @returns {CheckInView}
     */
    renderDurations: function () {
        var currentContext = this;
        var optionsHtml = '';
        currentContext.durationCollection.forEach(function (durationModel) {
            optionsHtml += optionTemplate({
                'value': durationModel.get('value'),
                'text': durationModel.get('text')
            });
        });
        currentContext.$('#duration-input').append(optionsHtml);
        return this;
    },

    /**
     *
     * @returns {CheckInView}
     */
    bindValidation: function () {
        var currentContext = this;
        validation.bind(this, {
            selector: 'name'
        });
        return this;
    },

    /**
     *
     * @returns {CheckInView}
     */
    updateModelFromParentModels: function () {
        var currentContext = this;
        if (currentContext.openEntryLogyModel && currentContext.openEntryLogyModel.has('entryLogId')) {
            currentContext.trigger('error');
            return this;
        }
        if (currentContext.model.get('checkInType') === CheckInTypeEnum.locus) {
            if (currentContext.locusModel && currentContext.locusModel.has('locusId')) {
                currentContext.model.set({'locusId': currentContext.locusModel.get('locusId')});
                currentContext.model.set({'locusName': currentContext.locusModel.get('locusName')});
                currentContext.model.set({'distance': currentContext.locusModel.get('distance')});
                currentContext.model.set({'latitude': currentContext.locusModel.get('latitude')});
                currentContext.model.set({'longitude': currentContext.locusModel.get('longitude')});
            } else {
                currentContext.trigger('error');
                return this;
            }
        }
        currentContext.model.set({'identityId': currentContext.myIdentityModel.get('identityId')});
        currentContext.model.set({'identityName': currentContext.myIdentityModel.get('identityName')});
        currentContext.model.set({'firstName': currentContext.myIdentityModel.get('firstName')});
        currentContext.model.set({'middleName': currentContext.myIdentityModel.get('middleName')});
        currentContext.model.set({'lastName': currentContext.myIdentityModel.get('lastName')});
        currentContext.model.set({'contactNumber': currentContext.myIdentityModel.get('contactNumber')});
        currentContext.model.set({'email': currentContext.myIdentityModel.get('email')});
        return this;
    },

    /**
     *
     * @returns {CheckInView}
     */
    updateViewFromModel: function () {
        var currentContext = this;
        currentContext.updateIdentityNameInput();
        currentContext.updateLocusNameInput();
        currentContext.updateDistanceInput();
        currentContext.updateLatitudeInput();
        currentContext.updateLongitudeInput();
        currentContext.updateContactNumberInput();
        currentContext.updateEmailInput();
        currentContext.updatePurposeInput();
        currentContext.updateDurationInput();
        currentContext.updateExpectedOutTimeInput();
        currentContext.updateInTimeInput();
        currentContext.updateOutTimeInput();
        currentContext.updateActualDurationInput();
        currentContext.updateHasGroupCheckInInput();
        currentContext.updateAdditionalInfoInput();
        return this;
    },

    /**
     *
     * @returns {CheckInView}
     */
    updateIdentityNameInput: function () {
        var currentContext = this;
        if (currentContext.model.has('identityName')) {
            var identityName = currentContext.model.get('identityName');
            currentContext.$('#identity-name-input').val(identityName).parent().addClass('control-highlight');
        }
        return this;
    },

    /**
     *
     * @returns {CheckInView}
     */
    updateLocusNameInput: function () {
        var currentContext = this;
        if (currentContext.model.has('locusName')) {
            var locusName = currentContext.model.get('locusName');
            currentContext.$('#locus-name-input').val(locusName).parent().addClass('control-highlight');
        }
        return this;
    },

    /**
     *
     * @returns {CheckInView}
     */
    updateDistanceInput: function () {
        var currentContext = this;
        if (currentContext.model.has('distance')) {
            var distance = currentContext.model.get('distance');
            currentContext.$('#distance-input').val(distance).parent().addClass('control-highlight');
        }
        return this;
    },

    /**
     *
     * @returns {CheckInView}
     */
    updateLatitudeInput: function () {
        var currentContext = this;
        if (currentContext.model.has('latitude')) {
            var latitude = currentContext.model.get('latitude');
            currentContext.$('#latitude-input').val(latitude).parent().addClass('control-highlight');
        }
        return this;
    },

    /**
     *
     * @returns {CheckInView}
     */
    updateLongitudeInput: function () {
        var currentContext = this;
        if (currentContext.model.has('longitude')) {
            var longitude = currentContext.model.get('longitude');
            currentContext.$('#longitude-input').val(longitude).parent().addClass('control-highlight');
        }
        return this;
    },

    /**
     *
     * @returns {CheckInView}
     */
    updateContactNumberInput: function () {
        var currentContext = this;
        if (currentContext.model.has('contactNumber')) {
            var contactNumber = currentContext.model.get('contactNumber');
            var cleanedContactNumber = utils.cleanPhone(contactNumber);
            var formattedContactNumber = utils.formatPhone(cleanedContactNumber);
            currentContext.$('#contact-number-input').val(formattedContactNumber).parent().addClass('control-highlight');
        }
        return this;
    },

    /**
     *
     * @returns {CheckInView}
     */
    updateEmailInput: function () {
        var currentContext = this;
        if (currentContext.model.has('email')) {
            var email = currentContext.model.get('email');
            currentContext.$('#email-input').val(email).parent().addClass('control-highlight');
        }
        return this;
    },

    /**
     *
     * @returns {CheckInView}
     */
    updatePurposeInput: function () {
        var currentContext = this;
        if (currentContext.model.has('purpose')) {
            var purpose = currentContext.model.get('purpose');
            currentContext.$('#purpose-input').val(purpose).parent().addClass('control-highlight');
        }
        return this;
    },

    /**
     *
     * @returns {CheckInView}
     */
    updateDurationInput: function (newDuration) {
        var currentContext = this;
        if (newDuration) {
            currentContext.model.set({duration: newDuration});
        }
        if (currentContext.model.has('duration')) {
            var duration = currentContext.model.get('duration');
            currentContext.$('#duration-input').val(duration).parent().addClass('control-highlight');
        }
        return this;
    },

    /**
     *
     * @returns {CheckInView}
     */
    updateExpectedOutTimeInput: function (duration) {
        var currentContext = this;
        if (duration) {
            var currentTime = new Date();
            var expectedOutTime = utils.addMinutes(currentTime, duration);
            currentContext.model.set({expectedOutTime: expectedOutTime});
        }
        if (currentContext.model.has('expectedOutTime')) {
            var expectedOutTime = currentContext.model.get('expectedOutTime');
            currentContext.$('#expected-out-time-input').val(utils.formatDate(expectedOutTime)).parent().addClass('control-highlight');
        }

        return this;
    },

    /**
     *
     * @returns {CheckInView}
     */
    updateInTimeInput: function () {
        var currentContext = this;
        if (currentContext.model.has('inTime')) {
            var inTime = currentContext.model.get('inTime');
            currentContext.$('#in-time-input').val(inTime).parent().addClass('control-highlight');
        }

        return this;
    },

    /**
     *
     * @returns {CheckInView}
     */
    updateOutTimeInput: function () {
        var currentContext = this;
        if (currentContext.model.has('outTime')) {
            var outTime = currentContext.model.get('outTime');
            currentContext.$('#out-time-input').val(outTime).parent().addClass('control-highlight');
        }

        return this;
    },

    /**
     *
     * @returns {CheckInView}
     */
    updateActualDurationInput: function () {
        var currentContext = this;
        if (currentContext.model.has('actualDuration')) {
            var actualDuration = currentContext.model.get('actualDuration');
            currentContext.$('#actual-duration-input').val(actualDuration).parent().addClass('control-highlight');
        }

        return this;
    },

    /**
     *
     * @returns {CheckInView}
     */
    updateHasGroupCheckInInput: function () {
        var currentContext = this;
        if (currentContext.model.has('hasGroupCheckIn')) {
            var hasGroupCheckIn = currentContext.model.get('hasGroupCheckIn');
            currentContext.$('#has-group-check-in-input').val(hasGroupCheckIn);
        }
        return this;
    },

    /**
     *
     * @returns {CheckInView}
     */
    updateAdditionalInfoInput: function () {
        var currentContext = this;
        if (currentContext.model.has('additionalInfo')) {
            var additionalInfo = currentContext.model.get('additionalInfo');
            currentContext.$('#additional-info-input').val(additionalInfo).parent().addClass('control-highlight');
        }
        return this;
    },

    /**
     *
     * @param event
     * @returns {CheckInView}
     */
    purposeChanged: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        var purpose = currentContext.$('#purpose-input option:selected').text();
        currentContext.togglePurposeOther(purpose === 'Other');
        if (!currentContext.manualDurationEntry) {
            var defaultDuration = currentContext.$('#purpose-input').val();
            currentContext.updateDurationInput(defaultDuration);
            currentContext.updateExpectedOutTimeInput(defaultDuration);
        }
        return this;
    },

    /**
     *
     * @param show
     * @returns {CheckInView}
     */
    togglePurposeOther: function (show) {
        var currentContext = this;
        if (show) {
            currentContext.$('#purpose-other-input-container').removeClass('hidden');
        } else {
            currentContext.$('#purpose-other-input-container').addClass('hidden');
        }
        return this;
    },

    /**
     *
     * @param event
     * @returns {CheckInView}
     */
    durationChanged: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        currentContext.manualDurationEntry = true;
        var duration = Number(currentContext.$('#duration-input').val());
        currentContext.updateExpectedOutTimeInput(duration);
        return this;
    },

    /**
     *
     * @param event
     * @returns {CheckInView}
     */
    submitCheckIn: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        currentContext.updateModelFromView();
        currentContext.model.validate();
        return this;
    },

    /**
     *
     * @returns {CheckInView}
     */
    updateModelFromView: function () {
        var currentContext = this;
        var attributes = {};

        attributes.latitude = currentContext.$('#latitude-input').val();
        attributes.longitude = currentContext.$('#longitude-input').val();
        var rawContactNumber = currentContext.$('#contact-number-input').val();
        attributes.contactNumber = utils.cleanPhone(rawContactNumber);
        attributes.email = currentContext.$('#email-input').val();
        attributes.purpose = currentContext.$('#purpose-input option:selected').text();
        if (currentContext.$('#purpose-input').prop('selectedIndex') === 0) {
            attributes.purpose = '';
        }
        if (attributes.purpose === 'Other') {
            attributes.purposeOther = currentContext.$('#purpose-other-input').val();
        }
        attributes.duration = currentContext.$('#duration-input').val();
        attributes.groupCheckIn = currentContext.$('#has-group-check-in-input').is(':checked');
        attributes.additionalInfo = currentContext.$('#additional-info-input').val();

        currentContext.model.set(attributes);
        return this;
    },

    /**
     *
     * @param isValid
     * @param model
     * @param errors
     * @returns {CheckInView}
     */
    onValidated: function (isValid, model, errors) {
        var currentContext = this;

        if (isValid) {
            currentContext.checkIn();
        } else {
            for (var error in errors) {
                currentContext.$('[name="' + error + '"]').parent().addClass('form-group-red');
            }
        }
        return this;
    },

    /**
     *
     * @param event
     * @returns {CheckInView}
     */
    checkIn: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        currentContext.dispatcher.trigger(EventNameEnum.checkIn, currentContext.model);
        return this;
    },

    /**
     *
     * @param event
     * @returns {CheckInView}
     */
    cancelCheckIn: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        var locusId = currentContext.model.get('locusId');
        if (locusId) {
            currentContext.dispatcher.trigger(EventNameEnum.goToLocusWithId, locusId);
        } else {
            currentContext.dispatcher.trigger(EventNameEnum.goToLocusSearch);
        }
        return this;
    },

    /**
     *
     * @returns {CheckInView}
     */
    onCheckInSuccess: function () {
        var currentContext = this;
        var locusId = currentContext.model.get('locusId');
        if (locusId) {
            currentContext.dispatcher.trigger(EventNameEnum.goToLocusWithId, locusId);
        } else {
            currentContext.dispatcher.trigger(EventNameEnum.goToLocusSearch);
        }
        return this;
    },

    /**
     *
     * @returns {CheckInView}
     */
    onCheckInError: function () {
        var currentContext = this;
        return this;
    },

    /**
     *
     */
    onError: function (error) {
        var currentContext = this;
        currentContext.$('.form-group-wrap').addClass('el-loading-done');
        return this;
    },

    /**
     *
     */
    onLoaded: function () {
        console.trace('CheckInView.onLoaded');
        var currentContext = this;
        currentContext.updateModelFromParentModels();
        currentContext.updateViewFromModel();
        currentContext.$('.form-group-wrap').addClass('el-loading-done');
    },

    /**
     *
     */
    onLeave: function () {
        console.trace('CheckInView.onLeave');
        var currentContext = this;
    }
});

module.exports = CheckInView;
