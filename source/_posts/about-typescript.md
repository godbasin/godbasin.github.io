---
title: 关于Typescript
date: 2017-09-01 21:21:26
categories: js什锦
tags: 分享
---
Typescript这事情，当你管理大点的应用的时候，就会感受到它的好处了。
<!--more-->

## 认识Typescript
---
### 什么是Typescript
TypeScript是JavaScript的超集，带来了诸多新特性：
- 可选的静态类型
- 类型接口
- 在ES6和ES7被主流浏览器支持之前使用它们的新特性
- 编译为可被所有浏览器支持的JavaScript版本
- 强大的智能感知

### Typescript特性
- 可选静态类型

类型可被添加到变量，函数，属性等。这将帮助编译器在App运行之前就能显示出任何潜在的代码警告。

给JavaScript加上可选的类型系统，很多事情是只有静态类型才能做的，给JavaScript加上静态类型后，就能将调试从运行期提前到编码期，诸如类型检查、越界检查这样的功能才能真正发挥作用。TypeScript的开发体验远远超过以往纯JavaScript的开发体验，无需运行程序即可修复潜在bug。

- 支持使用ES6和ES7的新特性

在TypeScript中，你可以直接使用ES6的最新特性，在编译时它会自动编译到ES3或ES5。

- 代码自动完成，代码智能感知

### TS与JS
TS是一个应用程序级的JavaScript开发语言。
TS是JavaScript的超集，可以编译成纯JavaScript。
TS跨浏览器、跨操作系统、跨主机，开源。
TS始于JS，终于JS。遵循JavaScript的语法和语义，方便了无数的JavaScript开发者。
TS可以重用现有的JavaScript代码，调用流行的JavaScript库。
TS可以编译成简洁、简单的JavaScript代码，在任意浏览器、Node.js或任何兼容ES3的环境上运行。
TypeScript比JavaScript更具开发效率，包括：静态类型检查、基于符号的导航、语句自动完成、代码重构等。
TS提供了类、模块和接口，更易于构建组件。

