// Infos de la boutique — à modifier pour chaque client
const boutique = {
  nom: "SUBMIT STORE",
  description: "Vêtements & Accessoires — Brazzaville",
  adresse: "Avenue de la Paix, Brazzaville",
  horaires: "Lun-Sam, 8h - 19h",
  whatsapp: "242067301532",
  mapsLien: "https://www.google.com/maps/search/?api=1&query=Avenue+de+la+Paix+Brazzaville"
};

// Liste des avis — le commerçant pourra en ajouter ici
const avis = [
  { nom: "Aïcha K.", note: 5, commentaire: "Très bon service, produit conforme et livraison rapide !" },
  { nom: "Franck M.", note: 4, commentaire: "Belle qualité, je recommande." },
  { nom: "Grâce T.", note: 5, commentaire: "Réponse rapide sur WhatsApp, très professionnel." }
];

let produits = [];
let produitSelectionne = null;

// Remplit les infos de la boutique dans le HTML
function afficherInfosBoutique() {
  document.getElementById('nom-boutique').textContent = boutique.nom;
  document.getElementById('description-boutique').textContent = boutique.description;
  document.getElementById('adresse-boutique').textContent = boutique.adresse;
  document.getElementById('horaires-boutique').textContent = boutique.horaires;
  document.getElementById('lien-whatsapp').href = `https://wa.me/${boutique.whatsapp}`;
  document.getElementById('lien-maps').href = boutique.mapsLien;
}

// Va chercher les produits dans la base de données (Supabase, via l'API)
async function chargerProduits() {
  try {
    const reponse = await fetch('/api/produits');
    produits = await reponse.json();
    afficherProduits();
    afficherCarrousel();
  } catch (erreur) {
    console.error('Erreur de chargement des produits :', erreur);
  }
}

// Affiche les cartes produits
function afficherProduits() {
  const conteneur = document.getElementById('liste-produits');
  conteneur.innerHTML = '';

  produits.forEach(produit => {
    const badgePromo = produit.ancien_prix ? `<span class="badge-promo">PROMO</span>` : '';
    const ancienPrixHtml = produit.ancien_prix ? `<span class="ancien-prix">${produit.ancien_prix}</span>` : '';
    const nomHtml = produit.nom ? `<h3>${produit.nom}</h3>` : '';

    conteneur.innerHTML += `
      <div class="produit">
        <div class="image-wrapper">
          <img src="${produit.image}" alt="${produit.nom || 'produit'}" onclick="voirImageProduit('${produit.image}')">
          ${badgePromo}
        </div>
        <div class="produit-details">
          ${nomHtml}
          <p class="prix">${ancienPrixHtml} ${produit.prix}</p>
          <button class="btn-commander" onclick="commander('${produit.nom || ''}', '${produit.prix}')">Commander</button>
        </div>
      </div>
    `;
  });
}

// Affiche le carrousel de produits vedettes
function afficherCarrousel() {
  const conteneur = document.getElementById('carrousel-produits');
  conteneur.innerHTML = '';

  produits.slice(0, 8).forEach(produit => {
    conteneur.innerHTML += `
      <div class="carrousel-item" onclick="voirImageProduit('${produit.image}')">
        <img src="${produit.image}" alt="${produit.nom || 'produit'}">
        ${produit.nom ? `<p>${produit.nom}</p>` : ''}
      </div>
    `;
  });
}

// Aperçu de l'image en grand
function voirImageProduit(url) {
  document.getElementById('image-agrandie').src = url;
  document.getElementById('modal-image').classList.remove('modal-cachee');
}

function fermerApercu() {
  document.getElementById('modal-image').classList.add('modal-cachee');
}

function genererEtoiles(note) {
  const pleines = '★'.repeat(note);
  const vides = '☆'.repeat(5 - note);
  return pleines + vides;
}

function afficherAvis() {
  const conteneur = document.getElementById('liste-avis');
  const noteMoyenneDiv = document.getElementById('note-moyenne');

  conteneur.innerHTML = '';

  avis.forEach(a => {
    conteneur.innerHTML += `
      <div class="avis">
        <div class="avis-header">
          <span class="avis-nom">${a.nom}</span>
          <span class="etoiles">${genererEtoiles(a.note)}</span>
        </div>
        <p class="avis-commentaire">${a.commentaire}</p>
      </div>
    `;
  });

  const moyenne = (avis.reduce((total, a) => total + a.note, 0) / avis.length).toFixed(1);
  noteMoyenneDiv.innerHTML = `${genererEtoiles(Math.floor(moyenne))} ${moyenne}/5 (${avis.length} avis)`;
}

// Ouvre le formulaire de commande
function commander(nomProduit, prix) {
  produitSelectionne = { nom: nomProduit, prix: prix };
  const texteProduit = nomProduit ? `${nomProduit} — ${prix}` : prix;
  document.getElementById('modal-produit').textContent = texteProduit;
  document.getElementById('modal-commande').classList.remove('modal-cachee');
}

// Ferme le formulaire de commande
function fermerModal() {
  document.getElementById('modal-commande').classList.add('modal-cachee');
}

// Envoie la commande sur WhatsApp
function envoyerCommande() {
  const nom = document.getElementById('client-nom').value;
  const tel = document.getElementById('client-tel').value;
  const quantite = document.getElementById('client-quantite').value;

  if (!nom || !tel) {
    alert("Merci de remplir votre nom et votre numéro.");
    return;
  }

  const ligneProduit = produitSelectionne.nom
    ? `Produit : ${produitSelectionne.nom}`
    : `Produit`;

  const message = `Bonjour, je souhaite commander :
${ligneProduit}
Prix : ${produitSelectionne.prix}
Quantité : ${quantite}
Nom : ${nom}
Téléphone : ${tel}`;

  const url = `https://wa.me/${boutique.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
  fermerModal();
}

// Formulaire "Laisser un avis"
function ouvrirFormAvis() {
  document.getElementById('modal-avis').classList.remove('modal-cachee');
}

function fermerModalAvis() {
  document.getElementById('modal-avis').classList.add('modal-cachee');
}

function envoyerAvis() {
  const nom = document.getElementById('avis-nom').value;
  const note = document.getElementById('avis-note').value;
  const commentaire = document.getElementById('avis-commentaire').value;

  if (!nom || !commentaire) {
    alert("Merci de remplir votre nom et votre commentaire.");
    return;
  }

  const message = `Nouvel avis client :
Nom : ${nom}
Note : ${note}/5 ⭐
Commentaire : ${commentaire}`;

  const url = `https://wa.me/${boutique.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
  fermerModalAvis();
}

// Lance l'affichage au chargement de la page
afficherInfosBoutique();
chargerProduits();
afficherAvis();