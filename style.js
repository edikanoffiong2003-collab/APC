// Election Countdown Clock (January 16, 2027)
(function initCountdownClock() {
  const startClock = () => {
    const targetDate = new Date("2027-01-16T08:00:00+01:00").getTime();

    function updateLiveClock() {
      const now = new Date().getTime();
      const difference = targetDate - now;

      const elDays = document.getElementById("cd-days");
      const elHours = document.getElementById("cd-hours");
      const elMinutes = document.getElementById("cd-minutes");
      const elSeconds = document.getElementById("cd-seconds");

      // Exit gracefully if the countdown elements are not on the page
      if (!elDays || !elHours || !elMinutes || !elSeconds) return;

      // Handle timer expiration
      if (difference <= 0) {
        const container = document.querySelector(".countdown-container");
        if (container && container.innerHTML !== "<h3 style='color: #28a745;'>Elections Are Live Today!</h3>") {
          container.innerHTML = "<h3 style='color: #28a745;'>Elections Are Live Today!</h3>";
        }
        return;
      }

      // Calculate time remaining
      const days = String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, "0");
      const hours = String(Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, "0");
      const minutes = String(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
      const seconds = String(Math.floor((difference % (1000 * 60)) / 1000)).padStart(2, "0");

      // Only update DOM if value actually changed (prevents breaking Google Translate)
      if (elDays.innerText !== days) elDays.innerText = days;
      if (elHours.innerText !== hours) elHours.innerText = hours;
      if (elMinutes.innerText !== minutes) elMinutes.innerText = minutes;
      if (elSeconds.innerText !== seconds) elSeconds.innerText = seconds;
    }

    updateLiveClock();
    setInterval(updateLiveClock, 1000);
  };

  // Ensure DOM is ready regardless of script loading order
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startClock);
  } else {
    startClock();
  }
})();