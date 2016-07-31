---
title: Angular使用笔记11-使用Karma和Jasmine进行单元测试
date: 2016-07-30 11:32:35
categories: angular混搭
tags: 笔记
---
最近的一个项目使用AngularJS(v1.2.6)作为前端的框架，《Angular使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录使用Karma和Jasmine搭建测试环境的过程。
<!--more-->

## TDD和BDD
-----
### TDD
Test Drive Development，测试驱动开发。
大概的流程是先针对每个功能点抽象出接口代码，然后编写单元测试代码，接下来实现接口，运行单元测试代码，循环此过程，直到整个单元测试都通过。
- 优点：
  - 1.能驱使系统最终的实现代码，都可以被测试代码所覆盖到，也即“每一行代码都可测”。
  - 2.测试代码作为实现代码的正确导向，最终演变为正确系统的行为，能让整个开发过程更加高效。
- 不足
  - 1.项目的需求必须足够清晰。
  - 2.对于一个业务模型及其复杂、内部模块之间的相互依赖性非常强的项目，采用TDD反而会得不尝失，这会导致程序员在拆分接口和写测试代码的时候工作量非常大。

### BDD
Behavior Drive Development，行为驱动开发。
把TDD中模糊的那一部分给明确了，强调开发、测试、BA、客户等所有项目相关人员都用自然语言来描述系统的行为。
大家看到的描述一致，读到的内容一致，于是最终测试驱动开发产出的结果也应该是最符合用户期望的。

### 参考
- [《[转]关于TDD、BDD和DDD的一些看法》](http://www.cnblogs.com/wangshenhe/archive/2013/02/16/2913431.html)

### 单元测试
单元测试是一种测试你的项目中每个最小单元代码的艺术，是使你的程序思路清晰的基础。一旦所有的测试通过，这些零散的单元组合在一起也会运行的很好，因为这些单元的行为已经被独立的验证过了。

## Jasmine
-----
Jasmine是一个用来编写Javascript测试的框架，它不依赖于任何其它的javascript框架，也不需要对DOM。它有拥有灵巧而明确的语法可以让你轻松的编写测试代码。

### jasmine基础语法
jasmine单元测试有两个核心的部分：describe函数块和it函数块。

- Suites
Suites可以理解为一组测试用例，使用全局的Jasmin函数describe创建。describe函数接受两个参数，一个字符串和一个函数。字符串是这个Suites的名字或标题（通常描述下测试内容），函数是实现Suites的代码块。

- Specs
Specs可以理解为一个测试用例，使用全局的Jasmin函数it创建。和describe一样接受两个参数，一个字符串和一个函数，函数就是要执行的测试代码，字符串就是测试用例的名字。一个Spec可以包含多个expectations来测试代码。

- Expectations
Expectations由expect函数创建。接受一个参数。和Matcher一起联用，设置测试的预期值。

在分组(describe)中可以写多个测试用例(it)，也可以再进行分组(describe)，在测试用例(it)中定义期望表达式(expect)和匹配判断(toBe*)。

- 内置Matchers

``` javascript
expect(a).toBe(true);//期望变量a为true  
expect(a).toEqual(true);//期望变量a等于true  
expect(a).toMatch(/reg/);//期望变量a匹配reg正则表达式，也可以是字符串  
expect(a.foo).toBeDefined();//期望a.foo已定义  
expect(a.foo).toBeUndefined();//期望a.foo未定义  
expect(a).toBeNull();//期望变量a为null  
expect(a.isMale).toBeTruthy();//期望a.isMale为真  
expect(a.isMale).toBeFalsy();//期望a.isMale为假  
expect(true).toEqual(true);//期望true等于true  
expect(a).toBeLessThan(b);//期望a小于b  
expect(a).toBeGreaterThan(b);//期望a大于b  
expect(a).toThrowError(/reg/);//期望a方法抛出异常，异常信息可以是字符串、正则表达式、错误类型以及错误类型和错误信息  
expect(a).toThrow();//期望a方法抛出异常  
expect(a).toContain(b);//期望a(数组或者对象)包含b  
```

- Setup and Teardown
为了在复杂的测试用例中更加便于组装和拆卸，Jasmine提供了四个函数：
``` javascript
beforeEach(function)  //在每一个测试用例(it)执行之前都执行一遍beforeEach函数；  
afterEach(function)  //在每一个测试用例(it)执行完成之后都执行一遍afterEach函数；  
beforeAll(function)  //在所有测试用例执行之前执行一遍beforeAll函数；  
afterAll(function)  //在所有测试用例执行完成之后执行一遍afterAll函数；
```

- this关键字
可以通过this关键字在beforeEach、afterEach和it之间共享变量，在beforeEach/afterEach/it中有一个共同的this对象。

- 参考
[《JavaScript单元测试框架——Jasmine入门》](http://ued.fanxing.com/javascriptdan-yuan-ce-shi-kuang-jia-jasmine/)

### jasmine环境配置
jasmine运行需要4个部分：
1.运行时环境：基于浏览器，通过HTML作为javascript载体
2.源文件：用于实现某种业务逻辑的文件，就是我们平时写的js脚本
3.测试文件：符合jasmineAPI的测试js脚本
4.输出结果：jasmine提供了基于网页的输出结果

## Karma
-----
### Karma介绍
Karma是一个基于Node.js的JavaScript测试执行过程管理工具（Test Runner）。
该工具可用于测试所有主流Web浏览器，也可集成到CI（Continuous integration）工具，也可和其他代码编辑器一起使用。
这个测试工具的一个强大特性就是，它可以监控(Watch)文件的变化，然后自行执行，通过console.log显示测试结果。

### Karma安装
安装karma和相关插件。
``` cmd
npm install karma --save-dev
npm install karma-jasmine karma-chrome-launcher --save-dev
```

## 编写测试代码
-----
项目中有关测试环境的搭建在我们之前[Yaomen](http://blog.jobbole.com/65399/)的时候就解决了呢。

### 控制器测试
这里我们简述一下编写IndexCtrl控制器的代码：
``` javascript
describe('Controller: IndexCtrl', function () {
  beforeEach(module('angularTestApp')); //注入module
  var IndexCtrl, scope, rootscope;
  beforeEach(inject(function ($controller, $rootScope) { //注入控制器和作用域
    scope = $rootScope.$new();
    IndexCtrl = $controller('IndexCtrl', {
      $scope: scope
    });
  }));
  it('should have loading to be init', function () {
    expect(scope.loading).toBe('init');
  });
  it('should have 4 asidemenus', function () {
    expect(scope.asidemenus.length).toBe(4);
  });
  it('should load photo', function () {
  	expect(scope.avatar).toBeUndefined();
    scope.loadphoto('123');
    expect(scope.avatar.length).toBe(3);
  });
});
```

## 结束语
-----
其它像Directive、Service等也是可以进行单元测试的哦，测试方法跟控制器，注入服务然后测试，小伙伴们也可以试试。