### 参考
- [《TypeScript的全部资料，以后都放这儿了》](http://www.cnblogs.com/farb/p/4983188.html)

## 使用Typescript
---
关于Typescript的语法，更多的可参考[官方文档](https://tslang.cn/docs/handbook/basic-types.html)，这里只列出常用的：基础类型、接口和类。

### 基础类型
TypeScript支持与JavaScript几乎相同的数据类型，此外还提供了实用的枚举类型使用。

``` js
// 布尔值
let isDone: boolean = false;

// 数字
let decLiteral: number = 6;

// 字符串
let name: string = "bob";

// 数组常用
// 在元素类型后面接上 []
let list: number[] = [1, 2, 3];

// 数组泛型，Array<元素类型>
let list: Array<number> = [1, 2, 3];

// any类型常用于对现有代码进行改写
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false;

// void类型像是与any类型相反，它表示没有任何类型
// 函数没有返回值
function warnUser(): void {
   alert("This is my warning message");
}

// 默认情况下null和undefined是所有类型的子类型
// 可以把null和undefined赋值给各种类型的变量
let u: undefined = undefined;
let n: null = null;
```

### 接口
TypeScript的核心原则之一是对值所具有的结构进行类型检查。 
它有时被称做“鸭式辨型法”或“结构性子类型化”。 

在TypeScript里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。

``` js
interface SquareConfig {
    color: string;
    // 可选属性
    width?: number;  
    // 指定属性 
    type: 1 | 2 | 3;
    // 只读属性  
    readonly x: number; 
    // 函数类型
    getArea(x: number): number; 
}
```

- 接口继承

``` js
interface Shape {
    color: string;
}

// 接口继承
// 此时Square同时具有两个属性
interface Square extends Shape {
    sideLength: number;
}
```

### 类
ECMAScript 6开始，JavaScript程序员将能够使用基于类的面向对象的方式。

``` js
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");
```

当接口继承了一个类类型时，它会继承类的成员但不包括其实现。 
接口同样会继承到类的private和protected成员。

公共，私有与受保护的修饰符：
- `public`（默认）: 可以自由的访问程序里定义的成员
- `private`: 当成员被标记成`private`时，它就不能在声明它的类的外部访问
- `protected`: `protected`修饰符与`private`修饰符的行为很相似，但`protected`成员在派生类中仍然可以访问
- `readonly`: 将属性设置为只读的，只读属性必须在声明时或构造函数里被初始化

``` js
class Person {
    protected name: string;
    constructor(name: string) { this.name = name; }
}

class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
        super(name)
        this.department = department;
    }

    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee("Howard", "Sales");
console.log(howard.getElevatorPitch());
console.log(howard.name); // error
```

在Typescript中，可以使用ES6很多新的特性，其中类Class也是ES6特性之一。包括`getter`和`setter`，其实都是ES6而不是Typescript的特性。
但`public`、`private`、`protected`等，则是Typescript中增加的。

### 声明文件
大多数情况下，类型声明包的名字总是与它们在npm上的包的名字相同，但是有`@types/`前缀：

``` cmd
npm install -D @types/node
```

这里我们参考`node.d.ts`中的`require`，在我们在typescript中使用`require`的时候，若无安装`@types/node`或是自己声明，会报错的：

``` js
// 声明require
declare var require: NodeRequire;
interface NodeModule {
   exports: any;
   require: NodeRequireFunction;
   id: string;
   filename: string;
   loaded: boolean;
   parent: NodeModule | null;
   children: NodeModule[];
}
```

### 项目配置
**`tsconfig.json`**：文件中指定了用来编译这个项目的根文件和编译选项。
**`tslint.json`**：规则定义。

``` js
// 常见tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "src",               // 根路径，常在使用paths时候结合使用
    "target": "es6",                // 目标js版本，当需要承接jsx的时候可设为"es6"，常设为"es5"
    "jsx": "preserve",              // 保留jsx的处理，常用在使用jsx时
    "module": "commonjs",
    "sourceMap": true,
    "emitDecoratorMetadata": true,  // 使用装饰器
    "experimentalDecorators": true, // 使用元数据
    "lib": [
      "dom",
      "es7",
      "es6"
    ],
    "paths": {
      "utils": "utils"
    }
  },
  "exclude": [
    "node_modules"
  ]
}
```

### 项目迁移
常用迁移步骤：
1. 安装依赖（`typescript` / `ts-loader` / `tslib`等）
2. 文件重命名（`.js => .ts` | `.jsx => .tsx`）
3. 添加`tsconfig.json`和`tslint.json`
4. 调整Webpack配置（`resolve.extensions` / `loaders`）
5. 添加声明文件（`@types/node`等）

## 为什么是Typescript
---

### 大型项目常见问题
1. 类型不明确，甚至在使用中转换。

``` js
var type = 1;
type = 'abc';
```

2. 对象成员属性不明确，使用容易出错。

``` js
var obj = {a: 123, b: 323};
console.log(obj.c);
```

3. 接口返回内容和格式不明确。

``` js
ajax('url', function (json){
 json.result ??
}
```

4. 接手代码注释不多，相关变量命名不规范，变量类型、接口类型等均难以debug。

5. 重构代码、重命名符号需要改动太多相关文件。

### 谁在使用Typescript
框架：`Angular`
工具：`TSLint`
编译器：`VSCode`
工具库：`RxJS`、`UI-ROUTER`
UI：`ANT Design` React UI库
APP：`Reddit`

### Angular说
1. TypeScript 拥有很好的工具。

它提供了先进的自动补全功能，导航，以及重构。有这样的工具几乎是开发大型项目的必要条件。没了这些工具，修改代码的恐惧将会导致该代码库在一个半只读（semi-read-only）状态， 并且使大规模重构变得极具风险，同时消耗巨大资金。

2. TypeScript 使抽象概念明确。

一个好的设计在于定义良好的接口。支持接口的语言使得表达想法变得更加容易。
不能清楚地看到界限，开发者开始依赖具体类型而不是抽象接口，导致了紧密耦合。

3. TypeScript 使代码更易阅读和理解。

### Reddit说
1. 要支持强类型。
2. 要有很好的配套工具。
3. 已经有了成功案例。
4. 我们的工程师可以很快上手。
5. 能同时工作于客户端和服务器。
6. 有优秀的类库。

**Typescript  vs Flow**：

Typescript是JavaScript的强类型版本。
Flow是通过一组可以添加到JavaScript的注解，然后通过工具检查正确性。
Flow的类型注解能自动的被Babel移除。
与TypeScript相比，Flow在类型检查中做得更好。
Typescript是强类型，能使代码有更少的类型相关bug，更容易构建大型应用，还有着丰富的生态系统。

TypeScript的一大加分项就是其生态系统，TypeScript的支持库实在是太棒了。

并且还支持目前流行的编辑器，比如VSCode, Atom和Sublime Text。
此外，TypeScript还支持解析JSDoc。

### 为什么使用Typescript
1. 提供了先进的自动补全功能，导航，以及重构工具。

构建丰富的开发工具从第一天起就成为了TypeScript团队的明确目标。
这也是为什么他们构建了编程语言服务，使得编辑器可以提供类型检查以及自动补全的功能。那么多的编辑器都对TypeScript有极好的支持，就是因为TypeScript提供了编程语言服务。

2. 是JavaScript的超集，从JavaScript迁移方。。

从JavaScript迁移到TypeScript不需要经过大改写。可以慢慢的、一次一个模块的迁移。

随便挑选一个模块，修改文件扩展名`.js`为`.ts`，然后逐步添加类型注释。当你完成了这个模块，再选择下一个。
一旦整个代码库都被类型化，你就可以开始调整编译器设置，使其对代码的检查更加严格。

3. 支持接口，抽象设计。

在一个静态类型的编程语言中，使用接口来定义子系统之间的界限。

4. 类型的支持，使代码更易阅读和理解。

我们不需要深入了解代码的实现，也不需要去阅读文档，就可以更更好地理解代码。

5. 生态系统完善，支持库完备，已有不少使用TypeScript的成熟项目。

### 参考
- [《为什么 Angular 2 改用 TypeScript 语言实现》](https://coyee.com/article/10635-why-angular-2-switched-to-typescript)
- [《为什么 Reddit 选择了 TypeScript？》](https://zhuanlan.zhihu.com/p/27695708)
- [《TypeScript 优秀开源项目大合集》](http://www.cnblogs.com/brookshi/p/6505599.html)

## 结束语
---
很多时候，当我们维护不同重量级的应用，或是在不同的场景中使用应用的时候，面对的架构选择往往是不一样的。
就像我们在很小的页面里使用redux会觉得繁琐，在数据类型不多的对象或接口中使用typescript会觉得没啥效果一样，个人还是认为，好的架构在能遇见拓展性的同时，不过度设计，恰到好处才是最棒的。