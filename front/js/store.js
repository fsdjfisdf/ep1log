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

  // ✅ 제품 목록 불러오기
  async function loadProducts() {
    productList.innerHTML = '';
    try {
      const res = await fetch(API_PRODUCTS);
      if (!res.ok) throw new Error(`Fetch 실패: ${res.status}`);
      const products = await res.json();
      console.log(products);

      if (products.length === 0) {
        productList.innerHTML = "<p>등록된 제품이 없습니다.</p>";
        return;
      }

      products.forEach(product => {
        const item = document.createElement("div");
        item.className = "product-card";
        item.innerHTML = `
          <img src="http://43.201.204.91:3001${product.image_url}" alt="${product.name}" style="width: 200px; height: auto;" />

          <h3>${product.name}</h3>
          <p>${product.price.toLocaleString()}원</p>
        `;
        item.addEventListener("click", () => showProductDetail(product));
        productList.appendChild(item);
      });
    } catch (err) {
      console.error("❌ 제품 로딩 에러:", err);
      productList.innerHTML = "<p>❌ 제품을 불러오는 데 실패했습니다.</p>";
    }
  }

  // ✅ 상세 모달 열기
function showProductDetail(product) {
  modalContent.innerHTML = `
    <h2>${product.name}</h2>
    <img src="http://43.201.204.91:3001${product.image_url}" alt="${product.name}" style="width: 200px; height: auto;" />
    <p>${product.description}</p>
    <p><strong>가격:</strong> ${product.price.toLocaleString()}원</p>
  `;

  // product_id를 form 내부에 넣어주기
  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden";
  hiddenInput.name = "product_id";
  hiddenInput.value = product.id;

  // 기존 hidden이 있다면 제거
  const existing = purchaseForm.querySelector('input[name="product_id"]');
  if (existing) existing.remove();

  purchaseForm.appendChild(hiddenInput); // 폼에 삽입

  modal.classList.remove("hidden");
}

  // ✅ 모달 닫기
  closeButton.addEventListener("click", () => {
    modal.classList.add("hidden");
    purchaseForm.reset();
    purchaseResult.textContent = "";
  });

  // ✅ 구매 신청
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
