---
title: 算法导论之js实现--快速排序
date: 2017-07-16 19:25:45
categories: js什锦
tags: 算法
---
快速排序的javascript实现。
<!--more-->

## 简单快速排序
-----
### 排序问题
- 输入：n个数的一个序列`<a1, a2, ..., an>`
- 输出：输入序列的一个排列`<a1', a2', ..., an'>`，满足`a1' <= a2' <= ... <= an'`

### 思路
快速排序使用分治法（Divide and conquer）策略来把一个序列（list）分为两个子序列（sub-lists）。

步骤为：
1. 从数列中挑出一个元素，称为"基准"（pivot），
2. 重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的摆在基准的后面（相同的数可以到任一边）。在这个分区结束之后，该基准就处于数列的中间位置。这个称为分区（partition）操作。
3. 递归地（recursive）把小于基准值元素的子数列和大于基准值元素的子数列排序。

递归的最底部情形，是数列的大小是零或一，也就是永远都已经被排序好了。虽然一直递归下去，但是这个算法总会结束，因为在每次的迭代（iteration）中，它至少会把一个元素摆到它最后的位置去。

### js基本思路实现
这里我们先使用两个数组分别保存“基准”左边、右边的子集。

``` javascript
function fakeQuickSort(iArr) {
    var n = iArr.length;
    // 若只有一个，则返回
    if (n <=1) { return iArr; }
    // 若有多个，则选择基准进行分组，递归处理
    else{
        var p = parseInt(n-1);
        var pivot = iArr[p];
        var leftArr = [], rightArr = [], arrVal;
        for(var i = 0; i < n-1; i++){
            arrVal = iArr[i];
            if(arrVal <= pivot){
                // 小于基准放置左侧
                leftArr.push(arrVal);
            }else{
                // 大于基准放置右侧
                rightArr.push(arrVal);
            }
        }
        // 递归计算左边、右边子集，将数组合并返回
        return fakeQuickSort(leftArr).concat([pivot].concat(fakeQuickSort(rightArr)));
    }
}
```

### 验证
``` javascript
fakeQuickSort([5, 2, 4, 6, 1, 3]); 
// 输出[1, 2, 3, 4, 5, 6]

fakeQuickSort([2, 1, 3, 1, 5]);
// 输出[1, 1, 2, 3, 5]

fakeQuickSort([5, 2, 12, 2, 134, 1, 3, 34, 4, 6, 1, 3, 4]); 
// 输出[1, 1, 2, 2, 3, 3, 4, 4, 5, 6, 12, 34, 134]
```

## 快速排序
---
### 原址排序
在排序算法中，如果输入数组中仅有常数个元素需要在排序过程中存储在数组之外，则称排序算法是原址的。

插入排序、堆排序、快速排序等都是原址排序。
归并排序不是原址的。

上面简单版本的缺点是，它需要Ω(n)的额外存储空间，也就跟归并排序一样不好。额外需要的存储器空间配置，在实际上的实现，也会极度影响速度和缓存的性能。有一个比较复杂使用原地（in-place）分区算法的版本，且在好的基准选择上，平均可以达到O(log n)空间的使用复杂度。

### 快速排序思路
上面我们移动位置是通过建立新的子集数组伪装的，这里我们则需要实现真正的位置交换。

- 获取基准值
- 将低于基准值的排列在左侧，剩下的排列在右侧
- 分别对左侧和右侧进行递归排序

这是原址排序算法，它分区了标示为"左边（left）"和"右边（right）"的序列部分，借由移动小于a[pivotIndex]的所有元素到子序列的开头，留下所有大于或等于的元素接在他们后面。
在这个过程它也为基准元素找寻最后摆放的位置，也就是它回传的值。它暂时地把基准元素移到子序列的结尾，而不会被前述方式影响到。

由于算法只使用交换，因此最后的数列与原先的数列拥有一样的元素。要注意的是，一个元素在到达它的最后位置前，可能会被交换很多次。

参考[快速排序-wiki](https://zh.wikipedia.org/wiki/%E5%BF%AB%E9%80%9F%E6%8E%92%E5%BA%8F)

### js基本思路实现
``` javascript
// 交换数组值
function swap(arr, a, b) {
    if(a == b){return;}
    var c = arr[a];
    arr[a] = arr[b];
    arr[b] = c;
}

function quickSort(iArr, start, end) {
    var n = end - start;
    // 若只有一个或者没有，则返回
    if (n <= 1) { return; }
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
        // 递归排序左侧
        quickSort(iArr, start, leftIndex);
        // 递归排序右侧
        quickSort(iArr, leftIndex + 1, end);
        return iArr;
    }
}
```

### 验证
``` javascript
quickSort([5, 2, 4, 6, 1, 3], 0, 6); 
// 输出[1, 2, 3, 4, 5, 6]

quickSort([2, 1, 3, 1, 5], 0, 5);
// 输出[1, 1, 2, 3, 5]

quickSort([5, 2, 12, 2, 134, 1, 3, 34, 4, 6, 1, 3, 4], 0, 13); 
// 输出[1, 1, 2, 2, 3, 3, 4, 4, 5, 6, 12, 34, 134]
```
