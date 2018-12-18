---
title: three.js笔记3--添加光源
date: 2017-04-22 19:09:19
categories: three.js奶茶
tags: 笔记
---
Three.js是一个3D库，《three.js笔记》系列是在使用three.js中的一些过程和笔记。
本文介绍光源的分类，并记录往场景中添加光源的基本过程。
<!--more-->
## 光源(Light)
-----
### 概要
Three.js提供了包括多种光源： 
- 环境光(AmbientLight)
- 点光源(PointLight)
- 聚光灯(SpotLight)
- 平行光(DirectionalLight)
- 半球光(HemisphereLight)

在Three.js中，能形成阴影的光源只有`THREE.DirectionalLight`与`THREE.SpotLight`。而相对地，能表现阴影效果的材质只有`THREE.LambertMaterial`与`THREE.PhongMaterial`。

### 环境光(AmbientLight)
环境光是指场景整体的光照效果，是由于场景内若干光源的多次反射形成的亮度一致的效果，通常用来为整个场景指定一个基础亮度，弱化阴影或添加一些颜色。
通过更改环境光的颜色可以感受环境光颜色的变化对于在场景中的物体渲染结果的变化。

因此，环境光没有明确的光源位置，在各处形成的亮度也是一致的。

在设置环境光时，只需要指定光的颜色。

创建环境光并将其添加到场景中的完整做法是：

``` javascript
var light = new THREE.AmbientLight(0xffffff);
scene.add(light);
```


### 点光源(PointLight)
点光源是不计光源大小，可以看作一个点发出的光源。点光源照到不同物体表面的亮度是线性递减的，因此，离点光源距离越远的物体会显得越暗。

单点发光，就类似于丢在空中的照明弹，该点往四面八方各个方向发光。

创建点光源并将其添加到场景中的完整做法是：

``` javascript
var light = new THREE.PointLight(0xffffff, 2, 100);
light.position.set(0, 1.5, 2);
scene.add(light);
```

点光源不能产生阴影，这样的光源会朝着所有的方向发射光线，在这种情况下计算阴影对GPU来讲是一个非常沉重的负担。

### 聚光灯(SpotLight)
聚光灯是一种特殊的点光源，它能够朝着一个方向投射光线。
聚光灯投射出的是类似圆锥形的光线，这与我们现实中看到的聚光灯是一致的。

其构造函数为：`THREE.SpotLight(hex, intensity, distance, angle, exponent)`。

相比点光源，多了`angle`和`exponent`两个参数。`angle`是聚光灯的张角，缺省值是`Math.PI / 3`，最大值是`Math.PI / 2`；`exponent`是光强在偏离`target`的衰减指数（`target`需要在之后定义，缺省值为(0, 0, 0)），缺省值是10。

在调用构造函数之后，除了设置光源本身的位置，一般还需要设置target：

``` javascript
light.position.set(x1, y1, z1);
light.target.position.set(x2, y2, z2);
```

除了设置light.target.position的方法外，如果想让聚光灯跟着某一物体移动（就像真的聚光灯！），可以target指定为该物体。

### 平行光(DirectionalLight)
对于任意平行的平面，平行光照射的亮度都是相同的，而与平面所在位置无关。

平行光所有对象接收的光强都是一样的，会产生阴影。
与聚点光源的主要差别是：聚点光源光距离目标越远光越暗淡，而平行光光强都是一样的。

对于平行光而言，设置光源位置尤为重要。

``` javascript
var light = new THREE.DirectionalLight();
light.position.set(2, 5, 3);
scene.add(light);
```

