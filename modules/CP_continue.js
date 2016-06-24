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

        code = 'function getCookie(e){var n=document.cookie.match(new RegExp("(?:^|; )"+e.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,"\\$1")+"=([^;]*)"));return n?decodeURIComponent(n[1]):void 0}function setCookie(e,n,o){o=o||{};var t=o.expires;if("number"==typeof t&&t){var i=new Date;i.setTime(i.getTime()+1e3*t),t=o.expires=i}t&&t.toUTCString&&(o.expires=t.toUTCString()),n=encodeURIComponent(n);var r=e+"="+n;for(var c in o)if(o.hasOwnProperty(c)){r+="; "+c;var a=o[c];a!==!0&&(r+="="+a)}document.cookie=r}function continueViewing(){var e=getCookie("CP_continue");e&&(window.location.href=e)}function watchLater(){setCookie("CP_continue",window.location.href,{expires:31104e3})}window.onload=function(){var e=document.querySelector("#continueViewing");e&&e.addEventListener("click",continueViewing);var n=document.querySelector("#watchLater");n&&n.addEventListener("click",watchLater)};';

    }
    
    return code;

}

module.exports = {
    "code" : codeContinue
};