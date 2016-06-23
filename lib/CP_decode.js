'use strict';

/**
 * Node dependencies.
 */

var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();

/**
 * Decoding the text.
 *
 * @param {String} text
 * @return {String}
 */

function decodeText(text) {
    var out = '', arr, i = 0, l, x;
    text = entities.decode(text);
    arr = text.split(/(%(?:D0|D1)%.{2})/);
    for ( l = arr.length; i < l; i++ ) {
        try {
            x = decodeURIComponent( arr[i] );
        } catch (e) {
            x = arr[i];
        }
        out += x;
    }
    return out.replace(/\+/g, ' ');
}

module.exports = {
    "text" : decodeText
};