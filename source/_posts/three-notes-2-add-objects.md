---
title: three.js笔记2--添加物体
date: 2017-04-16 11:34:59
categories: three.js奶茶
tags: 笔记
---
Three.js是一个3D库，《three.js笔记》系列是在使用three.js中的一些过程和笔记。
本文介绍物体的几何形状和材质等，并记录往场景中添加物体的基本过程。
<!--more-->
## 物体(Object)
-----
### 概要
上一节我们创建了一个初始化的3D世界，这一节我们将会往该世界中添加物体。

最常用的一种物体就是网格(Mesh)，网格是由顶点、边、面等组成的物体；其他物体包括线段(Line)、骨骼(Bone)、粒子系统(ParticleSystem，后命名为Points，其实就是一堆点的集合)等。

在创建物体时，需要传入两个参数，一个是几何形状(Geometry)，另一个是材质(Material)。

其中，几何形状决定了物体的顶点位置等信息，材质决定了物体的颜色、纹理等信息。

### 几何形状(Geometry)
几何形状(Geometry)最主要的功能是储存了一个物体的顶点信息，通过存储模型用到的点集和点间关系(哪些点构成一个三角形)来达到描述物体形状的目的。 

WebGL需要程序员指定每个顶点的位置，而在Three.js中，可以通过指定一些特征来创建几何形状。

Three提供了立方体(其实是长方体)、平面(其实是长方形)、球体、圆形、圆柱、圆台等许多基本形状。
也可以通过自己定义每个点的位置来构造形状。
对于比较复杂的形状，我们还可以通过外部的模型文件导入。

### 材质(Material)
材质(Material)是独立于物体顶点信息之外的与渲染效果相关的属性。通过设置材质可以改变物体的颜色、纹理贴图、光照模式等。

- 基本材质(BasicMaterial)
  - 使用基本材质(BasicMaterial)的物体，渲染后物体的颜色始终为该材质的颜色，而不会由于光照产生明暗、阴影效果。
  - 如果没有指定材质的颜色，则颜色是随机的。

- Lambert材质(MeshLambertMaterial)
  - Lambert材质(MeshLambertMaterial)是符合Lambert光照模型的材质
  - Lambert光照模型的主要特点是只考虑漫反射而不考虑镜面反射的效果，因而对于金属、镜子等需要镜面反射效果的物体就不适应，对于其他大部分物体的漫反射效果都是适用的

- Phong材质(MeshPhongMaterial)
  - Phong材质(MeshPhongMaterial)是符合Phong光照模型的材质
  - 和Lambert不同的是，Phong模型考虑了镜面反射的效果，因此对于金属、镜面的表现尤为适合

- 法向材质(MeshNormalMaterial)
  - 法向材质(MeshNormalMaterial)可以将材质的颜色设置为其法向量的方向，有时候对于调试很有帮助
  - 材质的颜色与照相机与该物体的角度相关

- 材质的纹理贴图
  - 使用图像作为材质，就需要导入图像作为纹理贴图，并添加到相应的材质中

### 参考
- [《Three.js入门指南》](http://www.ituring.com.cn/minibook/792)


## 向场景中添加物体
---
### 添加地板
``` javascript
// 添加地板
function initFloor() {
    var floorGeo = new THREE.PlaneBufferGeometry(12, 8, 1, 1);
    var floorMaterial = new THREE.MeshBasicMaterial({ color: '#aaaaaa' });
    var floor = new THREE.Mesh(floorGeo, floorMaterial);
    floor.position.set(0, 0, -1);
    scene.add(floor);
}
initFloor();
```

如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1486885952%281%29.png)

### 添加正方体
这里我们简单设计一个生成正方体的函数，当传入路径时则设置为材质的纹理贴图：

``` javascript
// 添加物体
function initCube(imageUrl) {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material;
    if (imageUrl) {
        material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture(imageUrl)
        });
    } else {
        material = new THREE.MeshLambertMaterial();
    }
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    return cube;
}
```

然后，我们添加几个正方体到场景中：

``` javascript
// 添加物体
var cube1 = initCube('./img/1.jpg');
var cube2 = initCube('./img/2.png');
var cube3 = initCube();
var cube4 = initCube();
cube1.position.set(2, 0, 0);
cube2.position.set(-2, 0, 0);
cube3.position.set(0, -2, 1);
cube4.position.set(1, 1, 3);
```

如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1486887050%281%29.png)

这里小伙伴们或许觉得奇怪，为什么正方体是黑色的呢，明明都已经添加材质纹理了呀。

这里我们使用的是Lambert材质，对光学有些了解的我们会知道，若没有光照射的时候，这些物体是没有反射的光，所以我们是看不到它们的颜色的。

而对于地板，由于我们使用的是基本材质。
前面也说过，使用基本材质的物体，渲染后物体的颜色始终为该材质的颜色，而不会由于光照产生明暗、阴影效果。故这里我们是可以看到地板的颜色的。

### 让物体动起来
上一节[《three.js笔记1--初始化3D世界》](https://godbasin.github.io/2017/04/13/three-notes-1-init-3d-world/)我们也说过，我们在动画渲染的时候可以添加动画处理，这样我们就能看到动画似的效果。

``` javascript
// 让世界动起来
function render() {
    requestAnimationFrame(render);

    // 此处可添加动画处理
    cube1.rotation.x += 0.03;
    cube1.rotation.y += 0.03;

    cube2.rotation.x += 0.02;
    cube3.rotation.y += 0.01;
    cube4.rotation.x -= 0.04;

    renderer.render(scene, camera);
};
render();
```

这时候我们虽然看不到正方体的颜色，但是我们能看到它们已经动起来了。


### 完整代码
``` javascript
// 设置场景
var scene = new THREE.Scene();

// 创建正交投影照相机
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, -5, 2);
camera.lookAt(scene.position);

// 定义着色器
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 添加地板
function initFloor() {
    var floorGeo = new THREE.PlaneBufferGeometry(12, 8, 1, 1);
    var floorMaterial = new THREE.MeshBasicMaterial({ color: '#aaaaaa' });
    var floor = new THREE.Mesh(floorGeo, floorMaterial);
    floor.position.set(0, 0, -1);
    scene.add(floor);
}
initFloor();

// 添加物体
function initCube(imageUrl) {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material;
    if (imageUrl) {
        material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture(imageUrl)
        });
    } else {
        material = new THREE.MeshLambertMaterial();
    }
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    return cube;
}
// 添加物体
var cube1 = initCube('./img/1.jpg');
var cube2 = initCube('./img/2.png');
var cube3 = initCube();
var cube4 = initCube();
cube1.position.set(2, 0, 0);
cube2.position.set(-2, 0, 0);
cube3.position.set(0, -2, 1);
cube4.position.set(1, 1, 3);

// 让世界动起来
function render() {
    requestAnimationFrame(render);

    // 此处可添加动画处理
    cube1.rotation.x += 0.03;
    cube1.rotation.y += 0.03;

    cube2.rotation.x += 0.02;
    cube3.rotation.y += 0.01;
    cube4.rotation.x -= 0.04;

    renderer.render(scene, camera);
};
render();
```

## 结束语
-----
这节主要讲了在初始化完毕后的3D世界中添加物体，由于Lambert材质的物体为漫反射物体，故我们需要在添加光源之后才能看到它们的效果。下一节将介绍光源的添加。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/three-notes/2-add-objets)
[此处查看页面效果](http://three-notes.godbasin.com/three-notes-2-add-objects/index.html)