//fonction qui creer la pierre
function pierre(pos = new THREE.Vector3(), team = 0) {

  var h = 0.135; // hauteur de la pierre
  var r = (0.745 / Math.PI) / 2; // rayon de la pierre

  //fonction qui creer la latte inferieur
  function lathe1() {

    p0 = new THREE.Vector3();
    p1 = new THREE.Vector3(r, 0, 0);
    p2 = new THREE.Vector3(r, (3 * h) / 8, 0);
    c = new THREE.QuadraticBezierCurve3(p0, p1, p2);

    const geometry = new THREE.LatheGeometry(c.getPoints(25), 50);
    const material = new THREE.MeshPhongMaterial({ color: 0x82878f });
    const lathe = new THREE.Mesh(geometry, material);

    lathe.rotation.x = Math.PI / 2;
    return lathe;
  }

  //fonction qui creer la latte intermediaire
  function lathe2() {

    p0 = new THREE.Vector3(r, (3 * h) / 8, 0);
    p1 = new THREE.Vector3(r, h / 2, 0);
    p2 = new THREE.Vector3(r, (5 * h) / 8, 0);
    c = new THREE.QuadraticBezierCurve3(p0, p1, p2);

    const geometry = new THREE.LatheGeometry(c.getPoints(25), 50);
    const material = new THREE.MeshPhongMaterial({ color: 0xcccccc });
    const lathe = new THREE.Mesh(geometry, material);

    lathe.rotation.x = Math.PI / 2;
    return lathe;
  }

  //fonction qui creer la latte superieur
  function lathe3() {

    p0 = new THREE.Vector3(r, (5 * h) / 8, 0);
    p1 = new THREE.Vector3(r, h, 0);
    p2 = new THREE.Vector3(0, h, 0);
    c = new THREE.QuadraticBezierCurve3(p0, p1, p2);

    const geometry = new THREE.LatheGeometry(c.getPoints(25), 50);
    const material = new THREE.MeshPhongMaterial({ color: 0x82878f });
    const lathe = new THREE.Mesh(geometry, material);

    lathe.rotation.x = Math.PI / 2;
    return lathe;
  }

  //fonction qui creer le cylindre au dessus des lattes
  function cylinder1(coul) {

    const geometry = new THREE.CylinderGeometry(0.085, 0.085, 0.03, 30);
    const material = new THREE.MeshPhongMaterial({ color: coul });
    const cylinder = new THREE.Mesh(geometry, material);

    cylinder.position.z += 0.12;
    cylinder.rotation.x = Math.PI / 2;

    return cylinder;
  }

  //fonction qui creer le cylindre du manche
  function cylinder2(coul) {

    const geometry = new THREE.CylinderGeometry(0.0075, 0.0075, 0.1, 20);
    const material = new THREE.MeshPhongMaterial({ color: coul });
    const cylinder = new THREE.Mesh(geometry, material);

    cylinder.position.x += 0.01;
    cylinder.position.z += 0.16;
    cylinder.rotation.x = Math.PI / 2;
    cylinder.rotation.z = Math.PI / 2;

    return cylinder;
  }

  //fonction qui creer le pavé du manche
  function box(coul) {

    const geometry = new THREE.BoxGeometry(0.015, 0.015, 0.095);
    const material = new THREE.MeshPhongMaterial({ color: coul });
    const box = new THREE.Mesh(geometry, material);

    box.position.x += 0.06;
    box.position.z += 0.12;

    return box;
  }

  //permet de choisir la couleur en fonction de la variable team
  const coul = team == 0 ? 0xff0000 : 0x0000ff;

  //creer le groupe composer
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

  return group;
}

