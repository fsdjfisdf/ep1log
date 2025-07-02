const logoButton = document.getElementById('logo-button');
const menu = document.getElementById('menu');
const tooltip = document.createElement('div');
tooltip.className = 'menu-tooltip';
document.querySelector('.container').appendChild(tooltip);

let isExpanded = false;

logoButton.addEventListener('click', () => {
  if (!isExpanded) {
    // 1. heartbeat 제거 및 초기 transform 명확화
    logoButton.classList.remove('heartbeat', 'animate-down');
    
    // 2. 강제로 layout 계산 시도 (transition 발동 보장)
    void logoButton.offsetWidth;

    // 3. animate-up 적용 (부드럽게 작아지고 올라감)
    logoButton.classList.add('animate-up');

    // 메뉴는 애니메이션 끝난 후 등장
    setTimeout(() => {
      menu.classList.add('show');
    }, 700);

    isExpanded = true;
  } else {
    // 메뉴 숨기고 버튼 복귀
    menu.classList.remove('show');
    logoButton.classList.remove('animate-up');
    logoButton.classList.add('animate-down');
    tooltip.textContent = '';
    isExpanded = false;

    setTimeout(() => {
      logoButton.classList.add('heartbeat');
    }, 600);
  }
});


// 호버 설명
const descriptions = {
  '멤버소개': 'EP1LOG의 멤버들을 확인할 수 있어요.',
  '공연일정': '다가오는 공연 일정을 확인하세요.',
  '공연예약': '공연에 참여하고 싶다면 여기서 예약하세요.',
  '방명록': '저희에게 해주고 싶은 말들을 남겨주세요.',
  '스토어': '저희가 자체 제작한 굿즈를 확인해보세요.'
};

document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    tooltip.textContent = descriptions[item.textContent.trim()];
    tooltip.style.opacity = '1';
  });

  item.addEventListener('mouseleave', () => {
    tooltip.textContent = '';
    tooltip.style.opacity = '0';
  });
});
