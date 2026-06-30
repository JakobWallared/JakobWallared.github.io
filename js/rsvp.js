// ===== RSVP.JS - RSVP Form Handler =====
// Ready for Supabase integration

const RSVP_STORAGE_KEY = "weddingRSVPs";
let rsvpResponses = [];

document.addEventListener("DOMContentLoaded", () => {
  loadRSVPData();
  initializeRSVPForm();
});

// Load RSVP Data
function loadRSVPData() {
  const stored = localStorage.getItem(RSVP_STORAGE_KEY);
  if (stored) {
    rsvpResponses = JSON.parse(stored);
  }
}

// Initialize RSVP Form
function initializeRSVPForm() {
  const form = document.getElementById("rsvpForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitRSVP();
  });
}

// Submit RSVP
function submitRSVP() {
  const form = document.getElementById("rsvpForm");
  const nameInput = form.querySelector('input[placeholder="Namn"]');
  const guestInput = form.querySelector('input[placeholder="Antal gäster"]');
  const statusSelect = form.querySelector("select");
  const dietInput = form.querySelector('input[placeholder="Matpreferenser"]');
  const submitBtn = form.querySelector("button");

  // Validate
  if (!nameInput.value.trim()) {
    showRSVPMessage("Vänligen ange ditt namn", "error");
    return;
  }

  const guestCount = parseInt(guestInput.value) || 1;
  if (guestCount < 1) {
    showRSVPMessage("Antal gäster måste vara minst 1", "error");
    return;
  }

  // Create response object
  const response = {
    id: Date.now(),
    name: nameInput.value.trim(),
    guests: guestCount,
    status: statusSelect.value,
    diet: dietInput.value.trim(),
    submitted: new Date().toISOString(),
  };

  // For now, save to localStorage
  // Later, replace this with Supabase:
  // saveRSVPToSupabase(response);

  saveRSVPLocally(response);

  // Show confirmation
  showRSVPConfirmation(response);

  // Reset form
  form.reset();

  // Disable button briefly
  submitBtn.disabled = true;
  setTimeout(() => {
    submitBtn.disabled = false;
  }, 2000);
}

// Save RSVP Locally
function saveRSVPLocally(response) {
  rsvpResponses.push(response);
  localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(rsvpResponses));
  showRSVPMessage("Tack för ditt svar! Vi ses på bröllopet 💕", "success");
}

// Show RSVP Message
function showRSVPMessage(message, type) {
  const form = document.getElementById("rsvpForm");
  if (!form) return;

  let messageEl = form.querySelector(".status-message");
  if (messageEl) {
    messageEl.remove();
  }

  const msg = document.createElement("div");
  msg.className = `status-message ${type}`;
  msg.textContent = message;
  form.parentElement.insertBefore(msg, form);

  setTimeout(() => {
    msg.remove();
  }, 5000);
}

// Show RSVP Confirmation
function showRSVPConfirmation(response) {
  const form = document.getElementById("rsvpForm");
  const confirmBox = form.parentElement.querySelector(".confirmation-box");

  if (confirmBox) {
    confirmBox.innerHTML = `
      <h3>Tack ${response.name}!</h3>
      <p>${response.guests} gäst${response.guests !== 1 ? "er" : ""} • Status: ${response.status === "Kommer" ? "✓ Kommer" : "✗ Kommer inte"}</p>
      ${response.diet ? `<p>Matpreferenser: ${response.diet}</p>` : ""}
    `;
    confirmBox.classList.add("show");

    setTimeout(() => {
      confirmBox.classList.remove("show");
    }, 5000);
  }
}

// Get RSVP Statistics
function getRSVPStats() {
  const total = rsvpResponses.length;
  const attending = rsvpResponses.filter((r) => r.status === "Kommer").length;
  const totalGuests = rsvpResponses.reduce((sum, r) => sum + r.guests, 0);

  return { total, attending, totalGuests };
}

// ===== SUPABASE INTEGRATION (Template) =====
/*
async function saveRSVPToSupabase(response) {
  const supabaseUrl = "YOUR_SUPABASE_URL";
  const supabaseKey = "YOUR_SUPABASE_KEY";

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/rsvp_responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
      },
      body: JSON.stringify(response),
    });

    if (res.ok) {
      showRSVPMessage("Tack för ditt svar! Vi ses på bröllopet 💕", "success");
    }
  } catch (error) {
    console.error("RSVP error:", error);
    showRSVPMessage("Något gick fel. Försök igen.", "error");
  }
}
*/
