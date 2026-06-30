// ===== COUNTDOWN.JS - Wedding Countdown Timer =====

const WEDDING_DATE = new Date("2027-09-04T00:00:00").getTime();

document.addEventListener("DOMContentLoaded", () => {
  initializeCountdown();
  updateCountdown();
  setInterval(updateCountdown, 1000);
});

function initializeCountdown() {
  const container = document.getElementById("countdownTimer");
  if (!container) return;

  container.innerHTML = `
    <div class="countdown-grid">
      <div class="countdown-item">
        <div class="countdown-number" id="days">0</div>
        <div class="countdown-label">Dagar</div>
      </div>
      <div class="countdown-item">
        <div class="countdown-number" id="hours">0</div>
        <div class="countdown-label">Timmar</div>
      </div>
      <div class="countdown-item">
        <div class="countdown-number" id="minutes">0</div>
        <div class="countdown-label">Minuter</div>
      </div>
      <div class="countdown-item">
        <div class="countdown-number" id="seconds">0</div>
        <div class="countdown-label">Sekunder</div>
      </div>
    </div>
  `;
}

function updateCountdown() {
  const now = new Date().getTime();
  const distance = WEDDING_DATE - now;

  if (distance < 0) {
    document.getElementById("countdownTimer").innerHTML =
      '<p style="text-align: center; font-size: 1.25rem;">Vi är gifta! 💕</p>';
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
  if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
  if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
}

// CSS for countdown styling
const countdownStyle = `
.countdown-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin: 2rem auto;
  max-width: 100%;
  padding: 0 0.5rem;
}

.countdown-item {
  text-align: center;
  padding: 0.75rem 0.5rem;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 0.5rem;
}

.countdown-number {
  font-size: 1.25rem;
  font-weight: bold;
  font-family: "Inter", sans-serif;
  margin-bottom: 0.25rem;
  line-height: 1;
}

.countdown-label {
  font-size: 0.65rem;
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  line-height: 1.2;
}

@media (min-width: 640px) {
  .countdown-grid {
    gap: 1rem;
    padding: 0;
  }
  
  .countdown-item {
    padding: 1.5rem;
    border-radius: 0.75rem;
  }
  
  .countdown-number {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  .countdown-label {
    font-size: 0.875rem;
    letter-spacing: 0.05em;
  }
}
`;

if (!document.querySelector("style[data-countdown]")) {
  const style = document.createElement("style");
  style.setAttribute("data-countdown", "true");
  style.textContent = countdownStyle;
  document.head.appendChild(style);
}
