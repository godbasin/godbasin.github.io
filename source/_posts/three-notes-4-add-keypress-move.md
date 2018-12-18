---
title: three.js笔记4--添加按键移动
date: 2017-04-23 09:46:10
categories: three.js奶茶
tags: 笔记
---
Three.js是一个3D库，《three.js笔记》系列是在使用three.js中的一些过程和笔记。
本文记录添加按键事件，来控制照相机前后左右移动的基本过程。
<!--more-->
## 添加移动控制
-----
### 基本思路
这里我们将添加按键的处理，来控制第一人称（照相机）的移动，基本思路为：
- 添加监听事件
- 进行按键处理
- 进行照相机移动

### 添加监听事件
``` javascript
// 添加按键时走动
document.addEventListener('keydown', handleKeyDown, false);
```

这里我们监听的是`keydown`事件，键盘事件有三个，事件执行的顺序是： keydown->keypress->keyup。

但是连续按一个按键的话，会一直触发：keydown keypress。直到你提起按键，会触发keyup。

而这里我们不使用keypress，是因为keypress对: shift、ctrl、上下键等非字符的输入不会触发。

### 进行按键处理
这里我们需要进行兼容性处理：
1. event
2. keyCode

``` javascript
var event = event || window.event;
```

IE中有`window.event`对象，firefox没有`window.event`对象。
可以通过给函数的参数传递event对象。 

``` javascript
var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
```

IE使用`e.keyCode`获取按键，FireFox和Opera等使用`e.which`获取按键。

然后我们添加按键判断和处理：

``` javascript
// 处理按键
function handleKeyDown(e) {
    var e = e || window.event;
    var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;

    if ('37, 38, 39, 40, 65, 87, 68, 83'.indexOf(keyCode) === -1) {
        return;
    } else {
        switch (e.keyCode) {
            case 37:
            case 65:
                CameraMove('x', -0.1);
                break;
            case 38:
            case 87:
                CameraMove('y', 0.1);
                break;
            case 39:
            case 68:
                CameraMove('x', 0.1);
                break;
            case 83:
            case 40:
                CameraMove('y', -0.1);
                break;
        }
    }
}
```

这里的CameraMove是用来处理camera的移动的。

### 进行照相机移动
``` javascript
function CameraMove(direction, distance) {
    camera.position[direction] += distance;
}
```

这时候，我们就能通过上下左右或者是WASD按键控制照相机的移动。

如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1486894019%281%29.png)

移动后：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1486906651%281%29.png)

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
// 添加文字
var loader = new THREE.FontLoader();
loader.load('./js/font.json', function(font) {
    var mesh = new THREE.Mesh(new THREE.TextGeometry('Please press Up/Down/Ledt/Right or W/A/S/D', {
        font: font,
        size: 0.4,
        height: 0.1
    }), new THREE.MeshLambertMaterial());
    mesh.position.set(-5, 2, 2);
    mesh.rotation.set(1.2, 0, 0)
    scene.add(mesh);

    render();
});


// 添加按键时走动
document.addEventListener('keydown', handleKeyDown, false);

// 处理按键
function handleKeyDown(e) {
    var e = e || window.event;
    var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;

    if ('37, 38, 39, 40, 65, 87, 68, 83'.indexOf(keyCode) === -1) {
        return;
    } else {
        switch (e.keyCode) {
            case 37:
            case 65:
                CameraMove('x', -0.1);
                break;
            case 38:
            case 87:
                CameraMove('y', 0.1);
                break;
            case 39:
            case 68:
                CameraMove('x', 0.1);
                break;
            case 83:
            case 40:
                CameraMove('y', -0.1);
                break;
        }
    }
}

function CameraMove(direction, distance) {
    camera.position[direction] += distance;
}
```

## 结束语
-----
这节主要讲了给第一人称（照相机）添加按键事件处理的基本过程。这里我们只考虑了前后左右的移动，包括视觉角度等的都没有进行计算和控制，后面章节我们会把这些方面也一并添加进去处理。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/three-notes/4-add-keypress-move)
[此处查看页面效果](http://three-notes.godbasin.com/three-notes-4-add-keypress-move/index.html)