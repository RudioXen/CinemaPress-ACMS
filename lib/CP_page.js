'use strict';

/**
 * Module dependencies.
 */

var CP_text     = require('./CP_text');

var CP_player   = require('../modules/CP_player');
var CP_schema   = require('../modules/CP_schema');
var CP_comments = require('../modules/CP_comments');
var CP_social   = require('../modules/CP_social');
var CP_abuse    = require('../modules/CP_abuse');
var CP_viewed   = require('../modules/CP_viewed');
var CP_continue = require('../modules/CP_continue');

/**
 * Configuration dependencies.
 */

var config  = require('../config/config');
var modules = require('../config/modules');
var texts   = require('../config/texts');

/**
 * Adding basic information on the index page:
 * protocol, domain, email, urls, codes, seo, title,
 * description, keywords, head, footer.
 *
 * Data from modules:
 * social.
 *
 * @return {Object}
 */

function pageIndex() {

    var page = {};

    page.protocol = config.protocol;
    page.domain   = config.domain;
    page.email    = config.email;
    page.urls     = formatUrls(config.urls);
    page.codes    = formatCodes(config.codes);
    page.seo      = CP_text.formatting(config.descriptions.index);

    page.title       = CP_text.formatting(config.titles.index);
    page.description = formatDescription(page.seo);
    page.keywords    = CP_text.formatting(config.keywords.index);

    if (modules.viewed.status) {
        page.codes.footer = CP_viewed.code() + page.codes.footer;
    }
    if (modules.continue.status) {
        page.codes.footer = CP_continue.code() + page.codes.footer;
    }
    if (modules.social.status) {
        page.social = CP_social.pages();
    }
    if (modules.schema.status) {
        page.codes.head = CP_schema.general(page) + page.codes.head;
    }

    return page;

}

/**
 * Adding basic information on the movie page:
 * protocol, domain, email, urls, codes, seo, title,
 * description, keywords, head, footer.
 *
 * Data from modules:
 * social, comments, abuse.
 *
 * @param {String} type - One type of single, online, download, picture, trailer.
 * @param {Object} movie
 * @param {Object} movies - The related movies.
 * @return {Object}
 */

function pageMovie(type, movie, movies) {

    var page = {};

    page.protocol = config.protocol;
    page.domain   = config.domain;
    page.email    = config.email;
    page.urls     = formatUrls(config.urls);
    page.codes    = formatCodes(config.codes);
    page.seo      = CP_text.formatting(config.descriptions.movie[type], movie);

    page.title       = uniqueTitle();
    page.description = formatDescription(page.seo);
    page.keywords    = CP_text.formatting(config.keywords.movie[type], movie);

    if (modules.player.status || type == 'trailer' || type == 'picture') {
        var player = CP_player.code(type, movie);
        page.codes.head = player.head + page.codes.head;
        page.player = player.player;
        page.codes.footer = player.footer + page.codes.footer;
    }
    if (modules.viewed.status) {
        page.codes.footer = CP_viewed.code() + page.codes.footer;
    }
    if (modules.continue.status) {
        page.codes.footer = CP_continue.code() + page.codes.footer;
    }
    if (modules.social.status) {
        page.social = CP_social.pages();
    }
    if (modules.schema.status) {
        page.codes.head = CP_schema.fullMovie(movie, movies) + page.codes.head;
    }
    if (modules.comments.status) {
        page.codes.head = CP_comments.head() + page.codes.head;
        page.comments = CP_comments.codes(movie);
    }
    if (modules.abuse.status) {
        page.abuse = CP_abuse.hide();
    }

    /**
     * Choose a unique title, if any.
     *
     * @return {String}
     */

    function uniqueTitle() {

        var id = parseInt(movie.kp_id);

        return (texts.ids.indexOf(id)+1 && texts.movies[id].title)
            ? CP_text.formatting(texts.movies[id].title)
            : CP_text.formatting(config.titles.movie[type], movie)

    }

    return page;

}

/**
 * Adding basic information on the movie page:
 * protocol, domain, email, urls, codes, seo, title,
 * description, keywords, url, sorting, pagination,
 * head, footer.
 *
 * Data from modules:
 * social.
 *
 * @param {Object} query
 * @param {String} sorting
 * @param {Number} num
 * @param {Number} all
 * @param {String} movies
 * @return {Object}
 */

