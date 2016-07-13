'use strict';

/**
 * Module dependencies.
 */

var CP_get   = require('../lib/CP_get');
var CP_text  = require('../lib/CP_text');
var CP_save  = require('../lib/CP_save');
var CP_cache = require('../lib/CP_cache');

/**
 * Configuration dependencies.
 */

var config  = require('../config/config');
var modules = require('../config/modules');
var texts   = require('../config/texts');

/**
 * Node dependencies.
 */

var express = require('express');
var async   = require('async');
var router  = express.Router();

/**
 * Callback.
 *
 * @callback Callback
 * @param {Object} err
 * @param {Object} [result]
 */

router.get('/:type?', function(req, res) {

    var c = JSON.stringify(config);
    var m = JSON.stringify(modules);
    var t = JSON.stringify(texts);

    var render = {
        "config"  : JSON.parse(c),
        "modules" : JSON.parse(m),
        "texts"   : JSON.parse(t)
    };

    var kp_id = (req.query.movie)
        ? req.query.movie
        : null;
    var mass = (req.query.movies)
        ? req.query.movies
        : null;
    var collection_url = (req.query.collection)
        ? req.query.collection
        : null;

    switch (req.params.type) {
        case 'index':
            res.render('admin/index', render);
            break;
        case 'movies':
            getMovie(function (err, render) {
                return (err)
                    ? res.send(err)
                    : res.render('admin/movies', render)
            });
            break;
        case 'main':
            res.render('admin/main', render);
            break;
        case 'urls':
            res.render('admin/urls', render);
            break;
        case 'display':
            res.render('admin/display', render);
            break;
        case 'titles':
            res.render('admin/titles', render);
            break;
        case 'descriptions':
            res.render('admin/descriptions', render);
            break;
        case 'keywords':
            res.render('admin/keywords', render);
            break;
        case 'codes':
            res.render('admin/codes', render);
            break;
        case 'cache':
            res.render('admin/cache', render);
            break;
        case 'load':
            res.render('admin/load', render);
            break;
        case 'publish':
            getCountMovies(function (err, render) {
                return (err)
                    ? res.send(err)
                    : res.render('admin/publish', render)
            });
            break;
        case 'collections':
            getCollection(function (err, render) {
                return (err)
                    ? res.send(err)
                    : res.render('admin/modules/collections', render)
            });
            break;
        case 'comments':
            res.render('admin/modules/comments', render);
            break;
        case 'related':
            res.render('admin/modules/related', render);
            break;
        case 'slider':
            res.render('admin/modules/slider', render);
            break;
        case 'abuse':
            res.render('admin/modules/abuse', render);
            break;
        case 'top':
            res.render('admin/modules/top', render);
            break;
        case 'social':
            res.render('admin/modules/social', render);
            break;
        case 'schema':
            res.render('admin/modules/schema', render);
            break;
        case 'soon':
            res.render('admin/modules/soon', render);
            break;
        case 'continue':
            res.render('admin/modules/continue', render);
            break;
        case 'viewed':
            res.render('admin/modules/viewed', render);
            break;
        case 'player':
            res.render('admin/modules/player', render);
            break;
        case 'blocking':
            res.render('admin/modules/blocking', render);
            break;
        default:
            getCountMovies(function (err, render) {
                return (err)
                    ? res.send(err)
                    : res.render('admin/admin', render)
            });
            break;
    }

    /**
     * Get movie.
     *
     * @param {Callback} callback
     */

    function getMovie(callback) {

        render.movie = null;
        render.movies = null;

        if (kp_id) {
            kp_id = parseInt(kp_id);
            CP_get.movies({"query_id": kp_id, "certainly": true}, function (err, movies) {
                if (err) return callback(err);

                render.movie = {};
                render.movie.kp_id = kp_id;

                if (movies && movies.length) {
                    render.movie = movies[0];
                    render.movie.title = CP_text.formatting(config.titles.movie.single, movies[0]);
                }

                if (texts.ids.indexOf(kp_id)+1) {
                    render.movie.title = render.texts.movies[kp_id].title;
                    render.movie.description = render.texts.movies[kp_id].description;
                    render.movie.keywords = render.texts.movies[kp_id].keywords;
                }

                callback(null, render);
            });
        }
        else if (mass) {
            render.movies = true;
            callback(null, render);
        }
        else {
            callback(null, render);
        }

    }

    /**
     * Get collection.
     *
     * @param {Callback} callback
     */

    function getCollection(callback) {

        render.collection = null;

        if (collection_url) {
            if (render.modules.collections.data.collections[collection_url]) {
                render.collection = render.modules.collections.data.collections[collection_url];
                render.collection.url = collection_url;
            }
            else {
                render.collection = {};
            }
        }

        return callback(null, render);

    }

    /**
     * Get count all and publish movies in website.
     *
     * @param {Callback} callback
     */

    function getCountMovies(callback) {

        async.series({
                "all": function (callback) {
                    CP_get.count({"all_movies": "_all_", "certainly": true}, function (err, count) {
                        if (err) return callback(err);

                        callback(null, count);

                    });
                },
                "publish": function (callback) {
                    CP_get.count({"all_movies": "_all_"}, function (err, count) {
                        if (err) return callback(err);

                        callback(null, count);

                    });
                }
            },
            function(err, result) {

                if (err) return callback(err);

                render.counts = result;
                render.counts.percent = Math.round((100 * result.publish) / result.all);
                render.counts.days = ((result.all - result.publish) && config.publish.every.movies && config.publish.every.hours)
                    ? Math.round((result.all - result.publish)/Math.round((24 * config.publish.every.movies) / config.publish.every.hours))
                    : 0;

                callback(null, render);

            });

    }

});

