import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let scene = new THREE.Scene();
let textureLoader = new THREE.TextureLoader();

let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

let renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#canvas'),
  alpha: true
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ( 40 );
camera.position.setY( 0 );

let donutTexture = textureLoader.load('/images/circuitry.png');

let geometry = new THREE.SphereGeometry( 13, 100, 30);
let material = new THREE.MeshStandardMaterial({ color: 0x292929} );

material.metalness = 0.7;
material.roughness = 0.2;
material.normalMap = donutTexture;

let sphere = new THREE.Mesh( geometry, material );
sphere.position.x = 0;

scene.add( sphere );

let light1 = new THREE.PointLight(0x0000FF, 3);
let light2 = new THREE.PointLight(0x004b85, 3);
let light3 = new THREE.PointLight(0x0000FF, 0.3);
let light4 = new THREE.PointLight(0xFF2000, 0.3);

light1.position.set(-15.86, -30, -26.65);
light2.position.set(20, 50, -26.65);
light3.position.set(100, 0, -100)
light4.position.set(-100, 0, -100);

scene.add(light1, light2, light3, light4);

let lightHelper1 = new THREE.PointLightHelper(light1);
let lightHelper2 = new THREE.PointLightHelper(light2);
let lightHelper3 = new THREE.PointLightHelper(light3);
let lightHelper4 = new THREE.PointLightHelper(light4);

//scene.add(lightHelper1, lightHelper2, lightHelper3, lightHelper4);

let controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 1.5;
camera.lookAt(sphere);

let stars = [];

function addStar() {
  if(stars.length < 400){
    let geometry = new THREE.SphereGeometry(THREE.MathUtils.randFloatSpread(0.4), 24, 24);
    let tempMaterial = new THREE.MeshStandardMaterial( { color: 0xFFFFFF });
    tempMaterial.normalMap = donutTexture;
    let star = new THREE.Mesh( geometry, tempMaterial );
  
    let [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z)
    stars.push(star);
    scene.add(star);
    scene.updateMatrixWorld(true);
  }
}

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () =>
{
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

function updateStars() {
  stars.map(x => {
    x.position.z += 0.5;
    let position = new THREE.Vector3();
    position.setFromMatrixPosition( x.matrixWorld );
    if(position.z > 100){
      x.position.z = -90;
    }
  });
}

document.addEventListener('mousemove', onDocumentMouseMove);

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

let windowHalfX = sizes.width / 2;
let windowHalfY = sizes.height / 2;

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX);
  mouseY = (event.clientY - windowHalfY);
}

function animate() {
	requestAnimationFrame( animate );

  targetX = mouseX * .001;
  targetY = mouseY * .001;
  sphere.rotation.y += 0.002;
  sphere.rotation.x += 0.002;
  sphere.rotation.z += 0.002;
  sphere.rotation.y += .02 * (targetX - sphere.rotation.y);
  sphere.rotation.x += .02 * (targetY - sphere.rotation.x);
  sphere.rotation.z += -.02 * (targetY - sphere.rotation.x);

  controls.update();
  addStar();
  updateStars();
	renderer.render( scene, camera );
}

animate();

