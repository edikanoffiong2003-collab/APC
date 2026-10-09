// Mobilization Hub Backend Interactivity
document.addEventListener("DOMContentLoaded", () => {
  const organizerForm = document.getElementById("organizerForm");
  const policyForm = document.getElementById("policyForm");

  // Handle Ward Organizer Sign-Up
  if (organizerForm) {
    organizerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const orgBtn = document.getElementById("orgSubmitBtn");
      const orgStatus = document.getElementById("orgStatus");

      orgBtn.disabled = true;
      orgBtn.innerText = "Processing Request...";
      orgStatus.style.color = "#38bdf8";
      orgStatus.innerText = "Registering organizer profile...";

      const data = {
        fullName: document.getElementById("orgName").value,
        whatsapp: document.getElementById("orgPhone").value,
        lga: "Organizer Portal",
        ward: document.getElementById("orgRole").value
      };

      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(() => {
        orgStatus.style.color = "#4ade80";
        orgStatus.innerText = "Leadership request logged! The campaign desk will contact you.";
        organizerForm.reset();
        orgBtn.disabled = false;
        orgBtn.innerText = "Request Organizer Backend Access";
      }).catch(() => {
        orgStatus.style.color = "#f87171";
        orgStatus.innerText = "Unable to register leadership profile. Try again.";
        orgBtn.disabled = false;
      });
    });
  }

  // Handle Policy Suggestion Submissions
  if (policyForm) {
    policyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const policyBtn = document.getElementById("policyBtn");
      const policyStatus = document.getElementById("policyStatus");

      policyBtn.disabled = true;
      policyBtn.innerText = "Sending to Senator's Desk...";
      policyStatus.style.color = "#f59e0b";
      policyStatus.innerText = "Transmitting policy proposal...";

      const policyData = {
        fullName: "Policy Submission",
        whatsapp: "N/A",
        lga: document.getElementById("policyTopic").value,
        ward: document.getElementById("policyDetails").value
      };

      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(policyData)
      }).then(() => {
        policyStatus.style.color = "#4ade80";
        policyStatus.innerText = "Proposal submitted directly to the Senator's Office!";
        policyForm.reset();
        policyBtn.disabled = false;
        policyBtn.innerText = "Submit Suggestion to Senator's Office";
      }).catch(() => {
        policyStatus.style.color = "#f87171";
        policyStatus.innerText = "Failed to send proposal. Please retry.";
        policyBtn.disabled = false;
      });
    });
  }
});