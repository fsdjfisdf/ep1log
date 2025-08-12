// schedule.js — merged single-event card (KST + progress)

(() => {
  // Anchors (KST)
  const OPEN_AT = new Date('2026-03-01T00:00:00+09:00');
  const SHOW_AT = new Date('2026-04-11T00:00:00+09:00');

  // Nodes
  const pill = document.getElementById('evPill');
  const statusText = document.getElementById('evStatusText');
  const ctaHero = document.getElementById('ctaReserveHero');
  const ctaEv = document.getElementById('evReserveBtn');
  const eventDateText = document.getElementById('eventDateText');
  const openDateText = document.getElementById('openDateText');
  const progressBar = document.getElementById('progressBar');
  const progressPct = document.getElementById('progressPct');

  // Helpers
  const z = (n) => String(n).padStart(2, '0');
  const fmtDate = (d) => {
    const days = ['일','월','화','수','목','금','토'];
    return `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())} (${days[d.getDay()]})`;
  };
  const diffDays = (future, now) => Math.ceil((future - now) / (1000*60*60*24));
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  // Static text
  eventDateText.textContent = fmtDate(SHOW_AT);
  openDateText.textContent  = `${fmtDate(OPEN_AT)} 00:00`;

  function setPill(el, state){
    el.classList.remove('upc','sale','done');
    if (state === 'upcoming') { el.classList.add('upc');  el.textContent = 'UPCOMING'; }
    if (state === 'on-sale')  { el.classList.add('sale'); el.textContent = 'ON SALE'; }
    if (state === 'closed')   { el.classList.add('done'); el.textContent = 'CLOSED'; }
  }
  const disableCTAs = () => [ctaHero, ctaEv].forEach(a => { a?.setAttribute('aria-disabled','true'); a?.removeAttribute('href'); a.dataset.disabled = 'true'; });
  const enableCTAs  = () => [ctaHero, ctaEv].forEach(a => { a?.removeAttribute('aria-disabled'); delete a.dataset.disabled; a?.setAttribute('href','reservation.html'); });

  function applyState(){
    const now = new Date();
    let state = 'upcoming';
    if (now >= SHOW_AT) state = 'closed';
    else if (now >= OPEN_AT) state = 'on-sale';

    setPill(pill, state);

    if (state === 'upcoming'){
      const d = diffDays(OPEN_AT, now);
      statusText.innerHTML = `예매 오픈까지 <strong>${d}</strong>일 남았습니다.`;
      disableCTAs();
      if (progressBar){ progressBar.style.width = '0%'; progressPct.textContent = '0%'; progressBar.parentElement.classList.remove('show'); }
    }
    if (state === 'on-sale'){
      const d = diffDays(SHOW_AT, now);
      statusText.innerHTML = `예매 오픈! 공연까지 <strong>${d}</strong>일 남았습니다.`;
      enableCTAs();
      const total = SHOW_AT - OPEN_AT;
      const done = now - OPEN_AT;
      const pct = clamp(Math.round((done/total)*100), 0, 100);
      if (progressBar){
        progressBar.style.width = pct + '%';
        progressPct.textContent = pct + '%';
        progressBar.parentElement.classList.add('show');
      }
    }
    if (state === 'closed'){
      statusText.textContent = '공연이 종료되었습니다. 다음 일정을 기대해주세요.';
      disableCTAs();
      if (progressBar){ progressBar.style.width = '100%'; progressPct.textContent = '100%'; progressBar.parentElement.classList.remove('show'); }
    }
  }

  // initial & midnight refresh
  applyState();
  const msToNextDay = (() => {
    const n = new Date();
    const t = new Date(n.getFullYear(), n.getMonth(), n.getDate()+1, 0,0,0,0);
    return t - n;
  })();
  setTimeout(() => {
    applyState();
    setInterval(applyState, 24*60*60*1000);
  }, msToNextDay);
})();
