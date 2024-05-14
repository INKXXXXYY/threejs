// 创建一个新的Three.js场景
const scene = new THREE.Scene();

// 创建球体几何体，指定半径为1，水平和垂直分段数为32
const geometry = new THREE.SphereGeometry(1.5, 64, 64);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

const loader = new THREE.GLTFLoader();

const textureLoader = new THREE.TextureLoader();

const diffuseTexture = textureLoader.load('textures/painted_brick_diff_4k.jpg');
const normalTexture = textureLoader.load('textures/painted_brick_nor_gl_4k.exr');

const material = new THREE.MeshStandardMaterial({
	map: diffuseTexture,
	// normalMap: normalTexture,
	side: THREE.DoubleSide // 设置材质为双面
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

loader.load(
	'ImageToStl.com_painted_brick_4k.glb', // 这里填写你的模型文件路径
	function(gltf) {

		gltf.scene.traverse(function(child) {
			if (child.isMesh) {
				child.material = material;
				child.geometry.computeVertexNormals(); // 计算顶点法线

			}
		});
		scene.add(gltf.scene);

	},
	function(xhr) {
		console.log((xhr.loaded / xhr.total * 100) + '% loaded'); // 显示加载进度
	},
	function(error) {
		console.error('模型加载出错: ', error); // 输出错误信息
	}
);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

function onDocumentMouseMove(event) {
	const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
	const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

	// 确保模型对象已被添加到场景中
	scene.traverse(function(object) {
		if (object.isMesh) { // 确保是模型网格
			object.rotation.y = mouseX * Math.PI;
			object.rotation.x = mouseY * Math.PI;
		}
	});
}

document.addEventListener('mousemove', onDocumentMouseMove);

camera.position.set(0, 0, 5); // 调整相机位置以适当查看模型
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 10, 10);
scene.add(light);

// renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;

//光线
// const light = new THREE.PointLight(0xffffff, 1, 100);
// light.position.set(10, 10, 10);
// scene.add(light);

// const ambientLight = new THREE.AmbientLight(0x404040); // 环境光
// scene.add(ambientLight);


window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

const loader1 = new THREE.FontLoader();

// 加载字体
loader1.load('helvetiker_bold.typeface.json', function(font) {
	const textGeo = new THREE.TextGeometry('HI, Friend!\nI’m choiiie', {
		font: font,
		size: 0.5,
		height: 0.1,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 0.01,
		bevelSize: 0.01,
		bevelOffset: 0,
		bevelSegments: 5
	});

	const textMaterial = new THREE.MeshPhongMaterial({
		color: 0x74C6CC
	});
	const textMesh = new THREE.Mesh(textGeo, textMaterial);
	textMesh.position.set(-1.5, 2.5, 0); // 假设球体半径为1.5，稍微提高一点位置以避免重叠
	textMesh.rotation.x = -Math.PI / 2; // 根据需要调整文字的朝向
	scene.add(textMesh);
});



function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

animate();