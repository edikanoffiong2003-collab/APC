// Mobilization Hub Backend Interactivity & Password Management
const BACKEND_API_URL = "http://localhost:5000/api/register-mobilizer";
const LOGIN_API_URL = "http://localhost:5000/api/login";
const POLICY_API_URL = "http://localhost:5000/api/submit-policy-proposal";
const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

// 1. Switch between Register and Login Modes
function switchAuthMode(mode) {
  const regForm = document.getElementById("organizerForm");
  const loginForm = document.getElementById("loginForm");
  const tabReg = document.getElementById("tabRegister");
  const tabLogin = document.getElementById("tabLogin");
  const title = document.getElementById("authCardTitle");
  const subtitle = document.getElementById("authCardSubtitle");
  const status = document.getElementById("orgStatus");

  if (status) status.innerText = "";

  if (mode === "login") {
    if (regForm) regForm.style.display = "none";
    if (loginForm) loginForm.style.display = "block";
    
    if (tabLogin) {
      tabLogin.style.background = "#10b981";
      tabLogin.style.color = "#fff";
    }
    if (tabReg) {
      tabReg.style.background = "transparent";
      tabReg.style.color = "#94a3b8";
    }

    if (title) title.innerText = "1. Ward Leadership Sign-In";
    if (subtitle) subtitle.innerText = "Log in to access Senator Meeting Room";
  } else {
    if (loginForm) loginForm.style.display = "none";
    if (regForm) regForm.style.display = "block";

    if (tabReg) {
      tabReg.style.background = "#0284c7";
      tabReg.style.color = "#fff";
    }
    if (tabLogin) {
      tabLogin.style.background = "transparent";
      tabLogin.style.color = "#94a3b8";
    }

    if (title) title.innerText = "1. Ward Leadership Sign-Up";
    if (subtitle) subtitle.innerText = "Become a verified community coordinator";
  }
}

// 2. Dynamic Password Visibility Toggle
function togglePasswordVisibility(inputId, iconId) {
  const passwordInput = document.getElementById(inputId);
  const icon = document.getElementById(iconId);

  if (!passwordInput || !icon) return;

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

// 3. Forgot Password Reset System (Dispatches 6-Digit Verification Code)
async function openForgotPasswordModal() {
  const userEmail = prompt("Enter your registered email address to receive a password reset code:");
  if (!userEmail) return;

  try {
    const response = await fetch("http://localhost:5000/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail })
    });

    const result = await response.json();
    alert(result.message);

    if (result.success) {
      const resetCode = prompt("Enter the 6-digit verification code sent to your email:");
      const newPassword = prompt("Enter your new password:");

      if (resetCode && newPassword) {
        const resetResponse = await fetch("http://localhost:5000/api/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, code: resetCode, newPassword: newPassword })
        });
        const resetResult = await resetResponse.json();
        alert(resetResult.message);
      }
    }
  } catch (error) {
    alert("Unable to connect to the backend server. Please ensure Node server.js is running on port 5000.");
  }
}

