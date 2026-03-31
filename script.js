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

  // ===== FONCTIONS =====

  function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
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
    console.log('🔄 Mise à jour de l\'aperçu...');
    
    const name = singleNameInput.value || 'Nom du gâteau';
    const price = parseFloat(singlePriceInput.value) || 0;
    const bgColor = backgroundColorInput.value;

    // Mettre à jour le texte
    previewName.textContent = name;
    previewPrice.textContent = formatPrice(price);

    // Mettre à jour l'image
    if (currentImageData) {
      previewImage.src = currentImageData;
      previewImage.style.display = 'block';
      previewImage.style.maxWidth = '90%';
      previewImage.style.maxHeight = '40%';
      previewImage.style.objectFit = 'contain';
      previewImage.style.margin = '10px auto';
    } else {
      previewImage.style.display = 'none';
    }

    // Mettre à jour le fond
    const labelContent = document.getElementById('labelContent');
    labelContent.style.backgroundColor = bgColor;

    // Ajuster la couleur du texte selon la luminosité
    const rgb = hexToRgb(bgColor);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    labelContent.style.color = brightness > 128 ? '#333333' : '#ffffff';

    // Sauvegarder dans localStorage
    localStorage.setItem('singleLabel', JSON.stringify({
      name,
      price,
      image: currentImageData,
      bgColor,
      width: labelWidthInput.value,
      height: labelHeightInput.value
    }));

    console.log('✅ Aperçu mis à jour');
  }

  function updateDimensions() {
    const width = labelWidthInput.value;
    const height = labelHeightInput.value;
    dimensionsText.textContent = `${width} cm × ${height} cm`;

    // Mettre à jour la taille de l'aperçu
    singlePreview.style.width = `${width * 2.834}px`; // 1cm = 28.34px
    singlePreview.style.height = `${height * 2.834}px`;

    updatePreview();
  }

  function printLabel() {
    window.print();
  }

  function downloadPdf() {
    alert('Cliquez sur "Imprimer", puis choisissez "Enregistrer en PDF".');
  }

  // ===== EVENT LISTENERS =====

  // Inputs de texte
  singleNameInput.addEventListener('input', () => {
    console.log('📝 Nom changé:', singleNameInput.value);
    updatePreview();
  });
  singlePriceInput.addEventListener('input', () => {
    console.log('💰 Prix changé:', singlePriceInput.value);
    updatePreview();
  });
  
  // Inputs de dimensions
  labelWidthInput.addEventListener('input', () => {
    console.log('📏 Largeur changée:', labelWidthInput.value);
    updateDimensions();
  });
  labelHeightInput.addEventListener('input', () => {
    console.log('📏 Hauteur changée:', labelHeightInput.value);
    updateDimensions();
  });
  
  // Couleur de fond
  backgroundColorInput.addEventListener('input', () => {
    console.log('🎨 Couleur changée:', backgroundColorInput.value);
    updatePreview();
  });
  
  // Boutons
  updatePreviewBtn.addEventListener('click', updatePreview);
  printSingleBtn.addEventListener('click', printLabel);
  downloadSinglePdfBtn.addEventListener('click', downloadPdf);

  // Gestion du fichier image
  singleImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 500 * 1024; // 500 KB
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
        updatePreview();
      };
      reader.onerror = () => {
        imageFileName.textContent = '❌ Erreur lors de la lecture du fichier';
      };
      reader.readAsDataURL(file);
    }
  });

  // ===== INITIALISATION =====
  
  // Charger les données sauvegardées
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

// =====================================================
// PAGE INDEX (PLUSIEURS ÉTIQUETTES)
// =====================================================

function isCurrentPageIndex() {
  const path = window.location.pathname;
  return path.endsWith('/') || path.endsWith('index.html') || !path.includes('single.html');
}

if (isCurrentPageIndex() && document.getElementById('addLabel')) {
  console.log('✅ Page index.html détectée');
  
  const productNameInput = document.getElementById('productName');
  const basePriceInput = document.getElementById('basePrice');
  const quantityInput = document.getElementById('quantity');
  const imageUrlInput = document.getElementById('imageUrl');
  const addLabelBtn = document.getElementById('addLabel');
  const printAllBtn = document.getElementById('printAll');
  const downloadPdfBtn = document.getElementById('downloadPdf');
  const preview = document.getElementById('preview');

  let labels = JSON.parse(localStorage.getItem('labels')) || [];

  function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  function loadLabels() {
    preview.innerHTML = '';

    if (labels.length === 0) {
      printAllBtn.style.display = 'none';
      downloadPdfBtn.style.display = 'none';
      preview.innerHTML = '<p style="grid-column: 1/-1; color: var(--color-text-secondary);">Aucune étiquette créée</p>';
      return;
    }

    printAllBtn.style.display = 'inline-block';
    downloadPdfBtn.style.display = 'inline-block';

    labels.forEach((label, index) => {
      const card = document.createElement('div');
      card.className = 'label-card';
      card.innerHTML = `
        ${label.image ? `<img src="${label.image}" alt="${label.name}" class="label-image">` : '<div class="label-image" style="background: linear-gradient(135deg, #d4a574, #8b4513);"></div>'}
        <div class="label-info">
          <h3>${label.name}</h3>
          <p class="label-price">${formatPrice(label.price)}</p>
        </div>
      `;

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '✕';
      deleteBtn.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        background: rgba(255, 0, 0, 0.7);
        color: white;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
        display: none;
      `;
      deleteBtn.addEventListener('click', () => {
        labels.splice(index, 1);
        localStorage.setItem('labels', JSON.stringify(labels));
        loadLabels();
      });

      card.style.position = 'relative';
      card.appendChild(deleteBtn);
      card.addEventListener('mouseenter', () => deleteBtn.style.display = 'block');
      card.addEventListener('mouseleave', () => deleteBtn.style.display = 'none');

      preview.appendChild(card);
    });
  }

  addLabelBtn.addEventListener('click', () => {
    const name = productNameInput.value.trim();
    const price = parseFloat(basePriceInput.value);
    const quantity = parseInt(quantityInput.value) || 1;
    const image = imageUrlInput.value.trim();

    if (!name || !price) {
      alert('Veuillez remplir le nom et le prix');
      return;
    }

    for (let i = 0; i < quantity; i++) {
      labels.push({
        id: Date.now() + i,
        name,
        price,
        image
      });
    }

    localStorage.setItem('labels', JSON.stringify(labels));
    loadLabels();

    productNameInput.value = '';
    basePriceInput.value = '';
    quantityInput.value = '1';
    imageUrlInput.value = '';
  });

  printAllBtn.addEventListener('click', () => {
    window.print();
  });

  downloadPdfBtn.addEventListener('click', () => {
    alert('Cliquez sur "Imprimer", puis choisissez "Enregistrer en PDF".');
  });

  loadLabels();
}
