// reservation.js — Neo-Brutal UX with robust states

(() => {
  const API_BASE = 'http://43.201.204.91:3001/api';
  const ENDPOINT_RESERVATION = `${API_BASE}/reservation`;
  const ENDPOINT_STATUS = `${API_BASE}/reservation/status`;
  const PRICE_PER_TICKET = 15000;

  const form = document.getElementById('reservation-form');
  const peopleEl = document.getElementById('people_count');
  const nameEl = document.getElementById('name');
  const ageEl = document.getElementById('age_group');
  const favEl = document.getElementById('favorite_member');
  const addrEl = document.getElementById('address');
  const amountEl = document.getElementById('total-amount');
  const confirmBox = document.getElementById('confirmation-message');
  const submitBtn = document.getElementById('submitBtn');

  const openStatusBtn = document.getElementById('openStatus');
  const checkStatusInline = document.getElementById('checkStatusInline');
  const modal = document.getElementById('statusModal');
  const modalBackdrop = modal.querySelector('.resv-modal-backdrop');
  const modalClose = document.getElementById('statusClose');
  const statusForm = document.getElementById('status-form');
  const statusResult = document.getElementById('status-result');

  // helpers
  const fmt = (n) => n.toLocaleString('ko-KR') + '원';
  const calc = () => {
    const c = Math.max(1, parseInt(peopleEl.value || '0', 10) || 0);
    amountEl.textContent = fmt(c * PRICE_PER_TICKET);
  };
  const setMsg = (html, ok=false, err=false) => {
    confirmBox.className = 'msg' + (ok ? ' ok' : '') + (err ? ' err' : '');
    confirmBox.innerHTML = html;
    confirmBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // live total
  peopleEl.addEventListener('input', calc);
  peopleEl.addEventListener('blur', calc);
  calc();

  // submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // basic client checks
    if (!nameEl.value.trim()) { nameEl.focus(); return setMsg('❌ 이름을 입력해주세요.', false, true); }
    const count = parseInt(peopleEl.value, 10);
    if (!count || count < 1) { peopleEl.focus(); return setMsg('❌ 인원 수를 1명 이상으로 입력해주세요.', false, true); }
    if (!addrEl.value.trim()) { addrEl.focus(); return setMsg('❌ 주소를 입력해주세요.', false, true); }

    const payload = {
      name: nameEl.value.trim(),
      people_count: count,
      age_group: ageEl.value,
      favorite_member: favEl.value,
      address: addrEl.value.trim(),
      amount: count * PRICE_PER_TICKET
    };

    submitBtn.disabled = true;
    submitBtn.textContent = '전송 중…';

    try {
      const res = await fetch(ENDPOINT_RESERVATION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setMsg(
          `✅ 예약 신청이 완료되었습니다!<br><br>
           <strong>입금계좌</strong> · 국민은행 288001-04-217050 (정현우)<br>
           <strong>입금금액</strong> · ${fmt(payload.amount)}<br><br>
           입금 확인 후 예약이 확정됩니다. (최대 1일 소요)`,
          true, false
        );
        form.reset();
        calc();
      } else {
        const txt = await res.text().catch(()=> '서버 오류');
        setMsg(`❌ 예약 중 오류가 발생했습니다.<br>${txt}`, false, true);
      }
    } catch (err) {
      setMsg(`❌ 네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.<br>${err.message}`, false, true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '예매';
    }
  });

  // modal open/close
  function openModal(){
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    statusResult.textContent = '';
    setTimeout(() => document.getElementById('status_name').focus(), 0);
  }
  function closeModal(){
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
  }

  openStatusBtn?.addEventListener('click', openModal);
  checkStatusInline?.addEventListener('click', openModal);
  modalBackdrop.addEventListener('click', (e)=>{ if (e.target.hasAttribute('data-close')) closeModal(); });
  modalClose.addEventListener('click', closeModal);
  addEventListener('keydown', (e)=>{ if (e.key === 'Escape') closeModal(); });

  // status submit
  statusForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('status_name').value.trim();
    const age_group = document.getElementById('status_age_group').value;

    if (!name) {
      statusResult.className = 'msg err';
      statusResult.textContent = '❌ 이름을 입력해주세요.';
      return;
    }

    statusResult.className = 'msg';
    statusResult.textContent = '조회 중…';

    try {
      const qs = new URLSearchParams({ name, age_group });
      const res = await fetch(`${ENDPOINT_STATUS}?${qs}`);
      if (res.ok) {
        const data = await res.json();
        statusResult.className = 'msg ok';
        statusResult.innerHTML = `
          <p><strong>예약 상태:</strong> ${data.status === 'completed' ? '✅ 입금 확인 완료' : '⏳ 입금 대기 중'}</p>
          <p><strong>예약 인원:</strong> ${data.people_count}</p>
          <p><strong>선호 멤버:</strong> ${data.favorite_member}</p>
          <p><strong>주소:</strong> ${data.address}</p>
        `;
      } else {
        const txt = await res.text().catch(()=> '');
        statusResult.className = 'msg err';
        statusResult.innerHTML = `❌ 예약 정보를 찾을 수 없습니다.${txt ? `<br>${txt}` : ''}`;
      }
    } catch (err) {
      statusResult.className = 'msg err';
      statusResult.textContent = `❌ 조회 중 오류: ${err.message}`;
    }
  });
})();
