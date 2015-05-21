'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var resources = {
    //search
    'locusSearchViewHeaderText': 'Stations',
    'searchButtonText': 'search',
    'searchQueryPlaceholder': 'search',
    'cancelButtonText': 'cancel',
    'alphabeticButtonText': 'a-z',
    'nearbyButtonText': 'nearby',
    'favoritesButtonText': 'fav',
    'loadingIconSrc': 'images/loading.gif',
    'loadingIconAlt': 'loading',

    //list
    'locusListViewHeaderTextFormatString': '{0} Stations',

    //list item
    'locusAvatarImageSrc': 'images/transmission_station.jpg',
    'locusAvatarImageAltText': 'station',
    'distanceFormatString': '{0} miles',
    'coordinatesUnavailableErrorMessage': 'gps unavailable',

    'locusHeaderImageSrc': 'images/transmission_station.jpg',

    'identitySearchViewHeaderText': 'Personnel',
    'identityListViewHeaderTextFormatString': '{0} Personnel',
    'identityHeaderImageSrc': 'images/cico_user.jpg',

    // check-in detail
    'currentCheckInDetailLabelTextFormatString': 'You checked-in to this Station at {0}. You are working on {1}, and expect to check-out at {2}.',
    'openCheckInDetailLabelTextFormatString': 'You checked-in to Station {0} at {1}. Check-out of that Station if you wish to check-in at this Station.',

    // lock
    'locusLockMessage': 'There is a hazard at this Station. You will need to call the dispatch desk if you need to check-in, extend your current check-in, or check-out.',

    'locusPhoneTypeHeaderText': 'Station',
    'identityPhoneTypeHeaderText': 'Mobile',
    'entryLogListViewHeaderTextFormatString': '{0} Check-ins',
    'openEntryLogListViewHeaderTextFormatString': '{0} Open Check-ins',
    'recentEntryLogListViewHeaderTextFormatString': '{0} Recent Check-ins',

    // check-in
    'checkInViewHeaderText': 'Check-in',
    'locusNameHeaderText': 'Location',
    'locusDescriptionHeaderText': 'Ad-hoc Location',
    'locusDescriptionPlaceholder': 'ad-hoc location',
    'coordinatesHeaderText': 'lat/lng',
    'latitudePlaceholder': 'latitude',
    'longitudePlaceholder': 'longitude',
    'distanceHeaderText': 'Distance',
    'phoneHeaderText': 'phone',
    'identityNameHeaderText': 'Personnel Name',
    'contactNumberHeaderText': 'mobile',
    'contactNumberPlaceholder': 'mobile number',
    'emailHeaderText': 'email',
    'emailPlaceholder': 'e-mail',
    'purposeHeaderText': 'Purpose',
    'purposePlaceholder': 'purpose',
    'purposeOtherHeaderText': 'Other',
    'purposeOtherPlaceholder': 'other purpose',
    'durationHeaderText': 'Duration',
    'durationPlaceholder': 'duration',
    'groupCheckInHeaderText': 'With Crew?',
    'additionalInfoHeaderText': 'Additional Info',
    'additionalInfoPlaceholder': 'additional info',
    'checkInButtonText': 'Check-in',
    'checkOutButtonText': 'check-out',
    'checkOutViewHeaderText': 'Check-in'
};

var defaultResource = '';

var resourceHelpers = {
    getResource: function (key) {
        if (resources.hasOwnProperty(key)) {
            return resources[key];
        } else {
            console.warn('resource for key "' + key + '" not found');
        }
        return defaultResource;
    }
};

module.exports = resourceHelpers;