'use strict';

/**
 * Module dependencies.
 */

var CP_get = require('../../lib/CP_get');

/**
 * Configuration dependencies.
 */

var config  = require('../../config/config');
var modules = require('../../config/modules');

/**
 * Callback.
 *
 * @callback Callback
 * @param {Object} err
 * @param {Object} [render]
 */

/**
 * Getting the data to render all sitemaps page.
 *
 * @param {Callback} callback
 */

function allSitemap(callback) {

    CP_get.categories('year', function(err, categories) {

        if (err) return callback(err);

        var render = {};
        render.sitemaps = [];

        for (var year in categories) {
            if (categories.hasOwnProperty(year)) {
                if (year == 'max') continue;
                render.sitemaps[render.sitemaps.length] = config.protocol + config.domain + '/' + config.urls.sitemap + '/' + config.urls.year + '/' + year;
            }
        }

        var collection = (modules.collections.status)
            ? modules.collections.data.url
            : null;

        var c = [
            config.urls.year,
            config.urls.genre,
            config.urls.country,
            config.urls.actor,
            config.urls.director,
            collection
        ];

        for (var cat in c) {
            if (c.hasOwnProperty(cat) && c[cat]) {
                render.sitemaps[render.sitemaps.length] = config.protocol + config.domain + '/' +  config.urls.sitemap + '/' + c[cat];
            }
        }

        callback(null, render);

    });

}

/**
 * Getting the data to render one sitemap page.
 *
 * @param {String} type
 * @param {String} year
 * @param {Callback} callback
 */

function oneSitemap(type, year, callback) {

    year = (year) ? parseInt(year) : 0;

    switch (type) {
        case (config.urls.year):
            return (year)
                ? getMovies(
                year,
                function(err, render) {
                    return (err)
                        ? callback(err)
                        : callback(null, render)
                })
                : getCategories(
                'year',
                function(err, render) {
                    return (err)
                        ? callback(err)
                        : callback(null, render)
                });
            break;
        case (config.urls.genre):
            getCategories(
                'genre',
                function(err, render) {
                    return (err)
                        ? callback(err)
                        : callback(null, render)
                });
            break;
        case (config.urls.country):
            getCategories(
                'country',
                function(err, render) {
                    return (err)
                        ? callback(err)
                        : callback(null, render)
                });
            break;
        case (config.urls.actor):
            getCategories(
                'actor',
                function(err, render) {
                    return (err)
                        ? callback(err)
                        : callback(null, render)
                });
            break;
        case (config.urls.director):
            getCategories(
                'director',
                function(err, render) {
                    return (err)
                        ? callback(err)
                        : callback(null, render)
                });
            break;
        case (modules.collections.data.url):
            getCollections(
                function(err, render) {
                    return (err)
                        ? callback(err)
                        : callback(null, render)
                });
            break;
        default:
            getCategories(
                'year',
                function(err, render) {
                    return (err)
                        ? callback(err)
                        : callback(null, render)
                });
    }

    /**
     * Get categories.
     *
     * @param {String} category
     * @param {Callback} callback
     */

    function getCategories(category, callback) {

        CP_get.categories(
            category,
            function (err, categories) {

                if (err) return callback(err);

                var render = {};
                render.links = [];

                for (var cat in categories) {
                    if (categories.hasOwnProperty(cat)) {
                        if (cat == 'max') continue;
                        render.links[render.links.length] = config.protocol + config.domain + '/' + config.urls[category] + '/' + encodeURIComponent(cat);
                    }
                }

                callback(null, render);

            });

    }

    /**
     * Get collections.
     *
     * @param {Callback} callback
     */

    function getCollections(callback) {

        var render = {};
        render.links = [];

        if (modules.collections.status) {
            for (var collection in modules.collections.data.collections) {
                if (modules.collections.data.collections.hasOwnProperty(collection)) {
                    render.links[render.links.length] = config.protocol + config.domain + '/' + modules.collections.data.url + '/' + encodeURIComponent(collection);
                }
            }
        }

        callback(null, render);

    }

    /**
     * Get movies.
     *
     * @param {String} year
     * @param {Callback} callback
     */

    function getMovies(year, callback) {

        CP_get.movies({"year": year}, 10000, function (err, movies) {

            if (err) return callback(err);

            if (movies && movies.length) {

                var render = {};
                render.links = [];

                for (var i = 0; i < movies.length; i++) {
                    render.links[render.links.length] = movies[i].url;
                }

                callback(null, render);

            }
            else {

                callback(null, '');

            }

        });

    }

}

module.exports = {
    "all" : allSitemap,
    "one" : oneSitemap
};