define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var resources = {
        'appTitleText': 'Check-in|Check-out',

        'loadingIconSrc': 'images/loading.gif',
        'loadingIconAlt': 'loading...',

        'logoImageAlt': 'AEP',
        'logoImageSrc': 'images/aep_logo_180x180.png',
        'logoImageSvgSrc': 'images/aep_logo_180x180.svg',

        'cancelButtonText': 'Cancel',
        'refreshButtonText': 'Refresh',
        'resetButtonText': 'Reset',
        'saveButtonText': 'Save',

        'goToStationListButtonText': 'Stations',
        'goToStationButtonText': 'Station',
        'goToMapButtonText': 'View in Google Maps',

        'gpsSearchButtonText': 'GPS',
        'manualSearchButtonText': 'Manual',
        'recentSearchButtonText': 'Recent',
        'helpButtonText': 'Help',
        'logOutButtonText': 'Log out',

        'areaNameHeaderText': 'Area',
        'regionNameHeaderText': 'Region',
        'stationNameHeaderText': 'Station',
        'stationIdHeaderText': 'Station',

        'station.manualSearchPlaceholderText': 'enter a station name',

        'stationSearch.viewTitleText': 'Find a Station',
        'stationList.viewTitleText': 'Stations',
        'station.viewTitleText': 'Station',

        'stationSearch.loadingMessage': 'loading search',
        'stationList.loadingMessage': 'loading stations',
        'station.loadingMessage': 'loading station',
        
        'validationErrorMessage': 'One or more of the fields are invalid. Please update them and try again.',
        'criticalSystemErrorMessage': 'The app encountered an error. If you need to check-in to a station, please call the dispatcher.',
        'stationNotFoundErrorMessage': 'The station specified was not found.'
    };

    var defaultResource = '';

    var resourceHelpers = {
        getResource: function(key) {
            if (resources.hasOwnProperty(key)) {
                return resources[key];
            } else {
                console.warn('resource for key "' + key + '" not found!')
            }
            return defaultResource;
        }
    };

    return resourceHelpers;
});