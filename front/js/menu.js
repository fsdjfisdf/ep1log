document.addEventListener("DOMContentLoaded", () => {
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
    <a href="introduce.html" class="slide-item">멤버소개</a>
    <a href="schedule.html" class="slide-item">공연일정</a>
    <a href="reservation.html" class="slide-item">공연예약</a>
    <a href="fanboard.html" class="slide-item">방명록</a>
    <a href="store.html" class="slide-item">스토어</a>
  `;
  document.body.appendChild(slideMenu);

  menuToggle.addEventListener("click", () => {
    slideMenu.classList.toggle("hidden");
    slideMenu.classList.toggle("visible");
  });
});
