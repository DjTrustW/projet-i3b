function init(){
  var stats = initStats();
  let rendu = new THREE.WebGLRenderer({antialias:true});
  rendu.shadowMap.enabled = true;
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(20, window.innerWidth/window.innerHeight, 0.1, 10000000);
  rendu.shadowMap.enabled = true;
  rendu.setClearColor(new THREE.Color(0xFFFFFF));
  rendu.setSize(window.innerWidth*.9, window.innerHeight*.9);
  cameraLumiere(scene,camera);
  lumiere(scene);
  var controls = new THREE.OrbitControls(camera, rendu.domElement);
  var axes = new THREE.AxesHelper(1);
  scene.add(axes);
  //********************************************************
  //
  //  P A R T I E     C U S T O M
  //
  //********************************************************
  function pierre(pos = new THREE.Vector3(), team = 0){
    function lathe1(){
      h = 0.135;
      r = (0.745/Math.PI)/2;
      p0 = new THREE.Vector3();
      p1 = new THREE.Vector3(r, 0, 0);
      p2 = new THREE.Vector3(r, (3*h)/8, 0);
      c = new THREE.QuadraticBezierCurve3(p0, p1, p2);
      const geometry = new THREE.LatheGeometry(c.getPoints(25), 50);
      const material = new THREE.MeshPhongMaterial({color: 0x82878f});
      const lathe = new THREE.Mesh(geometry, material);
      lathe.rotation.x = Math.PI/2;
      return lathe;
    }
    function lathe2(){
      h = 0.135;
      r = (0.745/Math.PI)/2;
      p0 = new THREE.Vector3(r, (3*h)/8, 0);
      p1 = new THREE.Vector3(r, h/2, 0);
      p2 = new THREE.Vector3(r, (5*h)/8, 0);
      c = new THREE.QuadraticBezierCurve3(p0, p1, p2);
      const geometry = new THREE.LatheGeometry(c.getPoints(25), 50);
      const material = new THREE.MeshPhongMaterial({color: 0xcccccc});
      const lathe = new THREE.Mesh(geometry, material);
      lathe.rotation.x = Math.PI/2;
      return lathe;
    }
    function lathe3(){
      h = 0.135;
      r = (0.745/Math.PI)/2;
      p0 = new THREE.Vector3(r, (5*h)/8, 0);
      p1 = new THREE.Vector3(r, h, 0);
      p2 = new THREE.Vector3(0, h, 0);
      c = new THREE.QuadraticBezierCurve3(p0, p1, p2);
      const geometry = new THREE.LatheGeometry(c.getPoints(25), 50);
      const material = new THREE.MeshPhongMaterial({color: 0x82878f});
      const lathe = new THREE.Mesh(geometry, material);
      lathe.rotation.x = Math.PI/2;
      return lathe;
    }
    function cylinder1(coul) {
      const geometry = new THREE.CylinderGeometry(0.085, 0.085, 0.03, 30);
      const material = new THREE.MeshPhongMaterial({color: coul});
      const cylinder = new THREE.Mesh(geometry, material);
      cylinder.position.z += 0.12;
      cylinder.rotation.x = Math.PI/2;
      return cylinder;
    }
    function cylinder2(coul) {
      const geometry = new THREE.CylinderGeometry(0.0075, 0.0075, 0.1, 20);
      const material = new THREE.MeshPhongMaterial({color: coul});
      const cylinder = new THREE.Mesh(geometry, material);
      cylinder.position.x += 0.01;
      cylinder.position.z += 0.16;
      cylinder.rotation.x = Math.PI/2;
      cylinder.rotation.z = Math.PI/2;
      return cylinder;
    }
    function box(coul) {
      const geometry = new THREE.BoxGeometry(0.015, 0.015, 0.095);
      const material = new THREE.MeshPhongMaterial({color: coul});
      const box = new THREE.Mesh(geometry, material);
      box.position.x += 0.06;
      box.position.z += 0.12;
      return box;
    }
    const coul = team==0 ? 0xff0000 : 0x0000ff;
    const group = new THREE.Group();
    group.add(lathe1());
    group.add(lathe2());
    group.add(lathe3());
    group.add(cylinder1(coul));
    group.add(cylinder2(coul));
    group.add(box(coul));
    group.position.x = pos.x;
    group.position.y = pos.y;
    group.position.z = pos.z;
    group.rotation.z = team==0 ? 0 : Math.PI;
    return group;
  }
  function terrain(pos = new THREE.Vector3()){
    function torus(coul, rin, rext, pos = new THREE.Vector3()){
      const geometry = new THREE.TorusGeometry((rin+rext)/4, (rext-rin)/4, 2, 50);
      const material = new THREE.MeshBasicMaterial({color:coul});
      const torus = new THREE.Mesh(geometry, material);
      torus.position.x = pos.x;
      torus.position.y = pos.y;
      torus.position.z = pos.z;
      return torus;
    }
    function plane(pos = new THREE.Vector3()){
      const geometry = new THREE.PlaneGeometry(42.07, 4.75);
      const material = new THREE.MeshBasicMaterial({color:0xeeeeee, side:THREE.DoubleSide});
      const plane = new THREE.Mesh(geometry, material);
      plane.position.x = pos.x;
      plane.position.y = pos.y;
      plane.position.z = pos.z;
      return plane;
    }
    const group = new THREE.Group();
    group.add(plane());
    group.add(torus(0xff0000, 0.3, 1.22, new THREE.Vector3(17.3736, 0, 0.0009)));
    group.add(torus(0xff0000, 0.3, 1.22, new THREE.Vector3(-17.3736, 0, 0.0009)));
    group.add(torus(0x0000ff, 2.43, 3.66, new THREE.Vector3(17.3736, 0, 0.0009)));
    group.add(torus(0x0000ff, 2.43, 3.66, new THREE.Vector3(-17.3736, 0, 0.0009)));
    group.position.x = pos.x;
    group.position.y = pos.y;
    group.position.z = pos.z;
    return group;
  }
  //********************************************************
  //
  // F I N      P A R T I E     C U S T O M
  //
  //********************************************************
  //********************************************************
  //
  //  P A R T I E     G E O M E T R I Q U E
  //
  //********************************************************
  scene.add(terrain());
  scene.add(p1 = pierre(new THREE.Vector3(0, 0.15, 0)));
  scene.add(p2 = pierre(new THREE.Vector3(0, -0.15, 0), 1));
  //********************************************************
  //
  // F I N      P A R T I E     G E O M E T R I Q U E
  //
  //********************************************************
  //********************************************************
  //
  //  D E B U T     M E N U     G U I
  //
  //********************************************************
  //********************************************************
  //
  //  F I N     M E N U     G U I
  //
  //********************************************************
  renduAnim();
  document.getElementById("webgl").appendChild(rendu.domElement);
  rendu.render(scene, camera);
  function reAffichage(){
    setTimeout(function (){}, 200);
    rendu.render(scene, camera);
  }
  function renduAnim(){
    stats.update();
    requestAnimationFrame(renduAnim);
    rendu.render(scene, camera);
  }
}
