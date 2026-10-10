/* ==========================================================================
   SLIDESHOW & MULTI-LANGUAGE ERASER/TYPEWRITER SYSTEM (LOOPS INFINITELY)
   ========================================================================== */

const slidesData = [
  {
    messages: [
      "[English]: Bold economic policy reforms, infrastructure prioritization, and economic empowerment for the Niger Delta.",
      "[Ikwerre]: Onyenwe anyi Presidential nweru kpakpando na risi okwu mmeje obodo kpa ayi.",
      "[Etche]: Onyenwe anyi President na-eburu anyi uzo na imeputa ihe oma nile.",
      "[Okrika]: Opubo President-mẹ belema piri wa tamuno obiri-mẹ minabo.",
      "[Pidgin]: President Tinubu dey give us better infrastructure and economic growth for Rivers East!"
    ]
  },
  {
    messages: [
      "[English]: Strategic legislative leadership driving swift lawmaking and key resource allocations for the South-South.",
      "[Ikwerre]: Ndidike rne Ogbo Senate no-neje riali kpa ikpe-azu ayi ga-adima.",
      "[Etche]: Senate President na-agba mbo na ihazi omaricha iwu uzo mmepe.",
      "[Okrika]: Senate President-mẹ na wa piri priority le-mẹ na bill-mẹ kụrọ-mẹ.",
      "[Pidgin]: Senate President Akpabio dey make sure federal allocation reach our side!"
    ]
  },
  {
    messages: [
      "[English]: Unmatched infrastructure execution and strong political protection for Rivers State interests at the federal level.",
      "[Ikwerre]: Leader anyi Nyesom Wike ji riali mmepe na-akpalite afuma Rivers State.",
      "[Etche]: Minister Wike na-aru oru di egwu na iwu okporo uzo na mmepe obodo.",
      "[Okrika]: Minister Wike na wa piri tari, wa obiri fine-mẹ mangi-mẹ.",
      "[Pidgin]: Wike na overall boss! E dey build roads and stand strong for Rivers people!"
    ]
  },
  {
    messages: [
      "[English]: Unified vision connecting state development plans with Senator Onyesoh’s legislative agenda.",
      "[Ikwerre]: Governorship Candidate anyi no-zi kpa state ayi ga-eme nweru mmepe.",
      "[Etche]: Onyenwe anyi na-azọ Governor na-eweta amamihe na ihu n'anya na Rivers.",
      "[Okrika]: Governor candidate-mẹ na wa piri progress mangi wa buru so-mẹ.",
      "[Pidgin]: APC Governorship candidate dey work side-by-side with Senator for full state progress!"
    ]
  },
  {
    // FINAL SLIDE: SENATOR ALLWELL ONYESOH (Index 4)
    messages: [
      "[English - Past Achievements]: Facilitated key bills, sponsored hundreds of university scholarships, and empowered local businesses.",
      "[English - Future Commitment]: Re-elect Senator Onyesoh for expanded industrial growth, continuous pipelines, and youth employment!",
      "[Ikwerre]: Senator Allwell Onyesoh na-eme oru oma na gboo, ku-anyi re-elect ya ozo!",
      "[Etche]: Senator Onyesoh emela ihe ukwu! Anyi ga-alaghachi ya ozo na 2027!",
      "[Pidgin]: Onyesoh don perform well! Re-elect Senator Allwell Onyesoh for 2027!"
    ]
  }
];

let currentSlideIndex = 0;
let typewriterTimeout = null;

// Initialize Dots Navigation
const dotsContainer = document.getElementById('dotsContainer');
if (dotsContainer) {
  slidesData.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = `dot ${idx === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => jumpToSlide(idx));
    dotsContainer.appendChild(dot);
  });
}

function updateDots() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, idx) => {
    dot.className = `dot ${idx === currentSlideIndex ? 'active' : ''}`;
  });
}

// Typewriter & Erase Engine
function typeAndEraseText(elementId, messages, msgIndex = 0, onComplete) {
  const element = document.getElementById(elementId);
  
  if (!element) {
    if (onComplete) onComplete();
    return;
  }

  const currentText = messages[msgIndex];
  let charIndex = 0;

  function typeChar() {
    if (charIndex < currentText.length) {
      element.textContent += currentText.charAt(charIndex);
      charIndex++;
      typewriterTimeout = setTimeout(typeChar, 35); // Typing speed
    } else {
      typewriterTimeout = setTimeout(() => {
        const isLastMessage = msgIndex === messages.length - 1;

        if (!isLastMessage) {
          // Erase text to type the next message in this slide
          eraseChar();
        } else if (onComplete) {
          // Move to the next slide once all messages for this slide finish
          onComplete();
        }
      }, 1200);
    }
  }

  function eraseChar() {
    if (element.textContent.length > 0) {
      element.textContent = element.textContent.substring(0, element.textContent.length - 1);
      typewriterTimeout = setTimeout(eraseChar, 18); // Erasing speed
    } else {
      typeAndEraseText(elementId, messages, msgIndex + 1, onComplete);
    }
  }

  element.textContent = '';
  typeChar();
}

// Slide Controller
function showSlide(index) {
  clearTimeout(typewriterTimeout);

  const slides = document.querySelectorAll('.slide');
  slides.forEach(slide => slide.classList.remove('active'));

  currentSlideIndex = index;
  if (slides[currentSlideIndex]) {
    slides[currentSlideIndex].classList.add('active');
  }

  updateDots();

  const textElementId = `text-slide-${currentSlideIndex}`;
  const currentMessages = slidesData[currentSlideIndex].messages;

  typeAndEraseText(textElementId, currentMessages, 0, () => {
    nextSlide();
  });
}

function nextSlide() {
  // Loop back to index 0 seamlessly when reaching the end
  const nextIndex = (currentSlideIndex + 1) % slidesData.length;
  showSlide(nextIndex);
}

function jumpToSlide(index) {
  showSlide(index);
}

// Start Slideshow on Page Load
window.addEventListener('DOMContentLoaded', () => {
  showSlide(0);
});