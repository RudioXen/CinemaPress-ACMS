'use strict';

/**
 * Configuration dependencies.
 */

var config = require('./config/config');

/**
 * Node dependencies. 
 */

var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var express      = require('express');
var path         = require('path');
var app          = express();

/**
 * Route dependencies.
 */

var robots  = require('./routes/robots');
var admin   = require('./routes/admin');
var website = require('./routes/website');

/**
 * Port.
 */

var port = process.env.PORT || parseInt(config.nginx.addr.split(':')[1]) || 3000;

/**
 * Template engine.
 */

app.set('views', [
    path.join(__dirname, 'themes', 'default', 'views'),
    path.join(__dirname, 'themes', config.theme, 'views')
]);
app.set('view engine', 'ejs');

/**
 * Middleware functions.
 */

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/robots.txt', robots);
app.use('/' + config.urls.admin, admin);
app.use(website);

app.use(function(err, req, res, next) {
    err.status  = (err.status)  ? err.status  : 404;
    err.message = (err.message) ? err.message : 'Not Found';
    res.status(err.status).render('error', {
        "search"  : config.urls.search,
        "status"  : err.status,
        "message" : err.message
    });
});

app.use(function(req, res) {
    res.status(404).render('error', {
        "search"  : config.urls.search,
        "status"  : 404,
        "message" : "Not Found"
    });
});

app.listen(port);