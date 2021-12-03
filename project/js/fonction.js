//fonction permettant l'affchage de la courbe de bezier
function TraceBezierQuadratique(cbeBez) {

    //creation de la courbe 
    let cbeGeometry = new THREE.Geometry();
    cbeGeometry.vertices = cbeBez.getPoints(nbpts_repr);
    let material = new THREE.LineBasicMaterial({ color: 0x050505, linewidth: 1 });
    let BezierQuadra = new THREE.Line(cbeGeometry, material);

    //return la courbe creer
    return BezierQuadra;
}

//fonction qui est appeler pour supprimer l'ancienne courbe et creer la nouvelle a chaque changement des points de contrôle
function refreshBezier(MaScene, P1, P2) {

    MaScene.remove(repr_cb);//retire l'ancien courbe

    // recreer la nouvelle courbe avec les nouveau points de controle puis l'ajoute a la scène
    cb = new THREE.QuadraticBezierCurve3(P_0, P1, P2);
    repr_cb = TraceBezierQuadratique(cb);
    MaScene.add(repr_cb);
}

//fonction qui est appelée pour verifier les collisions des pierres 
function verifcollisionall(pierre) {
    
    verifcollisionborder(pierre);// verifie les collisions avec les bords
    verifcollisionpierre(pierre);// verifie les collision avec les autres pierres
}

//fonction qui verifie si la pierre sort des limites du terrain et si elle sort ,la pierre sera supprimer 
function verifcollisionborder(pierre) {

    // verifie si la pierre est dans l intervalle x < 21 - son_rayon ,et -2 + son_rayon < y < 2 - son_rayon
    if (pierre.position.y > 2 - r_ || pierre.position.y < -2 + r_ || pierre.position.x > 21 - r_) {
        
        if (pierre == pierre_courante) { scene.remove(balai_courant);}// verifie si cet collision est la pierre courante est si oui retirera alors le balai 
        scene.remove(pierre);pierre_jouer.splice(pierre_jouer.indexOf(pierre), 1);// retire la pierre du tableau et de la scene
        calcul_score();
    }
}

//fonction qui verifie les collision entre chaque pierre et si oui applique un rebond
function verifcollisionpierre(pierre) {
    //verifie si il y a d'autre pierres dejà jouer
    if (pierre_jouer.length > 0) {
        trie_tab(); // appel la fonction pour trier le tableau
        /// verifie avec toutes les autre pierre si elle se touche
        for (let i = 0; i < pierre_jouer.length; i++) {
            if (pierre_jouer[i] != pierre && calculDistance(pierre.position, pierre_jouer[i].position) <= (2 * r_)) {
                if (pierre == pierre_courante) collision_courante = true; // permet de stoper si c est la pierre_courante
                let pierre_temp = pierre_jouer[i];
                rebond(pierre, pierre_temp, 1);//creer le rebond de la pierre toucher
            }
            else{calcul_score();} // a la fin des collsions on calcul le score
        }
    }
}

//fonction qui gere le rebond de la pierre toucher
function rebond(pierre1, pierre2, multyply) {

    //calcul du verteur de rebond avec multiplicateur (le suivant sera de moitier)
    let x = pierre2.position.x - pierre1.position.x;
    let y = pierre2.position.y - pierre1.position.y;
    let vec = new THREE.Vector3(x, y, 0);
    pierre2.position.x += x * multyply; pierre2.position.y += y * multyply;
    verifcollisionall(pierre2);

    //on verifie si le multiplicateur est negligeable si non alors on continue et si la pierre n'est pas nul (as toucher un bord est a été retirer de la partie)
    if (multyply >= 0.1 && pierre2 != null) {
        setTimeout(function () {
            // on applique le rebond suivant
            rebond(pierre1, pierre2, multyply / 2);

        }, 16);
    }
    else{verifcollisionall(pierre1);}
}

// fonction qui calcul la distance entre deux objets
function calculDistance(A, B) {
    return Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2)); 
}

