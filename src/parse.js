/**
 * @file 命令解析
 * @author leon <lupengyu@baidu.com>
 */

'use strict';

const COMMAND_TYPES = require('./constants.js').command;

const REG_GROUP = /^\[[\w@.]+\]$/;

// [GLOBAL]
const REG_GLOBAL_GROUP = /^GLOBAL$/;

// [a] [a.b.c]
// 绝对路径
const REG_ABSOLUTE_OBJECT_GROUP = /^((\.\w+)*)\.(@?)(\w+)$/;

// [.a] | [..a]
// 相对路径
const REG_RELATIVE_OBJECT_GROUP = /^((\.(\w+)?)*)\.(@?)(\w+)$/;

// key: value | @key: value
const REG_KEY_VALUE = /^(@?)(\w+)\s*:\s*([^\n]*)$/;

// #comment
const REG_COMMENT = /^#/;

function parseCommand(command, index) {

    if (REG_COMMENT.test(command)) {
        return {
            command,
            type: COMMAND_TYPES.COMMENT
        };
    }

    if (REG_KEY_VALUE.test(command)) {

        const multiple = RegExp.$1;
        const key = RegExp.$2;
        let value = RegExp.$3;

        value = /^"([\w\W]*)"/.test(value) ? value.slice(1, -1) : value;

        return multiple
            ? {
                command,
                type: COMMAND_TYPES.ARRAY_KEY_VALUE,
                key,
                value,
                lineNo: index
            }
            : {
                command,
                type: COMMAND_TYPES.OBJECT_KEY_VALUE,
                key,
                value,
                lineNo: index
            };

    }

    if (REG_GROUP.test(command)) {

        const group = command.slice(1, -1);

        if (REG_GLOBAL_GROUP.test(group)) {
            return {
                type: COMMAND_TYPES.GLOBAL_GROUP,
                command
            };
        }

        if (REG_RELATIVE_OBJECT_GROUP.test(group)) {

            return {
                type: COMMAND_TYPES.RELATIVE_OBJECT_GROUP,
                command,
                path: group
                    .split('.')
                    .map(function (item) {
                        return item[0] === '@' ? item.slice(1) : item;
                    }),
                multiple: !!RegExp.$4,
                lineNo: index
            };

        }

        if (REG_ABSOLUTE_OBJECT_GROUP.test('.' + group)) {

            return {
                type: COMMAND_TYPES.ABSOLUTE_OBJECT_GROUP,
                command,
                path: group
                    .split('.')
                    .map(function (item) {
                        return item[0] === '@' ? item.slice(1) : item;
                    }),
                multiple: !!RegExp.$3,
                lineNo: index
            };
        }


    }

    throw new Error(`error format: ${command}`);

}

module.exports = function (text) {

    return text.split('\n')
        .reduce(function (result, line, index) {

            line = line.trim();

            if (line) {
                result.push(parseCommand(line, index));
            }

            return result;

        }, []);

};
