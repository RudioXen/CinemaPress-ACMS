'use strict';

/**
 * Configuration dependencies.
 */

var config = require('../config/config');

/**
 * Node dependencies.
 */
 
var Memcached = require('memcached');

/**
 * Determination of address and port.
 *
 * @return {String}
 */

function cacheAddr() {

    return config.cache.addr || '127.0.0.1:11211';

}

module.exports = new Memcached(cacheAddr());