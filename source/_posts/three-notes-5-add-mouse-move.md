---
title: three.js笔记5--添加鼠标移动视角
date: 2017-04-29 09:48:34
categories: three.js奶茶
tags: 笔记
---
Three.js是一个3D库，《three.js笔记》系列是在使用three.js中的一些过程和笔记。
本文记录添加鼠标事件，以及调整照相机按照视角进行前后左右移动的基本过程。
<!--more-->
## 添加鼠标移动控制
-----
### 基本思路
这里我们将添加鼠标移动的处理，来控制第一人称（照相机）的视角的移动，基本思路为：
- 添加监听事件
- 绑定视角更新（照相机焦点处理）
- 调整照相机移动方向

这里我们添加几个全局变量：

``` javascript
// 定义角度
var theta = 0;
// 初始化鼠标X方向移动值
var mouseX = 0;
var r = 1000 / (2* Math.PI); // 用于角度计算： 鼠标移动1000px时，角度改变2PI
var far = 20000; // 用于照相机焦点设置（焦点距离，越大越精确）
var move = 0.1; // 用于步长（照相机移动距离）
```

其中theta(θ)角度如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1486987535%281%29.png)

### 添加监听事件
``` javascript
// 添加鼠标移动时事件
document.addEventListener('mousemove', handleMousemove, false);
// 添加鼠标进入页面时初始化鼠标位置
document.addEventListener('mouseenter', initMousePosition, false);
```

为了正确获取鼠标左右移动距离，我们在鼠标进入页面时会更新鼠标位置：

``` javascript
// 初始化鼠标移动值
function initMousePosition(e) {
    mouseX = getMousePos(e || window.event);
}
```

然后我们获取鼠标移动距离，这里我们需要处理鼠标位置的兼容性：

``` javascript
// 获取鼠标坐标，传入事件event
function getMousePos(event) {
    var e = event || window.event;
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var x = e.pageX || e.clientX + scrollX;
    var y = e.pageY || e.clientY + scrollY;
    return { 'x': x, 'y': y };
}

// 处理鼠标移动
function handleMousemove(e) {
    var e = e || window.event;
    // 获取鼠标x坐标
    var newMouseX = getMousePos(e).x;
    // 若值无效，更新坐标然后返回
    if (Number.isNaN((newMouseX - mouseX) / r)) { mouseX = newMouseX; return; }
    // 更新视角以及坐标位置
    theta += (newMouseX - mouseX) / r;
    mouseX = newMouseX;

    // 更新照相机焦点
    renderCameraLookat();
}
```

### 绑定视角更新（照相机焦点处理）
至于照相机焦点的更新，我们设置焦距为far，这里初始化为20000，根据theta角度我们可以计算得到：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1486987997%281%29.png)

即照相机焦点的坐标等于：
`焦点的x轴坐标 = 照相机x轴坐标 + 焦距far × sin(theta)`
`焦点的y轴坐标 = 照相机y轴坐标 + 焦距far × cos(theta)`

``` javascript
// 更新照相机焦点
function renderCameraLookat() {
    camera.lookAt(new THREE.Vector3(camera.position.x + far * Math.sin(theta), camera.position.y + far * Math.cos(theta), 1));
}
```

### 调整照相机移动方向
当我们照相机拥有了视觉角度之后，我们的移动方向也不再是x、y这样的简单方向了。

如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1486988752%281%29.png)

我们步长为move，则我们移动的计算公式为：

- 往前forward：

`移动后x轴坐标 = 照相机x轴坐标 + 步长move × sin(θ)`
`移动后y轴坐标 = 照相机y轴坐标 + 步长move × cos(θ)`

- 往左left：

`移动后x轴坐标 = 照相机x轴坐标 - 步长move × cos(θ)`
`移动后y轴坐标 = 照相机y轴坐标 + 步长move × sin(θ)`

- 往后backward则与往前相反：

`移动后x轴坐标 = 照相机x轴坐标 - 步长move × sin(θ)`
`移动后y轴坐标 = 照相机y轴坐标 - 步长move × cos(θ)`

- 往右right则与往左相反：

`移动后x轴坐标 = 照相机x轴坐标 + 步长move × cos(θ)`
`移动后y轴坐标 = 照相机y轴坐标 - 步长move × sin(θ)`

