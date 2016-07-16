/**
 * @file 构建输出
 * @author leon <lupengyu@baidu.com>
 */

const COMMAND_TYPES = require('./constants.js').command;

// 策略
//
// 1. [a] / [@a] root 切换指令
// 时切换 root；默认的 root 是 GLOBAL(object);
// [a] 的 scope 是 object；[@a] 的 scope 是 array;
//
// 2. [a.b.c] 绝对路径指令
// 不切换 root，直接对绝对路径指定的域上修改
// 绝对路径中的任意一级不存在，就挂掉
//
// 3. [.a] [.@a] [..a] [...a] [..@a] [...@a]
//
// 这种相当于 [R.R1.R2.R3...Rn.a]，会将作用域切换为 [R.R1.R2.R3...Rn.a]
//
// [.a] 是 object; [.@a] 是 array;
// 这种相当于从当前 scope 向下相找 n 级 sub scope；
// 如果 n-1 级子域中任意一级不存在，那就挂掉
//
// 4. [.a.b]
// 这种相当于 [R.a.b]

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
