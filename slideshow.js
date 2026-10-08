/* ==========================================================================
   SLIDESHOW & MULTI-LANGUAGE ERASER/TYPEWRITER SYSTEM (STOPS AT FINAL SLIDE)
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
      "[English]: Strategic alignment delivering grassroots empowerment and federal projects for Etche/Omuma Constituency.",
      "[Ikwerre]: Rep. Kelechi Nwogu na-ezisa mmepe na ikike n'obodo Etche na Omuma.",
      "[Etche]: Onyenwe anyi Rep. Kelechi Nwogu na-eweta ilu olu na mmepe puru iche n'ala Etche.",
      "[Okrika]: Rep. Kelechi Nwogu dey carry federal project and progress enter every corner for Etche/Omuma.",
      "[Pidgin]: Rep. Kelechi Nwogu dey work hand-in-hand with the people to bring real mmepe and youth empowerment!"
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
    messages: [
      "[English]: Direct ward-level implementation of Senator Onyesoh’s local welfare and scholarship programs.",
      "[Ikwerre]: Leadership LGA anyi no-meje oru riali na ward dum kpa ayi na-adima.",
      "[Etche]: Chairman LGA na-eweta nkwado Senator gaa na ward nile.",
      "[Okrika]: Chairman-mẹ na grassroots piri community empowerment mangi.",
      "[Pidgin]: Local Government Chairman dey deliver Senator's empowerment direct to every ward!"
    ]
  },
  {
    // FINAL SLIDE: SENATOR ALLWELL ONYESOH
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
    if (onComplete && currentSlideIndex < slidesData.length - 1) onComplete();
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
        const isLastSlide = currentSlideIndex === slidesData.length - 1;
        const isLastMessage = msgIndex === messages.length - 1;

        if (!isLastMessage) {
          // Erase text to type the next message in this slide
          eraseChar();
        } else if (!isLastSlide && onComplete) {
          // Move to the next slide only if it's NOT the last slide
          onComplete();
        }
        // If it is the last slide & last message, execution stops naturally here.
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
  // Stop when reaching the last slide instead of cycling back to index 0
  if (currentSlideIndex < slidesData.length - 1) {
    showSlide(currentSlideIndex + 1);
  }
}

function jumpToSlide(index) {
  showSlide(index);
}

// Start Slideshow on Page Load
window.addEventListener('DOMContentLoaded', () => {
  showSlide(0);
});