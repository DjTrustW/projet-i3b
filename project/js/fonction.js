function TraceBezierQuadratique(cbeBez) {
    let cbeGeometry = new THREE.Geometry();
    cbeGeometry.vertices = cbeBez.getPoints(nbpts_repr);
    let material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1 });
    let BezierQuadra = new THREE.Line(cbeGeometry, material);
    return BezierQuadra;
}

function refreshBezier(MaScene, P1, P2) {
    MaScene.remove(repr_cb);
    cb = new THREE.QuadraticBezierCurve3(P_0, P1, P2);
    repr_cb = TraceBezierQuadratique(cb);
    MaScene.add(repr_cb);
}

function verifcollisionborder(pierre) {
    if (pierre_courante.position.y > 2 - r_ || pierre_courante.position.y < -2 + r_ || pierre_courante.position.x > 20 - r_) {
        scene.remove(pierre);
        pierre_jouer.splice(pierre_jouer.indexOf(pierre), 1);
    }
}

function verifcollisionpierre(pierre) {
    if (pierre_jouer.length > 0) {
        for (let i = 0; i < pierre_jouer.length; i++) {
            if (calculDistance(pierre.position, pierre_jouer[i].position) < (2 * r_) && pierre_jouer[i] != pierre) {
                collision_courante = true;
                let pierre_temp = pierre_jouer[i];
                let vec  = new THREE.Vector3(pierre.x-pierre_temp.x,pierre.y-pierre_temp.y,pierre.z-pierre_temp.z);
                rebond(pierre,vec);
            }
        }
    }
}
function rebond (pierre ,vec){
    setTimeout(function() {
        let A = new THREE.Vector3(pierre.x,pierre.y,pierre.z);
        console.log(A);
        console.log(vec);
        A.add(vec).multiplyScalar(0.75);
        pierre.x = A.x;pierre.y = A.y;

        if(A.length <0.001){
            rebond(pierre,A);
        }
    }, 16);
}
function verifcollisionall(pierre){
    verifcollisionborder(pierre);
    verifcollisionpierre(pierre);
}

function calculDistance(A, B) {
    return Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
}