``` javascript
// 照相机移动计算，值可能为left/forward/right/backward
function CameraMove(direction) {
    var x, y;
    var oX = camera.position.x, oY = camera.position.y;
    switch (direction) {
        case 'left':
            x = oX - move * Math.cos(theta);
            y = oY + move * Math.sin(theta);
            break;
        case 'forward':
            x = oX + move * Math.sin(theta);
            y = oY + move * Math.cos(theta);
            break;
        case 'right':
            x = oX + move * Math.cos(theta);
            y = oY - move * Math.sin(theta);
            break;
        case 'backward':
            x = oX - move * Math.sin(theta);
            y = oY - move * Math.cos(theta);
            break;
    }
    camera.position.x = x;
    camera.position.y = y;
}
```

到这里，我们鼠标移动部分的逻辑代码则完成了。

### 完整代码
``` javascript
// 定义角度
var theta = 0;
// 初始化鼠标X方向移动值
var mouseX = 0;
var r = 1000 / (2* Math.PI); // 用于角度计算： 鼠标移动1000px时，角度改变2PI
var far = 20000; // 用于照相机焦点设置（焦点距离，越大越精确）
var move = 0.1; // 用于步长（照相机移动距离）

// 设置场景
var scene = new THREE.Scene();

// 创建正交投影照相机
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set( 0,-5, 1);
camera.up = new THREE.Vector3(0,0,1);
camera.lookAt(new THREE.Vector3(0,0,1));

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
loader.load('./js/font.json', function (font) {
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
document.addEventListener('keydown', handleKeydown, false);

// 添加鼠标移动时事件
document.addEventListener('mousemove', handleMousemove, false);
// 添加鼠标进入页面时初始化鼠标位置
document.addEventListener('mouseenter', initMousePosition, false);

// 处理按键
function handleKeydown(e) {
    var e = e || window.event;
    var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;

    if ('37, 38, 39, 40, 65, 87, 68, 83'.indexOf(keyCode) === -1) {
        return;
    } else {
        switch (e.keyCode) {
            case 37:
            case 65:
                CameraMove('left');
                break;
            case 38:
            case 87:
                CameraMove('forward');
                break;
            case 39:
            case 68:
                CameraMove('right');
                break;
            case 83:
            case 40:
                CameraMove('backward');
                break;
        }
    }
}

// 照相机移动计算
function CameraMove(direction) {
    var x, y;
    var oX = camera.position.x, oY = camera.position.y;
    switch (direction) {
        case 'left':
            x = oX - move * Math.cos(theta);
            y = oY + move * Math.sin(theta);
            break;
        case 'forward':
            x = oX + move * Math.sin(theta);
            y = oY + move * Math.cos(theta);
            break;
        case 'right':
            x = oX + move * Math.cos(theta);
            y = oY - move * Math.sin(theta);
            break;
        case 'backward':
            x = oX - move * Math.sin(theta);
            y = oY - move * Math.cos(theta);
            break;
    }
    camera.position.x = x;
    camera.position.y = y;
}

// 初始化鼠标移动值
function initMousePosition(e) {
    mouseX = getMousePos(e || window.event);
}

// 获取鼠标坐标
function getMousePos(event) {
    var e = event || window.event;
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var x = e.pageX || e.clientX + scrollX;
    var y = e.pageY || e.clientY + scrollY;
    return { 'x': x, 'y': y };
}

// 处理鼠标移动
function handleMousemove(e) {
    var e = e || window.event;
    // 获取鼠标x坐标
    var newMouseX = getMousePos(e).x;
    // 若值无效，更新坐标然后返回
    if (Number.isNaN((newMouseX - mouseX) / r)) { mouseX = newMouseX; return; }
    // 更新视角以及坐标位置
    theta += (newMouseX - mouseX) / r;
    mouseX = newMouseX;

    // 更新照相机焦点
    renderCameraLookat();
}

// 更新照相机焦点
function renderCameraLookat() {
    camera.lookAt(new THREE.Vector3(camera.position.x + far * Math.sin(theta), camera.position.y + far * Math.cos(theta), 1));
}
```

## 结束语
-----
这节主要讲了给第一人称（照相机）添加鼠标移动控制视觉方向，并调整移动计算的基本过程。有兴趣的小伙伴，也可以自行完成上下移动视觉的部分。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/three-notes/5-add-mouse-move)
[此处查看页面效果](http://three-notes.godbasin.com/three-notes-5-add-mouse-move/index.html)