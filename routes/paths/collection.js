'use strict';

/**
 * Module dependencies.
 */

var CP_structure = require('../../lib/CP_structure');
var CP_page      = require('../../lib/CP_page');
var CP_get       = require('../../lib/CP_get');

/**
 * Configuration dependencies.
 */

var config  = require('../../config/config');
var modules = require('../../config/modules');

/**
 * Node dependencies.
 */

var async = require('async');

/**
 * Callback.
 *
 * @callback Callback
 * @param {Object} err
 * @param {Object} [render]
 */

/**
 * Getting the data to render collections page.
 
 * @param {Callback} callback
 */

function allCollection(callback) {

    async.series({
            "categories": function (callback) {

                var collections = [];

                async.forEachOfSeries(modules.collections.data.collections, function (value, key, callback) {

                    var ids = (
                    modules.collections.data.collections[key] &&
                    modules.collections.data.collections[key].movies &&
                    modules.collections.data.collections[key].movies.length)
                        ? modules.collections.data.collections[key].movies.join('|')
                        : '';

                    var query = {"query_id": ids};

                    CP_get.movies(
                        query,
                        10,
                        'kinopoisk-vote-up',
                        1,
                        function (err, movies) {
                            if (err) return callback(err);

                            collections.push(CP_structure.collections(modules.collections.data.collections[key], movies));
                            callback();

                        });

                }, function (err) {

                    if (err) return callback(err);

                    callback(null, collections);

                });

            },
            "slider": function (callback) {
                return (modules.slider.status)
                    ? CP_get.additional(
                    {"query_id": modules.slider.data.movies},
                    'ids',
                    function (err, movies) {
                        if (err) return callback(err);

                        return (movies && movies.length)
                            ? callback(null, movies[0])
                            : callback(null, null)
                    })
                    : callback(null, null)
            },
            "soon": function (callback) {
                return (modules.soon.status)
                    ? CP_get.additional(
                    {"all_movies": "_all_"},
                    'soon',
                    function (err, movies) {
                        if (err) return callback(err);

                        return (movies && movies.length)
                            ? callback(null, movies[0])
                            : callback(null, null)
                    })
                    : callback(null, null)
            }
        },
        function(err, result) {

            if (err) return callback(err);

            for (var r in result)
                if (result.hasOwnProperty(r) && result[r] === null)
                    delete result[r];

            result.page = CP_page.collections();

            callback(null, result);

        });

}

/**
 * Getting the data to render collection page.
 *
 * @param {String} key
 * @param {String} page
 * @param {String} sorting
 * @param {Callback} callback
 */

function oneCollection(key, page, sorting, callback) {

    page = (parseInt(page)) ? parseInt(page) : 1;

    var ids = (
    modules.collections.data.collections[key] &&
    modules.collections.data.collections[key].movies &&
    modules.collections.data.collections[key].movies.length)
        ? modules.collections.data.collections[key].movies.join('|')
        : '';

    var query = {"query_id": ids};

    async.series({
            "movies": function (callback) {
                return CP_get.movies(
                    query,
                    config.default.count,
                    sorting,
                    page,
                    function (err, movies) {
                        if (err) return callback(err);

                        return (movies && movies.length)
                            ? callback(null, movies)
                            : callback(null, [])
                    });
            },
            "top": function (callback) {
                return (modules.top.status)
                    ? CP_get.additional(
                    query,
                    'top',
                    function (err, movies) {
                        if (err) return callback(err);

                        return (movies && movies.length)
                            ? callback(null, movies[0])
                            : callback(null, null)
                    })
                    : callback(null, null)
            },
            "slider": function (callback) {
                return (modules.slider.status)
                    ? CP_get.additional(
                    {"query_id": modules.slider.data.movies},
                    'ids',
                    function (err, movies) {
                        if (err) return callback(err);

                        return (movies && movies.length)
                            ? callback(null, movies[0])
                            : callback(null, null)
                    })
                    : callback(null, null)
            },
            "soon": function (callback) {
                return (modules.soon.status)
                    ? CP_get.additional(
                    {"all_movies": "_all_"},
                    'soon',
                    function (err, movies) {
                        if (err) return callback(err);

                        return (movies && movies.length)
                            ? callback(null, movies[0])
                            : callback(null, null)
                    })
                    : callback(null, null)
            },
            "count": function (callback) {
                return CP_get.count(
                    query,
                    function (err, num) {
                        if (err) return callback(err);

                        num = Math.ceil(parseInt(num)/config.default.count);

                        return (num)
                            ? callback(null, num)
                            : callback(null, 0)
                    });
            }
        },
        function(err, result) {

            if (err) return callback(err);

            for (var r in result)
                if (result.hasOwnProperty(r) && result[r] === null)
                    delete result[r];

            result.page = CP_page.collection(key, sorting, page, result.count, result.movies);

            callback(null, result);

        });

}

module.exports = {
    "all" : allCollection,
    "one" : oneCollection
};