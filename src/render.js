/**
 * @file 构建输出
 * @author leon <lupengyu@baidu.com>
 */

const COMMAND_TYPES = require('./constants.js').command;

function createScope(scope, path, isArray) {




}

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

    const nextScope = command.path.reduce(
        function (scope, item, index, items) {

            item = item || currentPath[index];

            if (!item || index < items.length - 1 && scope[item] == null) {
                throw new Error('invalid context: ' + command.command + ' lineNo:' + command.lineNo);
            }

            if (scope[item] == null) {
                scope[item] = command.multiple ? [] : {};
            }

            return scope[item];

        },
        root
    );

    return nextScope;

}

function render(commands) {

    let root = {};
    let currentScope = root;
    let currentPath = [];

    for (let i = 0, len = commands.length; i < len; ++i) {

        const command = commands[i];

        switch (command.type) {

            case COMMAND_TYPES.OBJECT_KEY_VALUE:
                currentScope[command.key] = command.value;
                break;

            case COMMAND_TYPES.ARRAY_KEY_VALUE:
                const key = command.key;
                const value = command.value;
                if (!Array.isArray(currentScope[key])) {
                    currentScope[key] = [value];
                }
                else {
                    currentScope[key].push(value);
                }
                break;

            case COMMAND_TYPES.ABSOLUTE_OBJECT_GROUP:
            case COMMAND_TYPES.RELATIVE_OBJECT_GROUP:
                currentScope = mergeGroup(root, currentPath, command);
                currentPath = command.path;
                break;

            case COMMAND_TYPES.COMMENT:
                break;
        }

    }

    return root;

}

module.exports = function (commands, scope) {
    return render(commands, {}, 0);
};