//fonction qui creer le balai
function balai(pos = new THREE.Vector3(), team = 0) {

  //fonction qui creer le cylindre supprieur du manche
  function cylinder1() {

    const geometry = new THREE.CylinderGeometry(0.008, 0.008, 0.7, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x444444 });
    const cylinder = new THREE.Mesh(geometry, material);

    cylinder.position.y -= 0.13;
    cylinder.position.z += 0.34;
    cylinder.rotation.x = Math.PI / 2 + 0.4;

    return cylinder;
  }

  //fonction qui creer le cylindre inferieur du manche
  function cylinder2(coul) {

    const geometry = new THREE.CylinderGeometry(0.01, 0.01, 0.5, 10);
    const material = new THREE.MeshPhongMaterial({ color: coul });
    const cylinder = new THREE.Mesh(geometry, material);

    cylinder.position.y -= 0.303;
    cylinder.position.z += 0.75;
    cylinder.rotation.x = Math.PI / 2 + 0.4;

    return cylinder;
  }

  //fonction qui creer le porte poils
  function box(coul) {

    const geometry = new THREE.BoxGeometry(0.28, 0.03, 0.02);
    const material = new THREE.MeshPhongMaterial({ color: coul });
    const box = new THREE.Mesh(geometry, material);
    box.position.z += 0.02;
    return box;
  }

  //fonction qui creer un poils
  function cone(x = 0, y = 0) {

    const geometry = new THREE.CylinderGeometry(0.005, 0, 0.014, 6);
    const material = new THREE.MeshBasicMaterial({ color: 0x444444 });
    const cylinder = new THREE.Mesh(geometry, material);

    cylinder.position.x += x / 100 - 0.132;
    cylinder.position.y += y / 100 - 0.01;
    cylinder.position.z += 0.007;
    cylinder.rotation.x = Math.PI / 2;

    return cylinder;
  }

  //permet de choisir la couleur en fonction de la variable team
  const coul = team == 0 ? 0xff0000 : 0x0000ff;

  //creer le groupe composer
  const group = new THREE.Group();
  group.add(cylinder1());
  group.add(cylinder2(coul));
  group.add(box(coul));

  for (var i = 0; i < 27; i++) {
    for (var j = 0; j < 3; j++) {
      group.add(cone(i, j)); // permet de creer une liste de poils
    }
  }

  group.position.x = pos.x;
  group.position.y = pos.y;
  group.position.z = pos.z;

  return group;
}

//fonction qui creer le terrain
function terrain(pos = new THREE.Vector3()) {

    //fonction qui creer les hog lines et des ligne de repere horizontaux
    function line1(pos = new THREE.Vector3()) {

      const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 2, 0), new THREE.Vector3(0, -2, 0)]);
      const material = new THREE.LineBasicMaterial({color:0xff0000,linewidth:3});
      const plane = new THREE.Line(geometry, material);

      plane.position.x = pos.x;
      plane.position.y = pos.y;
      plane.position.z = pos.z;

      return plane;
    }

    //fonction qui creer des ligne de repere verticaux
    function line2(pos = new THREE.Vector3()) {

      const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(21.035, 0, 0), new THREE.Vector3(-21.035, 0, 0)]);
      const material = new THREE.LineBasicMaterial({color:0xff0000,linewidth: 3});
      const plane = new THREE.Line(geometry, material);

      plane.position.x = pos.x;
      plane.position.y = pos.y;
      plane.position.z = pos.z;

      return plane;
    }

    //fonction qui creer les cercle de la maison 
    function torus(coul, rin, rext, pos = new THREE.Vector3()){

      const geometry = new THREE.TorusGeometry((rin+rext)/4, (rext-rin)/4, 2, 50);
      const material = new THREE.MeshBasicMaterial({color:coul});
      const torus = new THREE.Mesh(geometry, material);

    torus.position.x = pos.x;
    torus.position.y = pos.y;
    torus.position.z = pos.z;

    return torus;
  }

  //fonction qui creer un plan 
  function plane(pos = new THREE.Vector3(), dimX, dimY, coul) {

    const geometry = new THREE.PlaneGeometry(dimX, dimY);
    const material = new THREE.MeshBasicMaterial({ color: coul, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);

    plane.position.x = pos.x;
    plane.position.y = pos.y;
    plane.position.z = pos.z;

    return plane;
  }

  const group = new THREE.Group();

    group.add(plane(new THREE.Vector3(0, 0, 0), 42, 4, 0xeeeeee)); // terrain de glace
    group.add(plane(new THREE.Vector3(0, 0, -0.02), 100, 100, 0x5d5d5d)); // terain autour (blanc sur blanc c est pas ouf )
    group.add(torus(0xff0000, 0.3, 1.22, new THREE.Vector3(17.3736, 0, 0.01))); // maison (rouge)
    //group.add(torus(0xff0000, 0.3, 1.22, new THREE.Vector3(-17.3736, 0, 0.01))); // autre maison (rouge)
    group.add(torus(0x0000ff, 2.43, 3.66, new THREE.Vector3(17.3736, 0, 0.01))); // maison(bleu)
    //group.add(torus(0x0000ff, 2.43, 3.66, new THREE.Vector3(-17.3736, 0, 0.01))); // autre maisson (bleu)
    group.add(line1(new THREE.Vector3(11, 0, 0))); //deuxieme hog line
    group.add(line1(new THREE.Vector3(-11, 0, 0))); // premiere hogline

    // repere utilisable 
    //group.add(line1(new THREE.Vector3(17.3736, 0, 0))); 
    //group.add(line1(new THREE.Vector3(-17.3736, 0, 0)));
    //group.add(line1(new THREE.Vector3(19.2036, 0, 0)));
    //group.add(line1(new THREE.Vector3(-19.2036, 0, 0)));
    //group.add(line2());

  group.position.x = pos.x;
  group.position.y = pos.y;
  group.position.z = pos.z;

  return group;
}