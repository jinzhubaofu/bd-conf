/**
 * @file bd configure
 * @author leon <lupengyu@baidu.com>
 */

const getCommands = require('./getCommands.js');
const parse = require('./parse.js');
const render = require('./render.js');

exports.parse = function (text) {

    if (typeof text !== 'string') {
        throw new Error('parse need input to be a string');
    }

    const commands = getCommands(text).map(parse);

    return render(commands, {});

};
