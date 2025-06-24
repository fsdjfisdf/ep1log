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

  // 제품 목록 불러오기
  async function loadProducts() {
    try {
      const res = await fetch(API_PRODUCTS);
      const products = await res.json();

      products.forEach(product => {
        const item = document.createElement("div");
        item.className = "product-card";
        item.innerHTML = `
          <img src="${product.image_url}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p>${product.price.toLocaleString()}원</p>
        `;
        item.addEventListener("click", () => showProductDetail(product));
        productList.appendChild(item);
      });
    } catch (err) {
      productList.innerHTML = "<p>❌ 제품을 불러오는 데 실패했습니다.</p>";
    }
  }

  // 상세 보기 모달 열기
  function showProductDetail(product) {
    modalContent.innerHTML = `
      <h2>${product.name}</h2>
      <img src="${product.image_url}" alt="${product.name}" />
      <p>${product.description}</p>
      <p><strong>가격:</strong> ${product.price.toLocaleString()}원</p>
      <input type="hidden" name="product_id" value="${product.id}" />
    `;
    modal.classList.remove("hidden");
  }

  closeButton.addEventListener("click", () => {
    modal.classList.add("hidden");
    purchaseResult.textContent = "";
    purchaseForm.reset();
  });

  // 구매 신청
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
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (res.ok) {
        purchaseResult.textContent = "✅ 신청이 완료되었습니다!";
        purchaseForm.reset();
      } else {
        purchaseResult.textContent = `❌ ${result.error}`;
      }
    } catch (err) {
      purchaseResult.textContent = "❌ 오류 발생";
    }
  });

  loadProducts();
});
