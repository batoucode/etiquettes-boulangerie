// =====================================================
// GESTION DU THÈME
// =====================================================
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);
updateThemeIcon();

themeToggle.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  htmlElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon();
});

function updateThemeIcon() {
  const theme = htmlElement.getAttribute('data-theme');
  const icon = themeToggle.querySelector('.theme-icon');
  icon.textContent = theme === 'light' ? '🌙' : '☀️';
}

// =====================================================
// PAGE SINGLE (PERSONNALISER UNE ÉTIQUETTE)
// =====================================================

console.log('📜 Script chargé - Vérification de la page...');

// Vérifier si nous sommes sur la page single
function isCurrentPageSingle() {
  const path = window.location.pathname;
  return path.includes('single.html') || path.endsWith('/single');
}

// Vérifier si tous les éléments existent
function isSinglePageReady() {
  return (
    isCurrentPageSingle() &&
    document.getElementById('singleName') &&
    document.getElementById('singlePrice') &&
    document.getElementById('singleImage') &&
    document.getElementById('previewName') &&
    document.getElementById('previewPrice')
  );
}

// Si nous sommes sur la page single, initialiser
if (isSinglePageReady()) {
  console.log('✅ Page single.html détectée et prête');
  initializeSinglePage();
} else if (isCurrentPageSingle()) {
  console.log('⚠️ Page single.html détectée mais pas tous les éléments trouvés');
}