router.post('/change', function(req, res) {

    var form = req.body;

    var configs = {
        "config"  : config,
        "modules" : modules,
        "texts"  : texts
    };

    var change = {
        "config"     : false,
        "modules"    : false,
        "texts"     : false,
        "restart" : false
    };

    if (form.config) {

        if ((form.config.urls && form.config.urls.admin && form.config.urls.admin != configs.config.urls.admin) || (form.config.theme && form.config.theme != configs.config.theme)) {
            change.restart = true;
        }

        change.config  = true;
        configs.config = parseData(configs.config, form.config);

    }

    if (form.modules) {

        change.modules  = true;
        configs.modules = parseData(configs.modules, form.modules);

    }

    if (form.collection) {

        if (form.collection.url) {

            if (form.delete) {
                if (configs.modules.collections.data.collections[form.collection.url]) {
                    delete configs.modules.collections.data.collections[form.collection.url];
                }
            }
            else {
                var movies = [];
                form.collection.movies = form.collection.movies.split(',');
                for (var i = 0; i < form.collection.movies.length; i++) {
                    if (parseInt(form.collection.movies[i])) {
                        movies.push(parseInt(form.collection.movies[i]));
                    }
                }
                if (movies.length) {
                    change.modules = true;
                    form.collection.movies = movies;
                    configs.modules.collections.data.collections[form.collection.url] = form.collection;
                }
            }

        }

    }

    if (form.movie) {

        form.movie.kp_id = (parseInt(form.movie.kp_id)) ? parseInt(form.movie.kp_id) : 0;

        if (form.movie.kp_id)
            addMovie(form.movie);

    }

    if (form.movies) {

        var reg = new RegExp('\\s*\\(\\s*([0-9]{3,7})\\s*\\)\\s*\\{([^]*?)\\}\\s*', 'gi');

        var parts = form.movies.match(reg);

        parts.forEach(function (part) {

            var r = new RegExp('\\s*\\(\\s*([0-9]{3,7})\\s*\\)\\s*\\{([^]*?)\\}\\s*', 'gi');

            var p = r.exec(part);

            if (p && p.length) {

                var movie = {};

                movie.kp_id = parseInt(p[1]);

                var td = p[2].split('|');
                if (td.length == 2) {
                    movie.title = td[0].replace(/\s+/g, ' ').replace(/(^\s*)|(\s*)$/g, '');
                    movie.description = td[1].replace(/\s+/g, ' ').replace(/(^\s*)|(\s*)$/g, '');
                }
                else {
                    movie.description = td[0].replace(/\s+/g, ' ').replace(/(^\s*)|(\s*)$/g, '');
                }

                addMovie(movie);

            }

        });

    }

    if (form.switch && form.switch.module && modules[form.switch.module]) {

        change.modules = true;
        configs.modules[form.switch.module].status = (form.switch.status === 'true');

    }

    if (form.restart) {

        CP_save.restart(function (err, result) {
            console.log('Type:', 'restart', 'Error:', err, 'Result:', result);
            return (err)
                ? res.status(404).send(err)
                : res.send(result)
        });

    }
    else if (form.flush) {

        CP_cache.flush(function(err) {
            console.log('Type:', 'flush', 'Error:', err);
            return (err)
                ? res.status(404).send(err)
                : res.send('Flush.')
        });

    }
    else if (change.config || change.modules || change.texts) {

        async.series({
                "config": function (callback) {
                    return (change.config)
                        ? CP_save.save(
                        configs.config,
                        'config',
                        function (err, result) {
                            return (err)
                                ? callback(err)
                                : callback(null, result)
                        })
                        : callback(null, null);
                },
                "modules": function (callback) {
                    return (change.modules)
                        ? CP_save.save(
                        configs.modules,
                        'modules',
                        function (err, result) {
                            return (err)
                                ? callback(err)
                                : callback(null, result)
                        })
                        : callback(null, null);
                },
                "texts": function (callback) {
                    return (change.texts)
                        ? CP_save.save(
                        configs.texts,
                        'texts',
                        function (err, result) {
                            return (err)
                                ? callback(err)
                                : callback(null, result)
                        })
                        : callback(null, null);
                }
            },
            function(err, result) {

                console.log('Type:', 'save', 'Result:', result, 'Error:', err);
                return (err)
                    ? res.status(404).send(err)
                    : (change.restart)
                    ? CP_save.restart(
                    function (err, result) {
                        console.log('Type:', 'restart', 'Error:', err, 'Result:', result);
                        return (err)
                            ? res.status(404).send(err)
                            : res.send(result)
                    })
                    : res.send(result);

            });

    }
    else {

        res.send('Nothing to form.');

    }

    /**
     * Determine what the configuration settings have been changed.
     *
     * @param {Object} config
     * @param {Object} changes
     * @return {Object}
     */

    function parseData(config, changes) {

        var originals = config;

        for (var key in originals) {
            if (originals.hasOwnProperty(key) && changes.hasOwnProperty(key)) {

                if (Array.isArray(originals[key])) {
                    var arr = (changes[key])
                        ? changes[key].split(',')
                        : [];
                    var clear_arr = [];
                    arr.forEach(function (text) {
                        text = text.replace(/(^\s*)|(\s*)$/g, '');
                        if (text) {
                            clear_arr.push(text);
                        }
                    });
                    originals[key] = clear_arr;
                }
                else if (typeof originals[key] === 'string') {
                    originals[key] = changes[key].toString();
                }
                else if (typeof originals[key] === 'number') {
                    originals[key] = parseInt(changes[key]);
                }
                else if (typeof originals[key] === 'boolean') {
                    originals[key] = (changes[key] === 'true');
                }
                else if (typeof originals[key] === 'object') {
                    originals[key] = parseData(originals[key], changes[key]);
                }

            }
        }

        return originals;

    }

    /**
     * Add movie in texts.
     *
     * @param {Object} movie
     */

    function addMovie(movie) {

        var id = movie.kp_id;

        if (form.delete) {
            change.texts = true;
            while (configs.texts.ids.indexOf(id) !== -1)
                configs.texts.ids.splice(configs.texts.ids.indexOf(id), 1);
            delete configs.texts.movies[id];

            if (configs.modules.collections.data.collections.choice) {
                change.modules = true;
                configs.modules.collections.data.collections.choice.movies.push(id);
                while (configs.modules.collections.data.collections.choice.movies.indexOf(id) !== -1)
                    configs.modules.collections.data.collections.choice.movies.splice(configs.modules.collections.data.collections.choice.movies.indexOf(id), 1);
            }
        }
        else {
            change.texts = true;
            if (configs.texts.ids.indexOf(id) === -1) {
                configs.texts.ids.push(id);
            }
            configs.texts.movies[id] = movie;

            if (configs.modules.collections.data.collections.choice) {
                change.modules = true;
                if (configs.modules.collections.data.collections.choice.movies.indexOf(id) === -1) {
                    configs.modules.collections.data.collections.choice.movies.push(id);
                }
            }
        }

    }

});

module.exports = router;