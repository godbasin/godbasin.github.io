---
title: 算法导论之js实现--快速选择
date: 2017-07-29 15:57:36
categories: js什锦
tags: 算法
---
快速选择（Quick-Select）的javascript实现。
<!--more-->

## 快速选择
-----
### 问题
- 输入：n个数的一个序列`<a1, a2, ..., an>`
- 输出：找到第k个最小数字的元素

### 快速选择
快速选择（Quickselect）是一种从无序列表找到第k小元素的选择算法。它从原理上来说与快速排序有关。

快速选择的总体思路与快速排序一致，选择一个元素作为基准来对元素进行分区，将小于和大于基准的元素分在基准左边和右边的两个区域。不同的是，快速选择并不递归访问双边，而是只递归进入一边的元素中继续寻找。这降低了平均时间复杂度，从`O(n log n)`至`O(n)`，不过最坏情况仍然是`O(n2)`。

与快速排序一样，快速选择一般是以原地算法的方式实现，除了选出第k小的元素，数据也得到了部分地排序。

### 思路
1. 从数列中挑出一个元素，称为"基准"（pivot）。
2. 重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的摆在基准的后面（相同的数可以到任一边）。在这个分区结束之后，该基准就处于数列的中间位置。
3. 判断第k个最小元素位于左侧还是右侧，然后对该侧进行递归。

- 参考[快速选择-wiki](https://zh.wikipedia.org/wiki/%E5%BF%AB%E9%80%9F%E9%80%89%E6%8B%A9)

### js基本思路实现
``` javascript
// 交换数组值
function swap(arr, a, b) {
    if (a == b) { return; }
    var c = arr[a];
    arr[a] = arr[b];
    arr[b] = c;
}

function quickSelect(iArr, start, end, k) {
    var n = end - start;
    // 若只有一个或者没有，则返回
    if (n <= 1) { return iArr[start]; }
    // 若有多个，则选择基准进行位置调整，递归处理
    else {
        var p = end - 1; // 选取最后一个作为基准
        var pivot = iArr[p]; // 获取基准值
        var leftIndex = start; // 记录左侧列表位置
        for (var i = 0; i < n - 1; i++) {
            arrVal = iArr[start + i];
            // 若小于基准，则排列在左侧
            if (arrVal <= pivot) {
                swap(iArr, leftIndex++, start + i)
            }
            // 若大于基准，继续
        }
        // 交换基准至中间
        swap(iArr, leftIndex, p);
        if (leftIndex > k - 1) {
            // 若k < 基准位置，递归排序左侧
            return quickSelect(iArr, start, leftIndex, k);
        } else if (leftIndex < k - 1) {
            // 若k > 基准位置，递归排序右侧
            return quickSelect(iArr, leftIndex + 1, end, k);
        } else {
            // 若k = 基准位置，返回
            return iArr[k - 1];
        }
    }
}
```