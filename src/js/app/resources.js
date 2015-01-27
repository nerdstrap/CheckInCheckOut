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

        'areaNameHeaderText': 'Area',
        'regionNameHeaderText': 'Region',
        'stationNameHeaderText': 'Station',
        'stationIdHeaderText': 'Station',

        'stationNameSearchQueryPlaceholderText': 'enter a station name',

        'stationList.viewTitleText': 'Stations',
        'station.viewTitleText': 'Station',

        'stationList.loadingMessage': 'loading stations...',
        'station.loadingMessage': 'loading station...',
        
        'validationErrorMessage': 'One or more of the fields are invalid. Please update them and try again.'
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