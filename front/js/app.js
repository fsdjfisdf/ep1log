// 연도
const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

// 팔레트 토글
const trigger = document.getElementById('brandTrigger');
const pal = document.getElementById('palette');
const palClose = document.getElementById('palClose');
const palInput = document.getElementById('palInput');
const palList = document.getElementById('palList');

let palOpen = false, lastFocus = null, selIndex = -1;

function openPal(){
  if (palOpen) return;
  lastFocus = document.activeElement;
  pal.classList.add('show');
  pal.setAttribute('aria-hidden','false');
  trigger.setAttribute('aria-expanded','true');
  palOpen = true;
  selIndex = -1;
  palInput.value = '';
  palInput.focus();
}
function closePal(){
  if (!palOpen) return;
  pal.classList.remove('show');
  pal.setAttribute('aria-hidden','true');
  trigger.setAttribute('aria-expanded','false');
  palOpen = false;
  if (lastFocus) lastFocus.focus();
}

trigger.addEventListener('click', () => palOpen ? closePal() : openPal());
palClose.addEventListener('click', closePal);

// 외부 클릭 닫기
document.addEventListener('click', (e) => {
  if (!palOpen) return;
  const within = pal.contains(e.target) || trigger.contains(e.target);
  if (!within) closePal();
});

// ESC 닫기
addEventListener('keydown', (e) => {
  if (e.key === 'Escape') return closePal();
  // ⌘K / Ctrl+K 로 열기
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){
    e.preventDefault();
    palOpen ? closePal() : openPal();
  }
});

// 팔레트 검색/키보드 네비
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

function highlight(){
  palList.querySelectorAll('a').forEach(a => a.removeAttribute('aria-selected'));
  const visibles = [...palList.querySelectorAll('li')].filter(li => li.style.display !== 'none');
  if (selIndex >= 0 && visibles[selIndex]){
    const a = visibles[selIndex].querySelector('a');
    a.setAttribute('aria-selected','true');
    a.scrollIntoView({ block: 'nearest' });
  }
}
