document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://43.201.204.91:3001/api";
  const API_PRODUCTS = `${API_BASE}/products`;
  const API_PURCHASE = `${API_BASE}/purchase`;

  const productList = document.getElementById("product-list");
  const modal = document.getElementById("product-modal");
  const modalContent = document.getElementById("product-details");
  const closeButton = document.querySelector(".close-button");
  const purchaseForm = document.getElementById("purchase-form");
  const purchaseResult = document.getElementById("purchase-result");

  async function loadProducts() {
    productList.innerHTML = '';
    try {
      const res = await fetch(API_PRODUCTS);
      if (!res.ok) throw new Error(`Fetch 실패: ${res.status}`);
      const products = await res.json();

      if (products.length === 0) {
        productList.innerHTML = "<p>등록된 제품이 없습니다.</p>";
        return;
      }

      products.forEach(product => {
        const imageUrl = product.image_urls?.[0] || '';
        const item = document.createElement("div");
        item.className = "product-card";
        item.innerHTML = `
          <div class="product-image-wrapper">
            <img src="http://43.201.204.91:3001${imageUrl}" alt="${product.name}" />
          </div>
          <div class="product-info">
            <h3>${product.name}</h3>
            <p class="price">${product.price.toLocaleString()}원</p>
          </div>
        `;
        item.addEventListener("click", () => showProductDetail(product));
        productList.appendChild(item);
      });
    } catch (err) {
      console.error("❌ 제품 로딩 에러:", err);
      productList.innerHTML = "<p>❌ 제품을 불러오는 데 실패했습니다.</p>";
    }
  }

function showProductDetail(product) {
  let currentIndex = 0;
  const imageUrls = product.image_urls || [];


  const slides = imageUrls.map(url => `
    <div class="slide" style="min-width: 100%;">
      <img src="http://43.201.204.91:3001${url}" alt="${product.name}" />
    </div>
  `).join("");

  const indicators = imageUrls.map((_, i) => `
    <div class="indicator ${i === 0 ? 'active' : ''}" data-index="${i}"></div>
  `).join("");

modalContent.innerHTML = `
  <div class="slider-wrapper">
    <div class="slider-track" style="display: flex; transition: transform 0.3s ease;">
      ${slides}
    </div>
    <div class="indicator-wrapper">
      <button class="nav-button prev-button">◀</button>
      <div class="indicators">
        ${indicators} <!-- ✅ 여기 빠져 있었음 -->
      </div>
      <button class="nav-button next-button">▶</button>
    </div>
  </div>
  <div class="modal-product-info">
    <h2>${product.name}</h2>
    <p class="modal-description">${product.description || "설명이 등록되지 않았습니다."}</p>
    <p class="modal-price"><strong>${product.price.toLocaleString()}원</strong></p>
  </div>
`;

// ❗ 이 위치에서 버튼을 선택해야 함
const prevButton = modalContent.querySelector(".prev-button");
const nextButton = modalContent.querySelector(".next-button");

// 버튼 클릭 이벤트 바인딩
prevButton.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    setPositionByIndex();
  }
});

nextButton.addEventListener("click", () => {
  if (currentIndex < slideCount - 1) {
    currentIndex++;
    setPositionByIndex();
  }
});

  const sliderTrack = modalContent.querySelector(".slider-track");
  const indicatorEls = modalContent.querySelectorAll(".indicator");
  const slideCount = imageUrls.length;

  let startX = 0;
  let isDragging = false;
  let currentTranslate = 0;
  let prevTranslate = 0;

  const slideWidth = modalContent.querySelector(".slide").offsetWidth;

  function getSlideWidth() {
  const slide = modalContent.querySelector(".slide");
  return slide ? slide.getBoundingClientRect().width : 0;
}

  function setPositionByIndex() {
    currentTranslate = -currentIndex * getSlideWidth();
    prevTranslate = currentTranslate;
    sliderTrack.style.transition = "transform 0.3s ease";
    sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
    updateIndicators();
  }

  function updateIndicators() {
    indicatorEls.forEach((el, i) => {
      el.classList.toggle("active", i === currentIndex);
    });
  const slideEls = sliderTrack.querySelectorAll('.slide');
  slideEls.forEach((slide, i) => {
    slide.addEventListener('click', () => {
      if (i !== currentIndex) {
        currentIndex = i;
        setPositionByIndex();
      }
    });
  });
  }

  function getX(e) {
    return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
  }

  function dragStart(e) {
    isDragging = true;
    startX = getX(e);
    sliderTrack.style.transition = "none";
  }

  function dragMove(e) {
    if (!isDragging) return;
    const x = getX(e);
    const deltaX = x - startX;
    currentTranslate = prevTranslate + deltaX;

    // 탄성 효과
    if ((currentIndex === 0 && deltaX > 0) || (currentIndex === slideCount - 1 && deltaX < 0)) {
      currentTranslate = prevTranslate + deltaX * 0.3;
    }

    sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
  }

  function dragEnd() {
    isDragging = false;
    const movedBy = currentTranslate - prevTranslate;
    if (movedBy < -slideWidth * 0.2 && currentIndex < slideCount - 1) {
      currentIndex++;
    } else if (movedBy > slideWidth * 0.2 && currentIndex > 0) {
      currentIndex--;
    }
    setPositionByIndex();
  }

  // 이벤트 바인딩
  sliderTrack.addEventListener("touchstart", dragStart);
  sliderTrack.addEventListener("touchmove", dragMove);
  sliderTrack.addEventListener("touchend", dragEnd);
  sliderTrack.addEventListener("mousedown", dragStart);
  sliderTrack.addEventListener("mousemove", dragMove);
  sliderTrack.addEventListener("mouseup", dragEnd);
  sliderTrack.addEventListener("mouseleave", () => {
    if (isDragging) dragEnd();
  });

  // 인디케이터 클릭
indicatorEls.forEach(indicator => {
  indicator.addEventListener("click", (e) => {
    const index = parseInt(e.target.dataset.index);
    if (!isNaN(index)) {
      currentIndex = index;
      setPositionByIndex();
    }
  });
});

  setPositionByIndex(); // 초기 위치 설정

  // 구매 폼 처리 (생략하지 않음)
  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden";
  hiddenInput.name = "product_id";
  hiddenInput.value = product.id;

  const existing = purchaseForm.querySelector('input[name="product_id"]');
  if (existing) existing.remove();
  purchaseForm.appendChild(hiddenInput);

  modal.classList.remove("hidden");
  modal.classList.add("fade-in");
}

  closeButton.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("fade-in");
    purchaseForm.reset();
    purchaseResult.textContent = "";
  });

  purchaseForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(purchaseForm);
    const payload = {
      product_id: formData.get("product_id"),
      buyer_name: formData.get("buyer_name"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch(API_PURCHASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        purchaseResult.textContent = "✅ 신청이 완료되었습니다!";
        purchaseForm.reset();
      } else {
        purchaseResult.textContent = `❌ ${result.error || "신청 실패"}`;
      }
    } catch (err) {
      console.error("❌ 구매 요청 오류:", err);
      purchaseResult.textContent = "❌ 요청 중 오류 발생";
    }
  });

  loadProducts();
});