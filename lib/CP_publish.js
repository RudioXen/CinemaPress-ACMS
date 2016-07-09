'use strict';

/**
 * Configuration dependencies.
 */

var config  = require('../config/config');
var texts   = require('../config/texts');

/**
 * Formation of the query term.
 *
 * @param {String} [query_id]
 * @return {Object}
 */

function queryConditionPublish(query_id) {

    var query_ids = [];

    if (arguments.length) {
        query_ids = (query_id + '').split('|');
    }

    var publish = {};
    publish.select = '';
    publish.where = '';

    var ids = [];
    for (var i = 0; i < texts.ids.length; i++) {
        var id = parseInt(texts.ids[i]);
        var start = parseInt(config.publish.start);
        var stop = parseInt(config.publish.stop);
        if (id > start && id < stop) continue;
        if (query_ids.length && query_ids.indexOf('' + id) === -1) continue;
        ids.push(id);
    }

    var text = (config.publish.text)
        ? (ids.length)
            ? ' OR kp_id = ' + ids.join(' OR kp_id = ') + ' '
            : ' '
        : (ids.length && query_ids.length)
            ? ' OR kp_id = ' + ids.join(' OR kp_id = ') + ' '
            : ' ';

    var where = (config.publish.required.length)
        ? config.publish.required.map(function (ctgry) {
        return ' AND `' + ctgry.trim() + '` != \'\' ';
    })
        : [];
    where = (where.length) ? where.join(' ') : '';

    publish.select = ', ( ( ' +
        'kp_id >= ' + config.publish.start +
        ' AND ' +
        'kp_id <= ' + config.publish.stop +
        ') ' + text + ' ) AS movie';

    publish.where = ' AND movie > 0 ' + where;

    return publish;

}

module.exports = {
    "queryCondition" : queryConditionPublish
};