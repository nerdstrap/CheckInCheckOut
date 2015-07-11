'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var utils = require('lib/utils');
var config = require('lib/config');

var ModelMapper = function (options) {
    options || (options = {});
    this.initialize.apply(this, arguments);
};

_.extend(ModelMapper.prototype, {
    initialize: function (options) {
        console.trace('ModelMapper.initialize');
        options || (options = {});
    },

    mapGetIdentityResponse: function (getIdentityResponse, identityModel) {
        if (getIdentityResponse) {
            var getIdentityData;
            if (getIdentityResponse.length > 0) {
                getIdentityData = getIdentityResponse[0];
            } else {
                getIdentityData = getIdentityResponse;
            }
            if (getIdentityData && getIdentityData.identities && getIdentityData.identities.length > 0) {
                identityModel.set(getIdentityData.identities[0]);
            }
        }
    },

    mapGetLociResponse: function (getLociResponse, locusModel) {
        if (getLociResponse) {
            var getLocusData;
            if (getLociResponse.length > 0) {
                getLocusData = getLociResponse[0];
            } else {
                getLocusData = getLociResponse;
            }
            if (getLocusData && getLocusData.loci && getLocusData.loci.length > 0) {
                locusModel.set(getLocusData.loci[0]);
            }
        }
    },

    mapGetEntryLogsResponse: function (getEntryLogsResponse, entryLogModel) {
        if (getEntryLogsResponse) {
            var getEntryLogsData;
            if (getEntryLogsResponse.length > 0) {
                getEntryLogsData = getEntryLogsResponse[0];
            } else {
                getEntryLogsData = getEntryLogsResponse;
            }
            if (getEntryLogsData && getEntryLogsData.entryLogs && getEntryLogsData.entryLogs.length > 0) {
                entryLogModel.set(getEntryLogsData.entryLogs[0]);
            }
        }
    }
});

module.exports = ModelMapper;