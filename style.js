document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Accordion Toggle
  const accordionHeaders = document.querySelectorAll(".accordion-header");
  
  accordionHeaders.forEach(header => {
    header.addEventListener("click", () => {
      const currentItem = header.parentElement;
      
      document.querySelectorAll(".accordion-item").forEach(item => {
        if (item !== currentItem) item.classList.remove("active");
      });
      currentItem.classList.toggle("active");
    });
  });

  // 2. Gallery Filter
  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryCards = document.querySelectorAll(".gallery-card");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter");

      galleryCards.forEach(card => {
        if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // 3. Campaign Volunteer Form Submission
  const form = document.getElementById("campaignForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Registration successful! The Senator Allwell Onyesoh Campaign Office will contact you regarding ward activities.");
      form.reset();
    });
  }

  // ==========================================================================
  // 4. MULTI-LANGUAGE DYNAMIC CYCLING SYSTEM (PILLARS & DELIVERABLES)
  // ==========================================================================
  const multiLangPillars = [
    {
      titles: [
        "1. Effective Legislation & Energy Oversight",
        "1. Iwu Oma na Nhazi Alumu Ihe Anwo",
        "1. Nkeji Iwu Dima na Ihazi Ihe Nime Ala",
        "1. Iwu Piri So-mẹ na Energy Oversight",
        "1. Better Law-making & Energy Oversight"
      ],
      descriptions: [
        "Serving as Deputy Chairman of the Senate Committee on Petroleum Resources (Upstream), ensuring local content compliance, policy stability, and host community rights under the PIA.",
        "Onye osi-ite na Senate Committee Petroleum, na-neje riali kpa obodo ayi ga-enwe oke n'ihe omumu n'ala ayi m'oburu PIA.",
        "Na-aru oru di n'elu na Senate n'okwu oyibo petroleum, na-enyerem aka na-eme ka ala anyi nweta uru.",
        "Senator na-emere wa oru so-mẹ na Senate Petroleum committee so host communities go get direct benefit.",
        "As Deputy Chairman for Senate Petroleum Committee, Senator Onyesoh dey make sure our host communities get full benefits from oil money!"
      ]
    },
    {
      titles: [
        "2. Education & Human Capital Investment",
        "2. Mmụta na Mmepe Riali Ahụ Mmadụ",
        "2. Agụmakwụkwọ na Mmepe Uru Mmadụ",
        "2. Eri-kụrụ-mẹ na Mmadụ-mẹ Progress",
        "2. Education & Youth Brain Power"
      ],
      descriptions: [
        "Leveraging former Senior Lecturer and Education Commissioner experience to champion tertiary institution grants, scholarships, and women educational support.",
        "Ebe o gburu oru lekwasiri lecture na Commissioner, na-eweta scholarship na nkwado primary, secondary na tertiary.",
        "Na-eji amamihe ogbara dika lecturer na Commissioner wee na-enye ụmụ anyi scholarship na aka nkwado n'akwụkwọ.",
        "Senator na eji experience-mẹ na ako piri wa scholarship na support primary/tertiary education.",
        "With e experience as lecturer and former Education Commissioner, Senator dey share scholarship and support university students!"
      ]
    },
    {
      titles: [
        "3. Youth Empowerment & Job Creation",
        "3. Inye Ụmụ-Aghọ Ike na Mepụta Olu",
        "3. Nkwado Ụmụ-Aghọ na Imepụta Olu-Aka",
        "3. Youth-mẹ Empowerment na Olu Piri",
        "3. Youth Empowerment & Better Jobs"
      ],
      descriptions: [
        "Establishing federal technology hubs, vocational training centers, and micro-loan access tailored for digital and industrial careers across Rivers East.",
        "Na-eweta tech hubs na ulo-akwukwo oru-aka n'obodo ayi kpa umu-agho ga-enwe oru.",
        "Na-agba mbo na-eweta ebe agụmakwụkwọ oru-aka na micro-loans maka ndị ikorobia n'ala Etche na Rivers East.",
        "Tech hubs na skill acquisition centers na-emere young people order-mẹ so dem go get fine jobs.",
        "E dey set up tech centers, trade empowerment, and micro-loans make our young people get soft life and work!"
      ]
    },
    {
      titles: [
        "4. Grassroots Accessibility & Infrastructure",
        "4. Obodo Ogbondu na Nkwado Okporo-Ụzo",
        "4. Nkwado Uzo-Oma na Nweta Grassroots",
        "4. Grassroots Connection na Fine Roads",
        "4. Grassroots Connection & Quality Roads"
      ],
      descriptions: [
        "Maintaining an open-door Port Harcourt Constituency Office while lobbying for key federal road corridors connecting Port Harcourt, Etche, Ikwerre, and adjoining LGAs.",
        "Ulo oru constituency no phee obodo dum, na-akpa nkata iwu okporo uzo Etche, Ikwerre na Port Harcourt.",
        "Offis constituency nọ mehe-emehe mgbe dum, na-arụ oru uzo abuo si Port Harcourt, Etche gaa Obio/Akpor.",
        "Port Harcourt office dey open all time, na federal roads interconnecting our LGAs na-emeri.",
        "Constituency office dey open for everybody, and Senator dey force federal government to build all our major highways!"
      ]
    }
  ];

  const multiLangDeliverables = [
    {
      titles: [
        "Host Community Development & PIA Enforcement",
        "Uru Obodo Anwo & Mmeje Iwu PIA",
        "Uru Ala Anyi na Nhazi Iwu Petroleum",
        "Host Community Benefit na PIA Rules",
        "Host Community Development & Oil Money"
      ],
      descriptions: [
        "Directing regulatory focus toward strict enforcement of Petroleum Industry Act (PIA) Host Community Development Funds so oil and gas host communities in Rivers East receive direct development allocations.",
        "Na-achịkọta kpakpando na-ahụ na ego Host Community Funds ruru obodo niile nwere mmanụ mmanụ.",
        "Na-ahụ na oru PIA na-eweta ego na ala anyi n'ụzọ na-enweghị mpaghara.",
        "PIA host community development fund dey come directly enter community hand.",
        "Making sure oil communities for Rivers East get direct cash for community projects from the PIA funds!"
      ]
    },
    {
      titles: [
        "Technology & Vocational Innovation Hubs",
        "Ulo Akwụkwọ Tech na Nka-Aka",
        "Center Nkụzi Tech na Oru Aka",
        "Tech Hubs na Skill Training Centers",
        "Tech Innovation & Skill Acquisition Hubs"
      ],
      descriptions: [
        "Partnering with federal agencies to build tech innovation centers and vocational hubs in Port Harcourt, Obio/Akpor, and surrounding LGAs for young adult workforce transformation.",
        "Nkwekọrịta na federal agencies iweta innovation hubs n'obodo Port Harcourt na Obio/Akpor.",
        "Iwere aka na federal level na-eweta oru-aka na tech hubs maka ndi ikorobia anyi.",
        "Partnering federal agency-mẹ so tech hub go dey Port Harcourt na Obio/Akpor.",
        "Teaming up with federal ministries to build tech hubs and vocational workshops for our youth!"
      ]
    },
    {
      titles: [
        "South-South Federal Corridor Infrastructure",
        "Iwu Okporo Uzo Federal South-South",
        "Uzo Federal Nke South-South",
        "Federal Highway Corridor Upgrade",
        "South-South Federal Highways & Bridges"
      ],
      descriptions: [
        "Lobbying federal ministries to accelerate road rehabilitation and transport route upgrades linking Rivers East to broader South-South regional economic centers.",
        "Na-arịọ ụlọ oru federal iji mee ka uzo na-ejikọta Rivers East na mpaghara South-South maa mma.",
        "Lobbying federal ministries maka okporo uzo Etche, Ikwerre, Port Harcourt na South-South.",
        "Lobbying federal government to finish regional roads linking Port Harcourt na South-South.",
        "Pushing federal government to fix and complete all major highways connecting Rivers East with other states!"
      ]
    },
    {
      titles: [
        "Targeted Micro-Credit & Agrarian Support",
        "Nkwado Ego Agbanwe & Oru Ugbo",
        "Nkwado Micro-Credit na Oru Ugbo",
        "Micro-Credit & Farming Support",
        "Low-Interest Loans & Farmer Support"
      ],
      descriptions: [
        "Expanding low-interest micro-grants and subsidized agricultural inputs for farming communities in Etche, Ikwerre, Omuma, and Emohua.",
        "Inye nkwado ego micro-grants na ihe ugbo n'obodo Etche, Ikwerre, Omuma na Emohua.",
        "Inye aka na micro-credit na ihe ubi n'ala Etche, Ikwerre, na ebe nile.",
        "Piri micro-credit na farm tools enter farmer hand for Etche, Ikwerre and all LGAs.",
        "Giving cheap loans, fertilizer, and tractor support to local farmers in Etche, Ikwerre, Omuma, and Emohua!"
      ]
    }
  ];

  let langIndex = 0;

  function updateDynamicSections() {
    // Capture target index BEFORE initiating timeouts
    const activeIndex = langIndex;

    // Update Pillars
    multiLangPillars.forEach((pillar, i) => {
      const titleEl = document.getElementById(`pillar-title-${i}`);
      const descEl = document.getElementById(`pillar-desc-${i}`);
      if (titleEl && descEl) {
        titleEl.style.opacity = "0";
        descEl.style.opacity = "0";

        setTimeout(() => {
          titleEl.textContent = pillar.titles[activeIndex];
          descEl.textContent = pillar.descriptions[activeIndex];
          titleEl.style.opacity = "1";
          descEl.style.opacity = "1";
        }, 300);
      }
    });

    // Update Deliverables
    multiLangDeliverables.forEach((deliv, i) => {
      const titleEl = document.getElementById(`deliv-title-${i}`);
      const descEl = document.getElementById(`deliv-desc-${i}`);
      if (titleEl && descEl) {
        titleEl.style.opacity = "0";
        descEl.style.opacity = "0";

        setTimeout(() => {
          titleEl.textContent = deliv.titles[activeIndex];
          descEl.textContent = deliv.descriptions[activeIndex];
          titleEl.style.opacity = "1";
          descEl.style.opacity = "1";
        }, 300);
      }
    });

    // Advance language index for next cycle
    langIndex = (langIndex + 1) % 5;
  }

  // Smooth opacity transition styling targeting exact ID patterns
  const style = document.createElement("style");
  style.textContent = `
    [id^="pillar-title-"], [id^="pillar-desc-"],
    [id^="deliv-title-"], [id^="deliv-desc-"] {
      transition: opacity 0.3s ease-in-out !important;
    }
  `;
  document.head.appendChild(style);

  // Run initial state & start 6-second timer
  updateDynamicSections();
  setInterval(updateDynamicSections, 6000);
});

