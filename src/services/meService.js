'use strict';

var $ = require('jquery');
var _ = require('underscore');
var env = require('env');
var utils = require('utils');

var _entryLogList = [
    {
        "entryLogId": "380",
        "locusId": "840",
        "identityId": "S251201",
        "identityName": "baltic, michael",
        "purpose": "milkawhat",
        "additionalInfo": "ermahgerd",
        "inTime": "1416959468287",
        "contactNumber": "6145551212",
        "email": "mebaltic@aep.com",
        "duration": "60",
        "locusName": "Vine",
        "latitude": "39.97109",
        "longitude": "-83.00647",
        "hasCrew": "true"
    }
];

var _identity = {"identityId": "S251201", "identityName": "Baltic, Michael E", "contactNumber": "6143239560", "email": "mebaltic@aep.com", "role": "Admin", "openEntryLogs": _entryLogList};

var meService = {
    getIdentity: function () {
        return _identity;
    }
};

module.exports = meService;