function initializeSinglePage() {
  // Éléments du formulaire
  const singleNameInput = document.getElementById('singleName');
  const singlePriceInput = document.getElementById('singlePrice');
  const singleImageInput = document.getElementById('singleImage');
  const labelWidthInput = document.getElementById('labelWidth');
  const labelHeightInput = document.getElementById('labelHeight');
  const backgroundColorInput = document.getElementById('backgroundColor');
  const updatePreviewBtn = document.getElementById('updatePreview');
  const printSingleBtn = document.getElementById('printSingle');
  const downloadSinglePdfBtn = document.getElementById('downloadSinglePdf');
  
  // Éléments de l'aperçu
  const singlePreview = document.getElementById('singlePreview');
  const previewName = document.getElementById('previewName');
  const previewPrice = document.getElementById('previewPrice');
  const previewImage = document.getElementById('previewImage');
  const dimensionsText = document.getElementById('dimensionsText');
  const imageFileName = document.getElementById('imageFileName');

  let currentImageData = null;

  console.log('✅ Tous les éléments sélectionnés avec succès');
  console.log('  Elements:', {
    singleNameInput: singleNameInput ? 'OK' : 'MANQUANT',
    singlePriceInput: singlePriceInput ? 'OK' : 'MANQUANT',
    previewName: previewName ? 'OK' : 'MANQUANT',
    previewPrice: previewPrice ? 'OK' : 'MANQUANT'
  });

  // ===== FONCTIONS =====

  function formatPrice(price) {
    const formatted = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
    console.log('  💰 formatPrice(' + price + ') = ' + formatted);
    return formatted;
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  }

  function updatePreview() {
    try {
      console.log('🔄 Mise à jour de l\'aperçu démarrée...');
      
      const nameValue = singleNameInput.value;
      const priceValue = singlePriceInput.value;
      const name = nameValue || 'Nom du gâteau';
      const price = parseFloat(priceValue) || 0;
      const bgColor = backgroundColorInput.value;

      console.log('  Valeurs saisies:', { nameValue, priceValue, name, price, bgColor });
      console.log('  Avant - previewName.textContent:', previewName.textContent);
      console.log('  Avant - previewPrice.textContent:', previewPrice.textContent);

      // Mettre à jour le texte
      previewName.textContent = name;
      const formattedPrice = formatPrice(price);
      previewPrice.textContent = formattedPrice;
      
      console.log('  Après - previewName.textContent:', previewName.textContent);
      console.log('  Après - previewPrice.textContent:', previewPrice.textContent);

      // Mettre à jour l'image
      if (currentImageData) {
        previewImage.src = currentImageData;
        previewImage.style.display = 'block';
        previewImage.style.maxWidth = '90%';
        previewImage.style.maxHeight = '40%';
        previewImage.style.objectFit = 'contain';
        previewImage.style.margin = '10px auto';
        console.log('  ✅ Image affichée');
      } else {
        previewImage.style.display = 'none';
        console.log('  ⚠️ Pas d\'image');
      }

      // Mettre à jour le fond
      const labelContent = document.getElementById('labelContent');
      labelContent.style.backgroundColor = bgColor;

      // Ajuster la couleur du texte
      const rgb = hexToRgb(bgColor);
      const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
      labelContent.style.color = brightness > 128 ? '#333333' : '#ffffff';
      console.log('  🎨 Couleur de fond et texte mises à jour');

      // Sauvegarder
      localStorage.setItem('singleLabel', JSON.stringify({
        name, price, image: currentImageData, bgColor,
        width: labelWidthInput.value,
        height: labelHeightInput.value
      }));

      console.log('✅ Aperçu mis à jour avec succès');
    } catch (error) {
      console.error('❌ ERREUR dans updatePreview():', error);
      console.error(error.stack);
    }
  }

  function updateDimensions() {
    console.log('📏 Mise à jour des dimensions');
    const width = labelWidthInput.value;
    const height = labelHeightInput.value;
    dimensionsText.textContent = `${width} cm × ${height} cm`;
    
    // Convertir cm en pixels (1cm = 28.34px)
    let previewWidth = width * 2.834;
    let previewHeight = height * 2.834;
    
    // Appliquer un zoom intelligent pour que l'aperçu reste visible
    const MAX_PREVIEW = 400;  // Taille max en pixels
    const MIN_PREVIEW = 100;  // Taille min en pixels
    
    // Si trop gros, réduire proportionnellement
    if (previewWidth > MAX_PREVIEW) {
      const ratio = MAX_PREVIEW / previewWidth;
      previewWidth *= ratio;
      previewHeight *= ratio;
      console.log('  🔍 Zoom réduit (trop gros):', ratio.toFixed(2) + 'x');
    }
    
    // Si trop petit, agrandir proportionnellement
    if (previewWidth < MIN_PREVIEW) {
      const ratio = MIN_PREVIEW / previewWidth;
      previewWidth *= ratio;
      previewHeight *= ratio;
      console.log('  🔍 Zoom augmenté (trop petit):', ratio.toFixed(2) + 'x');
    }
    
    console.log('  Taille finale:', previewWidth.toFixed(0) + 'px × ' + previewHeight.toFixed(0) + 'px');
    singlePreview.style.width = previewWidth + 'px';
    singlePreview.style.height = previewHeight + 'px';
    updatePreview();
  }

  function printLabel() {
    window.print();
  }

  function downloadPdf() {
    alert('Cliquez sur "Imprimer", puis choisissez "Enregistrer en PDF".');
  }

  // ===== EVENT LISTENERS =====
  console.log('🔗 Attachement des event listeners...');

  singleNameInput.addEventListener('input', () => {
    console.log('📝 Nom changé:', singleNameInput.value);
    updatePreview();
  });
  
  singlePriceInput.addEventListener('input', () => {
    console.log('💰 Prix changé:', singlePriceInput.value);
    updatePreview();
  });
  
  labelWidthInput.addEventListener('input', () => {
    console.log('📏 Largeur changée:', labelWidthInput.value);
    updateDimensions();
  });
  
  labelHeightInput.addEventListener('input', () => {
    console.log('📏 Hauteur changée:', labelHeightInput.value);
    updateDimensions();
  });
  
  backgroundColorInput.addEventListener('input', () => {
    console.log('🎨 Couleur changée:', backgroundColorInput.value);
    updatePreview();
  });
  
  updatePreviewBtn.addEventListener('click', () => {
    console.log('🔄 Bouton "Actualiser l\'aperçu" cliqué');
    updatePreview();
  });
  
  printSingleBtn.addEventListener('click', printLabel);
  downloadSinglePdfBtn.addEventListener('click', downloadPdf);

  // Gestion du fichier image
  singleImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 500 * 1024;
      const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      
      if (!supportedTypes.includes(file.type)) {
        imageFileName.textContent = '❌ Format non supporté. Utilisez JPG, PNG, WebP ou GIF';
        return;
      }
      
      if (file.size > maxSize) {
        imageFileName.textContent = `❌ Image trop grosse (${(file.size / 1024 / 1024).toFixed(2)} MB). Max: 500 KB`;
        return;
      }
      
      imageFileName.textContent = `✅ ${file.name} (${(file.size / 1024).toFixed(0)} KB)`;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        currentImageData = event.target.result;
        console.log('🖼️ Image chargée:', file.name);
        updatePreview();
      };
      reader.onerror = () => {
        imageFileName.textContent = '❌ Erreur lors de la lecture du fichier';
      };
      reader.readAsDataURL(file);
    }
  });

  // ===== INITIALISATION =====
  console.log('🎯 Initialisation de la page...');
  
  const savedLabel = localStorage.getItem('singleLabel');
  if (savedLabel) {
    const data = JSON.parse(savedLabel);
    singleNameInput.value = data.name;
    singlePriceInput.value = data.price;
    labelWidthInput.value = data.width;
    labelHeightInput.value = data.height;
    backgroundColorInput.value = data.bgColor;
    if (data.image) {
      currentImageData = data.image;
    }
    updateDimensions();
  } else {
    updateDimensions();
  }

  console.log('✅ Page single.html initialisée avec succès');
}
