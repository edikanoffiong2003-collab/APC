const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzCBJECFBAS-qtMH4jQchbOORi9qgK3pE9rCRuzQVeDHeSbwe7niuGejWsU5XXtwsPC/exec";

document.addEventListener("DOMContentLoaded", () => {
  const campaignForm = document.getElementById("campaignForm");
  const loggedInState = document.getElementById("loggedInState");
  const formContainer = document.getElementById("formContainer");
  const userName = document.getElementById("userName");
  const userLGA = document.getElementById("userLGA");
  const logoutBtn = document.getElementById("logoutBtn");

  
  const savedUser = JSON.parse(localStorage.getItem("campaignUser"));

  if (savedUser && loggedInState) {
    if (userName) userName.innerText = savedUser.fullName;
    if (userLGA) userLGA.innerText = savedUser.lga;
    loggedInState.style.display = "block";
    if (formContainer) formContainer.style.display = "none";
  }

  
  if (campaignForm) {
    campaignForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById("submitBtn");
      const statusMsg = document.getElementById("formStatus");

      submitBtn.disabled = true;
      submitBtn.innerText = "Submitting to Database...";
      statusMsg.style.color = "#000000";
      statusMsg.innerText = "Connecting to campaign registry...";

      const formData = {
        fullName: document.getElementById("fullName").value,
        whatsapp: document.getElementById("whatsapp").value,
        lga: document.getElementById("lga").value,
        ward: document.getElementById("ward").value
      };

      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
        .then(() => {
          localStorage.setItem("campaignUser", JSON.stringify(formData));

          statusMsg.style.color = "#198754";
          statusMsg.innerText = "Registration successful.";

          setTimeout(() => {
            if (userName) userName.innerText = formData.fullName;
            if (userLGA) userLGA.innerText = formData.lga;
            loggedInState.style.display = "block";
            if (formContainer) formContainer.style.display = "none";
          }, 1200);
        })
        .catch((error) => {
          console.error("Submission Error:", error);
          statusMsg.style.color = "#dc3545";
          statusMsg.innerText = "Submission failed. Please try again.";
          submitBtn.disabled = false;
          submitBtn.innerText = "Submit Registration";
        });
    });
  }

  // Logout button handler
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("campaignUser");
      location.reload();
    });
  }
});