//variables globales

h_ = 0.135; // hauteur des pierres(non utiliser dans les assets)
r_ = (0.745 / Math.PI) / 2; // rayon des pierres (non utiliser dans les assets)
start_ = -17.3536;  // position x du départ 
end_ = 17.3536; // position x du centre de la maison d arriver
distance_bp = 1; // correspond a la disctance entre le balai et la pierre 
nbpts_repr = 100; // nb de points pour tracer la courbe (modifiable, default : 100)
nbpts_tir = 200; // nombre de point pour lors des tirs (modifiable, default : 200)
nb_lancer = 0; // nombre de lancer dans la partie 
tir_en_cour = false; // variable si un tir est en cour 
repr_cb = null; // representation de la courbe 
trajet = null;  // trajet que la pierre fera (clone de la courbe au moment ou l'on appui sur tirer)
pierre_courante = null; // pierre qui est en train d'être jouer
balai_courant = null; // balai qui accompagne la pierre 
collision_courante = false; // si des collisions sont detecter en ce moments
pierre_jouer = []; // tableau des pierres jouer dans la partie 
camera_vue = true; // sur la pierre (true);camera sur les trois position (false)
P_0 = new THREE.Vector3(start_, 0, 0.2); // point d'origine de la courbes