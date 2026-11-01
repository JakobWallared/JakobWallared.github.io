
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

    const images = (data || []).filter(file =>
      /\.(jpg|jpeg|png|webp)$/i.test(file.name)
    );

    const fragment = document.createDocumentFragment();

    images.forEach(file => {
      const path = `${FOLDER}/${file.name}`;

      const { data: urlData } = supabaseClient.storage
        .from(BUCKET)
        .getPublicUrl(path);

      const div = document.createElement("div");
      div.className = "gallery-item scale-up";

      const img = document.createElement("img");
      img.src = urlData.publicUrl;
      img.alt = "Bild från vårt bröllop";
      img.loading = "lazy";

      img.addEventListener("click", () => {
        window.open(urlData.publicUrl, "_blank", "noopener");
      });

      div.appendChild(img);
      fragment.appendChild(div);
    });

    galleryGrid.replaceChildren(fragment);

    if (!images.length) {
      const p = document.createElement("p");
      p.textContent =
        "Inga bilder ännu. Bli först med att dela ett minne! 🤍";
      galleryGrid.appendChild(p);
    }

  } catch (error) {
    console.error("Gallery error:", error);
    if (!galleryGrid.children.length) {
      galleryGrid.textContent =
        "Kunde inte hämta bilderna just nu.";
    }
  } finally {
    loadingGallery = false;
  }
}

// Ladda galleriet vid sidstart
document.addEventListener("DOMContentLoaded", () => {
  loadGalleryImages();

  // Kontrollera nya bilder var femte sekund
  setInterval(loadGalleryImages, 5000);
});
