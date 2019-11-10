---
title: 前端 CHANGELOG 生成指南
date: 2019-11-10 10:40:25
categories: 自动化甜筒
tags: 教程
---
我们在多人协同开发的时候，经常会遇到版本打包发布时，需要手动收集更新了什么内容、修复了什么 BUG，如果日常开发中并没有养成 commit 的好习惯，我们在合入 CHANGELOG 的时候就很容易遗漏特性。本文记录前端常用的自动生成 CHANGELOG 的接入过程。
<!--more-->

# Commit 规范化
不管是哪种自动生成 CHANGELOG 的工具，基本上都依赖于每次提交 git commit 的信息。从 git commit 信息开始进行规范化，这样就可以通过工具把关键信息找出来，并自动生成到 CHANGELOG 中。

## Angular 规范
目前，社区有多种 Commit message 的写法规范，这里我们使用的是 [Angular 规范](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.greljkmo14y0)，这是目前使用最广的写法，比较合理和系统化，并且有配套的工具（参考[《Commit message 和 Change log 编写指南》](https://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)）。

每次提交，Commit message 都包括三个部分：Header（必须），Body（可省略） 和 Footer（可省略）。

``` cmd
<type, 必填>(<scope，可省略>): <subject，必填>
// 空一行
<body，可省略>
// 空一行
<footer，可省略>
```

1. `type`。`type`用于说明 commit 的类别，一般来说只允许使用下面7个标识：

| 标识名 | 说明 | 是否会出现在 CHANGELOG 中 |
| - | - | - |
| feat | 新功能（feature） | 会 |
| fix | 修补bug | 会 |
| docs | 文档（documentation） | 自行决定 |
| style | 格式（不影响代码运行的变动） | 自行决定 |
| refactor | 重构（即不是新增功能，也不是修改bug的代码变动） | 自行决定 |
| test | 增加测试 | 自行决定 |
| chore | 构建过程或辅助工具的变动 | 自行决定 |

2. `scope`。`scope`用于说明 commit 影响的范围，比如某个模块、某个功能。
3. `subject`。`subject`是 commit 目的的简短描述，不超过50个字符。
4. `body`。`body`部分是对本次 commit 的详细描述，可以分成多行。
5. `footer`。`footer`部分只用于两种情况：不兼容变动、关闭 Issue。

## conventional-changelog 方案
关于自动生成 CHANGELOG，社区中使用较多的则是 [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) 方案。

### conventional-changelog 介绍
[conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) 可以根据项目的 commit 和 metadata 信息自动生成 CHANGELOG 和 release notes的系列工具，并且在辅助 standard-version 工具的情况下，可以自动帮你完成生成version、打tag, 生成CHANGELOG等系列过程。（参考[《git commit 、CHANGELOG 和版本发布的标准自动化》](https://zhuanlan.zhihu.com/p/51894196)）

#### 支持 Conventional Changelog 的插件
- [grunt](https://github.com/btford/grunt-conventional-changelog)
- [gulp](https://github.com/conventional-changelog/gulp-conventional-changelog)
- [atom](https://github.com/conventional-changelog/atom-conventional-changelog)
- [vscode](https://github.com/axetroy/vscode-changelog-generator)

#### Conventional Changelog 生态系统重要的模块
- [conventional-changelog-cli](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli) - 功能齐全的核心命令行工具
- [standard-changelog](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/standard-changelog) - 针对 angular commit 格式的命令行工具
- [conventional-github-releaser](https://github.com/conventional-changelog/conventional-github-releaser) - 利用 git metadata 针对 Github 的发布工具
- [conventional-recommended-bump](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-recommended-bump) - 根据 commit message 判断需要升级哪一位版本号
- [conventional-commits-detector](https://github.com/conventional-changelog/conventional-commits-detector) - commit message 规范引用检测
- [commitizen](https://github.com/commitizen/cz-cli) - 针对开发者简单的 commit 规范
- [commitlint](https://github.com/conventional-changelog/commitlint) - commit Lint 工具

以上是 conventional-changelog 生态重要的几个主要模块，实际工作中这几个工具常常是配套使用的，我们也是可以根据自己的情况来挑着使用。

### 规范 commit 命令行工具--commitizen
一般来说，我们提供一个脚本工具给到开发者来按照指引生成符合规范的 commit 信息也是够用的，这里我们使用`commitizen`工具。

1. 安装`commitizen`：

``` cmd
npm install -g commitizen
```

2. 通过以下命令来初始化项目以使用`cz-conventional-changelog`适配器（每个项目和构建过程都有不同的要求，因此commitizen通过适配器的方式，来保持Commitizen的扩展性）：

``` cmd
commitizen init cz-conventional-changelog --save-dev --save-exact
```

该命令做以下三件事情：
- 安装`cz-conventional-changelog`适配器npm模块
- 将其保存到`package.json`的依赖项或`devDependencies`
- 将`config.commitizen`配置添加到`package.json`的根目录，该配置告诉`commitizen`，当我们尝试提交此仓库时，我们实际上希望使用哪个适配器

3. 我们可以通过执行`git cz`命令，来提交 git commit：

``` cmd
> git cz

cz-cli@4.0.3, cz-conventional-changelog@3.0.2

? Select the type of change that you're committing: (Use arrow keys)
> feat:        A new feature
  fix:         A bug fix
  improvement: An improvement to a current feature
  docs:        Documentation only changes
  style:       Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
  refactor:    A code change that neither fixes a bug nor adds a feature
  perf:        A code change that improves performance
(Move up and down to reveal more choices)
```

### 强制执行 commit 规范--commitlint+husky
使用`commitizen`工具，我们可以通过执行`git cz`命令来提交符合规范的 commit 信息，但是在日常开发中，很多小伙伴并不是通过命令行的方式来提交 commit 的，如果我们要强制校验其他人通过 vscode/webstorm 等其他工具的方式提交 commit，可以使用`commitlint`+`husky`的方式来配合使用。

1. `commitlint`检查我们的 commit message 是否符合常规的提交格式，可通过以下方式安装：

``` cmd
npm install --save-dev @commitlint/config-conventional @commitlint/cli
```

2. 在`package.json`中添加配置（还可以通过`commitlint.config.js`，`.commitlintrc.js`，`.commitlintrc.json`，或`.commitlintrc.yml`文件等方式配置），此处`@commitlint/config-conventional`为基于 Angular 格式的配置：

``` json
{  
  "commitlint": {
    "extends": ["@commitlint/config-conventional"]
  }
}
```

3. `husky`继承了 git 下所有的钩子，在触发钩子的时候，`husky`可以阻止不合法的 commit、push 等等。安装`husky`：

``` cmd
npm install husky --save-dev
```

4. 使用`husky`添加 commit-msg 的钩子，用于检查`commitlint`规范：

``` json
{
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

这样，不管我们通过什么方式来提交 commit，如果 commit 信息不符合我们的规范，都会进行报错。例如我提交内容为`test`的 commit，会进行以下报错：

``` cmd
husky > commit-msg (node v10.16.2)
⧗   input: test
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]

✖   found 2 problems, 0 warnings
ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint
```

### 自动生成 CHANGELOG--conventional-changelog-cli
如果你的所有 Commit 都符合 Angular 格式，那么发布新版本时， CHANGELOG 就可以用脚本自动生成。

1. conventional-changelog-cli 就是生成 CHANGELOG 的工具，我们首先来安装一下：

``` cmd
npm install -g conventional-changelog-cli
```

2. 通过执行以下命令，则可以生成 CHANGELOG.md 文件：

``` cmd
conventional-changelog -p angular -i CHANGELOG.md -s
```

我们也可以将该命令配置到`scripts`中，就可以通过执行`npm run changelog`命令来生成 CHANGELOG 了:

``` json
{
  "scripts": {
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s"
  }
}
```

生成的 CHANGELOG 最终样式如下：

``` md
# 1.0.0 (2019-11-06)

### Features

- **自动化:** 新增自动生成 CHANGELOG 相关功能 ([a9ebf7e](https://github.com/godbasin/wxapp-typescript-demo/commit/a9ebf7ee0ca53a4906ed77106b65f6d6bef92f9b))
```

最终的代码可参考[wxapp-typescript-demo](https://github.com/godbasin/wxapp-typescript-demo)。

### 参考
- [《Commit message 和 Change log 编写指南》](https://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)
- [《git commit 、CHANGELOG 和版本发布的标准自动化》](https://zhuanlan.zhihu.com/p/51894196)

## 结束语
---
自动生成 CHANGELOG 其实是一个很好用的功能，同时其实前端自动化还会包括 CI/CD、自动化测试等功能。将一些重复性的工作进行脚本化和工具化，不正是我们程序员最擅长做的一些事情吗？