### 参考
- [《Three.js入门指南》](http://www.ituring.com.cn/minibook/792)
- [《THREE.JS中常用的4种光源》](http://www.2cto.com/kf/201605/507002.html)


## 向场景中添加光源
---
### 添加聚光灯光源
``` javascript
// 添加聚光灯光源
function initLight() {
    var light = new THREE.SpotLight(0xffffff);
    light.position.set(0, -3, 4);
    light.target = floor; // 投射方向指向地板
    scene.add(light);
}
initLight();
```

如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1486894019%281%29.png)

可见添加光源之后，我们就可以看到我们的物体了，包括贴上图片材质的cube酱们。

### 添加阴影
前面我们说过，能形成阴影的光源只有`THREE.DirectionalLight`与`THREE.SpotLight`。

而相对地，能表现阴影效果的材质只有`THREE.LambertMaterial`与`THREE.PhongMaterial`。

添加阴影我们需要以下步骤：
1. 对光源启用阴影
2. 对被照射的物体启用阴影的产生
3. 对投射的物体启用接受阴影

``` javascript
// 对cube启用阴影的产生
cube.castShadow = true; 

// 对floor接受阴影
floor.receiveShadow = true;

// 光源设置
light.castShadow = true;
// 光源的阴影设置
light.shadow.mapSize.width = 512;  // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5;       // default
light.shadow.camera.far = 500      // default
```

如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1486894379%281%29.png)

可见我们光源照射到cube酱们的阴影投射到了地板上。

光源阴影的设置：
- `shadow.mapSize.width`：阴影映射宽度
- `shadow.mapSize.height`：阴影映射高度
- `shadow.camera.near`:投影近点，距离光源多近能产生阴影
- `shadow.camera.far`：投影远点，到哪一点为止不再产生阴影 
- `shadow.camera.fov`：投影视场，聚光的角度大小

我们还可以开启光源阴影的辅助：

``` javascript
var helper = new THREE.CameraHelper(light.shadow.camera);
scene.add(helper);
```

如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1486894648%281%29.png)

### 完整代码
``` javascript
// 设置场景
var scene = new THREE.Scene()

// 创建正交投影照相机
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, -5, 2)
camera.lookAt(scene.position)

// 定义着色器
var renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
    // 告诉渲染器渲染阴影
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// 添加地板
function initFloor() {
    var floorGeo = new THREE.PlaneBufferGeometry(12, 8, 1, 1)
    var floorMaterial = new THREE.MeshStandardMaterial({ color: '#aaaaaa' })
    var floor = new THREE.Mesh(floorGeo, floorMaterial)
    floor.position.set(0, 0, -1)
    floor.receiveShadow = true; // 接受阴影
    scene.add(floor)
    return floor
}
var floor = initFloor()

// 添加物体
function initCube(imageUrl) {
    var geometry = new THREE.BoxGeometry(1, 1, 1)
    var material
    if (imageUrl) {
        material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture(imageUrl)
        })
    } else {
        material = new THREE.MeshLambertMaterial()
    }
    var cube = new THREE.Mesh(geometry, material)
    cube.castShadow = true; // 要产生阴影
    scene.add(cube)
    return cube
}
// 添加物体
var cube1 = initCube('./img/1.jpg')
var cube2 = initCube('./img/2.png')
var cube3 = initCube()
var cube4 = initCube()
cube1.position.set(2, 0, 0)
cube2.position.set(-2, 0, 0)
cube3.position.set(0, -2, 1)
cube4.position.set(1, 1, 3)

// 添加聚光灯光源
function initLight() {
    var light = new THREE.SpotLight(0xffffff)
    light.position.set(0, -3, 4)
    light.target = floor; // 投射方向指向地板
    light.castShadow = true; // 用于产生阴影
    scene.add(light)
        // 光源的阴影设置
    light.shadow.mapSize.width = 512 // default
    light.shadow.mapSize.height = 512 // default
    light.shadow.camera.near = 0.5 // default
    light.shadow.camera.far = 500 // default
    var helper = new THREE.CameraHelper(light.shadow.camera)
    scene.add(helper)
}
initLight()

// 让世界动起来
function render() {
    requestAnimationFrame(render)

    // 此处可添加动画处理
    cube1.rotation.x += 0.03
    cube1.rotation.y += 0.03

    cube2.rotation.x += 0.02
    cube3.rotation.y += 0.01
    cube4.rotation.x -= 0.04

    renderer.render(scene, camera)
}
render()
```

## 结束语
-----
这节主要讲了光源的几个分类（环境光、平行光、点光源、聚光灯），并记录往场景中添加光源，然后产生阴影的基本过程。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/three-notes/3-add-light-source)
[此处查看页面效果](http://three-notes.godbasin.com/three-notes-3-add-light-source/index.html)