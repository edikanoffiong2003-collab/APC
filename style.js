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
});