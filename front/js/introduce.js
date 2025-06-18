// introduce.js - EP1LOG 멤버 소개 페이지 전용 스크립트

// tagline 영역을 로고 이미지로 대체하고 클릭 시 홈으로 이동
const tagline = document.querySelector(".tagline");
if (tagline) {
  tagline.innerHTML = `<a href="index.html"><img src="images/ep1log_logo2.png" alt="EP1LOG 로고" class="tagline-logo"></a>`;

  const style = document.createElement('style');
  style.textContent = `
    .tagline-logo {
      height: 40px;
      vertical-align: middle;
    }
  `;
  document.head.appendChild(style);
}
