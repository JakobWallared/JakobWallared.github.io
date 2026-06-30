// ===== GALLERY.JS - Gallery Grid Management =====

let galleryImages = [];
const GALLERY_STORAGE_KEY = "weddingGalleryImages";

document.addEventListener("DOMContentLoaded", () => {
  loadGalleryImages();
  renderGallery();
});

// Load Gallery Images from LocalStorage or Initialize
function loadGalleryImages() {
  const stored = localStorage.getItem(GALLERY_STORAGE_KEY);
  if (stored) {
    galleryImages = JSON.parse(stored);
  } else {
    // Default placeholder images
    galleryImages = [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1519741497674-611481863552",
        uploaded: new Date().toISOString(),
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1523438097201-512ae7d59c1c",
        uploaded: new Date().toISOString(),
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18",
        uploaded: new Date().toISOString(),
      },
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1519225421117-39f82ecc1468",
        uploaded: new Date().toISOString(),
      },
    ];
  }
}

// Render Gallery Grid
function renderGallery() {
  const galleryGrid = document.getElementById("galleryGrid");
  if (!galleryGrid) return;

  galleryGrid.innerHTML = "";

  galleryImages.forEach((image) => {
    const div = document.createElement("div");
    div.className = "gallery-item scale-up";
    div.innerHTML = `
      <img src="${image.url}" alt="Gallery image" loading="lazy" />
    `;
    galleryGrid.appendChild(div);
  });
}

// Add New Image to Gallery
function addGalleryImage(imageUrl) {
  const newImage = {
    id: Date.now(),
    url: imageUrl,
    uploaded: new Date().toISOString(),
  };

  galleryImages.unshift(newImage);

  // Keep only 20 latest images
  if (galleryImages.length > 20) {
    galleryImages = galleryImages.slice(0, 20);
  }

  saveGalleryImages();
  renderGallery();
}

// Save Gallery Images to LocalStorage
function saveGalleryImages() {
  localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(galleryImages));
}

// Delete Gallery Image
function deleteGalleryImage(imageId) {
  galleryImages = galleryImages.filter((img) => img.id !== imageId);
  saveGalleryImages();
  renderGallery();
}
