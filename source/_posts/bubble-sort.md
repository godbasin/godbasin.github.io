---
title: 算法导论之js实现--冒泡排序
date: 2017-07-02 11:11:30
categories: js什锦
tags: 算法
---
冒泡排序的javascript实现。
<!--more-->

## 冒泡排序
-----
### 排序问题
- 输入：n个数的一个序列`<a1, a2, ..., an>`
- 输出：输入序列的一个排列`<a1', a2', ..., an'>`，满足`a1' <= a2' <= ... <= an'`

### 思路
1. 比较相邻的元素。如果第一个比第二个大，就交换他们两个。
2. 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对。在这一点，最后的元素应该会是最大的数。
3. 针对所有的元素重复以上的步骤，除了最后一个。
4. 持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。

### js实现
``` javascript
function bubbleSort(iArr) {
    // 交换函数
    function swap(arr, i, j) {
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    var n = iArr.length;
    // 从左边开始
    for (var i = 0; i < n; i++) {
        // 每次冒泡完毕，右侧新固定一个较大值
        for (var j = 1; j < n - i ; j++) {
            // 比较，交换大的于右侧
            if (iArr[j - 1] > iArr[j]) {
                swap(iArr, j - 1, j);
            } else {
                continue;
            }
        }
    }
    return iArr;
}
```

### 验证
``` javascript
insertionSort([5, 2, 4, 6, 1, 3]); 
// 输出[1, 2, 3, 4, 5, 6]

insertionSort([2, 1, 3, 1, 5]);
// 输出[1, 1, 2, 3, 5]

insertionSort([5, 2, 12, 2, 134, 1, 3, 34, 4, 6, 1, 3, 4]); 
// 输出[1, 1, 2, 2, 3, 3, 4, 4, 5, 6, 12, 34, 134]
```