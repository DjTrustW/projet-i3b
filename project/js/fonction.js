function TraceBezierQuadratique(cbeBez) {
    let cbeGeometry = new THREE.Geometry();
    cbeGeometry.vertices = cbeBez.getPoints(nbpts_repr);
    let material = new THREE.LineBasicMaterial({ color: 0x050505, linewidth: 1 });
    let BezierQuadra = new THREE.Line(cbeGeometry, material);
    return BezierQuadra;
}

function refreshBezier(MaScene, P1, P2) {
    MaScene.remove(repr_cb);
    cb = new THREE.QuadraticBezierCurve3(P_0, P1, P2);
    repr_cb = TraceBezierQuadratique(cb);
    MaScene.add(repr_cb);
}

function verifcollisionall(pierre) {
    verifcollisionborder(pierre);
    verifcollisionpierre(pierre);
    calcul_score();
}

function verifcollisionborder(pierre) {
    if (pierre_courante.position.y > 2 - r_ || pierre_courante.position.y < -2 + r_ || pierre_courante.position.x > 21 - r_) {
        scene.remove(pierre);
        pierre_jouer.splice(pierre_jouer.indexOf(pierre), 1);
    }
}

function verifcollisionpierre(pierre) {
    if (pierre_jouer.length > 0) {
        for (let i = 0; i < pierre_jouer.length; i++) {
            if (pierre_jouer[i] != pierre && calculDistance(pierre.position, pierre_jouer[i].position) <= (2 * r_) && calculDistance(pierre.position, pierre_jouer[i].position) != 0) {
                collision_courante = true;
                let pierre_temp = pierre_jouer[i];
                rebond(pierre.clone(), pierre, pierre_temp, 1);
            }
        }
    }
}

function rebond(pierre1_init_pos, pierre1, pierre2, multyply) {
    let x = pierre2.position.x - pierre1_init_pos.position.x;
    let y = pierre2.position.y - pierre1_init_pos.position.y;
    let vec = new THREE.Vector3(x, y, 0);
    pierre2.position.x += x * multyply; pierre2.position.y += y * multyply;
    verifcollisionall(pierre2);
    if (multyply >= 0.1 && pierre2 != null) {
        setTimeout(function () {

            rebond(pierre1_init_pos, pierre1, pierre2, multyply / 2);

        }, 16);
    }
}

function calculDistance(A, B) {
    return Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
}

function trie_tab() {
    let tabTrie = [];
    let vecend = new THREE.Vector3(end_, 0, 0);
    for (let i in pierre_jouer) {
        val = calculDistance(pierre_jouer[i].position, vecend);
        tabTrie.push(val);
    }

    let n = tabTrie.length;
    for (let i = 0; i < n - 1; i++) {
        min = i;
        for (let j = i + 1; j < n; j++) {
            if (tabTrie[j] < tabTrie[min]) {
                min = j;
            }
        }
        if (min != i) {
            [tabTrie[i], tabTrie[min]] = [tabTrie[min], tabTrie[i]];
            [pierre_jouer[i], pierre_jouer[min]] = [pierre_jouer[min], pierre_jouer[i]];
        }
    }
}

function calcul_score() {
    trie_tab();
    let score = 0;
    let i = 0;
    if (pierre_jouer.length) {
        let coul_depart = get_coul(pierre_jouer[0]);
        while (i < pierre_jouer.length && get_coul(pierre_jouer[i]) == coul_depart) {
            score++; i++;
        }
        let mes = "Les ";
        mes += coul_depart;
        mes += " : ";
        mes += score
        document.getElementById("score").innerHTML = mes;
    }
    else { document.getElementById("score").innerHTML = "wesh faut pas viser a coter"; }
}

function get_coul(pierre) {
    if (pierre.children[4].material.color.r == 1) return "rouge";
    else return "bleu";
}

function animation_balai(A) {
    if (balai_courant == null && A.x >= -12) {
        balai_courant = balai(new THREE.Vector3(A.x + 1, Math.sin(A.x + 1), 0), pierre_courante.children[4].material.color.b);
        scene.add(balai_courant);
    }
    if (balai_courant != null && A.x > -12) {
        if (A.x > 12 && balai_courant != null) { scene.remove(balai_courant); balai_courant = null; }
        if (A.x < 12 && balai_courant != null) {
            balai_courant.position.x = A.x + 1;
            balai_courant.position.y = ((Math.sin(2 * A.x)) / 2) + A.y;
        }
    }
}

function animation_camera(A) {
    camera.position.x = A.x - 5;
    camera.position.y = 5;
    camera.position.z = A.z + 10;
    camera.lookAt(pierre_courante.position);
}

function tir(i) {

    cbeGeometry = new THREE.Geometry();
    cbeGeometry.vertices = trajet.getPoints(nbpts_tir);
    if (i == 1 && collision_courante == false) {
        tir_en_cour = true;
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
        pierre_jouer.push(pierre_courante);
    }
    if (i < nbpts_tir && collision_courante == false) {
        i++;
        pierre_courante.position.x = cbeGeometry.vertices[i].x;
        pierre_courante.position.y = cbeGeometry.vertices[i].y;
        animation_balai(pierre_courante.position);
        if (camera_vue) { animation_camera(pierre_courante.position); }
        verifcollisionall(pierre_courante);
        if (pierre_courante != null) { calcul_score(); }
        setTimeout(function () {
            tir(i);
        }, 16);
    }

    if (i == nbpts_tir || collision_courante == true) { tir_en_cour = false; };
}