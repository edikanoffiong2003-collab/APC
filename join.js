// GOOGLE APPS SCRIPT WEB APP ENDPOINT URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxI_hR2lIU9ExtCmHmRgp-jxPexkDNxV5fqY1GFldW2vm0EIN2Mxi0G7okArwv7A5ZqzQ/exec";

// RIVERS EAST SENATORIAL DISTRICT LGAs AND WARDS DATA
const lgaWardData = {
    "Emohua": [
        "Ward 1 (Otuo)", "Ward 2 (Rumuche)", "Ward 3 (Rumuakunde)", "Ward 4 (Rumuche)", 
        "Ward 5 (Elele Alimini)", "Ward 6 (Omudioga)", "Ward 7 (Akpabu/Itu)", 
        "Ward 8 (Ogbakiri I)", "Ward 9 (Ogbakiri II)", "Ward 10 (Ibaa)", 
        "Ward 11 (Rumuewhor)", "Ward 12 (Ndele)", "Ward 13 (Erenato)", "Ward 14 (Rumuekpe)"
    ],
    "Etche": [
        "Ward 1 (Okehi)", "Ward 2 (Ulakwo I)", "Ward 3 (Ulakwo II)", "Ward 4 (Igbodo)", 
        "Ward 5 (Eberi)", "Ward 6 (Mba)", "Ward 7 (Egwi/Umualand)", "Ward 8 (Afara)", 
        "Ward 9 (Mbekirika)", "Ward 10 (Umuma)", "Ward 11 (Odufor)", "Ward 12 (Akuru)", 
        "Ward 13 (Obibi)", "Ward 14 (Ozuaha)", "Ward 15 (Chokocho)", "Ward 16 (Umuaturu)", 
        "Ward 17 (Umuanyagu)", "Ward 18 (Nihi)", "Ward 19 (Opiro)"
    ],
    "Ikwerre": [
        "Ward 1 (Isiokpo I)", "Ward 2 (Isiokpo II)", "Ward 3 (Elele I)", "Ward 4 (Elele II)", 
        "Ward 5 (Elele III)", "Ward 6 (Omagwa)", "Ward 7 (Igwuruta)", "Ward 8 (Ubima)", 
        "Ward 9 (Omerelu)", "Ward 10 (Apani)", "Ward 11 (Ozuaha)", "Ward 12 (Omudioga)", "Ward 13 (Aluu)"
    ],
    "Obio-Akpor": [
        "Ward 1 (Rumuodara)", "Ward 2 (Rumuokwu)", "Ward 3 (Rumuigbo)", "Ward 4 (Rumuepirikom)", 
        "Ward 5 (Rumuomasi)", "Ward 6 (Rumuokwurusi)", "Ward 7 (Elelenwo)", "Ward 8 (Woji)", 
        "Ward 9 (Rumurolu)", "Ward 10 (Rumueme I)", "Ward 11 (Rumueme II)", "Ward 12 (Rumueme III)", 
        "Ward 13 (Rumuokwuta)", "Ward 14 (Rumuigbo II)", "Ward 15 (Ozuboko)", "Ward 16 (Chooba)", "Ward 17 (Rumuolumeni)"
    ],
    "Ogu-Bolo": [
        "Ward 1 (Ogu I)", "Ward 2 (Ogu II)", "Ward 3 (Ogu III)", "Ward 4 (Ogu IV)", 
        "Ward 5 (Ogu V)", "Ward 6 (Ogu VI)", "Ward 7 (Bolo I)", "Ward 8 (Bolo II)", 
        "Ward 9 (Bolo III)", "Ward 10 (Bolo IV)", "Ward 11 (Wakama)", "Ward 12 (Ele)"
    ],
    "Okrika": [
        "Ward 1 (Okrika Urban I)", "Ward 2 (Okrika Urban II)", "Ward 3 (Okrika Urban III)", 
        "Ward 4 (Okrika Urban IV)", "Ward 5 (Okrika Urban V)", "Ward 6 (Okrika Urban VI)", 
        "Ward 7 (Ogoloma I)", "Ward 8 (Ogoloma II)", "Ward 9 (Ogoloma III)", 
        "Ward 10 (Ibaka)", "Ward 11 (Ogbogbo)", "Ward 12 (Abam)"
    ],
    "Omuma": [
        "Ward 1 (Ebereri)", "Ward 2 (Umuogba)", "Ward 3 (Umueke)", "Ward 4 (Umuechem)", 
        "Ward 5 (Oyigba)", "Ward 6 (Umujuloke)", "Ward 7 (Ohim)", "Ward 8 (Umuaga)", 
        "Ward 9 (Odufor)", "Ward 10 (Umudike)"
    ],
    "Port Harcourt": [
        "Ward 1 (Port Harcourt Township)", "Ward 2 (Port Harcourt Township)", "Ward 3 (Port Harcourt Township)", 
        "Ward 4 (Port Harcourt Township)", "Ward 5 (Port Harcourt Township)", "Ward 6 (Macoba)", 
        "Ward 7 (Marine Base)", "Ward 8 (Oromineke)", "Ward 9 (Oromineke)", "Ward 10 (Orebobiri)", 
        "Ward 11 (Diobu I)", "Ward 12 (Diobu II)", "Ward 13 (Diobu III)", "Ward 14 (Diobu IV)", 
        "Ward 15 (Mile 3)", "Ward 16 (Eagle Island)", "Ward 17 (Borokiri)", "Ward 18 (Waterside)", 
        "Ward 19 (Ogbunabali)", "Ward 20 (Nkpolu)"
    ]
};

