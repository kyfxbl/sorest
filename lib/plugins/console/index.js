'use strict';

module.exports = registerInternalConsolePlugin;

function registerInternalConsolePlugin(ctx){

    var console = ctx.extend.console;

    // 执行的结果是，hero.extend.console对象，其store包含此函数
    // 于是当执行hexo xxx，就会从hexo.extend.console中取出此函数并执行
    // 最终走到plugins/console/中对应的函数里
    // 由于调用是用的call(sorest, args)，所以其中的this指的是sorest对象
    console.register('help', 'Get help on a command.', require('./help'));

    var initOptions = {
        desc: 'Create a new Sorest folder at the specified path or the current directory.',
        usage: '[destination]'
    };

    console.register('init', 'Create a new Hexo folder.', initOptions, require('./init'));

    console.register('version', 'Display version information.', require('./version'));

    console.register('start', 'start a sorest server', require("./start"));
}