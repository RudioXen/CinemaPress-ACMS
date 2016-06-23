'use strict';

/**
 * Configuration dependencies.
 */

var config  = require('../config/config');
var texts   = require('../config/texts');

/**
 * Formation of the query term.
 *
 * @return {Object}
 */

function queryConditionPublish() {

    var publish = {};
    publish.select = '';
    publish.where = '';

    var text = (config.publish.text && texts.ids.length)
        ? ' OR kp_id = ' + texts.ids.join(' OR kp_id = ') + ' '
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