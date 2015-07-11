'use strict';

/**
 *
 * @type {{alphabetic: number, nearby: number, favorites: number, admin: number}}
 */
var SearchTypeEnum = {
    alphabetic: 1,
    nearby: 2,
    favorites: 3,
    admin: 4
};

if (Object.freeze) {
    Object.freeze(SearchTypeEnum);
}

module.exports = SearchTypeEnum;