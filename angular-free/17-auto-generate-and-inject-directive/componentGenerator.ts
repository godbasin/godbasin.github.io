const fs = require('fs'); // 获取文件服务依赖
declare var __filename: string;

fs.readdir('./app/shared/components', (err, files) => {
    if (err) {
        // 若出错，返回
        console.log(err);
        return;
    }
    // 获取所有的指令文件（以'.directive.ts'结尾）
    const directives = files.filter(x => x.endsWith('.directive.ts'));
    // 提取出所有的指令名
    const directiveNames = directives.map(x => x.split('.')[0]);
    // 输出import所有指令的文本
    const imports = directiveNames.map(x => `import ${x} from './${x}.directive';\n`).join('');
    // 输出注册所有指令的文本
    const applies = directiveNames.map(x => `    ${x}(ngModule);\n`).join('');

    // 获取当前文件名
    const currentFileName = __filename.split(/[\\/]/).pop();
    // 合入输出
    const output =
        `/* 文件由${currentFileName}自动生成，请勿更改 */
/* 文件由${currentFileName}自动生成，请勿更改 */
/* 文件由${currentFileName}自动生成，请勿更改 */

${imports}

export default ngModule => {
${applies}};`;

    // 同步输出至文件'./app/shared/components/index.ts'
    fs.writeFileSync('./app/shared/components/index.ts', output, { encoding: 'utf-8', flag: 'w' });
});