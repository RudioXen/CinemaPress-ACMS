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

        code = 'function getCookie(e){var t=document.cookie.match(new RegExp("(?:^|; )"+e.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,"\\$1")+"=([^;]*)"));return t?decodeURIComponent(t[1]):void 0}function setCookie(e,t,i){i=i||{};var n=i.expires;if("number"==typeof n&&n){var o=new Date;o.setTime(o.getTime()+1e3*n),n=i.expires=o}n&&n.toUTCString&&(i.expires=n.toUTCString()),t=encodeURIComponent(t);var r=e+"="+t;for(var a in i)if(i.hasOwnProperty(a)){r+="; "+a;var p=i[a];p!==!0&&(r+="="+p)}document.cookie=r}window.onload=function(){var e=window.location.href,t="' + config.urls.prefix_id + '",i=parseInt("' + config.urls.unique_id + '"),n="' + config.urls.movie + '",o=t||"/",r=new RegExp(o+"([0-9]{1,7})","ig"),a=r.exec(e),p=a?parseInt(a[1]):0,s=p?p-i:0,d=getCookie("CP_viewed"),c=document.getElementById("recentlyViewed");if(d&&c)for(var f=d.split(","),m=0;m<f.length;m++){var g=parseInt(f[m])+i,l=document.createElement("a");l.setAttribute("href","/"+n+"/"+t+g);var u=document.createElement("img");u.setAttribute("src","https://st.kp.yandex.net/images/sm_film/"+f[m]+".jpg"),u.setAttribute("style","width: 52px; height: 72px; margin: margin: 5px;"),l.appendChild(u),c.appendChild(l)}if(s){if(d){for(var v=d.split(",");-1!==v.indexOf(s);)v.splice(v.indexOf(s),1);d=s+","+v.join(",")}else d=s;setCookie("CP_viewed",d,{expires:2592e3})}};';

    }
    
    return code;

}

module.exports = {
    "code" : codeViewed
};