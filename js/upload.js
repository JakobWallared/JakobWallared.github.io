
/* ===== UPLOAD.JS ===== */

document.addEventListener("DOMContentLoaded", () => {
  initializeUploadArea();
});

function initializeUploadArea() {
  const uploadArea = document.getElementById("uploadArea");
  if (!uploadArea) return;

  const fileInput =
    uploadArea.querySelector('input[type="file"]');

  const status = document.createElement("p");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  uploadArea.insertAdjacentElement("afterend", status);

  let uploading = false;

  uploadArea.addEventListener("click", () => {
    if (!uploading) fileInput.click();
  });

  fileInput.addEventListener("click", e => {
    e.stopPropagation();
  });

  fileInput.addEventListener("change", async e => {
    await handleFiles(e.target.files);
    fileInput.value = "";
  });

  uploadArea.addEventListener("dragover", e => {
    e.preventDefault();
    uploadArea.style.borderColor = "#806b5a";
  });

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.style.borderColor = "#d1d5db";
  });

  uploadArea.addEventListener("drop", async e => {
    e.preventDefault();
    uploadArea.style.borderColor = "#d1d5db";
    await handleFiles(e.dataTransfer.files);
  });

  async function handleFiles(files) {
    if (uploading) return;

    const selectedFiles = Array.from(files);
    if (!selectedFiles.length) return;

    uploading = true;
    uploadArea.style.opacity = "0.6";
    uploadArea.style.pointerEvents = "none";

    let successful = 0;
    let failed = 0;

    const allowedTypes = {
      "image/jpeg": ["jpg", "jpeg"],
      "image/png": ["png"],
      "image/webp": ["webp"]
    };

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        const extension = file.name
          .split(".")
          .pop()
          .toLowerCase();

        if (
          !allowedTypes[file.type] ||
          !allowedTypes[file.type].includes(extension)
        ) {
          failed++;
          status.textContent =
            "Endast JPG, PNG och WebP är tillåtna.";
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          failed++;
          status.textContent =
            "En bild får inte vara större än 10 MB.";
          continue;
        }

        status.textContent =
          `Laddar upp bild ${i + 1} av ${selectedFiles.length}...`;

        const filename =
          `${crypto.randomUUID()}.${extension}`;

        const path = `guest-uploads/${filename}`;

        const { error } = await supabaseClient.storage
          .from("weddings photos")
          .upload(path, file, {
            contentType: file.type,
            upsert: false
          });

        if (error) {
          console.error("Upload error:", error);
          failed++;
        } else {
          successful++;
        }
      }

      status.textContent =
        `${successful} bilder uppladdade! 🤍` +
        (failed ? ` ${failed} misslyckades.` : "");

      if (successful > 0) {
        await loadGalleryImages();
      }

    } catch (error) {
      console.error(error);
      status.textContent =
        "Något gick fel. Försök igen.";
    } finally {
      uploading = false;
      uploadArea.style.opacity = "1";
      uploadArea.style.pointerEvents = "auto";
    }
  }
}
