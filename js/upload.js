// ===== UPLOAD.JS - Image Upload Handler =====
// Ready for Supabase integration

document.addEventListener("DOMContentLoaded", () => {
  initializeUploadArea();
});

function initializeUploadArea() {
  const uploadArea = document.getElementById("uploadArea");
  if (!uploadArea) return;

  const fileInput = uploadArea.querySelector('input[type="file"]');

  // Click to upload
  uploadArea.addEventListener("click", () => {
    fileInput.click();
  });

  // Drag and drop
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = "#000";
    uploadArea.style.background = "rgba(0, 0, 0, 0.05)";
  });

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.style.borderColor = "#d1d5db";
    uploadArea.style.background = "rgba(255, 255, 255, 0.5)";
  });

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = "#d1d5db";
    uploadArea.style.background = "rgba(255, 255, 255, 0.5)";

    const files = e.dataTransfer.files;
    handleFiles(files);
  });

  // File input change
  fileInput.addEventListener("change", (e) => {
    handleFiles(e.target.files);
  });
}

function handleFiles(files) {
  Array.from(files).forEach((file) => {
    // Validate file
    if (!file.type.startsWith("image/")) {
      showUploadMessage("Bara bildformat är tillåtna", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showUploadMessage("Bilden får inte vara större än 5MB", "error");
      return;
    }

    // Read and upload image
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;

      // For now, store as data URL in localStorage
      // Later, replace this with Supabase upload:
      // uploadToSupabase(imageUrl);

      addGalleryImage(imageUrl);
      showUploadMessage("Bild uppladdad! 🎉", "success");
    };

    reader.readAsDataURL(file);
  });
}

function showUploadMessage(message, type) {
  const uploadArea = document.getElementById("uploadArea");
  if (!uploadArea) return;

  const msg = document.createElement("p");
  msg.textContent = message;
  msg.style.margin = "1rem 0 0 0";
  msg.style.fontSize = "0.875rem";
  msg.style.color = type === "error" ? "#991b1b" : "#065f46";
  msg.style.opacity = "0.8";

  uploadArea.appendChild(msg);

  setTimeout(() => {
    msg.remove();
  }, 4000);
}

// ===== SUPABASE INTEGRATION (Template) =====
/*
async function uploadToSupabase(file) {
  const supabaseUrl = "YOUR_SUPABASE_URL";
  const supabaseKey = "YOUR_SUPABASE_KEY";

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${supabaseUrl}/storage/v1/object/wedding-gallery/${file.name}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      const imageUrl = `${supabaseUrl}/storage/v1/object/public/wedding-gallery/${data.name}`;
      addGalleryImage(imageUrl);
      showUploadMessage("Bild uppladdad till Supabase!", "success");
    }
  } catch (error) {
    console.error("Upload error:", error);
    showUploadMessage("Uppladdning misslyckades", "error");
  }
}
*/
