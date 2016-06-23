'use strict';

/**
 * Configuration dependencies.
 */

var config = require('../config/config');

/**
 * Node dependencies.
 */

var express = require('express');
var router  = express.Router();

/**
 * Robots.
 */

router.get('/?', function(req, res) {

    res.type('text/plain');
    res.send(
        config.codes.robots + '\n\n' +
        'Host: ' + config.domain + '\n\n' +
        'Sitemap: ' + config.protocol + config.domain + '/' + config.urls.sitemap
    );

});

module.exports = router;