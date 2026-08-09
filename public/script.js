const boutique = {
  nom: "SUBMIT STORE",
  description: "Vêtements & Accessoires — Brazzaville",
  adresse: "Avenue de la Paix, Brazzaville",
  horaires: "Lun-Sam, 8h - 19h",
  whatsapp: "242067301532",
  mapsLien: "https://www.google.com/maps/search/?api=1&query=Avenue+de+la+Paix+Brazzaville"
};

const avis = [
  { nom: "SAMBA J,", note: 5, commentaire: "Très bon service, produit conforme et livraison rapide !" },
  { nom: "Christian K.", note: 4, commentaire: "Belle qualité, je recommande." },
  { nom: "Syverlan M.", note: 5, commentaire: "Réponse rapide sur WhatsApp, très professionnel." }
];

let produits = [];
let produitSelectionne = null;
let animationFrameId = null;
let indexToast = 0;
let intervalToast = null;

function afficherInfosBoutique() {
  document.getElementById('nom-boutique').textContent = boutique.nom;
  document.getElementById('description-boutique').textContent = boutique.description;
  document.getElementById('adresse-boutique').textContent = boutique.adresse;
  document.getElementById('horaires-boutique').textContent = boutique.horaires;
  document.getElementById('lien-whatsapp').href = `https://wa.me/${boutique.whatsapp}`;
  document.getElementById('lien-maps').href = boutique.mapsLien;
}

async function chargerProduits() {
  try {
    const reponse = await fetch('/api/produits');
    produits = await reponse.json();
    afficherProduits();
    afficherCarrousel();
    definirFondBanniere();
  } catch (erreur) {
    console.error('Erreur de chargement des produits :', erreur);
  }
}

function definirFondBanniere() {
  const fond = document.getElementById('banniere-fond');
  if (!fond) return;

  const produitsVedette = produits.filter(p => p.vedette);
  const imageChoisie = produitsVedette.length > 0 ? produitsVedette[0].image : (produits[0]?.image || '');

  if (imageChoisie) {
    fond.style.backgroundImage = `url('${imageChoisie}')`;
  }
}

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

function afficherCarrousel() {
  const conteneur = document.getElementById('carrousel-produits');
  conteneur.innerHTML = '';

  const produitsVedette = produits.filter(p => p.vedette);
  if (produitsVedette.length === 0) return;

  const doubled = [...produitsVedette, ...produitsVedette];

  doubled.forEach(produit => {
    conteneur.innerHTML += `
      <div class="carrousel-item" onclick="voirImageProduit('${produit.image}')">
        <img src="${produit.image}" alt="${produit.nom || 'produit'}">
        ${produit.nom ? `<p>${produit.nom}</p>` : ''}
      </div>
    `;
  });

  demarrerDefilementAuto();
}

function demarrerDefilementAuto() {
  const carrousel = document.getElementById('carrousel-produits');
  if (!carrousel || carrousel.children.length === 0) return;

  if (animationFrameId) cancelAnimationFrame(animationFrameId);

  let enPause = false;
  const vitesse = 0.6;

  function step() {
    if (!enPause) {
      carrousel.scrollLeft += vitesse;
      const moitie = carrousel.scrollWidth / 2;
      if (carrousel.scrollLeft >= moitie) {
        carrousel.scrollLeft -= moitie;
      }
    }
    animationFrameId = requestAnimationFrame(step);
  }

  animationFrameId = requestAnimationFrame(step);

  carrousel.addEventListener('touchstart', () => { enPause = true; });
  carrousel.addEventListener('touchend', () => { setTimeout(() => enPause = false, 3000); });
  carrousel.addEventListener('mousedown', () => { enPause = true; });
  carrousel.addEventListener('mouseup', () => { setTimeout(() => enPause = false, 3000); });
}

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
  const noteMoyenneDiv = document.getElementById('note-moyenne');
  const moyenne = (avis.reduce((total, a) => total + a.note, 0) / avis.length).toFixed(1);
  noteMoyenneDiv.innerHTML = `${genererEtoiles(Math.floor(moyenne))} ${moyenne}/5 (${avis.length} avis)`;
}

function demarrerToastAvis() {
  if (avis.length === 0) return;

  afficherToastSuivant();
  intervalToast = setInterval(afficherToastSuivant, 6000);
}

function afficherToastSuivant() {
  const toast = document.getElementById('toast-avis');
  const a = avis[indexToast];

  document.getElementById('toast-etoiles').textContent = genererEtoiles(a.note);
  document.getElementById('toast-nom').textContent = a.nom;
  document.getElementById('toast-commentaire').textContent = a.commentaire;

  toast.classList.remove('cachee');

  setTimeout(() => {
    toast.classList.add('cachee');
  }, 4000);

  indexToast = (indexToast + 1) % avis.length;
}

function fermerToast() {
  document.getElementById('toast-avis').classList.add('cachee');
  clearInterval(intervalToast);
}

function commander(nomProduit, prix) {
  produitSelectionne = { nom: nomProduit, prix: prix };
  const texteProduit = nomProduit ? `${nomProduit} — ${prix}` : prix;
  document.getElementById('modal-produit').textContent = texteProduit;
  document.getElementById('modal-commande').classList.remove('modal-cachee');
}

function fermerModal() {
  document.getElementById('modal-commande').classList.add('modal-cachee');
}

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

afficherInfosBoutique();
chargerProduits();
afficherAvis();
demarrerToastAvis();