document.addEventListener("DOMContentLoaded", () => {
  // 1. BACKGROUND SLIDESHOW LOGIC
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  if (slides.length > 0) {
    setInterval(() => {
      slides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add("active");
    }, 4000); // Transitions every 4 seconds
  }

  // 2. DYNAMIC LGA AND WARD DROPDOWN LOGIC
  const lgaSelect = document.getElementById("lga");
  const wardSelect = document.getElementById("ward");

  if (lgaSelect && wardSelect) {
    lgaSelect.addEventListener("change", function () {
      const selectedLga = this.value;

      // Reset Ward options
      wardSelect.innerHTML = '<option value="">-- Select Ward --</option>';

      // Populate Wards if a valid LGA is chosen
      if (selectedLga && lgaWardData[selectedLga]) {
        lgaWardData[selectedLga].forEach((ward) => {
          const option = document.createElement("option");
          option.value = ward;
          option.textContent = ward;
          wardSelect.appendChild(option);
        });
      }
    });
  }

  // 3. FORM SUBMISSION & OPTIONAL FILE CONVERT
  const form = document.getElementById("campaignForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById("submitBtn");
      const statusDiv = document.getElementById("status");

      submitBtn.disabled = true;
      statusDiv.style.color = "#0f172a";
      statusDiv.innerText = "Submitting registration...";

      try {
        const pvcInput = document.getElementById("pvcImage");
        const fileInput = pvcInput && pvcInput.files ? pvcInput.files[0] : null;
        let base64File = "";
        let fileName = "";

        // Only convert image if user selected a file
        if (fileInput) {
          statusDiv.innerText = "Submitting registration & uploading PVC...";
          base64File = await convertBase64(fileInput);
          fileName = `${document.getElementById("fullName").value}_PVC.jpg`;
        }

        const payload = {
          fullName: document.getElementById("fullName").value,
          whatsapp: document.getElementById("whatsapp").value,
          role: document.getElementById("role").value,
          lga: document.getElementById("lga").value,
          ward: document.getElementById("ward").value,
          pollingUnit: document.getElementById("pollingUnit").value,
          vin: document.getElementById("vin") ? document.getElementById("vin").value : "",
          fileData: base64File,
          fileName: fileName
        };

        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.status === "success") {
          // Display Thank You screen inside the card
          const cardContent = document.querySelector(".card-content");
          cardContent.innerHTML = `
            <div style="text-align: center; padding: 20px 10px;">
              <div style="font-size: 50px; color: #28a745; margin-bottom: 10px;">✓</div>
              <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-bottom: 10px;">THANK YOU FOR JOINING!</h2>
              <p style="color: #334155; font-size: 15px; font-weight: 600; line-height: 1.5;">
                Your registration for <strong>Project 1,000,000 Votes for Senator Allwell Onyesoh</strong> has been submitted successfully.
              </p>
            </div>
          `;
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        statusDiv.style.color = "red";
        statusDiv.innerText = "Error submitting form. Please check your network and try again.";
        submitBtn.disabled = false;
      }
    });
  }
});

// Convert file to Base64
const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = (error) => reject(error);
  });
};