---
title: 前端性能优化--JavaScript 引擎性能
date: 2025-02-09 10:57:12
categories: 前端解决方案
tags: 性能优化
---
# 

或许你在做性能优化的时候有听说过——尽量避免使用`delete`，但是为什么呢？

这涉及到 v8 引擎的几个概念：快属性（fast properties）、隐藏类（hidden Classes）、内联缓存（IC）等。讲述 v8 引擎的文章很多，因此本文会简单进行介绍，然后以此说明我们在开发过程中的注意事项。

## JavaScript 引擎的优化

我们都知道，JavaScript 是动态语言，JavaScript 引擎在运行 JavaScript 代码时，会解析源代码并将其转换为抽象语法树 (AST)。基于该 AST，解释器可以开始执行其工作并生成字节码。

解释器可以快速生成字节码，但字节码的执行速度相对较慢。为了提高运行速度，字节码可以连同性能分析数据一起发送给优化编译器。优化编译器根据所掌握的性能分析数据做出某些假设，然后生成高度优化的机器码。

优化器需要更长的时间来生成代码，但它提供了更好的运行时性能。

V8 开始在解释器中运行字节码。在某个时刻，引擎确定代码是热门代码，并启动优化器前端，负责集成分析数据并构建代码的基本机器表示。然后，将其发送到不同线程上的优化器以进行进一步改进，如图：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/pipeline-detail-javascriptcore.svg)

当生成的代码准备就绪时，引擎开始运行此优化编译器代码而不是字节码。在 JavaScriptCore 中，所有优化编译器都与主 JavaScript 执行完全并发运行。

主线程会触发另一个线程上的编译作业，然后编译器使用复杂的锁定方案从主线程访问分析数据。

### 热函数优化

现在我们知道 JavaScript 引擎生成优化的机器代码需要很长时间，除此之外，优化的机器代码还需要更多的内存。

一般来说，字节码往往比机器码（尤其是优化的机器码）紧凑得多。另一方面，字节码需要解释器才能运行，而优化的代码可以由处理器直接执行。因此，为了使用解释器等快速生成代码和使用优化编译器生成快速代码之间进行权衡，JavaScript 引擎具有不同的优化层级：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/interpreter-optimizing-compiler-jsc.svg)

由于添加更多优化层级会产生额外的复杂性和开销，同时优化生成代码的内存使用量也会增大。因此，JavaScript 引擎只会尝试优化热函数。

**那么，我们在写代码的时候，就可以考虑抽离出高频执行的通用代码，让其成为热函数得到优化。**比如碰撞检测、

### JavaScript 引擎的去优化

现在我们知道，JavaScript 引擎在执行过程中会优化热函数，热函数即在代码执行过程中会高频执行的函数代码。

JavaScript 引擎在运行时，会结合运行代码时收集的分析数据，基于推测得到的数据类型，编译器可以生成高度优化的代码。但由于变量类型可能会在代码运行过程中发生变化，因此如果某一时刻某个假设被证明是错误的，优化编译器就会取消优化并返回到解释器。

我们可以看到 JavaScript 引擎运行 JavaScript 代码的过程如下图：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/js-engine-pipeline.svg)

取消优化的过程我们称之为去优化。显然，去优化会使得代码执行效率大大降低，因此我们要尽量避免该过程。

那么，什么情况下会发生去优化呢？

## JavaScript 引擎的形状

前面提到，JavaScript 引擎会基于运行代码时收集的分析数据，推测代码运行的大致类型然后进行优化。对于 JavaScript 引擎来说，相类似的对象模型，可以理解为是相类似的形状，这便是形状的概念。

所有 JavaScript 引擎都使用形状作为一种优化，当然，形状的说法还有很多种：隐藏类（Hidden Class）、`Maps`、类型、结构。

### JavaScript 中的隐藏类

我们先看看一个基本 JavaScript 对象在内存中包括了什么：

- HiddenClasses: 隐藏类保存了对象的形状信息，以及从属性名称到属性索引的映射
- Elements: 数组索引属性被保存在独立的元素存储中
- Properties: 命名属性被保存在属性存储中

每个 JavaScript 对象都有相应的隐藏类来记录该对象的形状信息。隐藏类保存了与对象相关的元信息，包括对象上的属性数和对象原型的引用。在基于 JavaScript 中，通常不可能预先知道类。因此，在这种情况下，V8 的隐藏类是动态创建的，并随着对象的变化而动态更新。

关于隐藏类的内容已有许多文章介绍过（文末提供了参考链接），这里不再赘述，我们需要知道的是：

