document.addEventListener("DOMContentLoaded", () => {
  const members = document.querySelectorAll(".member");
  const infoBox = document.getElementById("member-info");

  members.forEach(member => {
    member.addEventListener("click", () => {
      const name = member.dataset.name;
      const role = member.dataset.role;
      const link = member.dataset.link;

      let html = `<strong>${name}</strong><br>${role}`;
      if (link) {
        html += `<br><a href="https://instagram.com/${link.replace('@', '')}" target="_blank">${link}</a>`;
      }

      infoBox.innerHTML = html;
    });
  });
});
