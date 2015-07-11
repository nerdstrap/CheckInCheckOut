var config = {};

config.app = {};

config.app.apiUrl = '';
config.app.siteRoot = '';
config.app.entryLogExpirationThreshold = 1800000;
config.app.distanceThreshold = 50;
config.app.searchResultsThreshold = 20;

config.myIdentity = {};

config.myIdentity.identityId = 's251201';

config.positionOptions = {};

config.positionOptions.timeout = 5000;
config.positionOptions.enableHighAccuracy = false;
config.positionOptions.maximumAge = 6000;

module.exports = config;