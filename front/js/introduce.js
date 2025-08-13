// introduce.js — members page micro-interactions

// 1) 연도 표기 (전역 app.js 가 있지만 중복 안전장치)
(() => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// 2) 아바타에 이미지가 있으면 이니셜 라벨 제거
document.querySelectorAll('.avatar').forEach(av => {
  const img = av.querySelector('img');
  if (img) av.classList.add('has-img');
});

// 3) 추가 인터랙션은 현재 미니멀 유지
