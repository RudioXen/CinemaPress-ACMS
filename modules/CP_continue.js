'use strict';

/**
 * Configuration dependencies.
 */

var modules = require('../config/modules');

/**
 * Add the function to continue viewing.
 * All pages should be a button: id="continueViewing"
 * On the page movie should be a button: id="watchLater"
 *
 * @return {String}
 */

function codeContinue() {

    var code = '';

    if (modules.continue.status) {

        code = '<script>function getCookie(e){var t=document.cookie.match(new RegExp("(?:^|; )"+e.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,"\\$1")+"=([^;]*)"));return t?decodeURIComponent(t[1]):void 0}function setCookie(e,t,n){n=n||{};var o=n.expires;if("number"==typeof o&&o){var i=new Date;i.setTime(i.getTime()+1e3*o),o=n.expires=i}o&&o.toUTCString&&(n.expires=o.toUTCString()),t=encodeURIComponent(t);var r=e+"="+t;for(var c in n)if(n.hasOwnProperty(c)){r+="; "+c;var a=n[c];a!==!0&&(r+="="+a)}document.cookie=r}function continueViewing(){var e=getCookie("CP_continue");e&&(window.location.href=e)}function watchLater(){this.textContent="Сохранено",setCookie("CP_continue",window.location.href.split("#")[0],{expires:31104e3,path:"/"})}window.addEventListener("load",function(){var e=document.querySelectorAll(".continueViewingBlock");if(e&&e.length)for(var t=0;t<e.length;t++)e[t].style.display="block";var n=document.querySelector("#continueViewing");n&&n.addEventListener("click",continueViewing);var o=document.querySelectorAll(".watchLaterBlock");if(o&&o.length)for(var i=0;i<o.length;i++)o[i].style.display="block";var r=document.querySelector("#watchLater");r&&r.addEventListener("click",watchLater)});</script>';

    }
    
    return code;

}

module.exports = {
    "code" : codeContinue
};