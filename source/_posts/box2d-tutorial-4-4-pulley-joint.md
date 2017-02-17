---
title: Box2DJS教程4-4--滑轮关节(pulley-joint)
date: 2017-02-17 21:00:17
categories: box2djs方糖
tags: 教程
---
本节主要介绍滑轮关节(pulley-joint)。
<!--more-->

## 滑轮关节(pulley-joint)
-----
### 说明
滑轮关节用于模拟定滑轮或动滑轮，即由滑轮关节连接的两个物体就像由绳子和滑轮连在一起一样。

在此，简单介绍动滑轮的特点，使用动滑轮能省一半力，但是费距离。
这是因为使用动滑轮时，物体由两段绳子吊着，每段绳子只承担钩码重的一半。使用动滑轮虽然省了力，但是动力移动的距离是钩码升高的距离的2倍，即费了距离。

一般可以简单地套用公式来计算F和G的关系：
`F=(G+G动滑轮）/n`
对于滑轮组，n代表接在动滑轮上的绳子的段数，而比例系数ratio即是n。

### b2PulleyJointDef
创建好物体之后，用基类b2PulleyJointDef创建一个滑轮关节，然后分别设置其连接的是哪两个物体及其锚点，连接绳子顶点，两物体绳子最大长度及比例系数等参数即可。

``` javascript
var jointDefPulley = new b2PulleyJointDef();     //创建一个滑轮关节jointDefPulley
jointDefPulley.body1 = Body1;     //滑轮关节的一端连接在Body1上
jointDefPulley.body2 = Body2;     //滑轮关节的另一端连接在Body2上
jointDefPulley.anchorPoint1=Body1.GetCenterPosition();    //滑轮关节与Body1的连接点是Body1的中心位置
jointDefPulley.anchorPoint2=Body2.GetCenterPosition();    //滑轮关节与Body2的连接点是Body2的中心位置
var groundPoint1=new b2Vec2(850, 345); 
var groundPoint2=new b2Vec2(950, 365); 
jointDefPulley.groundPoint1=groundPoint1;
jointDefPulley.groundPoint2=groundPoint2;     //用b2Vec2创建两个矢量，然后赋值给groundPoint，设定两段绳子的顶点
jointDefPulley.maxLength1=300;         
jointDefPulley.maxLength2=100;    //设定滑轮两侧的绳子的最大长度
                                  //这两个maxLength至少有一个要大于|groundPoint-anchorPoint|   jointDefPulley.ratio=1; 
                                  //设定滑轮关节的比例系数，body1上下移动S，body2上下移动S/ratio，当ratio不等于1时，即模拟有动滑轮的情况

var jointPulley= world.CreateJoint(jointDefPulley);    //将滑轮关节放到世界内
```


### [返回总目录](/2017/02/17/box2d-tutorial-0-catalog/) 