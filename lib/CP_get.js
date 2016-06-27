'use strict';

/**
 * Module dependencies.
 */

var CP_publish   = require('./CP_publish');
var CP_structure = require('./CP_structure');
var CP_cache     = require('./CP_cache');
var CP_sphinx    = require('./CP_sphinx');
var CP_text      = require('./CP_text');

/**
 * Configuration dependencies.
 */

var config  = require('../config/config');
var modules = require('../config/modules');

/**
 * Node dependencies.
 */

var async = require('async');
var md5   = require('md5');

/**
 * Sphinx fulltext search.
 */

var sphinx = {
    "movies" : 'movies_' + config.domain.replace(/[^A-Za-z0-9]/g,'_')
};

/**
 * Callback.
 *
 * @callback Callback
 * @param {Object} err
 * @param {Object} [render]
 */

/**
 * Getting all movies for a particular query.
 *
 * @param {Object} query
 * @param {Number} [count]
 * @param {String} [sorting]
 * @param {String} [page]
 * @param {Boolean} [structure]
 * @param {Callback} callback
 */

function moviesGet(query, count, sorting, page, structure, callback) {

    if (arguments.length == 5) {
        callback = structure;
        structure = true;
    }
    else if (arguments.length == 4) {
        callback = page;
        page = 1;
        structure = true;
    }
    else if (arguments.length == 3) {
        callback = sorting;
        sorting  = 'kinopoisk-vote-up';
        page = 1;
        structure = true;
    }
    else if (arguments.length == 2) {
        callback = count;
        count = config.default.count;
        sorting  = 'kinopoisk-vote-up';
        page = 1;
        structure = true;
    }

    var start = parseInt(page) * parseInt(count) - parseInt(count);
    var max   = start + parseInt(count);

    var publish = {};
    publish.select = '';
    publish.where = '';

    if (query.admin) {
        delete query.admin;
    }
    else {
        publish = CP_publish.queryCondition();
    }

    var queryString = '' +
        ' SELECT * ' +
        publish.select +
        ' FROM ' + sphinx.movies +
        ' WHERE ' +
        createWhere() +
        publish.where +
        createOrderBy() +
        ' LIMIT ' + start + ', ' + count +
        ' OPTION max_matches = ' + max;

    CP_sphinx.query(queryString, function (err, movies) {

        if (err) return callback(err);

        if (movies && movies.length) {
            if (structure) {
                movies = CP_structure.movie(movies);
            }
        }
        else {
            movies = [];
        }

        callback(null, movies);

    });

    /**
     * Create WHERE for query.
     *
     * @return {String}
     */

    function createWhere() {

        var where = [];
        var match = [];

        match.push('@all_movies _all_');

        if (sorting.indexOf('kinopoisk-rating') + 1) {
            where.push('`kp_vote` > ' + config.default.votes.kp);
        }
        else if (sorting.indexOf('imdb-rating') + 1) {
            where.push('`imdb_vote` > ' + config.default.votes.imdb);
        }
        else if (sorting.indexOf('year') + 1 || sorting.indexOf('premiere') + 1) {
            where.push('`premiere` <= ' + toDays());
        }
        else if (sorting.indexOf('soon') + 1) {
            where.push('`premiere` > ' + toDays());
        }

        for (var attribute in query) {
            if (query.hasOwnProperty(attribute)) {

                var search = ('' + query[attribute]).toLowerCase();
                search = search.replace(/[^0-9A-Za-zА-Яа-яЁё\s\+-\|!]/g,'');
                search = search.replace(/\s+/g, ' ');
                search = search.replace(/(^\s*)|(\s*)$/g, '');

                if (attribute == 'type') {
                    if (search == config.urls.types.serial) {
                        where.push('`type` = 1');
                        match.push('@genre !аниме !короткометражка');
                    }
                    else if (search == config.urls.types.mult) {
                        where.push('`type` != 1');
                        match.push('@genre мультфильм | детский !аниме !короткометражка');
                    }
                    else if (search == config.urls.types.anime) {
                        match.push('@genre аниме');
                    }
                    else if (search == config.urls.types.tv) {
                        match.push('@genre шоу | новости | реальное | церемония | концерт');
                    }
                    else if (search == config.urls.types.movie) {
                        where.push('`type` != 1');
                        match.push('@genre !мультфильм !аниме !короткометражка !шоу !новости !реальное !церемония !концерт !детский !документальный');
                    }
                }
                else {
                    match.push('@' + attribute + ' ' + search);
                }

            }
        }

        where.push('MATCH(\'' + match.join(' ').trim() + '\')');

        return where.join(' AND ');

    }

    /**
     * Create ORDER BY for query.
     *
     * @return {String}
     */

    function createOrderBy() {

        var ob = '';

        switch (sorting) {
            case ('kinopoisk-rating-up'):
                ob = 'kp_rating DESC';
                break;
            case ('kinopoisk-rating-down'):
                ob = 'kp_rating ASC';
                break;
            case ('imdb-rating-up'):
                ob = 'imdb_rating DESC';
                break;
            case ('imdb-rating-down'):
                ob = 'imdb_rating ASC';
                break;
            case ('kinopoisk-vote-up'):
                ob = 'kp_vote DESC';
                break;
            case ('kinopoisk-vote-down'):
                ob = 'kp_vote ASC';
                break;
            case ('imdb-vote-up'):
                ob = 'imdb_vote DESC';
                break;
            case ('imdb-vote-down'):
                ob = 'imdb_vote ASC';
                break;
            case ('year-up'):
                ob = 'year DESC';
                break;
            case ('year-down'):
                ob = 'year ASC';
                break;
            case ('premiere-up'):
                ob = 'premiere DESC';
                break;
            case ('premiere-down'):
                ob = 'premiere ASC';
                break;
            default:
                ob = '';
                break;
        }

        return (ob != '') ? ' ORDER BY ' + ob : '';

    }

    /**
     * The number of days to the current time.
     *
     * @return {Number}
     */

    function toDays() {

        return 719527 + Math.floor(new Date().getTime()/(1000*60*60*24));

    }

}

