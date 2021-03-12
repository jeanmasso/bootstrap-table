/* Initialisation des outils utiles au serveur */
const express = require('express')
const ejs = require('ejs')
const path = require('path')
const app = express()
const port = 3000 // Port sur lequel est logé le serveur

/* Initialisation du moteur de modèle à utiliser */
app.engine('html', ejs.renderFile)
app.set('view engine', 'html') // Modèle utilisé: pug
app.set('views', path.join(__dirname, 'views')) // Le dossier dans lequel se trouvent les modèles de vues

/* Initialisation des fichiers statiques (pour les dépendances, styles, images, ...) */
app.use(express.static('public'))
app.use(express.static('node_modules'))

/* Initialisation des url pour l'acquisition des pages */
app.get('/', (req, res) => {
    res.render('index');
})


app.listen(port)