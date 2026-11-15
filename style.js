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

const manifestoData = [
  {
    lang: "ENGLISH",
    text: `OFFICIAL LEGISLATIVE MANIFESTO & REPORT CARD
RIVERS EAST SENATORIAL DISTRICT

As we reflect on our legislative journey in the National Assembly, our commitment to purposeful representation, tangible development, and grassroots inclusion has remained unshakeable across our eight local government areas.

During our first term, we delivered critical infrastructural upgrades, championed strategic secondary school renovations to provide conducive learning environments for our children, and provided vital scholarship and Call-to-Bar financial support to law students.

Furthermore, our healthcare initiatives successfully rolled out free medical and ophthalmological outreaches to grassroots communities, while our economic programs facilitated stable federal employment and empowered vulnerable market women and farmers.

Looking forward to our second term, we will scale up infrastructural projects, expand tech-driven youth empowerment, and leverage our digital town hall platform to ensure transparent, direct communication with every single voter.`
  },
  {
    lang: "IKWERRE",
    text: `MANIFESTO NKE RIVERS EAST (IKWERRE)
NDICHIE NA NDIBE ANYI NILE

Njem anyi riri n'okpuru nzukọ omeiwu ejirila ezi obi, ọrụ siri ike, na mmepe a na-ahụ anya gosi onwe ya n'ime LGA asatọ anyị nile.

N'oge nke mbu anyi, anyi rụgharịrị ma melite ọtụtụ ụlọ akwụkwọ sekọndrị iji hụ na ụmụ akwụkwọ nwere ebe ọmụmụ dị mma, ma nye ụmụ akwụkwọ iwu nnukwu enyemaka ego na nkwado Call-to-Bar.

N'akụkụ ahụike, anyi wetara ọgwụgwọ efu na nleta ahụike n'ime obodo nile, nakwa n'akụkụ akụ na ụba, anyi chọtara ọrụ gọọmentị etiti ma kesaa enyemaka ego nye ndị na-azụ ahịa n'ahịa.

Mgbè nke abụọ a gbara anyị, anyị ga-eweta nnukwu mmepe, ohere ọrụ ọhụrụ maka ndị ntorobịa, na nzukọ obodo mepere emepe site na ntaneetị iji na-ekwurịta okwu mgbe niile.`
  },
  {
    lang: "ETCHE",
    text: `MANIFESTO NA AKỤKỌ ỌRỤ: RIVERS EAST (ETCHE)
NDIBE ANYI NA ỤMỤNNAM

Nnọchiteanya anyi n'ime Senate abụghị naanị okwu, kama ọ bụ omume na arụmọrụ pụtara ihe nke gosiri na anyị na-agba mbọ iji wuli obodo anyị elu.

N'ime oge mbụ anyi n'ọkwa, anyi rụgharịrị ma dozie ọtụtụ ụlọ akwụkwọ sekọndrị iji bulie ọkụ agụmakwụkwọ, ma kwadoro ụmụ akwụkwọ na-amụ iwu site n'inye ha nnukwu onyinye ego iji wepụta ha n'ọrụ.

N'ihe gbasara ahụike, nleta ahụike efu ruru obodo ọ bụla iji gwọọ ndị mmadụ, ebe anyị mere ka ndị nne n'ahịa na ndị ọrụ ugbo nwee nkwado azụmahịa siri ike.

Oge anyị nke abụọ ga-eweta ọtụtụ okporo ụzọ ọhụrụ, nkwado ntorobịa site na teknụzụ, na ọchịchị doro aṅaa site na digital town hall ebe onye ọ bụla nwere olu.`
  },
  {
    lang: "OKRIKA",
    text: `MANIFESTO KENE RIVERS EAST (OKRIKA)
IJIYE-MINE KPOMOTERI IBITE MAMI KIYOU

Timi kiyou mi piri, awo n'ime Senate mi tameni gborofo wari kpete, school kpete, medical outreach free piri awo kpoko kpete n'ime local government nile.

First term mi niye kiyou kpomoteri road kpete, law students piri grants, market women piri support business bariye awo ibite mami kiyou nile.

Second term mi niye digital town hall platform piri awo kpo communication join senator directly, federal character chairman mi niye jobs piri youth nile.

Join us online live today kpo discuss future piri Rivers East Senatorial District bariye awo!`
  }
];

let currentIndex = 0;
const parchmentElement = document.getElementById("parchmentPaper");
const textElement = document.getElementById("manifestoText");
const quillElement = document.getElementById("quillPen");

function typeWriter(text, i = 0, callback) {
  if (i === 0) {
    textElement.textContent = "";
    if (quillElement) quillElement.style.display = "block";
  }

  if (i < text.length) {
    textElement.textContent += text.charAt(i);

    // Dynamically move the quill based on text container height/scroll
    if (quillElement) {
      const lineHeight = 24; // approximate line height in pixels
      const charsPerLine = 45; // approximate chars per line
      const lineNum = Math.floor(i / charsPerLine);
      
      let topPos = 20 + (lineNum * lineHeight) - parchmentElement.scrollTop;
      let leftPos = 20 + ((i % charsPerLine) * 9);

      // Keep quill inside the visible padded area of the paper
      if (topPos < 10) topPos = 10;
      if (topPos > parchmentElement.clientHeight - 40) {
        topPos = parchmentElement.clientHeight - 40;
        parchmentElement.scrollTop += lineHeight; // auto scroll parchment down
      }
      if (leftPos > parchmentElement.clientWidth - 50) leftPos = parchmentElement.clientWidth - 50;

      quillElement.style.top = `${topPos}px`;
      quillElement.style.left = `${leftPos}px`;
    }

    setTimeout(() => typeWriter(text, i + 1, callback), 20);
  } else {
    // Hide quill when typing finishes
    if (quillElement) quillElement.style.display = "none";
    if (callback) {
      setTimeout(callback, 9000); // 9-second pause to read full paragraphs before rolling up
    }
  }
}

function runScrollSequence() {
  if (!parchmentElement || !textElement) return;

  const currentItem = manifestoData[currentIndex];
  textElement.textContent = "";
  parchmentElement.scrollTop = 0;
  parchmentElement.classList.remove("rolling-up");

  setTimeout(() => {
    typeWriter(currentItem.text, 0, () => {
      parchmentElement.classList.add("rolling-up");
      if (quillElement) quillElement.style.display = "none";
      
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % manifestoData.length;
        runScrollSequence();
      }, 1200);
    });
  }, 600);
}

window.addEventListener("DOMContentLoaded", () => {
  runScrollSequence();
});