- 具有相同结构的对象（相同顺序相同属性）具有相同的隐藏类
- 默认情况下，每添加新的命名属性都会导致一个新的隐藏类被创建
- 添加数组索引属性不会创建新的隐藏类

## JavaScript 内联缓存

JavaScript 引擎不是将原型链接存储在实例本身上，而是将其存储在形状上。无论有多少个对象，只要它们具有相同的形状，我们只需存储一次形状和属性信息。隐藏类充当了对象形状的标识符，因此是 V8 优化编译器和内联缓存非常重要的组成部分。

内联缓存是让 JavaScript 快速运行的关键因素，JavaScript 引擎使用内联缓存来记住在何处查找对象属性的信息，以减少昂贵的查找次数。比如优化编译器可以直接内联属性访问，如果它可以通过隐藏类来确保对象结构是兼容的。

为了加快原型的后续加载速度，V8 设置了内联缓存，包括了四个字段：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/ic-validitycell.svg)

在首次运行此代码期间预热内联缓存时，V8 会记住在原型中找到该属性的偏移量、找到该属性的原型、实例的形状，以及从实例形状链接到的直接原型的当前`ValidityCell`的链接。

下次内联缓存命中时，引擎必须检查实例的形状和`ValidityCell`。如果它仍然有效，引擎可以直接访问`Offset`，`Prototype`跳过额外的查找。

当原型改变时，会分配一个新的形状，而之前的`ValidityCell`会失效，所以内联缓存在下次执行时会失效，导致性能下降：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/validitycell-invalid.svg)

因此，我们在开发代码中要尽量避免改变`Object.prototype`，因为它会使引擎在此之前为原型加载设置的任何内联缓存失效。

这就回到我们文章最开始提到的：尽量避免使用`delete`，因为删除属性会修改`Object.prototype`，因此所有内联缓存都会再次失效，引擎必须再次从头开始。

### JavaScript 的快属性

在前端开发中曾经流行着一句话： JavaScript 里一切皆对象。而我们在写的 JavaScript 代码中，到处都是对对象属性的实现、修改和使用。

在 JavaScript 引擎中有三种不同的命名属性类型：对象内属性、快属性和慢属性（字典）。

- 对象内属性（in-object properties）: 对象属性直接保存在对象本身上，它们在 V8 可用的属性中是最快的，因为它们不需要间接层就可以访问
- 快属性: 将保存在线性属性存储中的属性定义为“快”，只需通过属性存储中的索引即可访问快属性。要从属性名称获取属性存储中的实际位置，可查看隐藏类上的描述符数组
- 慢属性: 带慢属性的对象内部会有独立的词典作为属性存储，属性元信息保存在内部独立的属性字典中，不再通过隐藏类共享元信息。

如果从对象中添加和删除大量属性，则可能会产生大量时间和内存开销来维护描述符数组和隐藏类，此时则会 JavaScript 引擎会将其降级为慢属性。简单来说：慢属性允许高效的属性删除和添加，但访问速度比其它两种类型慢。

现在基于这些知识，我们找到了一个实用的 JavaScript 编码技巧，可以帮助提高性能：
- 始终以相同的方式初始化你的对象，这样它们最终就不会有不同的形状
- 不要乱动原型
- 不要弄乱数组元素的属性，以便可以有效地存储和操作它们

也就是说，我们尽量在最开始就初始化好对象的所有属性，并且在代码运行过程中尽量避免新增、修改和删除属性。

``` ts
// bad
const object = {};
object.x = 5;
object.y = 6;

// good
const object = {
    x: 5,
    y: 6,
};
```

### 参考

- [JavaScript engine fundamentals: Shapes and Inline Caches](https://mathiasbynens.be/notes/shapes-ics)
- [V8 中的快属性](https://v8.js.cn/blog/fast-properties/)
- [Explaining JavaScript VMs in JavaScript - Inline Caches](https://mrale.ph/blog/2012/06/03/explaining-js-vms-in-js-inline-caches.html)
- [Slack tracking in V8](https://v8.dev/blog/slack-tracking)
- [Maps (Hidden Classes) in V8](https://v8.dev/docs/hidden-classes)
- [What's up with monomorphism?](https://mrale.ph/blog/2015/01/11/whats-up-with-monomorphism.html)

## 结束语
有时候我们以为用不到的东西就`delete`，但或许直接删除带来的麻烦会更多，或许我们在最开始，就应该认真对待这些事情、做好规划的呢~