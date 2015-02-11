define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseModel = require('models/BaseModel'),
        env = require('env');

    var ListingModel = BaseModel.extend({
        idAttribute: 'listingId',
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

                if (attributes.hasOwnProperty('inTime')) {
                    var inTime = attributes.inTime;
                    if (inTime && !isNaN(inTime)) {
                        attributes.inTime = new Date(Number(inTime));
                    }
                }

                if (attributes.hasOwnProperty('duration')) {
                    var duration = attributes.duration;
                    if (duration && !isNaN(duration)) {
                        attributes.duration = Number(duration);
                    }
                }

                if (attributes.hasOwnProperty('outTime')) {
                    var outTime = attributes.outTime;
                    if (outTime && !isNaN(outTime)) {
                        attributes.outTime = new Date(outTime);
                    }
                }
            }
            return Backbone.Model.prototype.set.call(this, attributes, options);
        }
    });

    return ListingModel;
});