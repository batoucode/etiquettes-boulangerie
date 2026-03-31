# 🍰 Étiquettes Boulangerie

Application web pour créer et personnaliser des étiquettes de prix pour gâteaux de boulangerie.

## ✨ Fonctionnalités

### Page 1 : Plusieurs Étiquettes
- Créer plusieurs étiquettes en même temps
- Ajouter nom, prix et image du gâteau
- Gérer plusieurs étiquettes depuis une liste
- Imprimer toutes les étiquettes
- Prévisualisation en grille

### Page 2 : Personnaliser Une Étiquette
- Personnaliser une seule étiquette
- Définir le prix et l'image du gâteau
- Configurer les dimensions (largeur × hauteur)
- Choisir la couleur de fond
- Aperçu en direct avec dimensions exactes
- Imprimer ou télécharger en PDF

### 🌙 Thème Dark/Light
- Interrupteur de thème en haut à gauche
- Sauvegarde automatique de la préférence
- Design adapté aux deux thèmes

## 🚀 Démarrage

### Option 1 : Ouverture directe
1. Ouvrez `index.html` dans votre navigateur
2. Commencez à créer des étiquettes

### Option 2 : Serveur local
```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js
npx http-server
```
Puis visitez `http://localhost:8000`

## 📱 Utilisation

### Créer plusieurs étiquettes
1. Allez à la page "Plusieurs Étiquettes"
2. Remplissez le formulaire (nom, prix, image optionnelle)
3. Cliquez sur "Ajouter Étiquettes"
4. Imprimez ou téléchargez en PDF

### Personnaliser une étiquette
1. Allez à la page "Personnaliser Une Étiquette"
2. Configurez tous les paramètres :
   - Nom et prix
   - Image du gâteau
   - Dimensions en cm
   - Couleur de fond
3. Voyez l'aperçu en direct
4. Imprimez avec les dimensions exactes

## 💾 Sauvegarde des données

Les données sont sauvegardées automatiquement dans le localStorage :
- Les étiquettes multiples sur la première page
- Les paramètres de l'étiquette unique sur la deuxième page
- La préférence de thème (clair/sombre)

## 🎨 Personnalisation

### Couleurs
Modifiez les variables CSS dans `style.css` (section `:root`):
```css
--color-primary: #d4a574;  /* Couleur principale */
--color-accent: #8b4513;    /* Couleur d'accent */
```

### Thème Dark
Les couleurs du thème sombre sont définies dans :
```css
html[data-theme="dark"] {
  --color-bg: #1a1a1a;
  /* ... */
}
```

## 🖨️ Impression et PDF

### Imprimer
1. Cliquez sur "Imprimer"
2. Configurez votre imprimante
3. Marges recommandées : 0 cm

### Télécharger en PDF
1. Cliquez sur "Imprimer"
2. Sélectionnez "Enregistrer en PDF"
3. Choisissez votre emplacement

## 📦 Déploiement

### Sur Vercel
```bash
# 1. Initialisez un repo Git
git init
git add .
git commit -m "Initial commit"

# 2. Créez un repo sur GitHub
# Visitez https://github.com/new

# 3. Poussez votre code
git remote add origin https://github.com/votre-pseudo/etiquettes.git
git branch -M main
git push -u origin main

# 4. Déployez sur Vercel
# Visitez https://vercel.com/new
# Connectez votre repo GitHub
# Cliquez sur "Deploy"
```

### Configuration Vercel (vercel.json)
Le fichier `vercel.json` configure automatiquement le déploiement.

## 🔧 Structure du projet

```
etiquettes/
├── index.html          # Page 1 : Plusieurs étiquettes
├── single.html         # Page 2 : Une seule étiquette
├── style.css           # Styles (avec thème dark/light)
├── script.js           # Logique JavaScript
├── vercel.json         # Configuration Vercel
├── README.md           # Ce fichier
└── .gitignore          # Fichiers à ignorer
```

## 🌐 Navigateurs supportés

- Chrome/Edge (dernières versions)
- Firefox (dernières versions)
- Safari (dernières versions)

## 📝 Notes

- Les images sont converties en base64 et stockées localement
- Les données ne sont pas sauvegardées sur un serveur (stockage local uniquement)
- L'impression respecte les dimensions configurées

## 🐛 Problèmes connus

Aucun actuellement. Signalez les bugs via GitHub Issues.

## 📄 Licence

MIT - Libre d'utilisation

---

**Créé avec ❤️ pour les boulangeries**
