'use strict';

var EventNameEnum = {
    login: 'login',
    logout: 'logout',

    myIdentityReset: 'myIdentityReset',
    goToMyIdentity: 'goToMyIdentity',

    openEntryLogReset: 'openEntryLogReset',

    goToLocusSearch: 'goToLocusSearch',
    goToLocusWithId: 'goToLocusWithId',
    refreshLocusCollection: 'refreshLocusCollection',

    goToIdentitySearch: 'goToIdentitySearch',
    goToIdentityWithId: 'goToIdentityWithId',
    refreshIdentityCollection: 'refreshIdentityCollection',

    goToAdHocCheckIn: 'goToAdHocCheckIn',
    goToSettings: 'goToSettings',

    refreshEntryLogCollection: 'refreshEntryLogCollection',

    goToCheckIn: 'goToCheckIn',
    checkIn: 'checkIn',
    checkInSuccess: 'checkInSuccess',
    checkInError: 'checkInError',

    goToEditCheckIn: 'goToEditCheckIn',
    editCheckIn: 'editCheckIn',
    editCheckInSuccess: 'editCheckInSuccess',
    editCheckInError: 'editCheckInError',

    goToCheckOut: 'goToCheckOut',
    checkOut: 'checkOut',
    checkOutSuccess: 'checkOutSuccess',
    checkOutError: 'checkOutError',

    goToDirectionsWithLatLng: 'goToDirectionsWithLatLng'
};

if (Object.freeze) {
    Object.freeze(EventNameEnum);
}

module.exports = EventNameEnum;
