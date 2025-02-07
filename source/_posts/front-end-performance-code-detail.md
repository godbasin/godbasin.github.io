---
title: 前端性能优化--代码习惯
date: 2024-12-27 23:25:12
categories: 前端解决方案
tags: 性能优化
---

大多数情况下，前端很少遇到性能瓶颈。但如果在大型前端项目、数据量百万千万的场景下，有时候一些毫不起眼的代码习惯也可能会带来性能问题。

今天来简单介绍几种，大家在写代码的时候也可以注意。

## 代码细节与性能

### 减少函数拆解

很多时候，为了提高代码复用率以及提升代码可读性，我们习惯地将一些相同逻辑的代码进行抽离，比如下述的代码：

```ts
/**
 * 检查两个范围是否有相交
 */
function checkTwoDimensionCross(
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean {
  return !(startA > endB || endA < startB);
}

/**
 * 检查两个列范围是否有相交
 */
function checkTwoColRangesCross(
  colRangeA: [number, number],
  colRangeB: [number, number]
): boolean {
  const [startColA, endColA] = colRangeA;
  const [startColB, endColB] = colRangeB;

  return checkTwoDimensionCross(startColA, endColA, startColB, endColB);
}

/**
 * 检查两个行范围是否有相交
 */
export function checkTwoRowRangeCross(
  areaA: { rowStart: number; rowEnd: number },
  areaB: { rowStart: number; rowEnd: number }
): boolean {
  return checkTwoDimensionCross(
    areaA.rowStart,
    areaA.rowEnd,
    areaB.rowStart,
    areaB.rowEnd
  );
}
```

在该代码中，由于行范围和列范围的类型不一致，但为了逻辑判断一致性和方便管理，我们抽离了`checkTwoDimensionCross`方法，用于判断两个一维的范围是否相交。

大多数情况下，考虑代码可读性，也比较推荐这种写法。但如果在十万百万次调用的函数方法里，多一层的函数就需要多一层调用栈的开销，其中性能的影响不可小觑。因此，我们可以将拆出去的函数合并回来：

```ts
/**
 * 检查两个行范围是否有相交
 */
export function checkTwoRowRangeCross(
  areaA: IRowRange,
  areaB: IRowRange
): boolean {
  return !(areaA.rowStart > areaB.rowEnd || areaA.rowEnd < areaB.rowStart);
}

/**
 * 检查两个列范围是否有相交
 */
function checkTwoColRangesCross(
  colRangeA: IColRange,
  colRangeB: IColRange
): boolean {
  const [startColA, endColA] = colRangeA;
  const [startColB, endColB] = colRangeB;

  return !(startColA > endColB || endColA < startColB);
}
```

### if else 或许性能更优

有时候我们为了偷懒，喜欢使用语法糖来缩减代码的编写，比如说判断两个字符串数组是否内容一致：

```ts
/**
 * 判断两个字符串数组是否内容一致
 */
function isStringArrayTheSame(
  stringArrayA: string[],
  stringArrayB: string[]
): boolean {
  return stringArrayA.sort().join(",") === stringArrayB.sort().join(",");
}
```

但同样的，假设这个方法被调用十万百万次，性能问题可能就会变得是否明显，不管是`sort`还是数组拼接成字符串都会有一定开销。这种情况下我们可以这么写：

```ts
/**
 * 使用场景为数组内的字符串不会重复
 */
function isStringArrayTheSame(
  stringArrayA: string[],
  stringArrayB: string[]
): boolean {
  // 数量不一致，肯定不同
  if (stringArrayA.length !== stringArrayB.length) return false;

  // 相同数量时，A 的每一个都应该存在 B 中，才完全一致
  for (const type of stringArrayA) {
    if (!stringArrayB.includes(type)) return false;
  }

  return true;
}
```

下面这种偷懒写法也是:

```ts
// bad
function mergeStringArray(
  stringArrayA: string[],
  stringArrayB: string[]
): string[] {
  return Array.from(new Set(stringArrayA.concat(stringArrayB)));
}

// good
// 使用场景为单数组内的字符串不会重复
function mergeStringArray(
  stringArrayA: string[],
  stringArrayB: string[]
): string[] {
  const newStringArray = [].concat(stringArrayA);
  stringArrayB.forEach((type) => {
    if (!newStringArray.includes(type)) newStringArray.push(type);
  });
  return newStringArray;
}
```

### 低性能消耗代码判断提前

`if...else`写法也有很多注意事项，最简单的莫过于尽量使执行代码提前`return`。假设我们现在有这样的代码：

```ts
function test(arrayA: string[], arrayB: string[]): boolean {
  if (costTimeFunction(arrayA, arrayB) || noCostTimeFunction(arrayA, arrayB)) {
    testCodeA();
  } else {
    testCodeB();
  }
}
```

这样写看起来没什么问题，但假设已知`costTimeFunction`函数执行会有一定的性能消耗，那么在数组长度很大、调用次数很多的情况下，我们可以将耗时较少的函数放在前面执行：

```ts
function test(arrayA: string[], arrayB: string[]): boolean {
  if (noCostTimeFunction(arrayA, arrayB) || costTimeFunction(arrayA, arrayB)) {
    testCodeA();
    // 提前 retrun 可以简化代码复杂度
    return;
  }
  testCodeB();
}
```

### 结束语

虽然这些都是很细节的事情，有时候写代码甚至注意不到，但如果养成了思考代码性能的习惯，就可以写出更高效执行的代码。

实际上，除了简单的代码习惯以外，更多时候我们的性能问题也往往出现在不合理的代码执行流程里，这种就跟项目关系紧密，不在这里介绍啦。
