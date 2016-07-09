'use strict';

/**
 * Module dependencies.
 */

var CP_text = require('./CP_text');

/**
 * Configuration dependencies.
 */

var config = require('../config/config');
var modules = require('../config/modules');
var texts  = require('../config/texts');

/**
 * Node dependencies.
 */

var getSlug = require('speakingurl');

/**
 * A data structure for a categories.
 *
 * @param {String} type
 * @param {Object} movies
 * @return {Array}
 */

function structureCategories(type, movies) {

    var categories = [];

    movies.forEach(function(movie) {

        var categories_arr = ('' + movie[type]).split(',');

        if (categories_arr.length) {

            var one_cat_one_image = true;

            categories_arr.forEach(function(cat_new) {

                var there_is = false;
                one_cat_one_image = (type == 'actor' || type == 'director') ? true : one_cat_one_image;

                categories.forEach(function(cat_old, i) {

                    if (categories[i].name == cat_new) {

                        there_is = true;

                        if (categories[i].image == '') {

                            categories[i].image = createImage(movie.pictures);

                        }

                    }

                });

                if (!there_is) {

                    categories.push({
                        "url": createCategoryUrl(type, cat_new),
                        "name": cat_new,
                        "image": (one_cat_one_image) ? createImage(movie.pictures) : ''
                    });

                    one_cat_one_image = false;

                }

            });

        }

    });

    /**
     * Create image for category.
     *
     * @param {String} pictures
     * @return {String}
     */

    function createImage(pictures) {

        var image = '';

        var p = pictures.split(',');

        if (pictures.length) {
            var r = Math.floor(Math.random() * p.length);
            if (p[r] > 363866) {
                image = config.protocol + 'st.kp.yandex.net/images/kadr/sm_' + p[r] + '.jpg';
            }
        }

        return image;

    }

    /**
     * Create URL for category page.
     *
     * @param {String} type
     * @param {String} category
     * @return {String}
     */

    function createCategoryUrl(type, category) {

        return config.protocol + config.domain + '/' + config.urls[type] + '/' + encodeURIComponent(category);

    }

    return categories;

}

/**
 * A data structure for a collections.
 *
 * @param {Object} collection
 * @param {Object} movies
 * @return {Object}
 */

function structureCollections(collection, movies) {

    var collections = {
        "url": createCollectionUrl(collection.url),
        "name": collection.title,
        "image": ""
    };

    if (movies.length) {

        for (var i = 0; i < movies.length; i++) {

            if (movies[i].picture_min && !collections.image) {
                collections.image = movies[i].picture_min
            }

            if (movies[i].picture_min && Math.random() < 0.5) {
                collections.image = movies[i].picture_min;
            }

        }
        
    }

    /**
     * Create URL for collection page.
     *
     * @param {String} url
     * @return {String}
     */

    function createCollectionUrl(url) {

        return config.protocol + config.domain + '/' + modules.collections.data.url + '/' + encodeURIComponent(url);

    }

    return collections;

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
            "rating"        : createRating(movie, 'rating'),
            "vote"          : createRating(movie, 'vote'),
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
            ? CP_text.formatting(texts.movies[id].description)
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

        var slider = new RegExp('\\s*\\(\\s*' + movie.kp_id + '\\s*\\)\\s*\\{\\s*([^]*?)\\s*\\}\\s*', 'gi');
        var match = slider.exec(modules.slider.data.movies.join(','));
        if (modules.slider.status && match && match.length) {
            images.picture_big = match[1];
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
     * Create overall rating.
     *
     * @param {Object} movie
     * @param {String} type
     * @return {Object}
     */

    function createRating(movie, type) {

        var result = {};
        result.rating = 0;
        result.vote = 0;

        if (movie.kp_vote > 0 && movie.imdb_vote > 0) {
            if (movie.kp_rating && movie.imdb_rating) {
                result.rating += Math.round((parseInt(movie.kp_rating) + parseInt(movie.imdb_rating))/2);
                result.vote += parseInt(movie.kp_vote);
                result.vote += parseInt(movie.imdb_vote);
            }
        }
        else if (movie.kp_vote > 0) {
            if (movie.kp_rating) {
                result.rating += parseInt(movie.kp_rating);
                result.vote += parseInt(movie.kp_vote);
            }
        }
        else if (movie.imdb_vote > 0) {
            if (movie.imdb_rating) {
                result.rating += parseInt(movie.imdb_rating);
                result.vote += parseInt(movie.imdb_vote);
            }
        }

        return result[type];

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
    "categories"  : structureCategories,
    "collections" : structureCollections,
    "movie"       : structureMovie
};