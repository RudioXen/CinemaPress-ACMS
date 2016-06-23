'use strict';

/**
 * Module dependencies.
 */

var CP_cache = require('./CP_cache');

/**
 * Configuration dependencies.
 */

var config = require('../config/config');

/**
 * Node dependencies.
 */

var mysql = require('mysql');
var md5   = require('md5');

/**
 * Callback.
 *
 * @callback Callback
 * @param {Object} err
 * @param {Object} [render]
 */

/**
 * Query to database.
 *
 * @param {String} query
 * @param {Callback} callback
 */

function sphinxQuery(query, callback) {

    var hash = md5(query);

    return (config.cache.time)
        ? CP_cache.get(
        hash,
        function (err, render) {
            if (err) return callback(err);
            return (render)
                ? callback(null, render)
                : getSphinx(
                function (err, render) {
                    return (err)
                        ? callback(err)
                        : callback(null, render)
                });

        })
        : getSphinx(
        function (err, render) {
            return (err)
                ? callback(err)
                : callback(null, render)
        });

    /**
     * Sphinx.
     *
     * @param {Callback} callback
     */

    function getSphinx(callback) {

        var parse = config.sphinx.addr.split(':');

        var sphinxConnection = {
            host: parse[0] || '127.0.0.1',
            port: parse[1] || '9306'
        };

        var connection = mysql.createConnection(sphinxConnection);

        connection.connect(function(err) {

            if (err) return callback(err);

            connection.query(query, function(err, results) {

                connection.end();

                if (err) return callback(err);

                callback(null, results);

                if (config.cache.time && results) {

                    CP_cache.set(
                        hash,
                        results,
                        config.cache.time,
                        function (err) {
                            if (err) {
                                console.log('[lib/CP_sphinx.js:getSphinx] Cache Set Error:', err);
                            }
                        }
                    );

                }

            });

        });
        
    }

}

module.exports = {
    "query" : sphinxQuery
};