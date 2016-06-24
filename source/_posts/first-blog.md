---
title: 前端在变，然而热情不变
date: 2016-06-18 03:59:57
categories: web乱炖
tags: 教程
---
本文作为本骚年正式开始技术博客的开篇，当然先渲染一下快乐的氛围。接着会大致介绍搭建这个博客的步骤。
<!--more-->

## 首先为第一篇博客开心一下
-----
或许在两个月前，本骚年还生活在远离github以及各种社区论坛的宅世界里。但即使是那样一个几乎与世隔绝的环境下，也依然满怀学习前端的热情。
<!---->
那时候做的事情不多，基本是些与jQuery打架，努力想解剖它，最后又握手言和的过家家。
<!---->
工作原因慢慢用上一些工具，也挑战自己上了框架、试着对代码进行抽离又封装，到如今在小伙伴的怂恿下试着在github搭博客。
<!---->
进步不得说不大，对于懒癌晚期只沉迷于学习远离、学习代码解析的骚年来说，各种各样的工具毫无疑问又增加了需要学习的范围。但，既来之则安之，有句话叫学无止境不是吗，要相信自己，哈哈。

## 参考
-----
关于创建github博客：
[http://blog.csdn.net/renfufei/article/details/37725057](http://blog.csdn.net/renfufei/article/details/37725057/)
Hexo搭建博客教程: 
[http://ibruce.info/2013/11/22/hexo-your-blog](http://ibruce.info/2013/11/22/hexo-your-blog/)
知乎：Hexo好看的主题：
[https://www.zhihu.com/question/24422335](https://www.zhihu.com/question/24422335)

## 搭建步骤
-----

### 注册一个github账户

### 创建github pages
> 具体可参考Hexo搭建博客教程: 
> [http://ibruce.info/2013/11/22/hexo-your-blog](http://ibruce.info/2013/11/22/hexo-your-blog/)

### 装载Hexo
> 该过程需要安装node以及Git，具体可参考Hexo搭建博客教程: 
> [http://ibruce.info/2013/11/22/hexo-your-blog](http://ibruce.info/2013/11/22/hexo-your-blog/)

### 选择自己喜欢的主题
> Hexo主题可参考知乎：Hexo好看的主题：
> [https://www.zhihu.com/question/24422335](https://www.zhihu.com/question/24422335)

### 对模板和样式进行修改
> Hexo装载的模板为ejs，炒鸡好懂的

### 选择喜欢的插件和挂件，统计等
> Hexo搭建博客教程里面有提及相关的部署

### 部署到github上
> 设置./_config.yml中Deployment相关，然后hexo deploy
> 注意请先生成静态文件再进行部署哦
> 若部署失败提示'ERROR Deployer not found: github', 是因为Hexo3.0以后type需要改成git
> 1.安装 npm install hexo-deployer-git --save
> 2.将deploy 的 type由github改为git

## 此处粘贴Hexo常用命令
-----
> hexo new "postName"  ---新建文章
> hexo new page "pageName"  ---新建页面
> hexo clean  ---清除缓存 网页正常情况下可以忽略此条命令
> hexo generate  ---生成静态页面至public目录
> hexo server  ---开启预览访问端口（默认端口4000，'ctrl + c'关闭server）
> hexo deploy  ---将.deploy目录部署到GitHub

## 结束语
-----
然后一不小心就玩通宵了，赶紧补眠去。
Good Day!