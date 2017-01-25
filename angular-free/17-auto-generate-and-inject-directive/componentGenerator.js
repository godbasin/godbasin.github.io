var fs = require('fs'); // 获取文件服务依赖
fs.readdir('./app/shared/components', function (err, files) {
    if (err) {
        // 若出错，返回
        console.log(err);
        return;
    }
    // 获取所有的指令文件（以'.directive.ts'结尾）
    var directives = files.filter(function (x) { return x.endsWith('.directive.ts'); });
    // 提取出所有的指令名
    var directiveNames = directives.map(function (x) { return x.split('.')[0]; });
    // 输出import所有指令的文本
    var imports = directiveNames.map(function (x) { return "import " + x + " from './" + x + ".directive';\n"; }).join('');
    // 输出注册所有指令的文本
    var applies = directiveNames.map(function (x) { return "    " + x + "(ngModule);\n"; }).join('');
    // 获取当前文件名
    var currentFileName = __filename.split(/[\\/]/).pop();
    // 合入输出
    var output = "/* \u6587\u4EF6\u7531" + currentFileName + "\u81EA\u52A8\u751F\u6210\uFF0C\u8BF7\u52FF\u66F4\u6539 */\n/* \u6587\u4EF6\u7531" + currentFileName + "\u81EA\u52A8\u751F\u6210\uFF0C\u8BF7\u52FF\u66F4\u6539 */\n/* \u6587\u4EF6\u7531" + currentFileName + "\u81EA\u52A8\u751F\u6210\uFF0C\u8BF7\u52FF\u66F4\u6539 */\n\n" + imports + "\n\nexport default ngModule => {\n" + applies + "};";
    // 同步输出至文件'./app/shared/components/index.ts'
    fs.writeFileSync('./app/shared/components/index.ts', output, { encoding: 'utf-8', flag: 'w' });
});