function pageCategory(query, sorting, num, all, movies) {

    var page = {};

    page.protocol = config.protocol;
    page.domain   = config.domain;
    page.email    = config.email;
    page.urls     = formatUrls(config.urls);
    page.codes    = formatCodes(config.codes);

    for (var type in query) {
        if (query.hasOwnProperty(type)) {

            query['sorting'] = (config.default.sorting != sorting)
                ? config.titles.sorting[sorting] || ''
                : '';
            query['page'] = (num != 1)
                ? config.titles.num.replace('[num]', '' + num)
                : '';

            page.seo = CP_text.formatting(config.descriptions[type], query);

            page.title       = CP_text.formatting(config.titles[type], query);
            page.description = formatDescription(page.seo);
            page.keywords    = CP_text.formatting(config.keywords[type], query);
            page.url         = categoryUrl(config.urls[type], query[type]);
            page.sorting     = sortingUrl(page.url, sorting);
            page.pagination  = createPagination(page.url, sorting, num, all);

            if (config.default.sorting != sorting || num != 1)
                page.seo = '';

        }
    }

    if (modules.viewed.status) {
        page.codes.footer = CP_viewed.code() + page.codes.footer;
    }
    if (modules.continue.status) {
        page.codes.footer = CP_continue.code() + page.codes.footer;
    }
    if (modules.social.status) {
        page.social = CP_social.pages();
    }
    if (modules.schema.status) {
        page.codes.head = CP_schema.category(page, movies) + page.codes.head;
    }

    return page;

}

/**
 * Adding basic information on the collection page:
 * protocol, domain, email, urls, codes, seo, title,
 * description, keywords, url, sorting, pagination,
 * head, footer.
 *
 * Data from modules:
 * social.
 *
 * @param {String} url - The unique key collection.
 * @param {String} sorting
 * @param {Number} num
 * @param {Number} all
 * @param {Object} movies
 * @return {Object}
 */

function pageCollection(url, sorting, num, all, movies) {

    var page = {},
        keys = {};

    page.protocol = config.protocol;
    page.domain   = config.domain;
    page.email    = config.email;
    page.urls     = formatUrls(config.urls);
    page.codes    = formatCodes(config.codes);

    keys['sorting'] = (config.default.sorting != sorting)
        ? config.titles.sorting[sorting] || ''
        : '';
    keys['page'] = (num != 1)
        ? config.titles.num.replace('[num]', '' + num)
        : '';

    page.seo = CP_text.formatting(modules.collections.data.collections[url].description, keys);

    page.title       = CP_text.formatting(modules.collections.data.collections[url].title, keys);
    page.description = formatDescription(page.seo);
    page.keywords    = CP_text.formatting(modules.collections.data.collections[url].keywords, keys);
    page.url         = categoryUrl(modules.collections.data.url, url);
    page.sorting     = sortingUrl(page.url, sorting);
    page.pagination  = createPagination(page.url, sorting, num, all);

    if (config.default.sorting != sorting || num != 1)
        page.seo = '';

    if (modules.viewed.status) {
        page.codes.footer = CP_viewed.code() + page.codes.footer;
    }
    if (modules.continue.status) {
        page.codes.footer = CP_continue.code() + page.codes.footer;
    }
    if (modules.social.status) {
        page.social = CP_social.pages();
    }
    if (modules.schema.status) {
        page.codes.head = CP_schema.category(page, movies) + page.codes.head;
    }

    return page;

}

/**
 * Adding basic information on the collections page:
 * protocol, domain, email, urls, codes, url, seo, title,
 * description, keywords, head, footer.
 *
 * Data from modules:
 * social.
 *
 * @return {Object}
 */

function pageCollections() {

    var page = {};

    page.protocol = config.protocol;
    page.domain   = config.domain;
    page.email    = config.email;
    page.urls     = formatUrls(config.urls);
    page.codes    = formatCodes(config.codes);
    page.url      = categoriesUrl(modules.collections.data.url);
    page.seo      = CP_text.formatting(modules.collections.data.description);

    page.title       = CP_text.formatting(modules.collections.data.title);
    page.description = formatDescription(page.seo);
    page.keywords    = CP_text.formatting(modules.collections.data.keywords);

    if (modules.viewed.status) {
        page.codes.footer = CP_viewed.code() + page.codes.footer;
    }
    if (modules.continue.status) {
        page.codes.footer = CP_continue.code() + page.codes.footer;
    }
    if (modules.social.status) {
        page.social = CP_social.pages();
    }
    if (modules.schema.status) {
        page.codes.head = CP_schema.general(page) + page.codes.head;
    }

    return page;

}

/**
 * Adding basic information on the categories page:
 * protocol, domain, email, urls, codes, seo, title,
 * description, keywords, head, footer.
 *
 * Data from modules:
 * social.
 *
 * @param {String} category
 * @return {Object}
 */

