'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var BaseView = require('views/BaseView');
var EventNameEnum = require('enums/EventNameEnum');
var validation = require('backbone-validation');
var utils = require('lib/utils');
var optionTemplate = require('templates/Option.hbs');
var template = require('templates/CheckOutView.hbs');

var CheckOutView = BaseView.extend({

    /**
     *
     * @param options
     */
    initialize: function (options) {
        console.trace('CheckOutView.initialize');
        options || (options = {});
        this.controller = options.controller;
        this.dispatcher = options.dispatcher || this;

        this.myIdentityModel = options.myIdentityModel;
        this.purposeCollection = options.purposeCollection;
        this.durationCollection = options.durationCollection;

        this.listenTo(this.dispatcher, EventNameEnum.checkOutSuccess, this.onCheckOutSuccess);
        this.listenTo(this.purposeCollection, 'reset', this.renderPurposes);
        this.listenTo(this.durationCollection, 'reset', this.renderDurations);
        this.listenTo(this.model, 'validated', this.onValidated);
        this.listenTo(this, 'loaded', this.onLoaded);
        this.listenTo(this, 'leave', this.onLeave);
    },

    /**
     *
     * @returns {CheckOutView}
     */
    render: function () {
        var currentContext = this;
        var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model);
        currentContext.$el.html(template(renderModel));
        currentContext.bindValidation();
        return this;
    },

    //thirdPartyInitialize: function(){
    //    var currentContext = this;
    //    $('#purpose-input').material_select();
    //    $('#duration-input').material_select();
    //    return this;
    //},

    /**
     *
     */
    events: {
        'change #duration-input': 'durationChanged',
        'click #cancel-check-out-button': 'cancelCheckOut',
        'click #submit-check-out-button': 'submitCheckOut'
    },

    /**
     *
     * @param purposes
     * @returns {CheckOutView}
     */
    renderPurposes: function () {
        var currentContext = this;
        var optionsHtml = '';
        currentContext.purposeCollection.forEach(function (purposeModel) {
            optionsHtml += optionTemplate({
                'value': purposeModel.get('defaultDuration'),
                'text': purposeModel.get('purpose')
            });
        });
        currentContext.$('#purpose-input').append(optionsHtml);
        return this;
    },

    /**
     *
     * @param durations
     * @returns {CheckOutView}
     */
    renderDurations: function () {
        var currentContext = this;
        var optionsHtml = '';
        currentContext.durationCollection.forEach(function (durationModel) {
            optionsHtml += optionTemplate({
                'value': durationModel.get('minutes'),
                'text': durationModel.get('description')
            });
        });
        currentContext.$('#duration-input').append(optionsHtml);
        return this;
    },

    /**
     *
     * @returns {CheckOutView}
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
     * @returns {CheckOutView}
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
     * @returns {CheckOutView}
     */
    updateIdentityNameInput: function () {
        var currentContext = this;
        var identityId;
        if (currentContext.model.has('identityId')) {
            identityId = currentContext.model.get('identityId');
        }
        var identityName;
        if (currentContext.model.has('identityName')) {
            identityName = currentContext.model.get('identityName');
        }
        currentContext.$('#identity-name-input').attr('data-identity-id', identityId).val(identityName);
        return this;
    },

    /**
     *
     * @returns {CheckOutView}
     */
    updateLocusNameInput: function () {
        var currentContext = this;
        var locusId;
        if (currentContext.model.has('locusId')) {
            locusId = currentContext.model.get('locusId');
        }
        var locusName;
        if (currentContext.model.has('locusName')) {
            locusName = currentContext.model.get('locusName');
        }
        currentContext.$('#locus-name-input').attr('data-locus-id', locusId).val(locusName);
        return this;
    },

    /**
     *
     * @returns {CheckOutView}
     */
    updateDistanceInput: function () {
        var currentContext = this;
        var distance;
        if (currentContext.model.has('distance')) {
            distance = currentContext.model.get('distance');
        }
        return this;
    },

    /**
     *
     * @returns {CheckOutView}
     */
    updateLatitudeInput: function () {
        var currentContext = this;
        var latitude;
        if (currentContext.model.has('latitude')) {
            latitude = currentContext.model.get('latitude');
        }
        currentContext.$('#latitude-input').val(latitude);
        return this;
    },

    /**
     *
     * @returns {CheckOutView}
     */
    updateLongitudeInput: function () {
        var currentContext = this;
        var longitude;
        if (currentContext.model.has('longitude')) {
            longitude = currentContext.model.get('longitude');
        }
        currentContext.$('#longitude-input').val(longitude);
        return this;
    },

    /**
     *
     * @returns {CheckOutView}
     */
    updateContactNumberInput: function () {
        var currentContext = this;
        var formattedContactNumber;
        if (currentContext.model.has('contactNumber')) {
            var contactNumber = currentContext.model.get('contactNumber');
            var cleanedContactNumber = utils.cleanPhone(contactNumber);
            formattedContactNumber = utils.formatPhone(cleanedContactNumber);
        }
        currentContext.$('#contact-number-input').val(formattedContactNumber);
        return this;
    },

    /**
     *
     * @returns {CheckOutView}
     */
    updateEmailInput: function () {
        var currentContext = this;
        var email;
        if (currentContext.model.has('email')) {
            email = currentContext.model.get('email');
        }
        currentContext.$('#email-input').val(email);
        return this;
    },

    /**
     *
     * @returns {CheckOutView}
     */
    updatePurposeInput: function () {
        var currentContext = this;
        var purpose;
        if (currentContext.model.has('purpose')) {
            purpose = currentContext.model.get('purpose');
        }
        currentContext.$('#purpose-input').val(purpose);
        return this;
    },

    /**
     *
     * @returns {CheckOutView}
     */
    updateDurationInput: function () {
        var currentContext = this;
        var duration;
        if (currentContext.model.has('duration')) {
            duration = currentContext.model.get('duration');
        }
        currentContext.$('#duration-input').val(duration);
        return this;
    },

    /**
     *
     * @returns {CheckOutView}
     */
    updateExpectedOutTimeInput: function () {
        var currentContext = this;
        var expectedOutTime;
        if (currentContext.model.has('expectedOutTime')) {
            expectedOutTime = currentContext.model.get('expectedOutTime');
        }
        currentContext.$('#expected-out-time-input').val(expectedOutTime);

        return this;
    },

    /**
     *
     * @returns {CheckOutView}
     */
    updateInTimeInput: function () {
        var currentContext = this;
        var inTime;
        if (currentContext.model.has('inTime')) {
            inTime = currentContext.model.get('inTime');
        }
        currentContext.$('#in-time-input').val(inTime);

        return this;
    },

    /**
     *
     * @returns {CheckOutView}
     */
    updateOutTimeInput: function () {
        var currentContext = this;
        var outTime;
        if (currentContext.model.has('outTime')) {
            outTime = currentContext.model.get('outTime');
        }
        currentContext.$('#out-time-input').val(outTime);

        return this;
    },

    /**
     *
     * @returns {CheckOutView}
     */
    updateActualDurationInput: function () {
        var currentContext = this;
        var actualDuration;
        if (currentContext.model.has('actualDuration')) {
            actualDuration = currentContext.model.get('actualDuration');
        }
        currentContext.$('#actual-duration-input').val(actualDuration);

        return this;
    },

    /**
     *
     * @returns {CheckOutView}
     */
    updateHasGroupCheckInInput: function () {
        var currentContext = this;
        var hasGroupCheckIn;
        if (currentContext.model.has('hasGroupCheckIn')) {
            hasGroupCheckIn = currentContext.model.get('hasGroupCheckIn');
        }
        currentContext.$('#has-group-check-in-input').val(hasGroupCheckIn);
        return this;
    },

    /**
     *
     * @returns {CheckOutView}
     */
    updateAdditionalInfoInput: function () {
        var currentContext = this;
        var additionalInfo;
        if (currentContext.model.has('additionalInfo')) {
            additionalInfo = currentContext.model.get('additionalInfo');
        }
        currentContext.$('#additional-info-input').val(additionalInfo);
        return this;
    },

    /**
     *
     * @param event
     * @returns {CheckOutView}
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
            currentContext.$('#duration-input').val(defaultDuration);
        }
        return this;
    },

    /**
     *
     * @param show
     * @returns {CheckOutView}
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
     * @returns {CheckOutView}
     */
    durationChanged: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        var duration = currentContext.$('#duration-input').val();
        currentContext.manualDurationEntry = true;
        return this;
    },

    /**
     *
     * @param event
     * @returns {CheckOutView}
     */
    submitCheckOut: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        currentContext.showLoading();
        currentContext.updateModelFromView();
        currentContext.model.validate();
        return this;
    },

    /**
     *
     * @returns {CheckOutView}
     */
    updateModelFromView: function () {
        var currentContext = this;
        var attributes = {};

        //attributes.identityName = currentContext.$('#identity-name-input').val();
        //attributes.locusName = currentContext.$('#locus-name-input').val();
        //attributes.latitude = currentContext.$('#latitude-input').val();
        //attributes.longitude = currentContext.$('#longitude-input').val();
        //var rawContactNumber = currentContext.$('#contact-number-input').val();
        //attributes.contactNumber = utils.cleanPhone(rawContactNumber);
        //attributes.email = currentContext.$('#email-input').val();
        //attributes.purpose = currentContext.$('#purpose-input option:selected').text();
        //if (currentContext.$('#purpose-input').prop('selectedIndex') === 0) {
        //    attributes.purpose = '';
        //}
        //if (attributes.purpose === 'Other') {
        //    attributes.purposeOther = currentContext.$('#purpose-other-input').val();
        //}
        //attributes.duration = currentContext.$('#duration-input').val();
        //attributes.groupCheckIn = currentContext.$('#has-group-check-in-input').is(':checked');
        attributes.additionalInfo = currentContext.$('#additional-info-input').val();

        currentContext.model.set(attributes);
        return this;
    },

    /**
     *
     * @param isValid
     * @param model
     * @param errors
     * @returns {CheckOutView}
     */
    onValidated: function (isValid, model, errors) {
        var currentContext = this;

        currentContext.$('.validate').each(function () {
            $(this).parent().parent().removeClass('invalid');
        });

        if (isValid) {
            currentContext.checkOut();
        } else {
            currentContext.hideLoading();
            for (var error in errors) {
                currentContext.$('[name="' + error + '"]').parent().parent().addClass('invalid');
            }
        }
        return this;
    },

    /**
     *
     * @param event
     * @returns {CheckOutView}
     */
    cancelCheckOut: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        var locusId = currentContext.model.get('locusId');
        currentContext.dispatcher.trigger(EventNameEnum.goToLocusWithId, locusId);
        return this;
    },

    /**
     *
     * @param event
     * @returns {CheckOutView}
     */
    checkOut: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        currentContext.dispatcher.trigger(EventNameEnum.checkOut, currentContext.model);
        return this;
    },

    /**
     *
     * @returns {CheckOutView}
     */
    onCheckOutSuccess: function () {
        var currentContext = this;
        var locusId = currentContext.model.get('locusId');
        currentContext.dispatcher.trigger(EventNameEnum.goToLocusWithId, locusId);
        return this;
    },

    /**
     *
     */
    onLoaded: function () {
        var currentContext = this;
        currentContext.hideLoading();
    },

    /**
     *
     */
    onLeave: function () {
        var currentContext = this;
        console.trace('CheckOutView.onLeave');
        //$('#purpose-input').material_select('destroy');
        //$('#duration-input').material_select('destroy');
    }
});

module.exports = CheckOutView;
