---
title: 玩转Angular1(17)--脚本自动更新并注册指令
date: 2017-03-31 11:39:52
categories: angular混搭
tags: 笔记
---
AngularJS(v1.5.8)已经成为项目们的基本框架，《玩转Angular1》系列用于记录项目中的一些好玩或者比较特别的思路。
本文介绍使用脚本自动生成指令注册的文件，该脚本参考来自组内小朋友。
<!--more-->
## 指令的管理
-----
### 指令的注册
前面也提到过，我们在注入编写的指令、服务、控制器等等的时候，可以使用两种方法：
1. 通过在模块中注册。
2. 通过添加模块依赖，该模块依赖中已含有需要注入的对象。

目前我们维护的指令已经在不断增长了，这样我们每次新加一个指令的时候，都需要在`bootstrap.ts`中获取并注册到模块中，不是很方便。

我们可以编写一个简单的脚本，将所有的指令都在`shared/components`文件夹的`index.ts`文件中注入模块，然后返回该模块，在`bootstrap.ts`文件中注册。
这样，每次我们新建、更改、删除一些指令的时候，我们只需要运行一下这个脚本就可以了。

### 基本思路
我们的指令们的命名遵守的规律：
- [指令名].directive.ts

如此，我们可以从文件名拿到指令的名字，这样就可以自动获取指令名，并合并后统一导出。

既然我们是javascript的执行者，这时候当然要选择node去执行我们的脚本：
- 获取`fs`文件依赖
- 通过`fs.readdir()`去读取`app/shared/components`文件夹下的文件，匹配出指令名
- import所有的指令
- 通过`export default`导出合入后的指令

### fs服务
- `readFile()`
用于异步读取数据。

- `writeFile()`
用于异步写入文件。

- `exists()`
用来判断给定路径是否存在，然后不管结果如何，都会调用回调函数。

- `mkdir()`
用于新建目录。

- `readdir()`
用于读取目录，返回一个所包含的文件和子目录的数组。

- `mkdirSync()`，`writeFileSync()`，`readFileSync()`
这三个方法是建立目录、写入文件、读取文件的同步版本。

参考：[《fs 模块》](http://javascript.ruanyifeng.com/nodejs/fs.html#toc5)

## 自动注册实现
---
### componentGenerator.ts
``` typescript
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
```

### 在bootstrap中注入
这样，我们可以通过`app/shared/components/index.ts`文件中一并获取该文件夹下所有依赖，这样我们就可以只需要注入一次：

``` typescript
// app/bootstrap.ts
...
// 注入指令们
import ComponentLoader from './shared/components';

[
    ...
    ComponentLoader
].forEach((service) => service(ngModule));
...
```

### 生成并运行脚本
我们的脚本是用ts文件写的，若要在node下运行需要先编译成js文件：

``` nodejs
tsc componentGenerator.ts
```

这时候就会生成文件`componentGenerator.js`，然后可直接运行：

``` nodejs
node componentGenerator.js
```

就会自动生成`app/shared/components/index.ts`文件了：

``` typescript
/* 文件由componentGenerator.js自动生成，请勿更改 */
/* 文件由componentGenerator.js自动生成，请勿更改 */
/* 文件由componentGenerator.js自动生成，请勿更改 */

import alertMsg from './alertMsg.directive';
import beDisableIf from './beDisableIf.directive';
import onEnter from './onEnter.directive';
import onEsc from './onEsc.directive';
import onFocusLost from './onFocusLost.directive';
import safeClick from './safeClick.directive';
import selectDate from './selectDate.directive';
import selectDateInterval from './selectDateInterval.directive';
import selectTime from './selectTime.directive';
import sidebar from './sidebar.directive';


export default ngModule => {
    alertMsg(ngModule);
    beDisableIf(ngModule);
    onEnter(ngModule);
    onEsc(ngModule);
    onFocusLost(ngModule);
    safeClick(ngModule);
    selectDate(ngModule);
    selectDateInterval(ngModule);
    selectTime(ngModule);
    sidebar(ngModule);
};
```

至于其他的服务service/factory，还有控制器controller等，都可以参考这样的方式。

## 结束语
---
这节主要简单介绍使用脚本自动生成指令注册的文件的过程，脚本设计来自组内小朋友。
当我们的项目大了，对于管理的确比较不方便，这时候我们就需要一些相对自动或者辅助管理的脚本，像这里的`componentGenerator.ts`以及前面的`publish.sh`等等都是吧。
当然这里，小伙伴们也可以尝试把这个文件的运行添加到webpack-dev-server的热部署中，当文件有改动的时候自动运行之类之类的。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-free/17-auto-generate-and-inject-directive)