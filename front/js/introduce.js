// introduce.js — Clean Poster Cards (no photo/modal), reveal on scroll

window.addEventListener('DOMContentLoaded', () => {
  /* 연도 */
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* 간단 팔레트 */
  (function paletteInit(){
    const toggle = document.getElementById('menuToggle');
    const pal = document.getElementById('palette');
    const close = document.getElementById('palClose');
    if (!toggle || !pal) return;

    const open = () => {
      pal.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      const input = document.getElementById('palInput');
      if (input) setTimeout(() => input.focus(), 0);
    };
    const hide = () => {
      pal.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };
    toggle.addEventListener('click', () => pal.getAttribute('aria-hidden') === 'true' ? open() : hide());
    if (close) close.addEventListener('click', hide);
    pal.addEventListener('click', e => { if (e.target === pal) hide(); });
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
      if (e.key === 'Escape') hide();
    });
  })();

  /* 카드: 워터마크 텍스트 채우기 + 스크롤 등장 */
  const grid = document.getElementById('memberGrid');
  const cards = grid ? Array.from(grid.querySelectorAll('.mcard')) : [];

  // 워터마크(모노그램) 텍스트는 data-initial의 앞 2글자 사용
  cards.forEach(card => {
    const mono = card.querySelector('.mono');
    if (!mono) return;
    const init = (card.getAttribute('data-initial') || '').replace(/\s*\(.*?\)\s*/g,'').slice(0,2) || '??';
    mono.textContent = init;
  });

  // 등장 애니메이션
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });

  cards.forEach(c => io.observe(c));
});
