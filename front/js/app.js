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

// ===== NEXT SHOW / D-DAY (KST 기준)
// 고정된 공연일 (KST 자정)
const SHOW_ISO_KST = '2025-12-19T00:00:00+09:00';

// 날짜 표기 (예: 2025.12.19 (금))
(function setShowDateText(){
  const el = document.getElementById('showDate');
  if (!el) return;
  const d = new Date(SHOW_ISO_KST);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const weekday = d.toLocaleDateString('ko-KR', { weekday: 'short', timeZone: 'Asia/Seoul' }); // (금)
  el.textContent = `${y}.${m}.${day} (${weekday})`;
})();

// D-Day 계산 (KST 기준, 회당 1시간 갱신)
(function ddayInit(){
  const el = document.getElementById('dday');
  if (!el) return;

  const DAY = 24 * 60 * 60 * 1000;
  const targetMs = Date.parse(SHOW_ISO_KST);

  function update(){
    // 현재 시각을 KST 기준으로 보정 (KST는 DST 없음 → +9시간 고정)
    const nowKstMs = Date.now() + 9 * 60 * 60 * 1000;
    const diff = targetMs - nowKstMs;

    if (diff > 0){
      // 아직 공연 전: 올림 처리 (하루 미만 남아도 D-1)
      const daysLeft = Math.ceil(diff / DAY);
      el.textContent = `D-${daysLeft}`;
      el.classList.remove('ended');
    } else {
      // 공연 당일 또는 이후
      const daysPast = Math.floor((-diff) / DAY);
      if (daysPast === 0){
        el.textContent = 'D-DAY';
        el.classList.add('ended');
      } else {
        el.textContent = `D+${daysPast}`;
        el.classList.add('ended');
      }
    }
  }

  update();
  // 매시간 갱신 (부하 최소화)
  setInterval(update, 60 * 60 * 1000);
})();
