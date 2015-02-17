define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        globals = require('globals'),
        env = require('env'),
        utils = require('utils');

    var _identityList = [
        {
            "identityId": "S251201",
            "identityName": "Baltic, Michael",
            "firstName": "Michael",
            "lastName": "Baltic",
            "middleInitial": "E",
            "contactNumber": "6143239560",
            "email": "mebaltic@aep.com",
            "role": "Admin"
        },
        {
            "identityId": "S251203",
            "identityName": "Shu, Shujing",
            "firstName": "Shujing",
            "lastName": "Shu",
            "contactNumber": "6145551212",
            "email": "sshu@aep.com",
            "role": "Admin"
        },
        {
            "identityId": "S251204",
            "identityName": "Veit, Alex",
            "firstName": "Alex",
            "lastName": "Veit",
            "contactNumber": "6148675309",
            "email": "aveit@aep.com",
            "role": "User"
        },
        {
            "identityId": "S251202",
            "identityName": "Walden",
            "firstName": "Heather",
            "lastName": "Walden",
            "middleInitial": "M",
            "contactNumber": "6145551212",
            "email": "hmwalden@aep.com",
            "role": "ReadOnly"
        }
    ];

    var _userIdentity = {
        "identityId": "S251201",
        "identityName": "Baltic, Michael",
        "firstName": "Michael",
        "lastName": "Baltic",
        "middleInitial": "E",
        "contactNumber": "6143239560",
        "email": "mebaltic@aep.com",
        "role": "Admin"
    };

    var _getById = function (identityId) {
        return _.where(_identityList, function (identity) {
            return identity.identityId === identityId;
        });
    };

    var _getByIdentityName = function (identityName) {
        return _.where(_identityList, function (identity) {
            return identity.identityName.toLowerCase().indexOf(identityName || "".toLowerCase()) > -1;
        });
    };

    var IdentityService = function (options) {
        console.trace('new IdentityService()');
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(IdentityService.prototype, {
        initialize: function (options) {
            console.trace('IdentityService.initialize');
            options || (options = {});
        },
        getIdentitySearchOptions: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var results = {
                identity: _userIdentity
            };

            globals.window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 50);

            return deferred.promise();
        },
        getIdentityList: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var identityList;
            if (options.identityId) {
                identityList = _getById(options.identityId);
            } else if (options.identityName) {
                identityList = _identityList;
                //identityList = _getByIdentityName(options.identityName);
            } else {
                identityList = _identityList;
            }

            var results = {
                identityList: identityList,
                identity: _userIdentity
            };

            globals.window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 50);

            return deferred.promise();
        }
    });

    return IdentityService;
});