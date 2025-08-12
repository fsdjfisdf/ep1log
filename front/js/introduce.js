// introduce.js — members page micro-interactions

// 1) 연도 표기 (app.js가 이미 처리하지만, 혹시 누락될 경우를 대비)
(() => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// 2) 아바타에 이미지가 있으면 이니셜을 숨기는 로직 (추후 확장 대비)
document.querySelectorAll('.avatar').forEach(av => {
  const img = av.querySelector('img');
  if (img) av.classList.add('has-img');
});

// 3) 접근성: 키보드 포커스가 카드에 도달했을 때 살짝 강조(이미 CSS :focus-visible 있음)
// 스크립트 추가 동작은 지금은 불필요 — 깔끔 유지