// Unmute / Mute Video Controller
const video = document.getElementById("townhallVideo");
const unmuteBtn = document.getElementById("unmuteBtn");
const volumeIcon = document.getElementById("volumeIcon");
const volumeText = document.getElementById("volumeText");

if (video && unmuteBtn) {
  unmuteBtn.addEventListener("click", () => {
    if (video.muted) {
      video.muted = false;
      video.volume = 1.0; // Sets volume to 100%
      volumeIcon.className = "fa-solid fa-volume-high";
      volumeText.textContent = "Mute";
      unmuteBtn.style.background = "#28a745"; // Green indicator when active sound
    } else {
      video.muted = true;
      volumeIcon.className = "fa-solid fa-volume-xmark";
      volumeText.textContent = "Click to Unmute";
      unmuteBtn.style.background = "rgba(0, 0, 0, 0.75)";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Target: January 16, 2027 at 08:00 AM WAT
  const targetDate = new Date("2027-01-16T08:00:00+01:00").getTime();

  function updateLiveClock() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    const elDays = document.getElementById("cd-days");
    const elHours = document.getElementById("cd-hours");
    const elMinutes = document.getElementById("cd-minutes");
    const elSeconds = document.getElementById("cd-seconds");

    if (!elDays || !elHours || !elMinutes || !elSeconds) return;

    if (difference <= 0) {
      const container = document.querySelector(".countdown-container");
      if (container) {
        container.innerHTML = "<h3 style='color: #28a745;'>Elections Are Live Today!</h3>";
      }
      return;
    }

    // Math for Total Days + Remainder Hours, Minutes, and Seconds
    const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Format display output
    elDays.textContent = String(totalDays).padStart(2, "0");
    elHours.textContent = String(hours).padStart(2, "0");
    elMinutes.textContent = String(minutes).padStart(2, "0");
    elSeconds.textContent = String(seconds).padStart(2, "0");
  }

  updateLiveClock();
  setInterval(updateLiveClock, 1000);
});

// Gallery Card Slideshow Logic
let slideIndex = 0;
let slideTimer;

function showSlides() {
  const slides = document.getElementsByClassName("mySlides");
  const dots = document.getElementsByClassName("dot");

  if (!slides || slides.length === 0) return;

  // Hide all slides
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }

  // Remove active state from all dots
  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  // Display current slide and highlight matching dot
  slides[slideIndex - 1].style.display = "block";
  if (dots[slideIndex - 1]) {
    dots[slideIndex - 1].className += " active";
  }

  // Auto-advance slide every 3.5 seconds
  clearTimeout(slideTimer);
  slideTimer = setTimeout(showSlides, 3500);
}

// Manual Dot Click Action
function currentSlide(n) {
  slideIndex = n - 1;
  showSlides();
}

// Initialize slideshow on page load
document.addEventListener("DOMContentLoaded", () => {
  showSlides();
});