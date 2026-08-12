const fileInput = document.getElementById('loadJsonButton');
const output = document.getElementById('jsonOutput');
const newChronoButton = document.getElementById('newchrono');
const configmenu=document.getElementById('chronoConfig');
const validermenu=document.getElementById('createChrono');
// en cas d'upload de fichier
fileInput.addEventListener('change', async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const texte = await file.text();

    // formattag  du texte JSON en objet JS
    output.textContent = texte;
    try {
        const jsonData = JSON.parse(texte);
        console.log('JSON parsed successfully:', jsonData);
    }    catch (error) {
        console.error('Error parsing JSON:', error);
    }
});
newChronoButton.addEventListener('click', () => {
    configmenu.classList.toggle('hidden');
});
validermenu.addEventListener('click', () => {
    const config={};
    const fields= configmenu.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        config[field.name] = field.value;
    });
    console.log('Configuration:', config);
    CreateChronoFromConfig(config);
    configmenu.classList.add('hidden');
});
document.addEventListener('click', (event) => {
    if (!configmenu.contains(event.target) && event.target !== newChronoButton) {
        configmenu.classList.add('hidden');
    }
});
function CreateChronoFromConfig(config) {
    // Logique pour créer une chronologie à partir de la configuration fournie
    console.log('Creating chrono with config:', config);
    const chrono = document.getElementById('ChronoContainer');
    // Exemple d'injection dans le DOM (ex: de (50,100) vers (600,100))
    creerFlechePleineMonobloc({
    parent: chrono,
    largeurTotal: 2000,
    epaisseur: 150,
    couleur: "#ffffff"
    });
}
/**
 * Crée une flèche SVG pleine dont la ligne et la base de la pointe
 * ont exactement la même épaisseur.
 */
function creerFlechePleineMonobloc(params) {
  const {
    parent,            // Élément DOM où injecter le SVG
    largeurTotal = 500,// Longueur totale de la flèche
    epaisseur = 20,    // Épaisseur de la ligne (et base de la pointe)
    couleur = "#3b82f6",
    id = "fleche-dynamique"
  } = params;

  const ns = "http://www.w3.org/2000/svg";

  //--- 1. Dimensions de la pointe ---
  // Pour un beau rendu, la pointe doit être plus longue que large.
  // On la définit ici comme 1.5 fois l'épaisseur.
  const longueurPointe = epaisseur * 1.5;
  const longueurCorps = largeurTotal - longueurPointe;

  // Si l'épaisseur demandée est trop grande pour la largeur totale.
  if (longueurCorps < 0) {
    console.error("L'épaisseur de la flèche est trop grande pour sa largeur.");
    return;
  }

  //--- 2. Création du conteneur SVG ---
  const svg = document.createElementNS(ns, "svg");
  // Le viewbox définit notre espace de travail interne : (x, y, largeur, hauteur)
  // On centre le dessin verticalement à y=0.
  svg.setAttribute("viewBox", `0 ${-epaisseur} ${largeurTotal} ${epaisseur * 2}`);
  svg.setAttribute("width", "100%"); // Occupe la largeur de son parent
  svg.setAttribute("height", epaisseur * 2); // Hauteur fixe basée sur l'épaisseur
  svg.setAttribute("id", id);
  svg.style.overflow = "visible"; // Empêche le rognage si on ajoute des effets

  //--- 3. Création du tracé (Path) ---
  const path = document.createElementNS(ns, "path");

  // Demi-épaisseur pour les calculs de coordonnées
  const demiEp = epaisseur / 2;

  // Calcul du tracé personnalisé de la flèche (M=Move To, H=Horizontal L=Line To, V=Vertical, Z=Close)
  // On commence au milieu à gauche et on fait le tour.
  const d = `
    M 0,${-demiEp} 
    H ${longueurCorps} 
    V ${-demiEp} 
    L ${largeurTotal},0 
    L ${longueurCorps},${demiEp} 
    V ${demiEp} 
    H 0 
    Z
  `;

  path.setAttribute("d", d);
  path.setAttribute("fill", couleur);
  path.setAttribute("stroke", "none"); // Pas de contour pour garantir la précision

  //--- 4. Injection ---
  svg.appendChild(path);
  parent.appendChild(svg);
}
