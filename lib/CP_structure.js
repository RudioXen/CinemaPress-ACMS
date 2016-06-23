'use strict';

/**
 * Module dependencies.
 */

var CP_text = require('./CP_text');

/**
 * Configuration dependencies.
 */

var config = require('../config/config');
var texts  = require('../config/texts');

/**
 * Node dependencies.
 */

var getSlug = require('speakingurl');

/**
 * A data structure for a categories.
 *
 * @param {Object} movies
 * @return {Object}
 */

function structureCategories(movies) {

    var categories = {};
    categories.max = 1;

    movies.forEach(function(movie) {

        var cat = ('' + movie.category).split(',');

        cat.forEach(function(c) {

            categories[c] = (categories[c]) ? categories[c]+1 : 1;

            if (categories[c] > categories.max) {
                categories.max = categories[c];
            }

        });

    });

    return categories;

}

/**
 * A data structure for a movie/movies.
 *
 * @param {Object} movies
 * @return {Object}
 */

function structureMovie(movies) {

    return movies.map(function(movie) {

        var id = parseInt(movie.kp_id) + parseInt(config.urls.unique_id);
        
        var images = createImages(movie);
        var url = createMovieUrl(movie);
        
        movie = {
            "id"            : id, 
            "kp_id"         : movie.kp_id,
            "title"         : movie.search,
            "poster"        : images.poster,
            "poster_big"    : images.poster_big,
            "poster_min"    : images.poster_min,
            "picture"       : images.picture,
            "picture_big"   : images.picture_big,
            "picture_min"   : images.picture_min,
            "pictures"      : images.pictures,
            "title_ru"      : movie.title_ru || movie.title_en,
            "title_en"      : movie.title_en,
            "description"   : movie.description,
            "year"          : movie.year,
            "year_url"      : createCategoryUrl('year', movie.year),
            "countries"     : (movie.country == '_empty')  ? '' : randPos(movie.country),
            "directors"     : (movie.director == '_empty') ? '' : randPos(movie.director),
            "genres"        : (movie.genre == '_empty')    ? '' : randPos(movie.genre),
            "actors"        : (movie.actor == '_empty')    ? '' : randPos(movie.actor),
            "country"       : (movie.country == '_empty')  ? '' : movie.country.split(',')[0],
            "director"      : (movie.director == '_empty') ? '' : movie.director.split(',')[0],
            "genre"         : (movie.genre == '_empty')    ? '' : movie.genre.split(',')[0],
            "actor"         : (movie.actor == '_empty')    ? '' : movie.actor.split(',')[0],
            "countries_url" : (movie.country == '_empty')  ? '' : randPos(createCategoryUrl('country', movie.country)),
            "directors_url" : (movie.director == '_empty') ? '' : randPos(createCategoryUrl('director', movie.director)),
            "genres_url"    : (movie.genre == '_empty')    ? '' : randPos(createCategoryUrl('genre', movie.genre)),
            "actors_url"    : (movie.actor == '_empty')    ? '' : randPos(createCategoryUrl('actor', movie.actor)),
            "country_url"   : (movie.country == '_empty')  ? '' : createCategoryUrl('country', movie.country.split(',')[0]),
            "director_url"  : (movie.director == '_empty') ? '' : createCategoryUrl('director', movie.director.split(',')[0]),
            "genre_url"     : (movie.genre == '_empty')    ? '' : createCategoryUrl('genre', movie.genre.split(',')[0]),
            "actor_url"     : (movie.actor == '_empty')    ? '' : createCategoryUrl('actor', movie.actor.split(',')[0]),
            "countries_arr" : (movie.country == '_empty')  ? [] : movie.country.split(','),
            "directors_arr" : (movie.director == '_empty') ? [] : movie.director.split(','),
            "genres_arr"    : (movie.genre == '_empty')    ? [] : movie.genre.split(','),
            "actors_arr"    : (movie.actor == '_empty')    ? [] : movie.actor.split(','),
            "kp_rating"     : movie.kp_rating,
            "kp_vote"       : movie.kp_vote,
            "imdb_rating"   : movie.imdb_rating,
            "imdb_vote"     : movie.imdb_vote,
            "premiere"      : toDate(movie.premiere),
            "type"          : movie.type,
            "url"           : url
        };

        movie.description = uniqueDescription(movie);

        return movie;

    });

    /**
     * Create a string with the categories in random order.
     *
     * @param {String} items
     * @return {String}
     */

    function randPos(items) {

        var itemsArr = shuffle(('' + items).split(','));
        if (itemsArr.length > 1) {
            var lastArr = itemsArr.pop();
            items = (itemsArr.join(', ')) + ' и ' + lastArr;
        }
        else {
            items = itemsArr.join(', ');
        }

        return items;

    }

    /**
     * Shuffle array.
     *
     * @param {Array} array
     * @return {Array}
     */

    function shuffle(array) {

        var currentIndex = array.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;

    }

    /**
     * Choose a unique description, if any.
     *
     * @param {Object} movie
     * @return {String}
     */

    function uniqueDescription(movie) {

        var id = parseInt(movie.kp_id);

        return (texts.ids.indexOf(id)+1)
            ? CP_text.formatting(texts.movies[id].description, movie)
            : movie.description

    }

    /**
     * Create URL for category page.
     *
     * @param {String} type
     * @param {String} items
     * @return {String}
     */

    function createCategoryUrl(type, items) {

        var itemsArr = ('' + items).split(',');

        itemsArr = itemsArr.map(function(item) {

            return '<a href="' + config.protocol + config.domain + '/' + config.urls[type] + '/' + encodeURIComponent(item) +'">' + item +'</a>';

        });

        return itemsArr.join(', ');

    }

    /**
     * Create URL for movie page.
     *
     * @param {Object} movie
     * @return {String}
     */

    function createMovieUrl(movie) {

        var id = parseInt(movie.kp_id) + parseInt(config.urls.unique_id);

        var data = {
            "title_ru"  : movie.title_ru,
            "title_en"  : movie.title_en,
            "year"      : movie.year,
            "country"   : (movie.country == '_empty')   ? '' : movie.country.split(',')[0],
            "director"  : (movie.director == '_empty')  ? '' : movie.director.split(',')[0],
            "genre"     : (movie.genre == '_empty')     ? '' : movie.genre.split(',')[0],
            "actor"     : (movie.actor == '_empty')     ? '' : movie.actor.split(',')[0]
        };

        var separator = config.urls.separator;
        var prefix_id = config.urls.prefix_id + '' + id;
        var url = config.urls.movie_url;

        url = url.replace(/\[prefix_id]/g, prefix_id);
        url = url.replace(/\[separator]/g, separator);

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (!data[key]) {
                    url = url.replace(separator + '[' + key + ']' + separator, separator);
                    url = url.replace('[' + key + ']' + separator, '');
                    url = url.replace(separator + '[' + key + ']', '');
                }
                else {
                    url = url.replace('[' + key + ']', getSlug(data[key], separator));
                }
            }
        }

        return 'http://' + config.domain + '/' + config.urls.movie + '/' + url;

    }

    /**
     * Images for website.
     *
     * @param {Object} movie
     * @return {Object}
     */

    function createImages(movie) {

        var st = config.image.addr;

        var images = {};

        images.poster = config.protocol + st + '/images/film_iphone/iphone360_' + movie.kp_id + '.jpg';

        if (st == config.domain) {
            images.poster = createPosterUrl(movie);
            st = 'st.kp.yandex.net';
        }

        images.poster_big  = config.protocol + st + '/images/film_big/' + movie.kp_id + '.jpg';
        images.poster_min  = config.protocol + st + '/images/sm_film/' + movie.kp_id + '.jpg';

        images.picture     = images.poster;
        images.picture_big = images.poster_big;
        images.picture_min = images.poster_min;
        images.pictures    = [];

        if (movie.pictures) {
            var p = movie.pictures.split(',');
            var r = Math.floor(Math.random() * p.length);
            if (p[r] > 363866) {
                images.picture     = config.protocol + st + '/images/kadr/' + p[r] + '.jpg';
                images.picture_big = config.protocol + st + '/images/kadr/' + p[r] + '.jpg';
                images.picture_min = config.protocol + st + '/images/kadr/sm_' + p[r] + '.jpg';
            }
            p.forEach(function(id) {
                if (id > 363866) {
                    images.pictures.push({
                        "picture" : config.protocol + st + '/images/kadr/' + id + '.jpg',
                        "picture_big" : config.protocol + st + '/images/kadr/' + id + '.jpg',
                        "picture_min" : config.protocol + st + '/images/kadr/sm_' + id + '.jpg'
                    });
                }
            });
        }

        return images;

    }

    /**
     * Create poster URL.
     *
     * @param {Object} movie
     * @return {String}
     */

    function createPosterUrl(movie) {

        var separator = config.urls.separator;
        var prefix_id = 'img' + movie.kp_id;
        var url = config.urls.movie_url;

        url = url.replace(/\[prefix_id]/g, prefix_id);
        url = url.replace(/\[separator]/g, separator);

        var keys = {
            "title_ru"  : movie.title_ru,
            "title_en"  : movie.title_en,
            "year"      : movie.year,
            "country"   : (movie.country == '_empty')   ? '' : movie.country.split(',')[0],
            "director"  : (movie.director == '_empty')  ? '' : movie.director.split(',')[0],
            "genre"     : (movie.genre == '_empty')     ? '' : movie.genre.split(',')[0],
            "actor"     : (movie.actor == '_empty')     ? '' : movie.actor.split(',')[0]
        };

        for (var key in keys) {
            if (keys.hasOwnProperty(key)) {
                if (!keys[key]) {
                    url = url.replace(separator + '[' + key + ']' + separator, separator);
                    url = url.replace('[' + key + ']' + separator, '');
                    url = url.replace(separator + '[' + key + ']', '');
                }
                else {
                    url = url.replace('[' + key + ']', getSlug(keys[key], separator));
                }
            }
        }

        url = url.split('.')[0];

        return '/images/poster/' + url + '.jpg';

    }

    /**
     * Create date format dd-mm-YYYY.
     *
     * @param {Number} days
     * @return {String}
     */

    function toDate(days) {

        days = (days - 719528) * 1000 * 60 * 60 * 24;

        return new Date(days).toJSON().substr(0, 10);

    }

}

module.exports = {
    "categories" : structureCategories,
    "movie"      : structureMovie
};