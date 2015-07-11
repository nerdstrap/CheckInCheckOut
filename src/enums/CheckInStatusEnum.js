'use strict';

/**
 *
 * @type {{checkedIn: number, overdue: number, expired: number, checkedOut: number}}
 */
var CheckInStatusEnum = {
    checkedIn: 1,
    overdue: 2,
    expired: 3,
    checkedOut: 4
};

if (Object.freeze) {
    Object.freeze(CheckInStatusEnum);
}

module.exports = CheckInStatusEnum;