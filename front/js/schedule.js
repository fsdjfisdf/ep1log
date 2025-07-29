// 공연 예약 날짜 정보
const reservationDate = new Date("2026-03-01");
const today = new Date();

const messageBox = document.querySelector(".reservation-message");

if (today < reservationDate) {
  const daysLeft = Math.ceil((reservationDate - today) / (1000 * 60 * 60 * 24));
  messageBox.innerHTML = `
    <p><strong>${daysLeft}</strong>일 뒤, 26년 3월 1일부터 예매가 시작됩니다.</p>
  `;
} else {
  messageBox.innerHTML = `
    아래 링크에서 공연을 예약해주세요.</p>
    <a href="#" class="reserve-link">예매하러 가기</a>
  `;
}

// 공연 설명 추가 삽입
const scheduleContainer = document.querySelector(".schedule-container");

const descriptionBox = document.createElement("div");
descriptionBox.className = "concert-description";
descriptionBox.innerHTML = `
  <p>
  <h2>다가오는 공연을 기대해주세요.</h2>
  </p>
`;

scheduleContainer.appendChild(descriptionBox);

// tagline 로고 이미지로 교체 및 클릭 시 홈 이동
const tagline = document.querySelector(".tagline");
tagline.innerHTML = `<a href="index.html"><img src="images/NANSI logo.png" alt="NANSI 로고" class="tagline-logo"></a>`;

// 스타일 추가
const style = document.createElement('style');
style.textContent = `
  .tagline-logo {
    height: 40px;
    vertical-align: middle;
  }
`;
document.head.appendChild(style);
