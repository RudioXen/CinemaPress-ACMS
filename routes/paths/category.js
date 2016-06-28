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
 * Getting the data to render categories page.
 *
 * @param {String} type
 * @param {Callback} callback
 */

function allCategory(type, callback) {

    switch (type) {
        case (config.urls.year):
            getCategories('year', function(err, render) {
                return (err)
                    ? callback(err)
                    : callback(null, render)
            });
            break;
        case (config.urls.genre):
            getCategories('genre', function(err, render) {
                return (err)
                    ? callback(err)
                    : callback(null, render)
            });
            break;
        case (config.urls.country):
            getCategories('country', function(err, render) {
                return (err)
                    ? callback(err)
                    : callback(null, render)
            });
            break;
        case (config.urls.actor):
            getCategories('actor', function(err, render) {
                return (err)
                    ? callback(err)
                    : callback(null, render)
            });
            break;
        case (config.urls.director):
            getCategories('director', function(err, render) {
                return (err)
                    ? callback(err)
                    : callback(null, render)
            });
            break;
        default:
            res.redirect('/');
    }

    /**
     * Get categories.
     *
     * @param {String} category
     * @param {Callback} callback
     */

    function getCategories(category, callback) {

        async.series({
                "categories": function (callback) {
                    var query = {};
                    query[category] = '!_empty';
                    return CP_get.movies(
                        query,
                        1000,
                        'kinopoisk-vote-up',
                        1,
                        false,
                        function(err, movies) {
                            if (err) return callback(err);

                            var categories = CP_structure.categories(category, movies);

                            return callback(null, categories);
                        })
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

                result.page = CP_page.categories(category);

                callback(null, result);

            });

    }

}

/**
 * Getting the data to render category page.
 *
 * @param {String} type
 * @param {String} key
 * @param {String} page
 * @param {String} sorting
 * @param {Callback} callback
 */

function oneCategory(type, key, page, sorting, callback) {

    page = (parseInt(page)) ? parseInt(page) : 1;

    switch (type) {
        case (config.urls.year):
            getMovies({"year": key}, function(err, render) {
                return (err)
                    ? callback(err)
                    : callback(null, render)
            });
            break;
        case (config.urls.genre):
            getMovies({"genre": key}, function(err, render) {
                return (err)
                    ? callback(err)
                    : callback(null, render)
            });
            break;
        case (config.urls.country):
            getMovies({"country": key}, function(err, render) {
                return (err)
                    ? callback(err)
                    : callback(null, render)
            });
            break;
        case (config.urls.actor):
            getMovies({"actor": key}, function(err, render) {
                return (err)
                    ? callback(err)
                    : callback(null, render)
            });
            break;
        case (config.urls.director):
            getMovies({"director": key}, function(err, render) {
                return (err)
                    ? callback(err)
                    : callback(null, render)
            });
            break;
        case (config.urls.type):
            getMovies({"type": key}, function(err, render) {
                return (err)
                    ? callback(err)
                    : callback(null, render)
            });
            break;
        case (config.urls.search):
            getMovies({"search": key}, function(err, render) {
                return (err)
                    ? callback(err)
                    : callback(null, render)
            });
            break;
        default:
            callback('404');
    }

    /**
     * Get movies.
     *
     * @param {Object} query
     * @param {Callback} callback
     */

    function getMovies(query, callback) {

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

                result.page = CP_page.category(query, sorting, page, result.count, result.movies);

                callback(null, result);

            });

    }

}

module.exports = {
    "all" : allCategory,
    "one" : oneCategory
};
