'use strict';

var EventNameEnum = {
    login: 'login',
    loginSuccess: 'loginSuccess',
    loginError: 'loginError',
    logout: 'logout',
    logoutSuccess: 'logoutSuccess',
    logoutError: 'logoutError',

    myIdentityReset: 'myIdentityReset',
    openEntryLogReset: 'openEntryLogReset',

    goToLocusSearch: 'goToLocusSearch',
    goToLocusWithId: 'goToLocusWithId',
    refreshLocusCollection: 'refreshLocusCollection',

    goToMyIdentity: 'goToMyIdentity',
    goToIdentitySearch: 'goToIdentitySearch',
    goToIdentityWithId: 'goToIdentityWithId',
    refreshIdentityCollection: 'refreshIdentityCollection',

    goToEntryLogSearch: 'goToEntryLogSearch',
    goToEntryLogWithId: 'goToEntryLogWithId',
    refreshEntryLogCollection: 'refreshEntryLogCollection',

    goToAdHocCheckIn: 'goToAdHocCheckIn',
    goToCheckIn: 'goToCheckIn',
    checkInCancel: 'checkInCancel',
    checkIn: 'checkIn',
    checkInSuccess: 'checkInSuccess',
    checkInError: 'checkInError',

    goToEditCheckIn: 'goToEditCheckIn',
    editCheckInCancel: 'editCheckInCancel',
    editCheckIn: 'editCheckIn',
    editCheckInSuccess: 'editCheckInSuccess',
    editCheckInError: 'editCheckInError',

    goToCheckOut: 'goToCheckOut',
    checkOutCancel: 'checkOutCancel',
    checkOut: 'checkOut',
    checkOutSuccess: 'checkOutSuccess',
    checkOutError: 'checkOutError',

    refreshIssueCollection: 'refreshIssueCollection',

    addIssue: 'addIssue',
    addIssueSuccess: 'addIssueSuccess',
    addIssueError: 'addIssueError',
    
    clearIssue: 'clearIssue',
    clearIssueSuccess: 'clearIssueSuccess',
    clearIssueError: 'clearIssueError',

    refreshReportCollection: 'refreshReportCollection',

    goToDirectionsWithLatLng: 'goToDirectionsWithLatLng'
};

if (Object.freeze) {
    Object.freeze(EventNameEnum);
}

module.exports = EventNameEnum;