//fonction qui trie les pierres de la moins loin à la plus loin par rapport au centre de la maison dans toutes le tableau des pierres dejà jouer 
function trie_tab() {

    ///creation d'un tableau de distance des pierres par rapport au centre de la maison
    let tabTrie = [];
    let vecend = new THREE.Vector3(end_, 0, 0);
    for (let i in pierre_jouer) {
        val = calculDistance(pierre_jouer[i].position, vecend);
        tabTrie.push(val);
    }

    //on trie les pierre de la moins loin à la plus loin
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

// fonction qui calcul le score 
function calcul_score() {
    let score = 0;
    let i = 0;
    // calcul le score si les pierres jouer sont existantes
    if (pierre_jouer.length > 0) {  
        trie_tab(); // trie le tableau
        let coul_depart = get_coul(pierre_jouer[0]); // prend la premiere valeur(la plus proche car trier) et boucle jusqu'à ce que la pierre ne soit pas de la meme couleur
        while (i < pierre_jouer.length && get_coul(pierre_jouer[i]) == coul_depart) {
            score++; i++;
        }
        // affiche dans <div id="score"> le résultat
        getcoul_div(coul_depart);
        let mes = "Les ";
        mes += coul_depart;
        mes += "s : ";
        mes += score
        document.getElementById("score").innerHTML = mes;
    }
    // affiche dans <div id="score"> rater si aucun pierres on été lancer et rater
    else{document.getElementById("score").className = "noir";document.getElementById("score").innerHTML= "Rater"}
}

//fonction qui retour la couleur de la pierre
function get_coul(pierre) {
    //retourne la couleur de la pierre
    if (pierre.children[4].material.color.r == 1) return "rouge";
    else return "bleu";
}
// permet de changer la couleur du div dans l'html en fonction de l'équipe gagnante
function getcoul_div(coul){
    if(coul == "rouge")document.getElementById("score").className = "rouge";
    else document.getElementById("score").className = "bleu";
}

// fonction qui anime le balai devant la pierre
function animation_balai(A) {
    // si le balai n'existe pas et que la pierre a dépasser -11-distance entre pierre et balai
    if (balai_courant == null && A.x > -11-distance_bp) {
        balai_courant = balai(new THREE.Vector3(A.x + distance_bp, Math.sin(A.x), 0), pierre_courante.children[4].material.color.b);
        scene.add(balai_courant);
    }
    // si le balai exite et que la pierre a dépasser -11-distance entre pierre et balai
    if (balai_courant != null && A.x > -11-distance_bp) {
        if (A.x > 11-distance_bp && balai_courant != null) { scene.remove(balai_courant); balai_courant = null; } // si le balai a depasser la seconde ligne alors on le retire
        if (A.x < 11+distance_bp && balai_courant != null) { // si le balai est dans la zone ,il est anime avec un sin pour simuler un vas et viens
            balai_courant.position.x = A.x + distance_bp;
            balai_courant.position.y = ((Math.sin(2 * A.x)) / 2) + A.y;
        }
    }
}

//fonction qui anime la caméra pendant le lancer
function animation_camera(A) {
    //lors des lancer la caméra suit sur un trajectoire rectilignes la pierre
    camera.position.x = A.x - 5;
    camera.position.y = 5;
    camera.position.z = A.z + 10;
    camera.lookAt(pierre_courante.position);
}

//fonction de tir de la pierre (fonction principale)
function tir(i) {

    cbeGeometry = new THREE.Geometry();
    cbeGeometry.vertices = trajet.getPoints(nbpts_tir);

    // premier tour creer la pierre
    if (i == 1 && collision_courante == false) {
        tir_en_cour = true;
        let mod = nb_lancer % 2;
        switch (mod) {
            case 0:
                {
                    scene.add(pierre_courante = pierre(P_0, 1));// pierre rouge
                    pierre_courante.position.z = 0; break;
                }
            case 1:
                {
                    scene.add(pierre_courante = pierre(P_0, 0));// pierre bleu
                    pierre_courante.position.z = 0; break;
                }  
        }
        pierre_jouer.push(pierre_courante); // ajoute la pierre au tableau des pierres jouer
    }
    //tour suivant
    if (i < nbpts_tir && collision_courante == false) {
        i++;
        pierre_courante.position.x = cbeGeometry.vertices[i].x; // deplace la pierre en x selon la courbe 
        pierre_courante.position.y = cbeGeometry.vertices[i].y; // deplace la pierre en y selon la courbe 
        animation_balai(pierre_courante.position); // anime le balai
        if (camera_vue) { animation_camera(pierre_courante.position); } // si oui dans le menu gui , la camera suivera la pierre 
        verifcollisionall(pierre_courante); // verifie les collisions
        if (pierre_courante != null && i == nbpts_tir ) {pierre_courante =null ;} // si la pierre est arriver a sa destiantion ou a rencontrer une autre pierre alors la reference pierre_courante est supprimer (mais est toujours referencer dans le tableau des pierres )
        setTimeout(function () {
            tir(i);
        }, 16);
    }

    if (i == nbpts_tir || collision_courante == true) { tir_en_cour = false; }; // dernier tour ou si une collisions a arreter la pierre courante alors l'utilisateur peut en relancer une autre
}