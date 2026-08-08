// Infos de la boutique — à modifier pour chaque client
const boutique = {
  nom: "Ma Boutique",
  description: "Vêtements & Accessoires — Brazzaville",
  adresse: "Avenue de la Paix, Brazzaville",
  horaires: "Lun-Sam, 8h - 19h",
  whatsapp: "242XXXXXXXXX",
  mapsLien: "https://www.google.com/maps/search/?api=1&query=Avenue+de+la+Paix+Brazzaville"
};

// Liste des produits — modifie/ajoute ici tes vrais produits
const produits = [
  {
    nom: "Chemise homme",
    prix: "8 000 FCFA",
    image: "https://via.placeholder.com/220x150"
  },
  {
    nom: "Robe femme",
    prix: "15 000 FCFA",
    image: "https://via.placeholder.com/220x150"
  },
  {
    nom: "Sac à main",
    prix: "12 000 FCFA",
    image: "https://via.placeholder.com/220x150"
  }
];

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

// Affiche les cartes produits
function afficherProduits() {
  const conteneur = document.getElementById('liste-produits');
  conteneur.innerHTML = '';

  produits.forEach(produit => {
    conteneur.innerHTML += `
      <div class="produit">
        <img src="${produit.image}" alt="${produit.nom}">
        <div class="produit-details">
          <h3>${produit.nom}</h3>
          <p class="prix">${produit.prix}</p>
          <button class="btn-commander" onclick="commander('${produit.nom}', '${produit.prix}')">Commander</button>
        </div>
      </div>
    `;
  });
}

// Ouvre le formulaire de commande
function commander(nomProduit, prix) {
  produitSelectionne = { nom: nomProduit, prix: prix };
  document.getElementById('modal-produit').textContent = `${nomProduit} — ${prix}`;
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

  const message = `Bonjour, je souhaite commander :
Produit : ${produitSelectionne.nom}
Prix : ${produitSelectionne.prix}
Quantité : ${quantite}
Nom : ${nom}
Téléphone : ${tel}`;

  const url = `https://wa.me/${boutique.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
  fermerModal();
}

// Lance l'affichage au chargement de la page
afficherInfosBoutique();
afficherProduits();