function pageCategories(category) {

    var page = {};

    var categories = {
        "year"       : "years",
        "genre"      : "genres",
        "actor"      : "actors",
        "country"    : "countries",
        "director"   : "directors"
    };

    page.protocol = config.protocol;
    page.domain   = config.domain;
    page.email    = config.email;
    page.urls     = formatUrls(config.urls);
    page.codes    = formatCodes(config.codes);
    page.url      = categoriesUrl(config.urls[category]);
    page.seo      = CP_text.formatting(config.descriptions[categories[category]]);

    page.title       = CP_text.formatting(config.titles[categories[category]]);
    page.description = formatDescription(page.seo);
    page.keywords    = CP_text.formatting(config.keywords[categories[category]]);

    if (modules.viewed.status) {
        page.codes.footer = CP_viewed.code() + page.codes.footer;
    }
    if (modules.continue.status) {
        page.codes.footer = CP_continue.code() + page.codes.footer;
    }
    if (modules.social.status) {
        page.social = CP_social.pages();
    }
    if (modules.schema.status) {
        page.codes.head = CP_schema.general(page) + page.codes.head;
    }

    return page;

}

/**
 * Create URL for category/collection.
 *
 * @param {String} category
 * @param {String} name
 * @return {String}
 */

function categoryUrl(category, name) {

    return config.protocol + config.domain + '/' + category + '/' + encodeURIComponent(name);

}

/**
 * Create URL for categories/collections.
 *
 * @param {String} category
 * @return {String}
 */

function categoriesUrl(category) {

    return config.protocol + config.domain + '/' + category;

}

/**
 * Create a URL including sorting.
 *
 * @param {String} url
 * @param {String} sorting
 * @return {Object}
 */

function sortingUrl(url, sorting) {

    var sortingUp = [
        'kinopoisk-rating-up',
        'imdb-rating-up',
        'kinopoisk-vote-up',
        'imdb-vote-up',
        'year-up',
        'premiere-up'
    ];

    var sortingDown = {
        "kinopoisk-rating-down" : sortingUp[0],
        "imdb-rating-down"      : sortingUp[1],
        "kinopoisk-vote-down"   : sortingUp[2],
        "imdb-vote-down"        : sortingUp[3],
        "year-down"             : sortingUp[4],
        "premiere-down"         : sortingUp[5]
    };

    return sortingUp.map(function(s) {

        var a = false;

        if (sorting == s) {
            s = sorting.replace('up','down');
            a = 'up';
        }
        else if (sortingDown[sorting] == s) {
            a = 'down';
        }

        return {
            "name"   : config.sorting[s],
            "url"    : url + '?sorting=' + s,
            "active" : a
        }

    });

}

/**
 * Remove excess, addet new in URLs.
 *
 * @param {Object} urls
 * @return {Object}
 */

function formatUrls(urls) {

    var a = JSON.stringify(urls);
    urls = JSON.parse(a);

    delete urls.prefix_id;
    delete urls.unique_id;
    delete urls.separator;
    delete urls.movie_url;
    delete urls.admin;
    delete urls.prefix_id;
    
    urls.collection = modules.collections.data.url;

    return urls;

}

/**
 * Remove excess, addet new in codes.
 *
 * @param {Object} codes
 * @return {Object}
 */

function formatCodes(codes) {

    var a = JSON.stringify(codes);
    codes = JSON.parse(a);

    delete codes.robots;

    return codes;

}

/**
 * SEO description 160 symbol.
 *
 * @param {String} text
 * @return {String}
 */

function formatDescription(text) {

    text = text.replace(/<(?:.|\n)*?>/gm, '');
    text = text.replace(/\s+/g, ' ');
    text = text.replace(/(^\s*)|(\s*)$/g, '');

    if (text.length > 160) {
        var seo_text = text.substr(0, 160);
        var seo_arr = seo_text.split(' ');
        if (seo_arr.length > 1)
            seo_arr.pop();
        text = seo_arr.join(' ').trim();
    }

    return text;

}

/**
 * Create pagination links.
 *
 * @param {String} url
 * @param {String} sorting
 * @param {Number} current
 * @param {Number} all
 * @return {Object}
 */

function createPagination(url, sorting, current, all) {

    var pagination = {};
    pagination.prev = [];
    pagination.next = [];
    pagination.current = current;

    var number_prev = current;
    var number_next = current;

    var sorting_page = (sorting != config.default.sorting)
        ? '?sorting=' + sorting
        : '';

    for (var i = 1; i <= 10; i++) {
        number_prev = number_prev - 1;
        if (number_prev >= 1) {
            pagination.prev.push({
                "number" : number_prev,
                "link"   : url + '/' + number_prev + sorting_page
            });
        }
        number_next = number_next + 1;
        if (number_next <= all) {
            pagination.next.push({
                "number" : number_next,
                "link"   : url + '/' + number_next + sorting_page
            });
        }
    }

    pagination.prev.reverse();

    return pagination;

}

module.exports = {
    "index"       : pageIndex,
    "movie"       : pageMovie,
    "category"    : pageCategory,
    "categories"  : pageCategories,
    "collection"  : pageCollection,
    "collections" : pageCollections
};