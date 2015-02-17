define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var resources = {
        'appTitleText': 'Check-in&#124;Check-out',
        'locus.fragment': 'station',
        'locusWithId.fragment': 'station/',
        'identity.fragment': 'person',
        'identityWithId.fragment': 'person/',
        'entryLog.fragment': 'entryLog/',
        'checkIn.fragment': 'checkIn',

        'loadingIconSrc': 'images/loading.gif',
        'loadingIconAlt': 'loading',

        'goToLocusSearchButtonText': 'Stations',
        'goToLocusWithIdButtonText': 'View Station',

        'goToIdentitySearchButtonText': 'People',
        'goToIdentityWithIdButtonText': 'View Person',

        'locusSearch.viewTitleText': 'Find a Station',
        'identitySearch.viewTitleText': 'Find a Person',
        'checkIn.viewTitleText': 'Check-in to Station',

        'gpsSearchButtonText': 'GPS',
        'manualSearchButtonText': 'Manual',
        'recentSearchButtonText': 'Recent',

        'locus.manualSearchPlaceholderText': 'enter a station name',
        'identity.manualSearchPlaceholderText': 'enter a person name',

        'searchButtonText': 'Search',
        'resetButtonText': 'Reset',

        'locusSearch.loadingMessage': 'loading station search',
        'locusList.loadingMessage': 'loading stations',
        'locus.loadingMessage': 'loading station',

        'locusNameHeaderText': 'Location',
        'locusNamePlaceholder': 'enter description',
        'coordinatesHeaderText': 'Location',
        'latitudePlaceholder': 'Latitude',
        'longitudePlaceholder': 'Longitude',
        'distanceHeaderText': 'Distance',
        'identityNameHeaderText': 'Personnel Name',
        'contactNumberHeaderText': 'mobile',
        'contactNumberPlaceholder': 'enter phone number',
        'emailHeaderText': 'email',
        'emailPlaceholder': 'enter valid e-mail',
        'purposeHeaderText': 'Purpose',
        'purposePlaceholder': 'select purpose',
        'purposeOtherHeaderText': 'Other',
        'purposeOtherPlaceholder': 'enter reason',
        'durationHeaderText': 'Duration',
        'durationPlaceholder': 'select duration',
        'groupCheckInHeaderText': 'With Crew?',
        'additionalInfoHeaderText': 'Additional Info',
        'additionalInfoPlaceholder': 'enter your notes',
        'distanceFormatString': '{0} miles',
        'goToDirectionsButtonText': 'directions',
        'goToLinkedLocusButtonTextFormatString': 'Linked Station: {0}',

        'identitySearch.loadingMessage': 'loading person search',
        'identityList.loadingMessage': 'loading people',
        'identity.loadingMessage': 'loading person',

        'cancelButtonText': 'Cancel',
        'checkInButtonText': 'Check-in',
        'checkOutButtonText': 'Check-out',
        'editCheckInButtonText': 'Edit Check-in',
        'goToOpenCheckInButtonText': 'Open Check-in',

        'distance.loadingMessage': 'calculating distance',
        'entryLogStatus.loadingMessage': 'determining entry log status',
        'checkIn.loadingMessage': 'loading check-in prerequisites',

        'entryLogList.loadingMessage': 'loading entry logs',
        'entryLog.loadingMessage': 'loading entry log',

        'entryLogListHeaderText': 'Entry Logs',

        'goToHelpButtonText': 'Help',
        'goToLogOutButtonText': 'Log out',

        'saveButtonText': 'Save',
        
        'criticalSystemErrorMessage': 'critical error',
        'locusNotFoundErrorMessage': 'station not found',
        'identityNotFoundErrorMessage': 'person not found',
        'entryLogNotFoundErrorMessage': 'check-in not found',
        'coordinatesUnavailableErrorMessage': 'gps unavailable',
        'distanceUnknownErrorMessage': 'distance unknown',
        'directionsUnavailableErrorMessage': 'directions unavailable',

        'logoImageAlt': 'AEP',
        'logoImageSrc': 'images/aep_logo_180x180.png',
        'logoImageSvgSrc': 'images/aep_logo_180x180.svg',

        'checkedInIconAlt': 'station currently has people checked-in',
        'checkedInIconSrc': 'images/checked-in_180x180.png',
        'checkedInIconSvgSrc': 'images/checked-in_180x180.svg',

        'checkedInWithCrewIconAlt': 'station currently has people checked-in',
        'checkedInWithCrewIconSrc': 'images/checked-in_with_crew_180x180.png',
        'checkedInWithCrewIconSvgSrc': 'images/checked-in_with_crew_180x180.svg',

        'hazardIconAlt': 'station currently has a hazard',
        'hazardIconSrc': 'images/hazard_180x180.png',
        'hazardIconSvgSrc': 'images/hazard_180x180.svg',

        'outageIconAlt': 'station currently has an outage',
        'outageIconSrc': 'images/outage_180x180.png',
        'outageIconSvgSrc': 'images/outage_180x180.svg',

        'goToGpsSearchButtonText': 'Nearby',
        'goToManualSearchButtonText': 'Search',
        'goToAdHocEntryButtonText': 'Ad Hoc',
        'goToSettingsButtonText': 'Settings'
    };

    var defaultResource = '';

    var resourceHelpers = {
        getResource: function(key) {
            if (resources.hasOwnProperty(key)) {
                return resources[key];
            } else {
                console.warn('resource for key "' + key + '" not found')
            }
            return defaultResource;
        }
    };

    return resourceHelpers;
});