function init() {

  var stats = initStats();
  let rendu = new THREE.WebGLRenderer({ antialias: true });
  rendu.shadowMap.enabled = true;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 10000000);
  rendu.setClearColor(new THREE.Color(0xFFFFFF));
  rendu.setSize(window.innerWidth * .9, window.innerHeight * .9);
  cameraLumiere(scene, camera);
  lumiere(scene);
  //var controls = new THREE.OrbitControls(camera, rendu.domElement); //(peut etre activer pour une camera libre)

  //********************************************************
  //
  //  P A R T I E     M A I N
  //
  //********************************************************

  //initialisation avec des valeurs par defaut pour la premiere représentation de la courbe 
  let P1 = new THREE.Vector3(0, 0, 0.2);
  let P2 = new THREE.Vector3(17, 0, 0.2);
  refreshBezier(scene, P1, P2);

  //ajoute le terrain
  scene.add(terrain());

  //********************************************************
  //
  // F I N      P A R T I E     M A I N
  //
  //********************************************************
  //********************************************************
  //
  //  D E B U T     M E N U     G U I
  //
  //********************************************************

  gui = new dat.GUI();

  menuGUI = new function () {

    this.P1x = P1.x;
    this.P1y = P1.y;
    this.P2x = P2.x;
    this.P2y = P2.y;
    this.i = 0;
    this.camera_view = camera_vue;

    // position camera avec vue sur la piste depuis le depart 
    this.camera_piste = function () {
      camera.position.x = -17.35;
      camera.position.y = 0;
      camera.position.z = 1;
      camera.lookAt(17.35, 0, 0);
    }
    // position camera avec vue sur la maison
    this.camera_maison = function () {
      camera.position.x = 17.35;
      camera.position.y = 8;
      camera.position.z = 8;
      camera.lookAt(17.35, 0, 0);
    }
    // position camera avec vue sur le terrain entier 
    this.camera_basique = function () {
      camera.position.x = 50;
      camera.position.y = 50;
      camera.position.z = 50;
      camera.lookAt(0, 0, 0);
    }

    // bouton qui permet de lancer les pierres 
    this.lancer = function () {
      collision_courante = false;
      if (tir_en_cour == false && nb_lancer < 10) {
        trajet = cb.clone();
        nb_lancer++;
        setTimeout(tir(1), 10000);
      }
    }
  }

  // partie du menu gui qui propose de changer les cordonnées des points de controle de la courbe 
  guiPos = gui.addFolder("Points");
  guiPos.add(menuGUI, 'P1x', -5, 5).onChange(function () { refreshBezier(scene, new THREE.Vector3(menuGUI.P1x, menuGUI.P1y, 0.2), new THREE.Vector3(menuGUI.P2x, menuGUI.P2y, 0.2)); });
  guiPos.add(menuGUI, 'P1y', -3, 3).onChange(function () { refreshBezier(scene, new THREE.Vector3(menuGUI.P1x, menuGUI.P1y, 0.2), new THREE.Vector3(menuGUI.P2x, menuGUI.P2y, 0.2)); });
  guiPos.add(menuGUI, 'P2x', end_-2, end_+2).onChange(function () { refreshBezier(scene, new THREE.Vector3(menuGUI.P1x, menuGUI.P1y, 0.2), new THREE.Vector3(menuGUI.P2x, menuGUI.P2y, 0.2)); });
  guiPos.add(menuGUI, 'P2y', -2, 2).onChange(function () { refreshBezier(scene, new THREE.Vector3(menuGUI.P1x, menuGUI.P1y, 0.2), new THREE.Vector3(menuGUI.P2x, menuGUI.P2y, 0.2)); });
  guiPos.open();

  // partie du menu gui qui permet de lancer et gerer les angles de caméra
  gui.add(menuGUI, 'lancer').onChange(function () { menuGUI.lancer() });
  gui.add(menuGUI, 'camera_piste').onChange(function () { menuGUI.camera_piste });
  gui.add(menuGUI, 'camera_maison').onChange(function () { menuGUI.camera_maison });
  gui.add(menuGUI, 'camera_basique').onChange(function () { menuGUI.camera_basique });
  gui.add(menuGUI, 'camera_view').onChange(function () { camera_vue = menuGUI.camera_view });

  //********************************************************
  //
  //  F I N     M E N U     G U I
  //
  //********************************************************

  renduAnim();
  document.getElementById("webgl").appendChild(rendu.domElement);
  rendu.render(scene, camera);
  function reAffichage() {
    setTimeout(function () { }, 200);
    rendu.render(scene, camera);
  }
  function renduAnim() {
    stats.update();
    requestAnimationFrame(renduAnim);
    rendu.render(scene, camera);
  }
}