define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var resources = {
        'locusSearchViewHeaderText': 'Stations',
        'searchQueryPlaceholder':'search',
        'searchButtonText':'search',
        'cancelButtonText':'cancel',
        'alphabeticButtonText':'a-z',
        'nearbyButtonText':'nearby',
        'favoritesButtonText':'fav',
        'loadingIconSrc': 'images/loading.gif',
        'locusListViewHeaderTextFormatString': '{0} Stations',
        'locusHeaderImageSrc': 'images/transmission_station.jpg',
        'loadingIconAlt': 'loading',

        'identitySearchViewHeaderText': 'Personnel',
        'identityListViewHeaderTextFormatString': '{0} Personnel',
        'identityHeaderImageSrc': 'images/cico_user.jpg',

        'currentCheckInDetailLabelTextFormatString': 'You checked-in to this Station at {0}. You are working on {1}, and expect to check-out at {2}.',
        'openCheckInDetailLabelTextFormatString': 'You checked-in to Station {0} at {1}. Check-out of that Station if you wish to check-in at this Station.',
        'locusLockMessage': 'There is a hazard at this Station. You will need to call the dispatch desk if you need to check-in, extend your current check-in, or check-out.',

        'locusPhoneTypeHeaderText': 'Station',
        'identityPhoneTypeHeaderText': 'Mobile',
        'entryLogListViewHeaderTextFormatString': '{0} Check-ins',
        'openEntryLogListViewHeaderTextFormatString': '{0} Open Check-ins',
        'recentEntryLogListViewHeaderTextFormatString': '{0} Recent Check-ins',

        'appTitleText': 'Check-in&#124;Check-out',

        'checkInViewHeaderText': 'Check-in',
        'locusDescriptionPlaceholder': 'description',

        'goToLocusSearchButtonText': 'Stations',
        'goToLocusWithIdButtonText': 'View Station',

        'goToIdentitySearchButtonText': 'People',
        'goToIdentityWithIdButtonText': 'View Person',

        'myIdentity.headerText': 'Me',
        'locusSearch.headerText': 'Stations',
        'identitySearch.headerText': 'People',
        'checkIn.headerText': 'Check-in',
        'checkOut.headerText': 'Check-out',
        'adHocCheckIn.headerText': 'Ad-hoc Check-in',
        'settings.headerText': 'Settings',

        'gpsSearchButtonText': 'GPS',
        'manualSearchButtonText': 'Manual',
        'recentSearchButtonText': 'Recent',

        'showAlphabeticResultsButtonText': 'A-Z',
        'showNearbyResultsButtonText': 'Nearby',
        'showFavoritesResultsButtonText': 'Favorites',

        'search.placeholder': 'search',
        'locus.manualSearchPlaceholderText': 'enter a station name',
        'identity.manualSearchPlaceholderText': 'enter a person name',

        'resetButtonText': 'Reset',

        'button.search.text': 'Search',
        'button.reset.text': 'Reset',
        'button.cancel.text': 'Cancel',
        'button.alphabetic.text': 'A-Z',
        'button.nearby.text': 'Nearby',
        'button.favorites.text': 'Favorites',

        'locusSearch.loadingMessage': 'loading station search',
        'locusList.loadingMessage': 'loading stations',
        'locus.loadingMessage': 'loading station',
        'listSearch.loadingMessage': 'loading search',

        'locusList.headerTextFormatString': '{0} Stations',
        'identityList.headerTextFormatString': '{0} People',
        'entryLogList.headerTextFormatString': '{0} Check-ins',
        'currentEntryLogList.headerTextFormatString': 'Current Check-ins',
        'openEntryLogList.headerTextFormatString': '{0} Open Check-ins',
        'recentEntryLogList.headerTextFormatString': '{0} Recent Check-ins',

        'locusNameHeaderText': 'Location',
        'locusNamePlaceholder': 'enter description',
        'coordinatesHeaderText': 'directions',
        'latitudePlaceholder': 'Latitude',
        'longitudePlaceholder': 'Longitude',
        'distanceHeaderText': 'Distance',
        'phoneHeaderText': 'phone',
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

        'goToCheckInButtonText': 'Check-in',
        'checkInButtonText': 'Check-in',
        'goToCheckOutButtonText': 'Check-out',
        'checkOutButtonText': 'Check-out',
        'goToOpenCheckInButtonText': 'Open Check-in',
        'callDispatchPhoneButtonText': 'Call Dispatch',

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

        'goToMyIdentityButtonText': 'Me',
        'goToGpsSearchButtonText': 'Nearby',
        'goToManualSearchButtonText': 'Search',
        'goToAdHocEntryButtonText': 'Ad-hoc',
        'goToSettingsButtonText': 'Settings',

        'showOpenCheckInsButtonText': 'Open Check-ins',
        'showRecentCheckInsButtonText': 'Recent Check-ins',
        'showLocusDetailsButtonText': 'Station Details',
        'goBackFromLocusButtonText': 'Stations',
        'goBackFromIdentityButtonText': 'People',
        'menuButtonText': '...'
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