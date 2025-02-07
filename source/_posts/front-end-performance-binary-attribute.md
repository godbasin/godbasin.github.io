---
title: 前端性能优化--二进制压缩数据内容
date: 2025-01-02 21:34:23
categories: 前端解决方案
tags: 性能优化
---

今天也是来介绍一种性能优化的具体方式，使用二进制存储特定数据，来降低内存占用、后台存储和传输成本。

## 二进制数据设计

当我们需要描述某种数据的许多状态时，可以考虑使用二进制的方式优化。

简单来说，就是使用二进制数字`1`和`0`来表示单个状态，然后使用二进制数字来表示多种状态的组合，比如`10001001`可以表示 8 种状态。同时还可以将二进制转换为十进制来减少存储成本，比如`10001001`可转换成`137`。

### 上报数据转换

常用的场景可以考虑数据上报，比如当用户在编辑文档/打开文档的时候，需要收集一些数据来观测性能情况比如：

```ts
interface IDocumentInfo {
  isHugeDocument: boolean;
  isReadonly: boolean;
  hasCharts: boolean;
  hasFormatting: boolean;
  hasImages: boolean;
  hasVideos: boolean;
  hasRadios: boolean;
  hasPivotTable: boolean;
  hasTableStyle: boolean;
  hasFreezePanels: boolean;
}
```

我们需要根据文档的具体情况，结合大盘的文档性能数据来判断加载速度是否与某些文档特性相关，假设一次上报数据为：

```ts
interface reportData {
  timecost: number;
  docInfo: IDocumentInfo;
}
```

当希望收集的数据多了之后，我们每次都会携带十分大的数据内容。这时候可以考虑使用二进制的方式来进行上报，比如：

```ts
const docInfo = {
  isHugeDocument: true,
  isReadonly: true,
  hasCharts: true,
  hasFormatting: false,
  hasImages: true,
  hasVideos: false,
  hasRadios: false,
  hasPivotTable: false,
  hasTableStyle: true,
  hasFreezePanels: true,
};
```

可以表示为 10 个二进制位，即：`1110100011`，那么转为十进制则是`931`，我们上报为`931`即可。

通过这样的方式，原本一个 JSON 字符串：

```json
"{\"isHugeDocument\":true,\"isReadonly\":true,\"hasCharts\":true,\"hasFormatting\":false,\"hasImages\":true,\"hasVideos\":false,\"hasRadios\":false,\"hasPivotTable\":false,\"hasTableStyle\":true,\"hasFreezePanels\":true}"
```

只需要使用`931`来表示，可以极大地节省传输和存储成本。

### 单元格数据状态

除了上报数据以外，多状态数据同样适应。使用表格为例，一个单元格的样式可能包括：加粗、下划线、删除线、斜体、字号、字体颜色、字体样式、背景色等。那么，我们需要这样来描述一个单元格数据：

```ts
interface ICell {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikeThrough: boolean;
  font: string;
  fontSize: number;
  textColor: string;
  backgroundColor: string;
}
```

如果我们对一个单元格进行样式编辑，假设只设置了加粗、下划线，按理说最简单的数据变更应该只有`isBold`和`isUnderline`两个新数据，那么这次变更我们可以认为是`10100000`，转换成十进制则是`160`。

如果说我们还需要再细致些，直接将单元格的最终状态进行存储，同样可以使用进制的方式进行，比如`boolean`类型的可以直接使用二进制表示最终状态，假设前面四个布尔值的加粗、下划线、删除线、斜体可以压缩为`1010`来表示一个加粗、无下划线、有删除线、无斜体样式的单元格。

那么，我们在存储单元格数据的时候，一些小的成本节约遇上百万千万单元格数据时，则可能会产生想象不到的优化效果。

## 结束语

今天介绍的只是一个内存优化的思路，但依然还是一句话，性能优化往往是时间换空间、或是空间换时间，本文的例子中显然是时间换空间，毕竟我们需要对数据进行转换，这个过程需要消耗时间是不可避免的。

除了二进制转换成十进制以外，这样的思路可以拓展到许多地方，比如 16 进制/ 32 进制，甚至简单的字符串拼接等。本质上都是使用约定的方式来存储数据内容，比如 pb、json 便都是一种约定的数据结构。

还是那句，没有适用于所有方案的最优解，但总有更适合某个场景的解决方案。