/**
 * The additional for index/related movies.
 *
 * @param {Object} query
 * @param {String} type
 * @param {Callback} callback
 */

function additionalMoviesGet(query, type, callback) {

    var key, values, name, sorting, count;

    for (var q in query) {
        if (query.hasOwnProperty(q)) {
            key = q;
            values = query[q];
        }
    }

    values = (typeof values === 'object')
        ? values
        : ('' + values).split(',');

    switch (type) {
        case 'related':
            name = modules.related.data.types[key].name;
            sorting = modules.related.data.types[key].sorting;
            count = modules.related.data.types[key].count;
            break;
        case 'index':
            name = config.index[key].name;
            sorting = config.index[key].sorting;
            count = config.index[key].count;
            break;
        case 'top':
            name = 'Топ фильмы';
            sorting = modules.top.data.sorting;
            count = modules.top.data.count;
            break;
        case 'soon':
            name = 'Скоро выйдет';
            sorting = 'soon';
            count = modules.soon.data.count;
            break;
        case 'ids':
            name = 'Фильмы по ID';
            sorting = '';
            count = values.length;
            values = [values.join('|')];
            break;
        default:
            name = 'Список фильмов';
            sorting = 'kinopoisk-vote-up';
            count = 10;
    }

    var hash = md5(key + values.join(',') + count + sorting);

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
     * If not cache to get Sphinx.
     *
     * @param {Callback} callback
     */

    function getSphinx(callback) {
        
        var m = [];

        async.forEachOfSeries(values, function (value, k, callback) {

            var query = {};
            query[key] = ('' + value).replace(/\s+/g, ' ').replace(/(^\s*)|(\s*)$/g, '');

            moviesGet(query, count, sorting, function (err, movies) {

                if (err) return callback(err);

                if (movies && movies.length) {
                    m.push({
                        "movies" : movies,
                        "name" : CP_text.formatting(name, query)
                    });
                }

                callback();

            });

        }, function (err) {

            if (err) return callback(err);

            callback(null, m);

            if (config.cache.time && m) {
                
                CP_cache.set(
                    hash,
                    m,
                    config.cache.time,
                    function (err) {
                        if (err) {
                            console.log('[modules/CP_get.js:additionalMoviesGet] Cache Set Error:', err);
                        }
                    }
                );
                
            }

        });

    }

}

