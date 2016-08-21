'use strict';

/**
 * Configuration dependencies.
 */

var config  = require('../config/config');
var modules = require('../config/modules');

/**
 * Add the function to continue viewing.
 * All pages in footer should be a block: id="recentlyViewed"
 *
 * @return {String}
 */

function codeViewed() {

    var code = '';

    if (modules.viewed.status) {

        code = '<script>function getCookie(a){var b=document.cookie.match(new RegExp("(?:^|; )"+a.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,"\\$1")+"=([^;]*)"));return b?decodeURIComponent(b[1]):void 0}function setCookie(a,b,c){c=c||{};var d=c.expires;if("number"==typeof d&&d){var e=new Date;e.setTime(e.getTime()+1e3*d),d=c.expires=e}d&&d.toUTCString&&(c.expires=d.toUTCString()),b=encodeURIComponent(b);var f=a+"="+b;for(var g in c)if(c.hasOwnProperty(g)){f+="; "+g;var h=c[g];h!==!0&&(f+="="+h)}document.cookie=f}window.addEventListener("load",function(){function p(a){var b=new RegExp(d+"([0-9]{1,7})","ig"),e=b.exec(a),f=e?parseInt(e[1]):0;return f?f-c:0}var a=window.location.href,b="' + config.urls.prefix_id + '",c=parseInt("' + config.urls.unique_id + '"),d=b||"/",e=getCookie("CP_viewed"),f=document.getElementById("recentlyViewed"),g=a.split("/");g.length&&g.length>=6&&(g.pop(),a=g.join("/"));var h=p(a);if(e&&f){var i=document.querySelectorAll(".recentlyViewedBlock");if(i&&i.length)for(var j=0;j<i.length;j++)i[j].style.display="block";for(var k=e.split(","),l=0;l<k.length;l++)if(parseInt(p(k[l]))){var m=document.createElement("a");m.setAttribute("href",k[l]);var n=document.createElement("img");n.setAttribute("src","https://st.kp.yandex.net/images/sm_film/"+p(k[l])+".jpg"),n.setAttribute("style","width: 52px; height: 72px; margin: 3px;"),n.setAttribute("alt","Постер фильма"),m.appendChild(n),f.appendChild(m)}}if(h){if(e){for(var o=e.split(",");-1!==o.indexOf(""+a);)o.splice(o.indexOf(""+a),1);e=a+","+o.join(",")}else e=a;setCookie("CP_viewed",e,{expires:2592e3,path:"/"})}});</script>';

    }
    
    return code;

}

module.exports = {
    "code" : codeViewed
};