const MOT_DE_PASSE_ADMIN = "0000"; // change ce mot de passe !

function verifierMotDePasse() {
  const saisie = document.getElementById('mot-de-passe').value;
  if (saisie === MOT_DE_PASSE_ADMIN) {
    document.getElementById('ecran-login').classList.add('cachee');
    document.getElementById('ecran-admin').classList.remove('cachee');
    chargerProduitsAdmin();
  } else {
    document.getElementById('erreur-login').textContent = "Mot de passe incorrect.";
  }
}

async function chargerProduitsAdmin() {
  const reponse = await fetch('/api/produits');
  const produits = await reponse.json();
  const conteneur = document.getElementById('liste-admin-produits');
  conteneur.innerHTML = '';

  produits.forEach(p => {
    conteneur.innerHTML += `
      <div class="produit-admin">
       <img src="${p.image}" alt="${p.nom}" onclick="voirImage('${p.image}')">
        <div class="produit-admin-infos">
          <h4>${p.nom || '(sans nom)'}</h4>
          <p>${p.prix}</p>
        </div>
        <button class="btn-vedette ${p.vedette ? 'actif' : ''}" onclick="basculerVedette(${p.id}, ${!p.vedette})">${p.vedette ? '⭐ Retirer' : '☆ Mettre en vedette'}</button>
        <button class="btn-supprimer" onclick="supprimerProduit(${p.id})">Supprimer</button>
      </div>
    `;
  });
}

function voirImage(url) {
  document.getElementById('image-agrandie').src = url;
  document.getElementById('modal-image').classList.remove('modal-cachee');
}

function fermerApercu() {
  document.getElementById('modal-image').classList.add('modal-cachee');
}

async function ajouterProduit() {
  const nom = document.getElementById('nouveau-nom').value || null;
  const prix = document.getElementById('nouveau-prix').value;
  const ancien_prix = document.getElementById('nouveau-ancien-prix').value || null;
  const fichierImage = document.getElementById('nouveau-image').files[0];
  const vedette = document.getElementById('nouveau-vedette').checked;

  if (!prix || !fichierImage) {
    document.getElementById('message-ajout').textContent = "Remplis au moins le prix et choisis une photo.";
    return;
  }

  document.getElementById('message-ajout').textContent = "⏳ Envoi en cours...";

  // 1. Upload de l'image
  const formData = new FormData();
  formData.append('image', fichierImage);

  const uploadReponse = await fetch('/api/upload', { method: 'POST', body: formData });
  const uploadData = await uploadReponse.json();

  if (!uploadReponse.ok) {
    document.getElementById('message-ajout').textContent = "Erreur lors de l'envoi de l'image.";
    return;
  }

  // 2. Créer le produit avec l'URL de l'image obtenue
  const reponse = await fetch('/api/produits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nom, prix, ancien_prix, image: uploadData.url, vedette })
  });

  if (reponse.ok) {
    document.getElementById('message-ajout').textContent = "✅ Produit ajouté !";
    document.getElementById('nouveau-nom').value = '';
    document.getElementById('nouveau-prix').value = '';
    document.getElementById('nouveau-ancien-prix').value = '';
    document.getElementById('nouveau-image').value = '';
    document.getElementById('nouveau-vedette').checked = false;
    chargerProduitsAdmin();
  } else {
    document.getElementById('message-ajout').textContent = "Erreur lors de l'ajout.";
  }
}

async function basculerVedette(id, nouveauStatut) {
  await fetch(`/api/produits/${id}/vedette`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vedette: nouveauStatut })
  });
  chargerProduitsAdmin();
}

async function supprimerProduit(id) {
  if (!confirm("Supprimer ce produit ?")) return;
  await fetch(`/api/produits/${id}`, { method: 'DELETE' });
  chargerProduitsAdmin();
}