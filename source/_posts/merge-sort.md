---
title: 算法导论之js实现--归并排序
date: 2017-07-15 11:43:58
categories: js什锦
tags: 算法
---
归并排序的javascript实现。
<!--more-->

## 归并排序
-----
### 排序问题
- 输入：n个数的一个序列`<a1, a2, ..., an>`
- 输出：输入序列的一个排列`<a1', a2', ..., an'>`，满足`a1' <= a2' <= ... <= an'`

### 思路
假设桌面上有两堆扑克牌，每堆都已排序，最小的牌在上，把这两堆牌合并成单一的排好序的输出堆。

对总输入堆进行处理：
1. 将扑克牌分成两堆，每堆重复步骤1~3排序
2. 在牌面朝上的两堆牌的顶上两张牌中选取最小的一张，放置到输出堆
3. 重复步骤2，直到一个输入堆为空
4. 将两堆扑克牌重复2~3，合成输出堆

### js实现
``` javascript
function mergeSort(iArr) {
    var n = iArr.length;
    // 若小于两位数，则按顺序排列后返回
    if (n === 2 && iArr[0] > iArr[1]) { return [iArr[1], iArr[0]]; }
    else if(n <= 2) { return iArr; }
    // 若大于两位数，则分成两组，递归处理
    else{
        var p = parseInt(n/2);
        var iArr1 = mergeSort(iArr.slice(0,p));
        var iArr2 = mergeSort(iArr.slice(p));
        var oArr = [];
        for(var i = 0; i< n; i++){
            if(iArr1.length && iArr2.length){
                // 比较最前两个数，取出较小的
                oArr.push(iArr1[0] <= iArr2[0] ? iArr1.splice(0, 1)[0] : iArr2.splice(0, 1)[0]);
            }else{
                // 若其中一组为空，则将另一组剩下的添加到输出尾部
                oArr = oArr.concat(iArr1.length === 0 ? iArr2 : iArr1);
                break;
            }
        }
        return oArr;
    }
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