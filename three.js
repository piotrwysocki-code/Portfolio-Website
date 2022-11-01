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

let texture = textureLoader.load('https://i.postimg.cc/yxLw9wSx/circuitry.png');
let planetTexture = textureLoader.load('https://i.postimg.cc/fTpvM3ck/planet-Texture.jpg');

let geometry = new THREE.SphereGeometry( 13, 30, 30);
let material = new THREE.MeshStandardMaterial({ color: 0xEC18D8} );

let globeLight = new THREE.PointLight(0xFF0F00, 2);
globeLight.position.set(0, 8, 0);


material.metalness = 0.7;
material.roughness = 0.2;
material.normalMap = texture;

let sun = new THREE.Mesh( geometry, material );
sun.position.x = 0;

scene.add( sun );
scene.add(globeLight);

let light1 = new THREE.PointLight(0x0000FF, 1);
let light2 = new THREE.PointLight(0x00000FF, 0);
let light3 = new THREE.PointLight(0x0f0FF, 1);
let light4 = new THREE.PointLight(0xFF2000, 0.3);

light1.position.set(-15.86, -30, -26.65);
light2.position.set(20, 50, -26.65);
light3.position.set(100, 0, -100)
light4.position.set(-100, 0, -100);

scene.add(light1, light2, light3, light4);

let stars = [];

function addStar() {
  if(stars.length < 175){
    let geometry = new THREE.SphereGeometry(THREE.MathUtils.randFloatSpread(0.5), 24, 24);
    let tempMaterial = new THREE.MeshStandardMaterial( { color: 0x00fFFF });
    tempMaterial.normalMap = planetTexture;
    let star = new THREE.Mesh( geometry, tempMaterial );

    let [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
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
    x.position.z += 0.4;

    let position = new THREE.Vector3();
    position.setFromMatrixPosition( x.matrixWorld );
    if(position.z > 100){
      x.position.z = -50;
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

let planetGeo1 = new THREE.SphereGeometry(1, 24, 24);
let planetGeo2 = new THREE.SphereGeometry(3, 24, 24);
let planetGeo3 = new THREE.SphereGeometry(6, 24, 24);
let planetGeo4 = new THREE.SphereGeometry(2, 24, 24);
let OSGMaterial = new THREE.MeshStandardMaterial( { color: 0x0ff0FF });
OSGMaterial.normalMap = planetTexture;
let planet = new THREE.Mesh( planetGeo1, OSGMaterial );
let planet2 = new THREE.Mesh( planetGeo2, OSGMaterial );
let planet3 = new THREE.Mesh( planetGeo3, OSGMaterial );
let planet4 = new THREE.Mesh( planetGeo4, OSGMaterial );

planet2.position.y = 15
planet3.position.z = 30
planet3.position.y = 50
planet4.position.y = 30
planet.position.x = 20;

let planetObj = new THREE.Object3D();
planetObj.add(planet);
planetObj.position.x = 0;
scene.add(planetObj);

let planetObj2 = new THREE.Object3D();
planetObj2.add(planet);
planetObj2.position.x = 0;
scene.add(planetObj2);

let planetObj3 = new THREE.Object3D();
planetObj3.add(planet);
planetObj3.position.x = 0;
scene.add(planetObj3);

let planetObj4 = new THREE.Object3D();
planetObj4.add(planet);
planetObj4.position.x = 0;
scene.add(planetObj4);

planetObj2.add(planet2);
planetObj3.add(planet3);
planetObj4.add(planet4);

function animate() {
	requestAnimationFrame( animate );

  targetX = mouseX * .001;
  targetY = mouseY * .001;
  sun.rotation.y += 0.002;
  sun.rotation.x += 0.002;
  sun.rotation.z += 0.002;
  sun.rotation.y += .02 * (targetX - sun.rotation.y);
  sun.rotation.x += .02 * (targetY - sun.rotation.x);
  sun.rotation.z += -.02 * (targetY - sun.rotation.x);
  planetObj.rotateY(0.005);
  planetObj.rotateX(0.005);
  planetObj.rotateZ(-0.007);
  planetObj.rotation.y += .1 * (targetX - sun.rotation.y);
  planetObj.rotation.x += .1 * (targetY - sun.rotation.x);
  planetObj.rotation.z += -.1 * (targetY - sun.rotation.x);
  planetObj2.rotateY(-0.009);
  planetObj2.rotateX(0.009);
  planetObj2.rotateZ(0.009);
  planetObj2.rotation.y += .002 * (targetX - sun.rotation.y);
  planetObj2.rotation.x += .002 * (targetY - sun.rotation.x);
  planetObj2.rotation.z += -.002 * (targetY - sun.rotation.x);
  planetObj3.rotateY(-0.009);
  planetObj3.rotateX(-0.003);
  planetObj3.rotateZ(0.007);
  planetObj3.rotation.y += .005 * (targetX - sun.rotation.y);
  planetObj3.rotation.x += .007 * (targetY - sun.rotation.x);
  planetObj3.rotation.z += -.002 * (targetY - sun.rotation.x);
  planetObj4.rotateY(-0.002);
  planetObj4.rotateX(-0.006);
  planetObj4.rotateZ(0.004);
  planetObj4.rotation.y += -.005 * (targetX - sun.rotation.y);
  planetObj4.rotation.x += -.007 * (targetY - sun.rotation.x);
  planetObj4.rotation.z += -.002 * (targetY - sun.rotation.x);

  addStar();
  updateStars();
	renderer.render( scene, camera );
}

animate();

