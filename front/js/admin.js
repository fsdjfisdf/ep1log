async function loadReservations() {
  const res = await fetch('http://43.201.204.91:3001/api/reservations');
  const data = await res.json();

  const tbody = document.querySelector('#reservation-table tbody');
  tbody.innerHTML = '';

  data.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.name}</td>
      <td>${r.people_count}</td>
      <td>${r.age_group}</td>
      <td>${r.favorite_member}</td>
      <td>${r.address}</td>
      <td>${r.status}</td>
      <td>
        ${r.status === 'pending' ? `<button onclick="approve('${r.id}')">승인</button>` : '완료'}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function approve(id) {
  const res = await fetch(`http://43.201.204.91:3001/api/reservations/${id}`, {
    method: 'PATCH'
  });
  if (res.ok) {
    alert('승인 처리 완료!');
    loadReservations();
  } else {
    alert('승인 실패!');
  }
}

loadReservations();
