'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

/**
 *
 * @type {LocusModel}
 */
var LocusModel = Backbone.Model.extend({

    /**
     *
     */
    idAttribute: 'locusId',

    /**
     *
     * @param key
     * @param val
     * @param options
     * @returns {LocusModel}
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

            if (attributes.hasOwnProperty('hasHazard')) {
                var hasHazard = attributes.hasHazard;
                if (hasHazard && hasHazard.match(this.boolRegex)) {
                    attributes.hasHazard = (hasHazard === "true");
                }
            }

            if (attributes.hasOwnProperty('hasActiveIssues')) {
                var hasActiveIssues = attributes.hasActiveIssues;
                if (hasActiveIssues && isNaN(hasActiveIssues)) {
                    attributes.hasActiveIssues = (hasActiveIssues === "true");
                }
            }

            if (attributes.hasOwnProperty('hasOpenReports')) {
                var hasOpenReports = attributes.hasOpenReports;
                if (hasOpenReports && isNaN(hasOpenReports)) {
                    attributes.hasOpenReports = (hasOpenReports === "true");
                }
            }

            if (attributes.hasOwnProperty('hasOpenCheckIns')) {
                var hasOpenCheckIns = attributes.hasOpenCheckIns;
                if (hasOpenCheckIns && isNaN(hasOpenCheckIns)) {
                    attributes.hasOpenCheckIns = (hasOpenCheckIns === "true");
                }
            }
        }
        return Backbone.Model.prototype.set.call(this, attributes, options);
    }
});

module.exports = LocusModel;