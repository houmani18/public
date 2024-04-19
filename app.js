const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/reda', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const formDataSchema = new mongoose.Schema({
  nom: String,
  age: Number,
  genre: { type: String, enum: ['homme', 'femme'] }, 
});

const FormData = mongoose.model('FormData', formDataSchema);

app.use(express.urlencoded({ extended: true }));

app.post('/submit', async (req, res) => {
  const formData = req.body;
  console.log('Données reçues du formulaire :');
  console.log('Nom et prénom :', formData.nom);
  console.log('Age :', formData.age);
  console.log('Genre :', formData.genre); 

  const age = parseInt(formData.age);
  const selectedGenres = Array.isArray(formData.genre) ? formData.genre : [formData.genre];
  const isMale = selectedGenres.includes('homme');
  const isFemale = selectedGenres.includes('femme');

  if (age <= 17 || age >= 25) {
    return res.send('<p>Age erroné ! Veuillez remplir de nouveau le formulaire</p>');
  }

  if (selectedGenres.length !== 1 || (isMale && isFemale)) {
    return res.send('<p>Genre erroné ! Veuillez remplir de nouveau le formulaire</p>');
  }

  try {
    const newFormData = new FormData({
      nom: formData.nom,
      age: age,
      genre: selectedGenres[0],
    });
    await newFormData.save();
    console.log('Données enregistrées avec succès dans MongoDB.');
    res.send('<p>Formulaire soumis avec succès et données enregistrées !</p>');
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement des données dans MongoDB :', err);
    res.status(500).send('<p>Une erreur s\'est produite lors de la soumission du formulaire.</p>');
  }
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
