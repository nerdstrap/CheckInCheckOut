define(function (require) {
    'use strict';

    var AppEventNamesEnum = {
        login: 'login',
        logout: 'logout',
        userRoleUpdated: 'userRoleUpdated',

        goToLocusSearch: 'goToLocusSearch',
        goToLocusWithId: 'goToLocusWithId',
        refreshLocusListByGps: 'refreshLocusListByGps',
        refreshLocusList: 'refreshLocusList',

        goToListingWithId: 'goToListingWithId',
        refreshListingListByGps: 'refreshListingListByGps',
        refreshListingList: 'refreshListingList',

        goToNewListing: 'goToNewListing',
        checkIn: 'checkIn',
        checkInSuccess: 'checkInSuccess',
        checkInError: 'checkInError',

        goToDirectionsWithLatLng: 'goToDirectionsWithLatLng'
    };

    if (Object.freeze) {
        Object.freeze(AppEventNamesEnum);
    }

    return AppEventNamesEnum;
});
