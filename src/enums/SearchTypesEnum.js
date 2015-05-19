'use strict';

var SearchTypesEnum = {
    alphabetic: 'alphabetic',
    nearby: 'nearby',
    favorites: 'favorites'
};

if (Object.freeze) {
    Object.freeze(SearchTypesEnum);
}

module.exports = SearchTypesEnum;