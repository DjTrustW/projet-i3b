var xDir = 0;
var yDir = 0;
var zDir = 1;

function cameraLumiere(scene, camera) {
  camera.up = new THREE.Vector3(0, 0, 1);
  let xPos = 50;
  let yPos = 50;
  let zPos = 50;
  camera.position.set(xPos, yPos, zPos);
  camera.lookAt(xDir, yDir, zDir);
  camera.updateProjectionMatrix();
}

function lumiere(scene) {
  let lumPt = new THREE.PointLight(0xffffff);
  lumPt.position.set(3, 3, -3);
  lumPt.intensity = 1;
  lumPt.shadow.camera.far = 2000;
  lumPt.shadow.camera.near = 0;
  scene.add(lumPt);
  let lumPt1 = new THREE.PointLight(0xffffff);
  lumPt1.castShadow = true;
  lumPt1.shadow.camera.far = 2000;
  lumPt1.shadow.camera.near = 0;
  lumPt1.position.set(5, -15, 15);
  lumPt1.intensity = 1;
  scene.add(lumPt1);
}
