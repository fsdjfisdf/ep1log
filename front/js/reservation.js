document.getElementById('reservation-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;
  const name = form.name.value;
  const peopleCount = parseInt(form.people_count.value);
  const ageGroup = form.age_group.value;
  const favoriteMember = form.favorite_member.value;
  const address = form.address.value;
  const amount = peopleCount * 15000;

const res = await fetch('http://43.201.204.91:3001/api/reservation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, people_count: peopleCount, age_group: ageGroup, favorite_member: favoriteMember, address, amount })
});

  if (res.ok) {
    document.getElementById('confirmation-message').innerHTML = `
      <p>예약 신청이 완료되었습니다! 🎉<br><br>
      <strong>입금계좌:</strong> 국민은행 288001-04-217050 (정현우)<br>
      <strong>입금금액:</strong> ${amount.toLocaleString()}원<br><br>
      입금 확인 후 예약이 확정됩니다. (1일 이상 소요될 수 있습니다.)</p>
    `;
    form.reset();
  } else {
    alert('예약 중 오류가 발생했습니다.');
  }
});

document.getElementById('check-status-btn').addEventListener('click', () => {
  document.getElementById('status-modal').classList.remove('hidden');
});

document.querySelector('.close-btn').addEventListener('click', () => {
  document.getElementById('status-modal').classList.add('hidden');
});

document.getElementById('status-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = e.target;
  const name = form.status_name.value.trim();
  const ageGroup = form.status_age_group.value;

  const res = await fetch(`http://43.201.204.91:3001/api/reservation/status?name=${encodeURIComponent(name)}&age_group=${encodeURIComponent(ageGroup)}`);
  const resultBox = document.getElementById('status-result');

  if (res.ok) {
    const data = await res.json();
    resultBox.innerHTML = `
      <p><strong>예약 상태:</strong> ${data.status === 'completed' ? '✅ 입금 확인 완료' : '⏳ 입금 대기 중'}</p>
      <p><strong>예약 인원:</strong> ${data.people_count}</p>
      <p><strong>선호 멤버:</strong> ${data.favorite_member}</p>
      <p><strong>주소:</strong> ${data.address}</p>
    `;
  } else {
    resultBox.innerHTML = `<p>❌ 예약 정보를 찾을 수 없습니다.</p>`;
  }
});
