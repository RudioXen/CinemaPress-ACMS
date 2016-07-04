'use strict';

/**
 * Module dependencies.
 */

var CP_cache  = require('../lib/CP_cache');
var CP_decode = require('../lib/CP_decode');

/**
 * Configuration dependencies.
 */

var config  = require('../config/config');
var modules = require('../config/modules');

/**
 * Node dependencies.
 */

var md5     = require('md5');
var express = require('express');
var router  = express.Router();

/**
 * Route dependencies.
 */

var index    = require('./paths/index');
var movie    = require('./paths/movie');
var category = require('./paths/category');
var sitemap  = require('./paths/sitemap');

/**
 * Route CP modules dependencies.
 */

var collection = require('./paths/collection');

/**
 * Callback.
 *
 * @callback Callback
 * @param {Object} err
 * @param {Object} [render]
 */

router.get('/:level1?/:level2?/:level3?/:level4?', function (req, res, next) {

    var url = parseUrl();
    var urlHash = md5(url.toLowerCase());

    var level1  = clearString(req.params.level1) || null;
    var level2  = clearString(req.query.q)       || clearString(req.params.level2) || null;
    var level3  = clearString(req.params.level3) || null;
    var sorting = clearString(req.query.sorting) || config.default.sorting;

    console.time(url);

    var template = setTemplate();

    getRender(function (err, render) {

        renderData(err, render);

    });

    /**
     * Get render.
     *
     * @param {Callback} callback
     */

    function getRender(callback) {

        return (config.cache.time)
            ? getCache(
            function (err, render) {
                return (err)
                    ? callback(err)
                    : callback(null, render)
            })
            : getSphinx(
            function (err, render) {
                return (err)
                    ? callback(err)
                    : callback(null, render)
            });

    }

    /**
     * Get cache.
     *
     * @param {Callback} callback
     */

    function getCache(callback) {

        CP_cache.get(urlHash, function (err, render) {

            if (err) return callback(err);

            return (render)
                ? callback(null, render)
                : getSphinx(
                function (err, render) {
                    return (err)
                        ? callback(err)
                        : callback(null, render)
                });

        });

    }

    /**
     * Get sphinx.
     *
     * @param {Callback} callback
     */

    function getSphinx(callback) {

        switch (template) {
            case 'movie':
                movie.data(
                    movie.id(level2),
                    'movie',
                    function (err, render) {
                        callback(err, render);
                    });
                break;
            case 'online':
                movie.data(
                    movie.id(level2),
                    'online',
                    function (err, render) {
                        callback(err, render);
                    });
                break;
            case 'download':
                movie.data(
                    movie.id(level2),
                    'download',
                    function (err, render) {
                        callback(err, render);
                    });
                break;
            case 'trailer':
                movie.data(
                    movie.id(level2),
                    'trailer',
                    function (err, render) {
                        callback(err, render);
                    });
                break;
            case 'picture':
                movie.data(
                    movie.id(level2),
                    'picture',
                    function (err, render) {
                        callback(err, render);
                    });
                break;
            case 'category':
                category.one(
                    level1,
                    level2,
                    level3,
                    sorting,
                    function (err, render) {
                        callback(err, render);
                    });
                break;
            case 'categories':
                category.all(
                    level1,
                    function (err, render) {
                        callback(err, render);
                    });
                break;
            case 'sitemap':
                return (level2)
                    ? sitemap.one(
                    level2,
                    level3,
                    function (err, render) {
                        callback(err, render);
                    })
                    : sitemap.all(
                    function (err, render) {
                        callback(err, render);
                    });
                break;
            case 'collection':
                template = 'category';
                collection.one(
                    level2,
                    level3,
                    sorting,
                    function (err, render) {
                        callback(err, render);
                    });
                break;
            case 'collections':
                template = 'categories';
                collection.all(
                    function (err, render) {
                        callback(err, render);
                    });
                break;
            case 'index':
                index.data(
                    function (err, render) {
                        callback(err, render);
                    });
                break;
            default:
                callback('Данной страницы нет на сайте. Возможно Вы ошиблись в URL или это внутренняя ошибка сайта, о которой администратор уже знает и предпринимает действия для её устранения.');
        }

    }

    /**
     * Parse URL.
     *
     * @return {String}
     */

    function parseUrl() {

        var parts = req.originalUrl.split('?');

        var url = config.domain + parts[0];

        if (parts[1]) {
            if (req.query.sorting && config.sorting[req.query.sorting]) {
                url += '?sorting=' + req.query.sorting;
            }
            else if (req.query.q) {
                url += '?q=' + req.query.q.replace(/[^A-zА-яЁё0-9 -]/g, '');
            }
        }

        return CP_decode.text(url);

    }

    /**
     * Set template.
     *
     * @return {String}
     */

    function setTemplate() {

        switch (level1) {
            case config.urls.movie:
                return (movie.id(level2))
                    ? movie.type(level3)
                    : 'error';
                break;
            case config.urls.year:
                return (level2)
                    ? 'category'
                    : 'categories';
                break;
            case config.urls.genre:
                return (level2)
                    ? 'category'
                    : 'categories';
                break;
            case config.urls.country:
                return (level2)
                    ? 'category'
                    : 'categories';
                break;
            case config.urls.actor:
                return (level2)
                    ? 'category'
                    : 'categories';
                break;
            case config.urls.director:
                return (level2)
                    ? 'category'
                    : 'categories';
                break;
            case config.urls.type:
                return (level2)
                    ? 'category'
                    : 'error';
                break;
            case config.urls.search:
                return (level2)
                    ? 'category'
                    : 'error';
                break;
            case config.urls.sitemap:
                return 'sitemap';
                break;
            case modules.collections.data.url:
                if (!modules.collections.status)
                    return 'error';
                return (level2)
                    ? 'collection'
                    : 'collections';
                break;
            case null:
                return 'index';
                break;
            default:
                return 'error';
        }

    }

    /**
     * Clear string.
     *
     * @param {String} string
     * @return {String}
     */

    function clearString(string) {

        return (string) ? string.replace(/[^\w\sа-яё\._-]/gi, '') : null;
        
    }

    /**
     * Render data.
     *
     * @param {Object} err
     * @param {Object} render
     */

    function renderData(err, render) {

        if (err) {
            console.log('[routes/website.js] Error:', err);
            
            return next({
                "status": 404,
                "message": err
            });
        }

        if (typeof render === 'object') {

            if (config.theme == 'default') {

                console.time('TimeRender');
                res.json(render);
                console.timeEnd('TimeRender');

            }
            else {

                console.time('TimeRender');

                if (template == 'sitemap')
                    res.header('Content-Type', 'application/xml');

                res.render(template, render, function(err, html) {

                    if (err) console.log('[renderData] Render Error:', err);

                    res.send(html);

                    console.timeEnd('TimeRender');

                    if (config.cache.time && html) {
                        CP_cache.set(
                            urlHash,
                            html,
                            config.cache.time,
                            function (err) {
                                if (err) console.log('[renderData] Cache Set Error:', err);
                            }
                        );
                    }

                });

            }
        }
        else {

            res.send(render);

        }

        console.timeEnd(url);

    }

});

module.exports = router;