/**
 * Getting count movies for a particular query.
 *
 * @param {Object} query
 * @param {Callback} callback
 */

function countMoviesGet(query, callback) {

    var publish = CP_publish.queryCondition();

    if (query.admin) {
        delete query.admin;
        publish.select = ', ( kp_id >= 298 AND kp_id <= 1100000 ) AS movie ';
    }

    var queryString = '' +
        ' SELECT COUNT(*) AS num ' +
        publish.select +
        ' FROM ' + sphinx.movies +
        ' WHERE ' +
        createWhere() +
        publish.where +
        ' OPTION max_matches = 1';

    CP_sphinx.query(queryString, function (err, count) {

        if (err) return callback(err);

        if (count && count.length) {
            count = count[0].num;
        }
        else {
            count = 0;
        }

        callback(null, count);

    });

    /**
     * Create WHERE for query.
     *
     * @return {String}
     */

    function createWhere() {

        var where = [];
        var match = [];

        match.push('');

        for (var attribute in query) {
            if (query.hasOwnProperty(attribute)) {

                var search = ('' + query[attribute]).toLowerCase();
                search = search.replace(/[^0-9A-Za-zА-Яа-яЁё\s\+-\|]/g,'');
                search = search.replace(/\s+/g, ' ');
                search = search.replace(/(^\s*)|(\s*)$/g, '');

                match.push('@' + attribute + ' ' + search);

            }
        }

        where.push('MATCH(\'' + match.join(' ').trim() + '\')');

        return where.join(' AND ');

    }

}

/**
 * Gets an object with new ID for diapason.
 *
 * @param {Callback} callback
 */

function publishIdsGet(callback) {

    var start_limit = Math.ceil(
        (config.publish.every.movies/config.publish.every.hours)/2
    );
    var stop_limit = Math.floor(
        (config.publish.every.movies/config.publish.every.hours)/2
    );

    if ((start_limit && !stop_limit) || (!start_limit && stop_limit)) {
        start_limit = (start_limit) ? start_limit : 1;
        stop_limit = (stop_limit) ? stop_limit : 1;
    }

    var publish = {};
    publish.where = ''; 

    var where = (config.publish.required.length)
        ? config.publish.required.map(function(ctgry) {
        return ' AND `' + ctgry.trim() + '` != \'\' ';
    })
        : [];
    where = (where.length) ? where.join(' ') : '';

    publish.where = where;

    var startQueryString = '' +
        ' SELECT kp_id' +
        ' FROM ' + sphinx.movies +
        ' WHERE kp_id < ' + config.publish.start + publish.where +
        ' ORDER BY kp_id DESC' +
        ' LIMIT ' + start_limit +
        ' OPTION max_matches = ' + start_limit;

    var stopQueryString = '' +
        ' SELECT kp_id' +
        ' FROM ' + sphinx.movies +
        ' WHERE kp_id > ' + config.publish.stop + publish.where +
        ' ORDER BY kp_id ASC' +
        ' LIMIT ' + stop_limit +
        ' OPTION max_matches = ' + stop_limit;

    var queryString = startQueryString + '; ' + stopQueryString;

    CP_sphinx.query(queryString, function (err, result) {

        if (err) return callback(err);

        if (result && result.length) {

            var ids = {};
            var i;

            ids.start_id = parseInt(config.publish.start);
            ids.stop_id = parseInt(config.publish.stop);

            for (i = 0; i < result[0].length; i++) {
                ids.start_id = (parseInt(result[0][i].kp_id) < ids.start_id)
                    ? parseInt(result[0][i].kp_id)
                    : ids.start_id;
            }

            for (i = 0; i < result[1].length; i++) {
                ids.stop_id = (parseInt(result[1][i].kp_id) > ids.stop_id)
                    ? parseInt(result[1][i].kp_id)
                    : ids.stop_id;
            }

            callback(null, ids);

        }
        else {

            callback(null, null);

        }

    });

}

module.exports = {
    "movies"     : moviesGet,
    "additional" : additionalMoviesGet,
    "count"      : countMoviesGet,
    "publishIds" : publishIdsGet
};