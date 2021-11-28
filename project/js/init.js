function init() {
  var stats = initStats();
  let rendu = new THREE.WebGLRenderer({ antialias: true });
  rendu.shadowMap.enabled = true;
  scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 10000000);
  rendu.setClearColor(new THREE.Color(0xFFFFFF));
  rendu.setSize(window.innerWidth, window.innerHeight * .9);
  cameraLumiere(scene, camera);
  lumiere(scene);
  var controls = new THREE.OrbitControls(camera, rendu.domElement);

  //********************************************************
  //
  //  P A R T I E     M A I N
  //
  //********************************************************

  h_ = 0.135;
  r_ = (0.745 / Math.PI) / 2;

  start_ = -17.35;
  nbpts_repr = 100;
  nbpts_tir = 150;
  nb_lancer = 0;
  P_0 = new THREE.Vector3(start_, 0, 0.2);
  let P1 = new THREE.Vector3(0, 0, 0.2);
  let P2 = new THREE.Vector3(17, 0, 0.2);

  cb = new THREE.QuadraticBezierCurve3(P_0, P1, P2);
  repr_cb = TraceBezierQuadratique(cb);
  refreshBezier(scene, P1, P2)

  pierre_courante = null;
  collision_courante = false;
  pierre_jouer = [];

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

  let gui = new dat.GUI();

  let menuGUI = new function () {

    this.P1x = P1.x;
    this.P1y = P1.y;
    this.P2x = P2.x;
    this.P2y = P2.y;
    this.i = 0;

    this.lancer = function (i) {

      if (nb_lancer <= 10 && collision_courante == false) {
        if (i == 1) {
          nb_lancer++;

          let trajet = cb.clone()
          cbeGeometry = new THREE.Geometry();
          cbeGeometry.vertices = trajet.getPoints(nbpts_tir);
          let mod = nb_lancer % 2;
          switch (mod) {
            case 0:
              {
                scene.add(pierre_courante = pierre(P_0, 1));
                pierre_courante.position.z = 0; break;
              }
            case 1:
              {
                scene.add(pierre_courante = pierre(P_0, 0));
                pierre_courante.position.z = 0; break;
              }

          }
        }
        if (i < cbeGeometry.vertices.length) {
          setTimeout(function () {
            let trajet = cb.clone();
            pierre_jouer.push(pierre_courante);
            pierre_courante.position.x = cbeGeometry.vertices[i].x;
            pierre_courante.position.y = cbeGeometry.vertices[i].y;
            verifcollisionall(pierre_courante); i++;
            if (i <= nbpts_tir) { menuGUI.lancer(i); }

          }, 16);
        }
      }
    }
  }

  let guiPos = gui.addFolder("Points");
  guiPos.add(menuGUI, 'P1x', -5, 5).onChange(function () { refreshBezier(scene, new THREE.Vector3(menuGUI.P1x, menuGUI.P1y, 0.2), new THREE.Vector3(menuGUI.P2x, menuGUI.P2y, 0.2)); });
  guiPos.add(menuGUI, 'P1y', -3, 3).onChange(function () { refreshBezier(scene, new THREE.Vector3(menuGUI.P1x, menuGUI.P1y, 0.2), new THREE.Vector3(menuGUI.P2x, menuGUI.P2y, 0.2)); });
  guiPos.add(menuGUI, 'P2x', 14, 25).onChange(function () { refreshBezier(scene, new THREE.Vector3(menuGUI.P1x, menuGUI.P1y, 0.2), new THREE.Vector3(menuGUI.P2x, menuGUI.P2y, 0.2)); });
  guiPos.add(menuGUI, 'P2y', -2, 2).onChange(function () { refreshBezier(scene, new THREE.Vector3(menuGUI.P1x, menuGUI.P1y, 0.2), new THREE.Vector3(menuGUI.P2x, menuGUI.P2y, 0.2)); });
  guiPos.open()
  gui.add(menuGUI, 'lancer').onChange(function () { collision_courante = false; menuGUI.lancer(1); });

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