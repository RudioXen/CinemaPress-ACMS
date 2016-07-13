'use strict';

/**
 * Module dependencies.
 */

var CP_blocking = require('../modules/CP_blocking');

/**
 * Configuration dependencies.
 */

var config  = require('../config/config');
var modules = require('../config/modules');

/**
 * Node dependencies.
 */

var request = require('request');
var async   = require('async');

/**
 * Adding a page player.
 *
 * @return {Object}
 */

function codePlayer(type, movie) {

    var code = {};
    code.head = '';
    code.player = '';
    code.footer = '';

    var id = 'yohoho';
    var title = movie.title + ' (' + movie.year + ')';

    if (type == 'picture') {

        code.head = '<link rel="stylesheet" href="/themes/default/public/css/ideal-image-slider.css"><link rel="stylesheet" href="/themes/default/public/css/default.css">';

        code.footer = '<script src="/themes/default/public/js/ideal-image-slider.min.js"></script><script>new IdealImageSlider.Slider("#slider");</script>';

        var pictures = '';
        if (movie.pictures.length) {
            movie.pictures.forEach(function (picture) {
                pictures += '<img src="' + picture.picture_big + '" alt="Кадр ' + movie.title + '">';
            });
        }

        code.player = '<div id="slider">' + pictures + '</div>';

    }
    else if (type == 'trailer') {

        title += ' трейлер';

        yohohoPlayer();

    }
    else {
        if (type == 'download') {
            id = 'yohoho-torrent';
        }

        if (modules.abuse.status && modules.abuse.data.movies.indexOf((movie.kp_id + ''))+1) {

            code.player = '<div style="position:absolute;background:#000 url(/themes/default/public/images/theme/dark/player.png) 100% 100% no-repeat;z-index:9999;top:0;left:0;width:100%;height:100%;color:#fff;text-align:center"><div style="margin:80px auto 0;width:70%">' + modules.abuse.data.message + '</div></div>';

        }
        else {

            yohohoPlayer();
            code = CP_blocking.code(code);

        }

    }

    function yohohoPlayer() {

        code.player = '<div id="' + id + '" data-title="' + title + '" data-up="' + modules.player.data.yohoho.up + '" data-down="' + modules.player.data.yohoho.down + '"></div>';
        code.footer = '<script src="https://yohoho.xyz/yo.js"></script>';

    }

    return code;

}

module.exports = {
    "code" : codePlayer
};