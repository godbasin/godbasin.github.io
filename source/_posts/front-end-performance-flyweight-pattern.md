---
title: 前端性能优化--享元模式
date: 2024-11-06 20:51:10
categories: 前端解决方案
tags: 性能优化
---

之前讲到性能优化，大多数介绍的都是耗时上的一些优化，比如页面打开更快、用户交互响应更快等。不过，在最开始的[《前端性能优化--归纳篇》](https://godbasin.github.io/2022/03/06/front-end-performance-optimization/)一文中有说过，前端性能优化可以从两个角度来衡量：时间和空间，今天介绍的享元模式则用于空间下内存占用的优化。

## 享元模式

享元是一种设计模式，通过共享对象的方式来减少创建对象的数量，从而降低程序运行过程中占用的内存，提升页面性能。

一般来说，假如我们的页面中存在大量相类似的内容时，这些内容在代码中被设计为对象的方式，则我们可以通过享元的方式，将一样的对象进行共享，从而减少页面中的总对象数，降低内存占用。

本文就以最近比较熟练的表格为例子来介绍吧。

### 享元对象设计

假设我们现在有 1W 个单元格的表格，每个单元格内都有不一样的文字信息，但是单元格格式基本上都是一样的，这里包括字体色、背景色、对齐方式等等格式。

我们可以将这样一个格式`CellStyle`作为享元对象，它的属性可能包括：

```ts
const enum HorizontalAlign {
  left = "left",
  center = "center",
  right = "right",
}

const enum VerticalAlign {
  top = "top",
  middle = "middle",
  bottom = "bottom",
}

interface ICellStyleProps {
  textColor: string;
  backgroundColor: string;
  horizontalAlign: HorizontalAlign;
  verticalAlign: VerticalAlign;
}
```

那么一个`CellStyle`对象则可能是这样的:

```ts
class CellStyle {
  private textColor: string;
  private backgroundColor: string;
  private horizontalAlign: HorizontalAlign;
  private verticalAlign: VerticalAlign;

  private constructor({
    textColor: string,
    backgroundColor: string,
    horizontalAlign: HorizontalAlign,
    verticalAlign: VerticalAlign,
  }) {
    this.textColor = textColor || "#000";
    this.backgroundColor = backgroundColor || "#fff";
    this.horizontalAlign = horizontalAlign || HorizontalAlign.left;
    this.verticalAlign = verticalAlign || VerticalAlign.middle;
  }

  get textColor() {
    return this.textColor;
  }

  get backgroundColor() {
    return this.backgroundColor;
  }

  get horizontalAlign() {
    return this.horizontalAlign;
  }

  get verticalAlign() {
    return this.verticalAlign;
  }
}
```

一个单元格可能是这样的：

```ts
class Cell {
  private row: number;
  private column: number;

  private cellStyle: CellStyle;
  private text: string;

  private constructor(
    row: number,
    column: number,
    text: string,
    cellStyle?: CellStyle
  ) {
    this.row = row;
    this.column = column;
    this.text = text;
    this.cellStyle = cellStyle || new CellSyle();
  }
}
```

由于单元格跟行列信息`row/column`挂钩，因此是无法完全享元的，那么 1W 个单元格的表格里可能有 1W 个`Cell`对象。同样的，每个`Cell`对象都有一个`CellStyle`对象，因此该表格同样会有 1W 个`CellStyle`对象。

但是`CellStyle`对象仅跟单元格的格式相关，我们可以考虑将`CellStyle`对象进行享元。

### 享元工厂

我们可以给`CellStyle`定义一个享元的`key`，当然这个`key`可以代表完全相同格式的`CellStyle`对象，并通过享元的方式创建对象：

```ts
class CellStyle {
  static pools: {
    [key: string]: CellStyle;
  } = {};

  static generateKey(
    textColor: string,
    backgroundColor: string,
    horizontalAlign: HorizontalAlign,
    verticalAlign: VerticalAlign
  ) {
    return `${textColor}-${backgroundColor}-${horizontalAlign}-${verticalAlign}`;
  }

  static newInstance(props: ICellStyleProps): CellStyle {
    const { textColor, backgroundColor, horizontalAlign, verticalAlign } =
      props;
    const key = CellStyle.generateKey(
      textColor,
      backgroundColor,
      horizontalAlign,
      verticalAlign
    );

    // 如果已有相同格式的对象，则使用享元对象
    const cellStyle = CellStyle.pools[key];

    // 如果没有，则创建享元对象，并添加到享元对象池子
    return cellStyle
      ? cellStyle
      : (CellStyle.pools[key] = new CellStyle(
          textColor,
          backgroundColor,
          horizontalAlign,
          verticalAlign
        ));
  }

  private textColor: string;
  private backgroundColor: string;
  private horizontalAlign: HorizontalAlign;
  private verticalAlign: VerticalAlign;

  private constructor(
    textColor: string,
    backgroundColor: string,
    horizontalAlign: HorizontalAlign,
    verticalAlign: VerticalAlign
  ) {
    this.textColor = textColor || "#000";
    this.backgroundColor = backgroundColor || "#fff";
    this.horizontalAlign = horizontalAlign || HorizontalAlign.left;
    this.verticalAlign = verticalAlign || VerticalAlign.middle;
  }

  get textColor() {
    return this.textColor;
  }

  get backgroundColor() {
    return this.backgroundColor;
  }

  get horizontalAlign() {
    return this.horizontalAlign;
  }

  get verticalAlign() {
    return this.verticalAlign;
  }
}
```

相比于`new CellStyle()`的方式创建对象，我们可以使用`CellStyle.newInstance()`的方式来创建:

```ts
const cellStyle = CellStyle.newInstance({
  textColor: "#000",
  backgroundColor: "#fff",
  horizontalAlign: HorizontalAlign.center,
  verticalAlign: VerticalAlign.top,
});
```

到这里，如果我们表格中 1W 个单元格的样式都是一样的，那么我们页面中只会存在一个`CellStyle`对象，大幅度减少了对象的创建和维护，降低了页面的内存占用，从而提升页面的性能。

当然，享元并不是万能的。前端性能优化的尽头往往是时间换空间、空间换时间，享元便是一个时间换空间的典型例子，我们通过`key`去获取对象时会比直接访问要多一步。

除此之外，享元对象需要十分注意对象的修改。由于对象是享元的，如果在使用的时候直接修改了，会导致许多引用到的地方都被修改。因此，一般建议通过`CellStyle.newInstance()`新建`CellStyle`对象的方式来进行修改。

最后其实还留了个小问题给小伙伴们想一想，`CellStyle`中颜色是字符串的形式提供的，但前端颜色表示可能不只有一个，比如`#000`、`#000000`和`rgb(0,0,0)`都是代表一种颜色，那么在`key`中如何让它们保持一致呢？

### 结束语

之前将性能优化都倾向于介绍比较大的解决方案，后面如果有时间的话，也会考虑一个个小的优化点拎出来简单讲讲，比如享元就是其中一个。

有时候一点小小的问题里，也会有许多学问可以学习的！
