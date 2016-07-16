/**
 * @file 构建输出
 * @author leon <lupengyu@baidu.com>
 */

'use strict';

const COMMAND_TYPES = require('./constants.js').command;

// 策略
//
// **这个格式不能表达出 [[], [], []]**
//
// 其实这个格式的 GROUP 就是使用一个数组记录当前 json pointer
// [a.b.c.d] 表达一个 json pointer，在这个 json pointer 指定的位置是一个 object
// [...d] 则是一个 json pointer 简略写法；如果当前的 pointer 是 [a.b.c]，那么 [...d] 就是 [a.b.c.d]
// 对于数组，json pointer 的最后一节的 key 加 @ 前缀；

function mergeGroup(root, currentPath, command) {

    const multiple = command.multiple;

    const nextPath = command.path.map(function (item, index) {

        item = item || currentPath[index];

        if (item == null) {
            throw new Error(''
                + 'invalid context: ' + command.command + ' '
                + 'lineNo:' + (command.lineNo + 1)
            );
        }

        return item;

    });

    const nextScope = nextPath.reduce(
        function (scope, item, index, items) {


            if (index < items.length - 1 && scope[item] == null) {
                throw new Error(''
                    + 'invalid context: ' + command.command + ' '
                    + 'lineNo:' + (command.lineNo + 1)
                );
            }

            // 最后一级为空，那么创建一个新的域。
            if (index === items.length - 1) {

                if (scope[item] == null) {
                    scope[item] = multiple ? [] : {};
                }

                // 如果是数组，那么在数组末尾放一个新的域，并把域直接向数组的最后一个元素
                if (multiple) {
                    scope[item].push({});
                }

            }

            // 指向到下一级
            scope = scope[item];

            if (Array.isArray(scope)) {
                scope = scope[scope.length - 1];
            }

            return scope;

        },
        root
    );

    return {
        scope: nextScope,
        path: nextPath
    };

}

function setProperty(scope, key, value) {
    scope[key] = value;
}

function render(commands) {

    let root = {};
    let currentScope = root;
    let currentPath = [];

    for (let i = 0, len = commands.length; i < len; ++i) {

        const command = commands[i];

        switch (command.type) {

            case COMMAND_TYPES.OBJECT_KEY_VALUE:
                setProperty(currentScope, command.key, command.value);
                break;

            case COMMAND_TYPES.ARRAY_KEY_VALUE:

                const key = command.key;
                const value = command.value;

                if (Array.isArray(currentScope[key])) {
                    currentScope[key].push(value);
                }
                else {
                    currentScope[key] = [value];
                }

                break;

            case COMMAND_TYPES.ABSOLUTE_OBJECT_GROUP:
            case COMMAND_TYPES.RELATIVE_OBJECT_GROUP:

                const merged = mergeGroup(root, currentPath, command);
                currentPath = merged.path;
                currentScope = merged.scope;

                break;

            case COMMAND_TYPES.GLOBAL_GROUP:
                currentPath = [];
                currentScope = root;
                break;

            case COMMAND_TYPES.COMMENT:
                break;
        }

    }


    return root;

}

module.exports = render;
