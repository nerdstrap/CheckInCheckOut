'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var CheckInStatusEnum = require('enums/CheckInStatusEnum');
var config = require('lib/config');
var utils = require('lib/utils');

/**
 *
 * @type {EntryLogModel}
 */
var EntryLogModel = Backbone.Model.extend({

    /**
     *
     */
    idAttribute: 'entryLogId',

    /**
     *
     */
    validation: {
        locusId: {
            required: true,
            minLength: 1
        },
        locusName: {
            required: true,
            minLength: 1
        },
        identityId: {
            required: true,
            minLength: 1
        },
        identityName: {
            required: true,
            minLength: 1
        },
        contactNumber: {
            required: true,
            pattern: 'digits',
            minLength: 10,
            maxLength: 11
        },
        email: {
            required: true,
            pattern: 'email'
        },
        purpose: {
            required: true,
            minLength: 1
        },
        purposeOther: {
            required: function () {
                return (this.get('purpose') === 'Other');
            }
        },
        duration: {
            required: true
        }
    },

    /**
     *
     * @param key
     * @param val
     * @param options
     * @returns {EntryLogModel}
     */
    set: function (key, val, options) {
        var attributes;
        if (typeof key === 'object') {
            attributes = key;
            options = val;
        } else {
            (attributes = {})[key] = val;
        }
        if (attributes) {
            if (attributes.hasOwnProperty('latitude')) {
                var latitude = attributes.latitude;
                if (latitude && !isNaN(latitude)) {
                    attributes.latitude = Number(latitude);
                }
            }

            if (attributes.hasOwnProperty('longitude')) {
                var longitude = attributes.longitude;
                if (longitude && !isNaN(longitude)) {
                    attributes.longitude = Number(longitude);
                }
            }

            if (attributes.hasOwnProperty('distance')) {
                var distance = attributes.distance;
                if (distance && !isNaN(distance)) {
                    attributes.distance = Number(distance);
                }
            }

            if (attributes.hasOwnProperty('inTime') && attributes.hasOwnProperty('duration')) {
                var inTime = attributes.inTime;
                var duration = attributes.duration;
                if (inTime && !isNaN(inTime) && duration && !isNaN(duration)) {
                    attributes.inTime = new Date(Number(inTime));
                    attributes.duration = Number(duration);
                    attributes.expectedOutTime = utils.addMinutes(attributes.inTime, attributes.duration);
                    attributes.checkInStatus = CheckInStatusEnum.checkedIn;
                }
            }

            if (attributes.hasOwnProperty('outTime')) {
                var outTime = attributes.outTime;
                if (outTime && !isNaN(outTime)) {
                    attributes.outTime = new Date(Number(outTime));
                    attributes.actualDuration = (attributes.outTime - attributes.inTime);
                    attributes.checkInStatus = CheckInStatusEnum.checkedOut;
                }
            }

            if (attributes.checkInStatus === CheckInStatusEnum.checkedIn) {
                var expectedOutTimeElapsed = new Date() - attributes.expectedOutTime;
                if (expectedOutTimeElapsed >= config.entryLogExpirationThreshold) {
                    attributes.checkInStatus = CheckInStatusEnum.overdue;
                } else if (expectedOutTimeElapsed > 0) {
                    attributes.checkInStatus = CheckInStatusEnum.expired;
                }
            }
        }

        return Backbone.Model.prototype.set.call(this, attributes, options);
    }
});

module.exports = EntryLogModel;