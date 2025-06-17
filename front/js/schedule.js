// 공연 예약 날짜 정보
const reservationDate = new Date("2025-10-01");
const today = new Date();

const messageBox = document.querySelector(".reservation-message");

if (today < reservationDate) {
  const daysLeft = Math.ceil((reservationDate - today) / (1000 * 60 * 60 * 24));
  messageBox.innerHTML = `
    <p><strong>${daysLeft}</strong>일 뒤, EP1LOG가 여러분을 만납니다.<br>
    10월 1일부터 예매가 시작됩니다. 그날의 떨림을 함께 준비해주세요.</p>
  `;
} else {
  messageBox.innerHTML = `
    <p>우리는 이제 만날 준비가 되어 있어요.<br>
    아래 링크에서 당신의 자리를 예약해주세요.</p>
    <a href="#" class="reserve-link">예매하러 가기</a>
  `;
}

// 공연 설명 추가 삽입
const scheduleContainer = document.querySelector(".schedule-container");

const descriptionBox = document.createElement("div");
descriptionBox.className = "concert-description";
descriptionBox.innerHTML = `
  <h2>✨ 공연 소개</h2>
  <p>
    이번 EP1LOG의 무대는, 단순한 공연이 아닌<br>
    지나온 계절들과 마음속 이야기들을 노래로 건네는 한 편의 에필로그입니다.<br><br>
    사랑, 이별, 그리움, 희망...<br>
    말로 전하지 못한 감정들을 음악에 담아, 당신의 하루 끝에 닿고자 합니다.<br>
    우리는 그저 진심을 연주합니다. 그리고 그 진심이 당신에게 닿기를 바랍니다.<br><br>
    셋리스트는 비밀이에요. 하지만 잊지 못할 순간만은 약속드릴게요.
  </p>
`;

scheduleContainer.appendChild(descriptionBox);

// tagline 로고 이미지로 교체 및 클릭 시 홈 이동
const tagline = document.querySelector(".tagline");
tagline.innerHTML = `<a href="index.html"><img src="images/ep1log_logo2.png" alt="EP1LOG 로고" class="tagline-logo"></a>`;

// 스타일 추가
const style = document.createElement('style');
style.textContent = `
  .tagline-logo {
    height: 40px;
    vertical-align: middle;
  }
`;
document.head.appendChild(style);
