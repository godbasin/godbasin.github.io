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