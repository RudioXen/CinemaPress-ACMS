'use strict';

/**
 * Module dependencies.
 */

var CP_page   = require('../../lib/CP_page');
var CP_get    = require('../../lib/CP_get');
var CP_decode = require('../../lib/CP_decode');

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
 * Getting the data to render movie page.
 *
 * @param {Number} id
 * @param {String} type
 * @param {Callback} callback
 */

function dataMovie(id, type, callback) {

    var related = {};

    async.series({
            "movie": function (callback) {
                return CP_get.movies(
                    {"query_id": id},
                    function (err, movies) {
                        if (err) return callback(err);

                        if (movies && movies.length) {
                            related = movies[0];
                            callback(null, movies[0]);
                        }
                        else {
                            callback('Данного фильма на сайте нет. Возможно Вы ошиблись в URL или текущий фильм еще не опубликован.');
                        }
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
                            ? callback(null, movies)
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
                            ? callback(null, movies)
                            : callback(null, null)
                    })
                    : callback(null, null)
            },
            "movies": function(callback) {
                return (related.id && modules.related.status)
                    ? async.series({
                        "countries": function(callback) {
                            return (modules.related.data.display.indexOf('countries') + 1)
                                ? CP_get.additional(
                                {"country": related.countries_arr},
                                'related',
                                function (err, movies) {
                                    if (err) return callback(err);

                                    return (movies && movies.length)
                                        ? callback(null, movies)
                                        : callback(null, [])
                                })
                                : callback(null, [])
                        },
                        "genres": function(callback) {
                            return (modules.related.data.display.indexOf('genres') + 1)
                                ? CP_get.additional(
                                {"genre": related.genres_arr},
                                'related',
                                function (err, movies) {
                                    if (err) return callback(err);

                                    return (movies && movies.length)
                                        ? callback(null, movies)
                                        : callback(null, [])
                                })
                                : callback(null, [])
                        },
                        "directors": function(callback) {
                            return (modules.related.data.display.indexOf('directors') + 1)
                                ? CP_get.additional(
                                {"director": related.directors_arr},
                                'related',
                                function (err, movies) {
                                    if (err) return callback(err);

                                    return (movies && movies.length)
                                        ? callback(null, movies)
                                        : callback(null, [])
                                })
                                : callback(null, [])
                        },
                        "actors": function(callback) {
                            return (modules.related.data.display.indexOf('actors') + 1)
                                ? CP_get.additional(
                                {"actor": related.actors_arr},
                                'related',
                                function (err, movies) {
                                    if (err) return callback(err);

                                    return (movies && movies.length)
                                        ? callback(null, movies)
                                        : callback(null, [])
                                })
                                : callback(null, [])
                        },
                        "country": function(callback) {
                            return (modules.related.data.display.indexOf('country') + 1)
                                ? CP_get.additional(
                                {"country": related.country},
                                'related',
                                function (err, movies) {
                                    if (err) return callback(err);

                                    return (movies && movies.length)
                                        ? callback(null, movies)
                                        : callback(null, [])
                                })
                                : callback(null, [])
                        },
                        "genre": function(callback) {
                            return (modules.related.data.display.indexOf('genre') + 1)
                                ? CP_get.additional(
                                {"genre": related.genre},
                                'related',
                                function (err, movies) {
                                    if (err) return callback(err);

                                    return (movies && movies.length)
                                        ? callback(null, movies)
                                        : callback(null, [])
                                })
                                : callback(null, [])
                        },
                        "director": function(callback) {
                            return (modules.related.data.display.indexOf('director') + 1)
                                ? CP_get.additional(
                                {"director": related.director},
                                'related',
                                function (err, movies) {
                                    if (err) return callback(err);

                                    return (movies && movies.length)
                                        ? callback(null, movies)
                                        : callback(null, [])
                                })
                                : callback(null, [])
                        },
                        "actor": function(callback) {
                            return (modules.related.data.display.indexOf('actor') + 1)
                                ? CP_get.additional(
                                {"actor": related.actor},
                                'related',
                                function (err, movies) {
                                    if (err) return callback(err);

                                    return (movies && movies.length)
                                        ? callback(null, movies)
                                        : callback(null, [])
                                })
                                : callback(null, [])
                        },
                        "year": function(callback) {
                            return (modules.related.data.display.indexOf('year') + 1)
                                ? CP_get.additional(
                                {"year": related.year},
                                'related',
                                function (err, movies) {
                                    if (err) return callback(err);

                                    return (movies && movies.length)
                                        ? callback(null, movies)
                                        : callback(null, [])
                                })
                                : callback(null, [])
                        }
                    },
                    function(err, result) {

                        return (err)
                            ? callback(err)
                            : callback(err, result)

                    })
                    : callback(null, null)
            }
        },
        function(err, result) {

            if (err) return callback(err);

            for (var r in result)
                if (result.hasOwnProperty(r) && result[r] === null)
                    delete result[r];

            result.page = CP_page.movie(type, result.movie, result.movies);

            callback(null, result);

        });

}

/**
 * Get ID movie.
 *
 * @param {String} url
 * @return {Number}
 */

function idMovie(url) {

    url = '/' + url;

    var prefix_id = config.urls.prefix_id || '/';
    var regexpId  = new RegExp(CP_decode.text(prefix_id) + '([0-9]{1,7})', 'ig');
    var execId    = regexpId.exec(CP_decode.text(url));
    var id        = (execId) ? parseInt(execId[1]) : 0;

    return id - parseInt(config.urls.unique_id);

}

/**
 * Get type movie.
 *
 * @param {String} type
 * @return {String}
 */

function typeMovie(type) {

    type = type || 'movie';
    
    var types = '';
    
    for (var t in config.urls.movies) {
        if (config.urls.movies.hasOwnProperty(t)) {
            types += '|' + config.urls.movies[t];
        }
    }

    var regexpType = new RegExp('^(movie' + types + ')$', 'ig');
    var execType   = regexpType.exec(type);

    return (execType) ? execType[1] : '404';

}

module.exports = {
    "id"   : idMovie,
    "type" : typeMovie,
    "data" : dataMovie
};