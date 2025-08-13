// ===== 연도 표시
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// ===== MENU 오버레이 요소
const menuToggle = document.getElementById('menuToggle');
const pal = document.getElementById('palette');
const palClose = document.getElementById('palClose');
const palInput = document.getElementById('palInput');
const palList = document.getElementById('palList');

let palOpen = false, lastFocus = null, selIndex = -1;

// ===== Scroll lock & Focus trap
let unblockScroll = () => {};
function lockScroll(){
  const prev = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  unblockScroll = () => { document.body.style.overflow = prev; };
}
let releaseTrap = () => {};
function trapFocus(container){
  const focusables = container.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return () => {};
  const first = focusables[0], last = focusables[focusables.length - 1];
  function handler(e){
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }
  container.addEventListener('keydown', handler);
  return () => container.removeEventListener('keydown', handler);
}

// ===== 팔레트 토글
function openPal(){
  if (palOpen) return;
  const last = document.activeElement;
  lastFocus = last && last !== document.body ? last : menuToggle;
  pal.classList.add('show');
  pal.setAttribute('aria-hidden','false');
  menuToggle?.setAttribute('aria-expanded','true');
  palOpen = true;
  selIndex = -1;
  palInput.value = '';
  palInput.focus();
  lockScroll();
  releaseTrap = trapFocus(pal);
}
function closePal(){
  if (!palOpen) return;
  pal.classList.remove('show');
  pal.setAttribute('aria-hidden','true');
  menuToggle?.setAttribute('aria-expanded','false');
  palOpen = false;
  unblockScroll();
  releaseTrap();
  if (lastFocus) lastFocus.focus();
}
menuToggle?.addEventListener('click', () => palOpen ? closePal() : openPal());
palClose?.addEventListener('click', closePal);
document.addEventListener('click', (e) => {
  if (!palOpen) return;
  const within = pal.contains(e.target) || menuToggle?.contains(e.target);
  if (!within) closePal();
});
addEventListener('keydown', (e) => {
  if (e.key === 'Escape') return closePal();
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){
    e.preventDefault();
    palOpen ? closePal() : openPal();
  }
});

// ===== 팔레트 검색/네비
function highlight(){
  palList.querySelectorAll('a').forEach(a => a.removeAttribute('aria-selected'));
  const visibles = [...palList.querySelectorAll('li')].filter(li => li.style.display !== 'none');
  if (selIndex >= 0 && visibles[selIndex]){
    const a = visibles[selIndex].querySelector('a');
    a.setAttribute('aria-selected','true');
    a.scrollIntoView({ block:'nearest' });
  }
}
palInput?.addEventListener('input', () => {
  const q = palInput.value.toLowerCase();
  const items = [...palList.querySelectorAll('a')];
  items.forEach(a => {
    const show = a.textContent.toLowerCase().includes(q);
    a.parentElement.style.display = show ? '' : 'none';
  });
  selIndex = -1; highlight();
});
palInput?.addEventListener('keydown', (e) => {
  const visibles = [...palList.querySelectorAll('li')].filter(li => li.style.display !== 'none');
  if (!visibles.length) return;
  if (e.key === 'ArrowDown'){ e.preventDefault(); selIndex = (selIndex + 1) % visibles.length; highlight(); }
  if (e.key === 'ArrowUp'){ e.preventDefault(); selIndex = (selIndex - 1 + visibles.length) % visibles.length; highlight(); }
  if (e.key === 'Enter' && selIndex >= 0){
    const link = visibles[selIndex].querySelector('a');
    if (link) window.location.href = link.getAttribute('href');
  }
});
