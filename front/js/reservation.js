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
