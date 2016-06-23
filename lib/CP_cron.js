'use strict';

/**
 * Module dependencies.
 */

var CP_get  = require('./CP_get');
var CP_save = require('./CP_save');

/**
 * Configuration dependencies.
 */

var config = require('../config/config');

CP_get.publishIds(function (err, ids) {

    if (!ids) {
        console.log('[publish] Not Movies.');
        config.publish.every.hours = 0;
        config.publish.every.movies = 0;
    }
    else if (ids.start_id == config.publish.start && ids.stop_id == config.publish.stop) {
        console.log('[publish] All movies published.');
        config.publish.every.hours = 0;
        config.publish.every.movies = 0;
    }
    else {
        console.log('[publish] New IDs: ' + ids.start_id + ' - ' + ids.stop_id);
        config.publish.start = ids.start_id;
        config.publish.stop = ids.stop_id;
    }

    var data = JSON.stringify(config);

    CP_save.save(data, 'config', function (err, result) {
        console.log(err, result);
    });

});