// Helper to read PDF file as Base64 string for Policy Desk
function readPdfAsBase64(file) {
  return new Promise((resolve, reject) => {
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      return reject("Invalid file type. Only uneditable PDF documents (.pdf) are permitted.");
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// 4. Main Event Handlers
document.addEventListener("DOMContentLoaded", () => {
  const organizerForm = document.getElementById("organizerForm");
  const loginForm = document.getElementById("loginForm");
  const policyForm = document.getElementById("policyDeskForm") || document.getElementById("policyForm");

  // Check if User Arrived via Email Link with Chat Access Token
  const urlParams = new URLSearchParams(window.location.search);
  const chatToken = urlParams.get("token");
  const userRole = urlParams.get("role");

  if (chatToken) {
    showChatInterface(userRole);
  }

  // Handle Mobilizer Sign-Up
  if (organizerForm) {
    organizerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const orgBtn = document.getElementById("orgSubmitBtn");
      const orgStatus = document.getElementById("orgStatus");

      const idType = document.getElementById("orgIdType") ? document.getElementById("orgIdType").value : "Voter's Card (VIN)";
      const idNumber = document.getElementById("orgVin") ? document.getElementById("orgVin").value.trim() : "";

      // Strict VIN/NIN Validation Check before API Dispatch
      if (!idNumber || idNumber.length < 8) {
        orgStatus.style.color = "#f87171";
        orgStatus.innerText = `Error: Please enter a valid ${idType} (at least 8 characters).`;
        return;
      }

      orgBtn.disabled = true;
      orgBtn.innerText = "Verifying & Registering...";
      orgStatus.style.color = "#38bdf8";
      orgStatus.innerText = "Registering leadership profile & logging verification details...";

      const fileInput = document.getElementById("orgIdFile");
      const fileName = fileInput && fileInput.files.length > 0 ? fileInput.files[0].name : "voter_id_doc.jpg";

      const payload = {
        fullName: document.getElementById("orgName").value,
        email: document.getElementById("orgEmail") ? document.getElementById("orgEmail").value : "",
        password: document.getElementById("orgPassword") ? document.getElementById("orgPassword").value : "",
        phone: document.getElementById("orgPhone").value,
        idType: idType,
        idNumber: idNumber,
        role: document.getElementById("orgRole").value,
        fileName: fileName
      };

      // Save locally for Senator Command Dashboard
      let registeredList = JSON.parse(localStorage.getItem("campaign_mobilizers") || "[]");
      registeredList.push({ ...payload, id: Date.now(), registeredAt: new Date().toLocaleDateString() });
      localStorage.setItem("campaign_mobilizers", JSON.stringify(registeredList));

      try {
        const response = await fetch(BACKEND_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.success) {
          orgStatus.style.color = "#4ade80";
          orgStatus.innerHTML = `
            <i class="fa-solid fa-circle-check"></i> Registration Submitted! <br/>
            An email confirmation was sent to <strong>${payload.email}</strong>. Please await Senator verification approval.
          `;
          organizerForm.reset();
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        orgStatus.style.color = "#f87171";
        orgStatus.innerText = err.message || "Registration saved locally. Ensure 'node server.js' is running for email delivery.";
      } finally {
        orgBtn.disabled = false;
        orgBtn.innerText = "Submit Registration & Verify Access";
      }
    });
  }

  // Handle Account Login
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const loginBtn = document.getElementById("loginSubmitBtn");
      const orgStatus = document.getElementById("orgStatus");

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      loginBtn.disabled = true;
      loginBtn.innerText = "Authenticating...";
      orgStatus.style.color = "#38bdf8";
      orgStatus.innerText = "Verifying account credentials...";

      // Check Local Registered Mobilizers List
      const localUsers = JSON.parse(localStorage.getItem("campaign_mobilizers") || "[]");
      const user = localUsers.find(u => u.email && u.email.toLowerCase() === email.toLowerCase() && u.password === password);

      if (user) {
        orgStatus.style.color = "#4ade80";
        orgStatus.innerText = `Welcome back, ${user.fullName}! Entering Meeting Room...`;
        setTimeout(() => {
          showChatInterface(user.role);
          loginForm.reset();
        }, 600);
      } else {
        // Fallback: Check backend server authentication endpoint
        try {
          const response = await fetch(LOGIN_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
          });

          const result = await response.json();

          if (result.success) {
            orgStatus.style.color = "#4ade80";
            orgStatus.innerText = "Login Successful!";
            showChatInterface(result.role || "Verified Leader");
            loginForm.reset();
          } else {
            throw new Error(result.message || "Invalid email or password.");
          }
        } catch (err) {
          orgStatus.style.color = "#f87171";
          orgStatus.innerText = err.message || "Account not found. Please verify your details or register first.";
        }
      }

      loginBtn.disabled = false;
      loginBtn.innerText = "Sign In to Leadership Meeting Room";
    });
  }

  // Handle Policy Desk PDF Submissions
  if (policyForm) {
    policyForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const policyBtn = document.getElementById("policySubmitBtn") || document.getElementById("policyBtn");
      const policyStatus = document.getElementById("policyStatus");
      const pdfInput = document.getElementById("policyPdfFile");

      if (!pdfInput || !pdfInput.files || pdfInput.files.length === 0) {
        policyStatus.style.color = "#f87171";
        policyStatus.innerText = "Please attach a non-editable PDF proposal document.";
        return;
      }

      const file = pdfInput.files[0];

      policyBtn.disabled = true;
      policyBtn.innerText = "Transmitting PDF to Senator...";
      policyStatus.style.color = "#f59e0b";
      policyStatus.innerText = "Processing uneditable PDF document attachment...";

      try {
        const pdfBase64 = await readPdfAsBase64(file);

        const policyPayload = {
          authorName: document.getElementById("policyName") ? document.getElementById("policyName").value : "Ward Leader",
          authorEmail: document.getElementById("policyEmail") ? document.getElementById("policyEmail").value : "leader@campaign.com",
          authorPhone: document.getElementById("policyPhone") ? document.getElementById("policyPhone").value : "N/A",
          role: document.getElementById("policyRole") ? document.getElementById("policyRole").value : "Ward Coordinator",
          proposalTitle: document.getElementById("policyTitle") ? document.getElementById("policyTitle").value : "Policy Proposal",
          proposalSummary: document.getElementById("policySummary") ? document.getElementById("policySummary").value : "",
          pdfFileName: file.name,
          pdfBase64: pdfBase64
        };

        const response = await fetch(POLICY_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(policyPayload)
        });

        const result = await response.json();

        if (result.success) {
          policyStatus.style.color = "#4ade80";
          policyStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> Proposal successfully transmitted! <br/> Your PDF proposal ("${file.name}") was emailed directly to the Senator's Desk.`;
          policyForm.reset();
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        policyStatus.style.color = "#f87171";
        policyStatus.innerText = typeof err === "string" ? err : (err.message || "Error transmitting PDF proposal.");
      } finally {
        policyBtn.disabled = false;
        policyBtn.innerText = "Transmit Proposal to Senator Desk";
      }
    });
  }
});

