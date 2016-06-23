'use strict';

/**
 * Configuration dependencies.
 */

var config  = require('../config/config');
var modules = require('../config/modules');

/**
 * Adding social comments for movie page.
 *
 * @param {Object} movie - The get url movie page.
 * @return {Object}
 */

function codesComments(movie) {

    var data = {};

    if (modules.comments.data.disqus.shortname) {
        data.disqus = '<div id="disqus_thread"></div><script>var disqus_config=function(){this.page.url="' + movie.url + '",this.page.identifier="' + movie.url + '"};!function(){var e=document,t=e.createElement("script");t.src="//' + modules.comments.data.disqus.shortname + '.disqus.com/embed.js",t.setAttribute("data-timestamp",+new Date),(e.head||e.body).appendChild(t)}();</script>';
    }

    if (modules.comments.data.vk.app_id) {
        data.vk = '<script type="text/javascript" src="//vk.com/js/api/openapi.js?121"></script><script type="text/javascript">VK.init({apiId: ' + modules.comments.data.vk.app_id + ', onlyWidgets: true});</script><div id="vk_comments"></div><script type="text/javascript">VK.Widgets.Comments("vk_comments", {limit: 10, width: "665", attach: "*"});</script>';
    }

    if (modules.comments.data.facebook.admins) {
        var admins = modules.comments.data.facebook.admins.split(',');
        for (var i = 0; i < admins.length; i++) {
            admins[i] = '<meta property="fb:admins" content="' + admins[i] + '">';
        }

        data.facebook = admins.join('') + '<div class="fb-comments" data-href="' + movie.url + '" data-numposts="10" data-width="665"></div><div id="fb-root"></div><script>(function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) return; js = d.createElement(s); js.id = id; js.src = "//connect.facebook.net/ru_RU/sdk.js#xfbml=1&version=v2.6"; fjs.parentNode.insertBefore(js, fjs);}(document, "script", "facebook-jssdk"));</script>';
    }

    return data;

}

module.exports = {
    "codes" : codesComments
};