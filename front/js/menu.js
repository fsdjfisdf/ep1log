document.addEventListener("DOMContentLoaded", () => {
  const existingToggle = document.querySelector('.menu-toggle');
  if (existingToggle) return;

  const menuToggle = document.createElement("div");
  menuToggle.className = "menu-toggle";
  menuToggle.innerHTML = `
    <svg viewBox="0 0 100 80" width="26" height="26">
      <rect width="100" height="10" rx="6"></rect>
      <rect y="30" width="100" height="10" rx="6"></rect>
      <rect y="60" width="100" height="10" rx="6"></rect>
    </svg>
  `;
  document.body.appendChild(menuToggle);

  const slideMenu = document.createElement("div");
  slideMenu.className = "slide-menu hidden";
  slideMenu.innerHTML = `
    <a href="introduce.html" class="slide-item">MEMBERS</a>
    <a href="schedule.html" class="slide-item">SCHEDULE</a>
    <a href="reservation.html" class="slide-item">RESERVATION</a>
    <a href="fanboard.html" class="slide-item">FAN BOARD</a>
    <a href="store.html" class="slide-item">STORE</a>
  `;
  document.body.appendChild(slideMenu);

  menuToggle.addEventListener("click", () => {
    slideMenu.classList.toggle("hidden");
    slideMenu.classList.toggle("visible");
  });
});