// Helper Functions for Group Senator Discussion Room
function enableDirectChat(role) {
  showChatInterface(role);
}

function showChatInterface(role) {
  let chatBox = document.getElementById("mobilizerChatSection");
  if (!chatBox) {
    chatBox = document.createElement("div");
    chatBox.id = "mobilizerChatSection";
    chatBox.style.cssText = "max-width: 1100px; margin: 2rem auto; background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 1.5rem; color: #fff;";
    chatBox.innerHTML = `
      <div style="border-bottom: 1px solid #334155; padding-bottom: 1rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="color: #38bdf8; margin: 0;"><i class="fa-solid fa-comments"></i> Senator & Ward Coordinators Group Discussion Room (${role || 'Verified Leader'})</h3>
        <span style="background: #10b981; color: #fff; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem;">Verified Channel Active</span>
      </div>
      <div id="chatMessagesBox" style="height: 300px; overflow-y: auto; background: #0f172a; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.8rem;">
        <div style="background: #0284c7; color: #fff; padding: 10px 14px; border-radius: 10px; max-width: 80%; align-self: flex-start;">
          <strong>Senator Allwell Onyesoh:</strong> Greetings Leaders. Welcome to the official command channel. All verified coordinators are connected here. Let us align on district strategies.
        </div>
      </div>
      <div style="display: flex; gap: 0.5rem;">
        <input type="text" id="mobilizerMsgInput" placeholder="Type message to the group..." style="flex: 1; padding: 10px; background: #0f172a; border: 1px solid #475569; border-radius: 6px; color: #fff;" />
        <button onclick="sendMobilizerMessage()" style="background: #10b981; color: #fff; border: none; padding: 0 20px; border-radius: 6px; font-weight: bold; cursor: pointer;">Send</button>
      </div>
    `;
    const targetContainer = document.querySelector("section#mobilize .container");
    if (targetContainer) targetContainer.appendChild(chatBox);
  }
  chatBox.scrollIntoView({ behavior: 'smooth' });
}

function sendMobilizerMessage() {
  const input = document.getElementById("mobilizerMsgInput");
  const msg = input ? input.value.trim() : "";
  if (!msg) return;

  const box = document.getElementById("chatMessagesBox");
  if (box) {
    const msgBubble = document.createElement("div");
    msgBubble.style.cssText = "background: #334155; color: #fff; padding: 10px 14px; border-radius: 10px; max-width: 80%; align-self: flex-end;";
    msgBubble.innerHTML = `<strong>You:</strong> ${msg}`;
    box.appendChild(msgBubble);
    input.value = "";
    box.scrollTop = box.scrollHeight;
  }
}