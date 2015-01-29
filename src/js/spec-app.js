define(function (require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var specs = [];
    specs.push('specs/goToStationSearchSpec');
    specs.push('specs/goToStationWithIdSpec');
    specs.push('specs/refreshStationsSpec');
    specs.push('specs/refreshStationsByGpsSpec');

    $(document).ready(function () {
        require(specs, function (spec) {
            window.executeTests();
        });
    });
});
