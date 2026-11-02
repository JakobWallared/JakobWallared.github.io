
/* ===== GALLERY.JS ===== */

const SUPABASE_URL =
  "https://bdxlqzydvtmlqbchdzym.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_WFpev48hAGESXzI87X8kJw_UjjqIjtV";

const BUCKET = "weddings photos";
const FOLDER = "guest-uploads";

window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

let loadingGallery = false;
let galleryImages = [];
let currentSlide = 0;
let selectedImageName = null;

function renderGallerySlide() {
  const galleryGrid = document.getElementById("galleryGrid");
  const previousButton = document.getElementById("galleryPrevious");
  const nextButton = document.getElementById("galleryNext");
  const counter = document.getElementById("galleryCounter");
  if (!galleryGrid) return;

  galleryGrid.replaceChildren();

  if (!galleryImages.length) {
    const p = document.createElement("p");
    p.textContent = "Inga bilder ännu. Bli först med att dela ett minne! 🤍";
    galleryGrid.appendChild(p);
    if (previousButton) previousButton.hidden = true;
    if (nextButton) nextButton.hidden = true;
    if (counter) counter.textContent = "";
    return;
  }

  const image = galleryImages[currentSlide];
  const slide = document.createElement("div");
  slide.className = "gallery-item scale-up";

  const img = document.createElement("img");
  img.src = image.url;
  img.alt = "Bild från vårt bröllop";
  img.addEventListener("click", () => {
    window.open(image.url, "_blank", "noopener");
  });

  slide.appendChild(img);
  galleryGrid.appendChild(slide);

  if (previousButton) previousButton.hidden = galleryImages.length < 2;
  if (nextButton) nextButton.hidden = galleryImages.length < 2;
  if (counter) counter.textContent = `${currentSlide + 1} / ${galleryImages.length}`;
}

function moveGallerySlide(direction) {
  if (galleryImages.length < 2) return;

  currentSlide = (currentSlide + direction + galleryImages.length) % galleryImages.length;
  selectedImageName = galleryImages[currentSlide].name;
  renderGallerySlide();
}

// Hämta bilder från Supabase
async function loadGalleryImages() {
  const galleryGrid = document.getElementById("galleryGrid");
  if (!galleryGrid || loadingGallery) return;

  loadingGallery = true;

  try {
    const { data, error } = await supabaseClient.storage
      .from(BUCKET)
      .list(FOLDER, {
        limit: 1000,
        sortBy: {
          column: "created_at",
          order: "desc"
        }
      });

    if (error) throw error;

    const files = (data || []).filter(file =>
      /\.(jpg|jpeg|png|webp)$/i.test(file.name)
    );

    const images = files.map(file => {
      const path = `${FOLDER}/${file.name}`;

      const { data: urlData } = supabaseClient.storage
        .from(BUCKET)
        .getPublicUrl(path);

      return { name: file.name, url: urlData.publicUrl };
    });

    const imageListChanged =
      images.length !== galleryImages.length ||
      images.some((image, index) => image.name !== galleryImages[index]?.name);
    if (!imageListChanged && galleryGrid.children.length) return;

    galleryImages = images;
    const selectedIndex = galleryImages.findIndex(image => image.name === selectedImageName);
    currentSlide = selectedIndex >= 0 ? selectedIndex : Math.min(currentSlide, galleryImages.length - 1);
    selectedImageName = galleryImages[currentSlide]?.name ?? null;
    renderGallerySlide();

  } catch (error) {
    console.error("Gallery error:", error);
    if (!galleryGrid.children.length) {
      galleryGrid.textContent =
        "Kunde inte hämta bilderna just nu.";
    }
    const previousButton = document.getElementById("galleryPrevious");
    const nextButton = document.getElementById("galleryNext");
    if (previousButton) previousButton.hidden = true;
    if (nextButton) nextButton.hidden = true;
  } finally {
    loadingGallery = false;
  }
}

// Ladda galleriet vid sidstart
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("galleryPrevious")?.addEventListener("click", () => {
    moveGallerySlide(-1);
  });
  document.getElementById("galleryNext")?.addEventListener("click", () => {
    moveGallerySlide(1);
  });

  loadGalleryImages();

  // Kontrollera nya bilder var femte sekund
  setInterval(loadGalleryImages, 5000);
});
