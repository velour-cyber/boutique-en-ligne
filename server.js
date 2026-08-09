
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const express = require('express');
const supabase = require('./supabaseClient');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Récupérer tous les produits
app.get('/api/produits', async (req, res) => {
  const { data, error } = await supabase.from('produits').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Ajouter un produit
// Basculer le statut vedette d'un produit
app.patch('/api/produits/:id/vedette', async (req, res) => {
  const { id } = req.params;
  const { vedette } = req.body;
  const { data, error } = await supabase.from('produits').update({ vedette }).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
// Supprimer un produit
app.delete('/api/produits/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('produits').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});
// Upload d'une image produit
app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu.' });

  const nomFichier = `${Date.now()}-${req.file.originalname}`;

  const { error } = await supabase.storage
    .from('images-produits')
    .upload(nomFichier, req.file.buffer, { contentType: req.file.mimetype });

  if (error) return res.status(500).json({ error: error.message });

  const { data } = supabase.storage.from('images-produits').getPublicUrl(nomFichier);
  res.json({ url: data.publicUrl });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});