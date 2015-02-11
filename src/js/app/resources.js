define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var resources = {
        'appTitleText': 'Check-in&#124;Check-out',

        'loadingIconSrc': 'images/loading.gif',
        'loadingIconAlt': 'loading',

        'logoImageAlt': 'AEP',
        'logoImageSrc': 'images/aep_logo_180x180.png',
        'logoImageSvgSrc': 'images/aep_logo_180x180.svg',

        'checkedInIconAlt': 'station currently has personnel checked-in',
        'checkedInIconSrc': 'images/checked-in_180x180.png',
        'checkedInIconSvgSrc': 'images/checked-in_180x180.svg',

        'checkedInWithCrewIconAlt': 'station currently has personnel checked-in',
        'checkedInWithCrewIconSrc': 'images/checked-in_with_crew_180x180.png',
        'checkedInWithCrewIconSvgSrc': 'images/checked-in_with_crew_180x180.svg',

        'hazardIconAlt': 'station currently has a hazard',
        'hazardIconSrc': 'images/hazard_180x180.png',
        'hazardIconSvgSrc': 'images/hazard_180x180.svg',

        'outageIconAlt': 'station currently has an outage',
        'outageIconSrc': 'images/outage_180x180.png',
        'outageIconSvgSrc': 'images/outage_180x180.svg',

        'goToLocusButtonText': 'Stations',
        'goToLocusWithIdButtonText': 'View Station',
        'goToDirectionsButtonText': 'directions',

        'gpsSearchButtonText': 'GPS',
        'manualSearchButtonText': 'Manual',
        'recentSearchButtonText': 'Recent',

        'helpButtonText': 'Help',
        'logOutButtonText': 'Log out',

        'cancelButtonText': 'Cancel',
        'resetButtonText': 'Reset',
        'saveButtonText': 'Save',
        'searchButtonText': 'Search',

        'locusIdHeaderText': 'Station',
        'locusNameHeaderText': 'Station',
        'regionNameHeaderText': 'Region',
        'areaNameHeaderText': 'Area',
        'latitudeHeaderText': 'Latitude',
        'longitudeHeaderText': 'Longitude',
        'distanceHeaderText': 'Distance',
        'openEntryLogListHeader': 'Open Station Entry Logs',

        'locus.manualSearchPlaceholderText': 'enter a station name',

        'locusSearch.viewTitleText': 'Find a Station',

        'locusSearch.loadingMessage': 'loading search',
        'locusList.loadingMessage': 'loading stations',
        'entryLogList.loadingMessage': 'loading station entry logs',
        'locus.loadingMessage': 'loading station',
        'calculatingDistanceLoadingMessage': 'calculating distance',

        'distanceFormatString': '{0} miles',
        'linkedLocusHeaderText': 'Linked to',
        
        'criticalSystemErrorMessage': 'critical error',
        'locusNotFoundErrorMessage': 'station not found',
        'distanceUnknownErrorMessage': 'distance unknown',
        'directionsUnavailableErrorMessage': 'directions unavailable',

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