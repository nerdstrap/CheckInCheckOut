define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        env = require('env'),
        utils = require('utils');

    var EntryLogModel = Backbone.Model.extend({
        idAttribute: 'entryLogId',
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
                required: function() {
                    return (this.get('purpose') === 'Other');
                }
            },
            duration: {
                required: true
            }
        },
        set: function (key, val, options) {
            var attributes;
            if (typeof key === 'object') {
                attributes = key;
                options = val;
            } else {
                (attributes = {})[key] = val;
            }
            if (attributes) {
                if (attributes.hasOwnProperty('identityUserName')) {
                    var identityNameParts = attributes.identityUserName.split(', ');
                    if (identityNameParts && identityNameParts.length > 1) {
                        attributes.identityInitials = identityNameParts[1][0] + identityNameParts[0][0];
                        attributes.identityFullName = identityNameParts[1] + ' ' + identityNameParts[0];
                    }
                }

                if (attributes.hasOwnProperty('locusName')) {
                    var locusNameParts = attributes.locusName.split(' ');
                    if (locusNameParts && locusNameParts.length > 0) {
                        attributes.locusInitials = locusNameParts[0][0];
                        if (locusNameParts.length > 1) {
                            attributes.locusInitials += locusNameParts[1][0];
                        }
                    }
                }

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

                if (attributes.hasOwnProperty('inTime')) {
                    var inTime = attributes.inTime;
                    if (inTime && !isNaN(inTime)) {
                        attributes.inTime = new Date(Number(inTime));

                        if (attributes.hasOwnProperty('duration')) {
                            var duration = attributes.duration;
                            if (duration && !isNaN(duration)) {
                                attributes.duration = Number(duration);
                                attributes.expectedOutTime = utils.addMinutes(attributes.inTime, attributes.duration);
                            }
                        }

                        var checkedOut = false;
                        if (attributes.hasOwnProperty('outTime')) {
                            var outTime = attributes.outTime;
                            if (outTime && !isNaN(outTime)) {
                                attributes.outTime = new Date(Number(outTime));
                                attributes.actualDuration = (outTime - inTime);
                                checkedOut = true;
                            }
                        }

                        if (checkedOut === false && attributes.expectedOutTime) {
                            var expectedOutTimeElapsed = new Date() - attributes.expectedOutTime;
                            if (expectedOutTimeElapsed >= env.getExpirationThreshold()) {
                                attributes.checkOutOverdue = true;
                            } else if (expectedOutTimeElapsed > 0) {
                                attributes.checkOutExpired = true;
                            }
                        }
                    }
                }
            }
            return Backbone.Model.prototype.set.call(this, attributes, options);
        }
    });

    return EntryLogModel;
});