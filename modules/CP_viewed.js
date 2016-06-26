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

        code = '<script>function getCookie(e){var t=document.cookie.match(new RegExp("(?:^|; )"+e.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,"\\$1")+"=([^;]*)"));return t?decodeURIComponent(t[1]):void 0}function setCookie(e,t,i){i=i||{};var n=i.expires;if("number"==typeof n&&n){var r=new Date;r.setTime(r.getTime()+1e3*n),n=i.expires=r}n&&n.toUTCString&&(i.expires=n.toUTCString()),t=encodeURIComponent(t);var o=e+"="+t;for(var a in i)if(i.hasOwnProperty(a)){o+="; "+a;var d=i[a];d!==!0&&(o+="="+d)}document.cookie=o}window.addEventListener("load",function(){var e=window.location.href,t="' + config.urls.prefix_id + '",i=parseInt("' + config.urls.unique_id + '"),n="' + config.urls.movie + '",r=t||"/",o=new RegExp(r+"([0-9]{1,7})","ig"),a=o.exec(e),d=a?parseInt(a[1]):0,p=d?d-i:0,s=getCookie("CP_viewed"),c=document.getElementById("recentlyViewed");if(s&&c){var l=document.querySelectorAll(".recentlyViewedBlock");if(l&&l.length)for(var f=0;f<l.length;f++)l[f].style.display="block";for(var g=s.split(","),m=0;m<g.length;m++){var u=parseInt(g[m])+i,v=document.createElement("a");v.setAttribute("href","/"+n+"/"+t+u);var h=document.createElement("img");h.setAttribute("src","https://st.kp.yandex.net/images/sm_film/"+g[m]+".jpg"),h.setAttribute("style","width: 52px; height: 72px; margin: 3px;"),v.appendChild(h),c.appendChild(v)}}if(p){if(s){for(var x=s.split(",");-1!==x.indexOf(""+p);)x.splice(x.indexOf(""+p),1);s=p+","+x.join(",")}else s=p;setCookie("CP_viewed",s,{expires:2592e3,path:"/"})}});</script>';

    }
    
    return code;

}

module.exports = {
    "code" : codeViewed
};