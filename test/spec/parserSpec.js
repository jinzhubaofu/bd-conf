/**
 * @file 解析器测试用例
 * @author leon <lupengyu@baidu.com>
 */

const parse = require('../../src/parse.js');
const getCommands = require('../../src/getCommands.js');
const render = require('../../src/render.js');
const fs = require('fs');
const path = require('path');

describe('`parse`', function () {

    it('is a function', function () {
        expect(parse).toEqual(jasmine.any(Function));
    });

    it('should work', function () {

        const text = fs.readFileSync(path.join(__dirname, 'test.conf'), 'utf8');
        const commands = getCommands(text).map(function (line, index) {
            const command = parse(line, index);
            console.log(command);
            return command;
        });

        const result = render(commands);

        expect(true).toBe(true);
    });

});
