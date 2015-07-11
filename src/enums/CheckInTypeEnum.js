'use strict';

/**
 *
 * @type {{adhoc: number, locus: number}}
 */
var CheckInTypeEnum = {
    adhoc: 1,
    locus: 2
};

if (Object.freeze) {
    Object.freeze(CheckInTypeEnum);
}

module.exports = CheckInTypeEnum;