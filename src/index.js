/**
 * @file bd configure
 * @author leon <lupengyu@baidu.com>
 */

const parse = require('./parse.js');
const render = require('./render.js');

exports.parse = function (text) {

    if (typeof text !== 'string') {
        throw new Error('parse need input to be a string');
    }

    return render(parse(text));

};
