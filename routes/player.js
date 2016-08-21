'use strict';

/**
 * Configuration dependencies.
 */

var modules = require('../config/modules');

/**
 * Node dependencies.
 */

var request = require('request');
var express = require('express');
var router  = express.Router();

/**
 * Player.
 */

router.get('/?', function(req, res) {

    var kp_id = (parseInt(req.query.id)) ? req.query.id : 0;

    var script = 'function player(){var a=document.querySelector("#cinemapress-player");if(a){try{if("https:"==window.top.location.protocol)return window.top.location.href="http:"+window.top.location.href.substring(window.top.location.protocol.length),console.log("Error: redirect to http protocol - http:"+window.top.location.href.substring(window.top.location.protocol.length)),!1}catch(a){console.log(a)}var b=a.dataset,c=[],d="",e="";b.title=b.title||"",b.single=b.single||0,e=parseInt(b.single)?"&single="+b.single:"",c.border=a.style.border||0,c.margin=a.style.margin||0,c.padding=a.style.padding||0,c.width=a.style.width||"100%",c.height=a.style.height||"370px",c["overflow-x"]=a.style["overflow-x"]||"hidden",c.background=a.style.background||"none",c.display=a.style.display||"block";for(var f in c)c.hasOwnProperty(f)&&(d+=f+":"+c[f]+";");var g=document.createElement("iframe");g.setAttribute("src","iframe-src"),g.setAttribute("style",d),g.setAttribute("id",a.id),g.setAttribute("data-title",b.title),g.setAttribute("data-single",b.single),g.setAttribute("allowfullscreen",""),a.parentNode.replaceChild(g,a)}return!1}document.addEventListener("DOMContentLoaded",player);';

    if (!/googlebot|crawler|spider|robot|crawling|bot/i.test(req.get('User-Agent'))) {

        res.setHeader('Content-Type', 'application/javascript');

        if (modules.player.data.display == 'hdgo') {
            if (modules.player.data.hdgo.token) {
                getHdgo(kp_id, function(result) {
                    if (result) {
                        res.send(result);
                    }
                    else {
                        if (modules.player.data.moonwalk.token) {
                            getMoonwalk(kp_id, function(result) {
                                if (result) {
                                    res.send(result);
                                }
                                else {
                                    getYohoho(function (result) {
                                        res.send(result);
                                    });
                                }
                            });
                        }
                        else {
                            getYohoho(function (result) {
                                res.send(result);
                            });
                        }
                    }
                });
            }
            else {
                if (modules.player.data.moonwalk.token) {
                    getMoonwalk(kp_id, function(result) {
                        if (result) {
                            res.send(result);
                        }
                        else {
                            getYohoho(function (result) {
                                res.send(result);
                            });
                        }
                    });
                }
                else {
                    getYohoho(function (result) {
                        res.send(result);
                    });
                }
            }
        }
        else if (modules.player.data.display == 'moonwalk') {
            if (modules.player.data.moonwalk.token) {
                getMoonwalk(kp_id, function(result) {
                    if (result) {
                        res.send(result);
                    }
                    else {
                        if (modules.player.data.hdgo.token) {
                            getHdgo(kp_id, function(result) {
                                if (result) {
                                    res.send(result);
                                }
                                else {
                                    getYohoho(function (result) {
                                        res.send(result);
                                    });
                                }
                            });
                        }
                        else {
                            getYohoho(function (result) {
                                res.send(result);
                            });
                        }
                    }
                });
            }
            else {
                if (modules.player.data.hdgo.token) {
                    getHdgo(kp_id, function(result) {
                        if (result) {
                            res.send(result);
                        }
                        else {
                            getYohoho(function (result) {
                                res.send(result);
                            });
                        }
                    });
                }
                else {
                    getYohoho(function (result) {
                        res.send(result);
                    });
                }
            }
        }
        else {
            getYohoho(function (result) {
                res.send(result);
            });
        }

    }
    else {

        res.setHeader('Content-Type', 'application/javascript');

        res.send('console.log(\'Hello CinemaPress!\');');

    }

    /**
     * Get HDGO player.
     */

    function getHdgo(id, callback) {

        request('http://hdgo.cc/content/base/video_api.php?token=' + modules.player.data.hdgo.token.trim() + '&k=' + id, function (error, response, body) {

            var r = false;

            if (!error && response.statusCode == 200) {

                var result = body.match(/(http.*?\/[0-9]{1,10}\/)/i);

                if (result) {

                    r = script.replace('iframe-src', result[0]);

                }

            }

            callback(r);

        });

    }

    /**
     * Get Moonwalk player.
     */

    function getMoonwalk(id, callback) {

        request('http://moonwalk.cc/api/videos.json?api_token=' + modules.player.data.moonwalk.token.trim() + '&kinopoisk_id=' + id, function (error, response, body) {

            var r = false;

            if (!error && response.statusCode == 200) {

                var result = JSON.parse(body);

                if (!result.error && result.length) {

                    r = script.replace('iframe-src', result[0].iframe_url);

                }

            }

            callback(r);

        });

    }

    /**
     * Get Yohoho player.
     */

    function getYohoho(callback) {

        callback(script.replace('iframe-src', 'http://yohoho.xyz/online?title=" + encodeURIComponent(b.title) + e + "'));

    }

});

module.exports = router;