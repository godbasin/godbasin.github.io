---
title: 算法导论之js实现--分治法求最大子数组
date: 2017-07-30 16:16:09
categories: js什锦
tags: 算法
---
分治法求最大子数组的javascript实现。
<!--more-->

## 分治法求最大子数组
-----
### 分治法
分治策略递归求解一个问题，在每层递归中：
- 分解(Divide)步骤：将问题划分未一些子问题，子问题的形式与原问题一样，只是规模更小
- 解决(Conquer)步骤：递归地求解出子问题。如果子问题的规模足够小，则停止递归，直接求解
- 合并(Combine)步骤：将子问题的解组合成原问题的解

### 最大子数组问题
求数组的和最大的非空连续子数组，即最大子数组。

### 分治策略思路
将子数组划分为两个规模尽量相等的子数组，`A[low, ..., high]`的一个最大子数组`A[i, .., j]`所处的位置必然是三种情况之一：
- 完全位于子数组`A[low, ..., mid]`中，`low <= i <= j <= mid`
- 完全位于子数组`A[mid + 1, ..., high]`中，`mid <= i <= j <= high`
- 跨越了中点，`low <= i <= mid < j <= high`

可递归求解`A[low, ..., mid]`和`A[mid + 1, ..., high]`。

求解跨越中点的最大子数组的思路： 
1. 循环求出`A[i, ..., mid]`以及`A[mid + 1, ..., j]`的最大和
2. 合并返回左侧和右侧最大和

### js实现
``` javascript
function findMaxSubarray(iArr, low, high) {
    // 求解跨越中点的最大子数组
    function findMaxCrossingSubarray(arr, low, mid, high) {
        var leftSum = arr[mid];
        var rightSum = arr[mid + 1];
        var left = mid,
            right = mid + 1;
        // 遍历左侧，找出左侧最大和
        for (var i = mid, sum = 0; i >= low; i--) {
            sum += arr[i];
            if (sum > leftSum) {
                leftSum = sum;
                left = i;
            }
        }
        // 遍历右侧，找出右侧最大和
        for (var j = mid + 1, sum = 0; j <= high; j++) {
            sum += arr[j];
            if (sum > rightSum) {
                rightSum = sum;
                right = j;
            }
        }
        return [leftSum + rightSum, left, right];
    }
    
    if (high === low) {
        // 若只有一个数，返回该数
        return [iArr[low], low, high];
    } else {
        // 取中间数
        var mid = parseInt((high + low) / 2);
        // 递归求左侧最大子数组
        var result1 = findMaxSubarray(iArr, low, mid);
        // 递归求右侧最大子数组
        var result2 = findMaxSubarray(iArr, mid + 1, high);
        // 求跨越中点的最大子数组
        var result3 = findMaxCrossingSubarray(iArr, low, mid, high);
        
        // 比较三个子数组，然后返回最大
        if (result1[0] > result2[0] && result1[0] > result3[0]) {
            return result1;
        } else if (result1[0] > result2[0]) {
            return result3;
        } else {
            return result3[0] > result2[0] ? result3 : result2;
        }
    }
}
```

### 验证
``` javascript
var inputArr = [13, -3, -25, 20, -3, -16, -23, 18, 20, -7, 12, -5, -22, 15, -4, 7];
findMaxSubarray(inputArr, 0, inputArr.length - 1);
// 输出[43, 7, 10]，即最大和43，子数组为inputArr[7, 10]
```