// Theme Management
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Initialize theme
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

// Page Detection
const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');
const isSinglePage = window.location.pathname.includes('single.html');

// =====================
// INDEX PAGE LOGIC
// =====================
if (isIndexPage && document.getElementById('addLabel')) {
  const productNameInput = document.getElementById('productName');
  const basePriceInput = document.getElementById('basePrice');
  const quantityInput = document.getElementById('quantity');
  const imageUrlInput = document.getElementById('imageUrl');
  const addLabelBtn = document.getElementById('addLabel');
  const printAllBtn = document.getElementById('printAll');
  const downloadPdfBtn = document.getElementById('downloadPdf');
  const preview = document.getElementById('preview');

  let labels = JSON.parse(localStorage.getItem('labels')) || [];

  // Load saved labels on page load
  loadLabels();

  addLabelBtn.addEventListener('click', addLabels);
  printAllBtn.addEventListener('click', printLabels);
  downloadPdfBtn.addEventListener('click', downloadPdf);

  function addLabels() {
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

    // Reset form
    productNameInput.value = '';
    basePriceInput.value = '';
    quantityInput.value = '1';
    imageUrlInput.value = '';
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
          <small>ID: ${label.id}</small>
        </div>
      `;

      // Add delete button
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
      deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
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

  function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  function printLabels() {
    window.print();
  }

  function downloadPdf() {
    alert('Fonctionnalité PDF disponible. Utilisez "Imprimer puis enregistrer en PDF" pour obtenir un fichier PDF.');
  }
}

// =====================
// SINGLE PAGE LOGIC
// =====================
if (isSinglePage && document.getElementById('updatePreview')) {
  const singleNameInput = document.getElementById('singleName');
  const singlePriceInput = document.getElementById('singlePrice');
  const singleImageInput = document.getElementById('singleImage');
  const labelWidthInput = document.getElementById('labelWidth');
  const labelHeightInput = document.getElementById('labelHeight');
  const backgroundColorInput = document.getElementById('backgroundColor');
  const updatePreviewBtn = document.getElementById('updatePreview');
  const printSingleBtn = document.getElementById('printSingle');
  const downloadSinglePdfBtn = document.getElementById('downloadSinglePdf');
  const singlePreview = document.getElementById('singlePreview');
  const previewName = document.getElementById('previewName');
  const previewPrice = document.getElementById('previewPrice');
  const previewImage = document.getElementById('previewImage');
  const dimensionsText = document.getElementById('dimensionsText');
  const imageFileName = document.getElementById('imageFileName');

  let currentImageData = null;

  // Initialize preview
  updatePreview();

  // Event listeners
  singleNameInput.addEventListener('input', updatePreview);
  singlePriceInput.addEventListener('input', updatePreview);
  labelWidthInput.addEventListener('input', updateDimensions);
  labelHeightInput.addEventListener('input', updateDimensions);
  backgroundColorInput.addEventListener('input', updatePreview);
  updatePreviewBtn.addEventListener('click', updatePreview);
  printSingleBtn.addEventListener('click', printLabel);
  downloadSinglePdfBtn.addEventListener('click', downloadPdf);

  singleImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      imageFileName.textContent = `Fichier sélectionné: ${file.name}`;
      const reader = new FileReader();
      reader.onload = (event) => {
        currentImageData = event.target.result;
        updatePreview();
      };
      reader.readAsDataURL(file);
    }
  });

  function updatePreview() {
    const name = singleNameInput.value || 'Nom du gâteau';
    const price = parseFloat(singlePriceInput.value) || 0;
    const bgColor = backgroundColorInput.value;

    previewName.textContent = name;
    previewPrice.textContent = formatPrice(price);

    if (currentImageData) {
      previewImage.src = currentImageData;
      previewImage.style.display = 'block';
    } else {
      previewImage.style.display = 'none';
    }

    // Update preview background
    const labelContent = document.getElementById('labelContent');
    labelContent.style.backgroundColor = bgColor;

    // Adjust text color based on background brightness
    const rgb = hexToRgb(bgColor);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    labelContent.style.color = brightness > 128 ? '#333333' : '#ffffff';

    // Save to localStorage
    localStorage.setItem('singleLabel', JSON.stringify({
      name,
      price,
      image: currentImageData,
      bgColor,
      width: labelWidthInput.value,
      height: labelHeightInput.value
    }));
  }

  function updateDimensions() {
    const width = labelWidthInput.value;
    const height = labelHeightInput.value;
    dimensionsText.textContent = `${width} cm × ${height} cm`;

    // Update preview size
    singlePreview.style.width = `${width * 2.834}px`; // convert cm to px (1cm = 28.34px)
    singlePreview.style.height = `${height * 2.834}px`;

    updatePreview();
  }

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

  function printLabel() {
    // Set print-specific styles
    const originalStyles = singlePreview.style.cssText;
    singlePreview.style.cssText += `
      width: ${labelWidthInput.value}cm;
      height: ${labelHeightInput.value}cm;
      margin: 0;
      padding: 0;
    `;
    window.print();
    singlePreview.style.cssText = originalStyles;
  }

  function downloadPdf() {
    alert('Cliquez sur "Imprimer", puis choisissez "Enregistrer en PDF" pour télécharger le fichier.');
  }

  // Load saved data on page load
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
  }
}
