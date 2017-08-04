---
title: 算法导论之js实现--堆排序
date: 2017-07-23 16:07:16
categories: js什锦
tags: 算法
---
堆排序的javascript实现。
<!--more-->

## 堆排序
-----
### 排序问题
- 输入：n个数的一个序列`<a1, a2, ..., an>`
- 输出：输入序列的一个排列`<a1', a2', ..., an'>`，满足`a1' <= a2' <= ... <= an'`

### 堆
堆（二叉堆）可以视为一棵完全的二叉树，完全二叉树的一个“优秀”的性质是，除了最底层之外，每一层都是满的，这使得堆可以利用数组来表示（普通的一般的二叉树通常用链表作为基本容器表示），每一个结点对应数组中的一个元素。

二叉堆一般分为两种：最大堆和最小堆。

- 最大堆：
  - 最大堆中的最大元素值出现在根结点（堆顶）
  - 堆中每个父节点的元素值都大于等于其孩子结点（如果存在）

- 最小堆：
  - 最小堆中的最小元素值出现在根结点（堆顶）
  - 堆中每个父节点的元素值都小于等于其孩子结点（如果存在）

通常堆是通过一维数组来实现的。在数组起始位置为0的情形中：
> 父节点i的左子节点在位置`(2*i+1)`
> 父节点i的右子节点在位置`(2*i+2)`
> 子节点i的父节点在位置`floor((i-1)/2)`

### 思路
堆排序就是把最大堆堆顶的最大数取出，将剩余的堆继续调整为最大堆，再次将堆顶的最大数取出，这个过程持续到剩余数只有一个时结束。在堆中定义以下几种操作：
- 最大堆调整（Max-Heapify）：将堆的末端子节点作调整，使得子节点永远小于父节点
- 创建最大堆（Build-Max-Heap）：将堆所有数据重新排序，使其成为最大堆
- 堆排序（Heap-Sort）：移除位在第一个数据的根节点，并做最大堆调整的递归运算

参考[堆排序-wiki](https://zh.wikipedia.org/wiki/%E5%A0%86%E6%8E%92%E5%BA%8F)

### js基本思路实现
``` javascript
function swap(arr, a, b) {
    if (a == b) { return; }
    var c = arr[a];
    arr[a] = arr[b];
    arr[b] = c;
}

function heapSort(iArr) {
    var n = iArr.length;
    // 若只有一个或者没有，则返回
    if (n <= 1) { return iArr; }
    // 若有多个，则建最大堆
    else {
        // 建堆（Build-Max-Heap）
        for (var i = Math.floor(n / 2); i >= 0; i--) {
            maxHeapify(iArr, i, n);
        }
        // 堆排序
        for (var j = 0; j < n; j++) {
            swap(iArr, 0, n - 1 - j)
            maxHeapify(iArr, 0, n - 2 - j);
        }
        return iArr;
    }
}

function maxHeapify(Arr, i, size) {
    var l = 2 * i + 1, r = 2 * i + 2; // 左子节点为2i + 1，右子节点为2i + 2
    var largest = i;
    // 若子节点比节点大，则标记
    if (l <= size && Arr[l] > Arr[largest]) {
        largest = l;
    }
    if (r <= size && Arr[r] > Arr[largest]) {
        largest = r;
    }
    // 若标记有子节点，则交换父子位置，并递归计算
    if (largest !== i) {
        swap(Arr, i, largest);
        maxHeapify(Arr, largest, size);
    }
}
```

### 验证
``` javascript
heapSort([5, 2, 4, 6, 1, 3]); 
// 输出[1, 2, 3, 4, 5, 6]

heapSort([2, 1, 3, 1, 5]);
// 输出[1, 1, 2, 3, 5]

heapSort([5, 2, 12, 2, 134, 1, 3, 34, 4, 6, 1, 3, 4]); 
// 输出[1, 1, 2, 2, 3, 3, 4, 4, 5, 6, 12, 34, 134]
```