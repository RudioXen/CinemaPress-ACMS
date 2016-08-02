'use strict';

/**
 * Configuration dependencies.
 */

var config  = require('../config/config');
var modules = require('../config/modules');

/**
 * Blocking a page player.
 *
 * @return {Object}
 */

function blockingPlayer(code) {

    if (modules.blocking.status && modules.blocking.data[modules.blocking.data.display]) {

        var block = modules.blocking.data[modules.blocking.data.display];

        var message = block.message.replace('[timer]', '<span id="blockingTimer" style="background:#000;color:#fff;padding:2px 7px 0;border-radius:3px;border:1px solid #666;font-family:monospace,sans-serif">--</span>');

        if (modules.blocking.data.display == 'share') {

            code.player = '<div id="blocking" style="position:absolute;background:#000 url(/themes/default/public/images/theme/dark/player.png) 100% 100% no-repeat;background-size:100% 100%;z-index:10000;top:0;left:0;width:100%;height:100%;color:#fff;text-align:center"><div id="blockingMessage" style="margin:80px auto 0;width:70%">' + message + '</div><div id="blockingCode" style="margin:50px auto"><script type="text/javascript" src="//yastatic.net/es5-shims/0.0.2/es5-shims.min.js" charset="utf-8"></script><script type="text/javascript" src="//yastatic.net/share2/share.js" charset="utf-8"></script><div class="ya-share2" data-services="vkontakte,facebook,odnoklassniki,moimir,gplus" data-counter=""></div></div></div><script>window.addEventListener("load",function(){var e=document.getElementById("blockingTimer"),n=' + block.time + ';var si=setInterval(function(){if(e.innerHTML=""+n,n=parseInt(n),n--,0>n){var t=document.getElementById("blocking");t.style.display="none";clearInterval(si)}},1e3);var t=document.getElementById("blockingCode");t.addEventListener("click",function(){setTimeout(function(){var e=document.getElementById("blocking");e.style.display="none";clearInterval(si)},10e3)})});</script>' + code.player;

        }
        else if (modules.blocking.data.display == 'adv') {

            code.player = '<div id="blocking" style="position:absolute;background:#000 url(/themes/default/public/images/theme/dark/player.png) 100% 100% no-repeat;background-size:100% 100%;z-index:10000;top:0;left:0;width:100%;height:100%;color:#fff;text-align:center"><div id="blockingMessage" style="margin:30px auto 0;width:70%">' + message + '</div><div id="blockingCode" style="margin:30px auto">' + block.code + '</div></div><script>window.addEventListener("load",function(){var e=document.getElementById("blockingTimer"),n=' + block.time + ';var si=setInterval(function(){if(e.innerHTML=""+n,n=parseInt(n),n--,0>n){var t=document.getElementById("blocking");t.style.display="none";clearInterval(si)}},1e3);var t=document.getElementById("blockingCode");t.addEventListener("click",function(){setTimeout(function(){var e=document.getElementById("blocking");e.style.display="none";clearInterval(si)},10e3)})});</script>' + code.player;

        }
        else if (modules.blocking.data.display == 'adblock') {

            code.player = '<div id="blocking" style="position:absolute;background:#000 url(/themes/default/public/images/theme/dark/player.png) 100% 100% no-repeat;background-size:100% 100%;z-index:10000;top:0;left:0;width:100%;height:100%;color:#fff;text-align:center"><div id="blockingMessage" style="margin:80px auto 0;width:70%">' + message + '</div></div><script type="text/javascript" src="/themes/default/public/js/ads.js" charset="utf-8"></script><script>window.addEventListener("load",function(){var e=document.getElementById("blockingTimer"),n=' + block.time + ';var si=setInterval(function(){if(e.innerHTML=""+n,n=parseInt(n),n--,0>n){var t=document.getElementById("blocking");t.style.display="none";clearInterval(si)}},1e3);if(document.getElementById("CinemaPressACMS")){var ee=document.getElementById("blocking");ee.style.display="none";clearInterval(si)}});</script>' + code.player;

        }
        else if (modules.blocking.data.display == 'sub') {

            if (!global.CP_sub || (global.CP_sub && modules.blocking.data.sub.keys.indexOf(global.CP_sub) === -1)) {

                code.player = '<div id="blocking" style="position:absolute;background:#000 url(/themes/default/public/images/theme/dark/player.png) 100% 100% no-repeat;background-size:100% 100%;z-index:10000;top:0;left:0;width:100%;height:100%;color:#fff;text-align:center"><div id="blockingMessage" style="margin:80px auto 0;width:70%">' + message + '</div><div id="blockingCode" style="margin:30px auto"> <input type="text" placeholder="CP8881160388831744" style="border: 0;padding: 10px;border-radius: 3px;background: #ccc;color: #000;" id="subscribeKey"><input type="button" style="border: 0;padding: 10px;border-radius: 3px;background: #000;color: #fff; cursor: pointer;" value="Подписаться" id="subscribe"></div></div><script>function setCookie(e,t,n){n=n||{};var o=n.expires;if("number"==typeof o&&o){var i=new Date;i.setTime(i.getTime()+1e3*o),o=n.expires=i}o&&o.toUTCString&&(n.expires=o.toUTCString()),t=encodeURIComponent(t);var r=e+"="+t;for(var a in n)if(n.hasOwnProperty(a)){r+="; "+a;var s=n[a];s!==!0&&(r+="="+s)}document.cookie=r}window.addEventListener("load",function(){var e=document.getElementById("subscribe");e.addEventListener("click",function(){var e=document.getElementById("subscribeKey");e&&e.value&&(setCookie("CP_sub",e.value,{expires:29549220,path:"/"}),setTimeout(function(){location.reload(!0)},1e3))})});</script>';

            }

        }

    }
    
    return code;

}

module.exports = {
    "code" : blockingPlayer
};