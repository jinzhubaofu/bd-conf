/**
 * @file 解析出命令行测试
 * @author leon <lupengyu@baidu.com>
 */

const getCommands = require('../../src/getCommands.js');

describe('getCommand', function () {


    it('is a function', function () {
        expect(getCommands).toEqual(jasmine.any(Function));
    });

    it('return a array of string', function () {
        const text = `
#fdafdsaf

##fadfasdf

a: 1
[a]
name: 1

[.a]
hello: 2
        `;
        const commands = getCommands(text);

        expect(commands).toEqual(jasmine.any(Array));

        const everyItemIsString = commands.every(function (line) {
            return typeof line === 'string' && line;
        });

        expect(everyItemIsString).toBe(true);

    });

});
