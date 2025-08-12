// store.js — NANSI Goods Store (neo-brutal, mobile-first polished)

(() => {
  const API_BASE = "http://43.201.204.91:3001/api";
  const API_PRODUCTS = `${API_BASE}/products`;
  const API_PURCHASE = `${API_BASE}/purchase`;
  const IMG_BASE = "http://43.201.204.91:3001";

  // Nodes
  const productList   = document.getElementById("product-list");
  const emptyBox      = document.getElementById("store-empty");
  const errorBox      = document.getElementById("store-error");
  const modal         = document.getElementById("product-modal");
  const pmClose       = document.getElementById("pmClose");
  const detailsRoot   = document.getElementById("product-details"); // left
  const pmInfo        = document.getElementById("pmInfo");          // right info
  const purchaseForm  = document.getElementById("purchase-form");
  const purchaseResult= document.getElementById("purchase-result");

  // Utils
  const formatKRW = (n) => `${new Intl.NumberFormat("ko-KR").format(Number(n || 0))}원`;
  const el = (tag, cls, attrs) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (attrs) Object.entries(attrs).forEach(([k,v]) => n.setAttribute(k, v));
    return n;
  };
  const isArray = Array.isArray;
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const on = (t, ev, fn, opts) => t.addEventListener(ev, fn, opts || false);
  const isAbs = (u) => /^https?:\/\//i.test(u);
  const imgURL = (u) => (u ? (isAbs(u) ? u : (IMG_BASE + u)) : "images/placeholder-4x3.png");

  // Year (fallback)
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  function lockScroll(lock){
    document.documentElement.style.overflow = lock ? "hidden" : "";
    document.body.style.overflow = lock ? "hidden" : "";
  }

  function showSkeleton(count=6){
    productList.replaceChildren();
    const frag = document.createDocumentFragment();
    for (let i=0;i<count;i++){
      frag.appendChild(el("div","pcard skeleton"));
    }
    productList.appendChild(frag);
  }

  // 유연한 파서 (배열/객체 모두 지원)
  function parseProducts(json){
    if (isArray(json)) return json;
    if (json && typeof json === "object"){
      if (isArray(json.data)) return json.data;
      if (isArray(json.items)) return json.items;
      if (isArray(json.products)) return json.products;
      const arrKey = Object.keys(json).find(k => isArray(json[k]));
      if (arrKey) return json[arrKey];
    }
    return [];
  }

  // 로딩
  async function loadProducts(){
    emptyBox.hidden = true;
    errorBox.hidden = true;
    showSkeleton();

    try{
      const res = await fetch(API_PRODUCTS, { cache: "no-store" });
      if (!res.ok) throw new Error(`Fetch 실패: ${res.status}`);
      const json  = await res.json();
      const items = parseProducts(json);

      productList.replaceChildren();

      if (!items || items.length === 0){
        emptyBox.hidden = false;
        return;
      }

      const frag = document.createDocumentFragment();
      items.forEach(p => frag.appendChild(renderCard(p)));
      productList.appendChild(frag);

      // 확실히 숨김
      emptyBox.hidden = true;
      errorBox.hidden = true;
    }catch(err){
      console.error("❌ 제품 로딩 에러:", err);
      productList.replaceChildren();
      errorBox.hidden = false;
      emptyBox.hidden = true;
    }
  }

  // 카드
  function renderCard(product){
    const card = el("button","pcard",{ type:"button", "aria-label": `${product.name || "상품"} 상세보기` });

    const shot = el("div","shot");
    const img = new Image();
    const first = isArray(product.image_urls) && product.image_urls[0] ? product.image_urls[0] : null;
    img.loading = "lazy";
    img.src = imgURL(first);
    img.alt = product.name || "product";
    on(img, "error", () => { img.src = "images/placeholder-4x3.png"; });
    shot.appendChild(img);

    const meta = el("div","meta");
    const name = el("h3"); name.textContent = product.name || "Untitled";
    const price = el("p","price"); price.textContent = formatKRW(product.price);
    meta.append(name, price);

    card.append(shot, meta);
    on(card, "click", () => openProduct(product));
    return card;
  }

  // 포커스 트랩
  function createFocusTrap(container){
    const SEL = ['a[href]','area[href]','button:not([disabled])','input:not([disabled])','select:not([disabled])','textarea:not([disabled])','[tabindex]:not([tabindex="-1"])'];
    let first, last;
    function set(){
      const list = [...container.querySelectorAll(SEL.join(','))].filter(el => el.offsetParent !== null && !el.hasAttribute("disabled"));
      first = list[0]; last = list[list.length - 1];
    }
    function trap(e){
      if (e.key !== 'Tab') return;
      set();
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
    function enable(){ document.addEventListener('keydown', trap); set(); }
    function disable(){ document.removeEventListener('keydown', trap); }
    return { enable, disable, refresh:set };
  }
  let focusTrap;

  // 모바일 모드 적용
  function isMobile(){ return window.matchMedia("(max-width: 760px)").matches; }
  function applyModalMode(){
    modal.classList.toggle("mobile", isMobile());
  }
  window.addEventListener("resize", () => {
    if (modal.classList.contains("show")) applyModalMode();
  });

  // 모달 열기/닫기
  function openModal(){
    applyModalMode();                 // 모바일이면 .mobile 클래스
    modal.classList.add("show");
    modal.setAttribute("aria-hidden","false");
    lockScroll(true);
    if (!focusTrap) focusTrap = createFocusTrap(modal);
    focusTrap.enable();
    pmClose.focus();
  }
  function closeModal(){
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden","true");
    lockScroll(false);
    focusTrap?.disable();
    purchaseResult.hidden = true;
    purchaseForm.reset();
    detailsRoot.replaceChildren();
    pmInfo.replaceChildren();
  }

  on(pmClose, "click", closeModal);
  on(modal, "click", (e) => {
    if (e.target.classList.contains("shop-backdrop") || e.target.dataset.close === "backdrop") closeModal();
  });
  on(document, "keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
  });

  // 상품 열기
  function openProduct(product){
    buildProductDetail(product);
    let hid = purchaseForm.querySelector('input[name="product_id"]');
    if (!hid){ hid = document.createElement("input"); hid.type="hidden"; hid.name="product_id"; purchaseForm.appendChild(hid); }
    hid.value = product.id;
    openModal();
  }

  // 상세 구성: 왼쪽 슬라이더 + 오른쪽 정보
  function buildProductDetail(product){
    const urls = isArray(product.image_urls) ? product.image_urls : [];
    const slides = (urls.length ? urls : [null]).map(imgURL);

    // Left
    const leftHeader = el("header","card-head");
    leftHeader.appendChild(Object.assign(el("h2"), { textContent: "상품 이미지" }));

    const wrapper = el("div","slider-wrapper");
    const track = el("div","slider-track");
    wrapper.appendChild(track);

    slides.forEach(u => {
      const slide = el("div","slide");
      const im = new Image(); im.src = u; im.alt = product.name || "product image"; im.loading="eager";
      on(im, "error", () => { im.src = "images/placeholder-4x3.png"; });
      slide.appendChild(im);
      track.appendChild(slide);
    });

    const indWrap = el("div","indicator-wrapper");
    const prevBtn = el("button","nav-button prev-button",{ type:"button","aria-label":"이전 이미지" });
    prevBtn.textContent = "◀";
    const indots = el("div","indicators");
    const nextBtn = el("button","nav-button next-button",{ type:"button","aria-label":"다음 이미지" });
    nextBtn.textContent = "▶";
    indWrap.append(prevBtn, indots, nextBtn);

    slides.forEach((_, i) => {
      const dot = el("div","indicator" + (i===0 ? " active" : ""));
      dot.dataset.index = String(i);
      indots.appendChild(dot);
    });

    detailsRoot.replaceChildren(leftHeader, wrapper, indWrap);

    // Right info
    const title = el("h3","pm-name"); title.textContent = product.name || "Untitled";
    const desc = el("p","pm-desc"); desc.textContent = product.description || "설명이 등록되지 않았습니다.";
    const price = el("p","pm-price"); price.textContent = formatKRW(product.price);
    pmInfo.replaceChildren(title, desc, price);

    // Slider logic
    sliderLogic({ track, scope: detailsRoot, prevBtn, nextBtn, indicatorContainer: indots, slideCount: slides.length });
  }

  function sliderLogic({ track, scope, prevBtn, nextBtn, indicatorContainer, slideCount }){
    let currentIndex = 0;
    let startX = 0, isDragging = false, currentTranslate = 0, prevTranslate = 0;

    const indicators = [...indicatorContainer.querySelectorAll(".indicator")];
    const getSlideWidth = () => {
      const first = scope.querySelector(".slide");
      return first ? first.getBoundingClientRect().width : 0;
    };
    const updateIndicators = () => indicators.forEach((d,i)=> d.classList.toggle("active", i===currentIndex));
    const setPositionByIndex = (animate=true) => {
      currentTranslate = -currentIndex * getSlideWidth();
      prevTranslate = currentTranslate;
      track.style.transition = animate ? "transform 0.3s ease" : "none";
      track.style.transform = `translateX(${currentTranslate}px)`;
      updateIndicators();
    };
    const next = () => { currentIndex = clamp(currentIndex+1, 0, slideCount-1); setPositionByIndex(); };
    const prev = () => { currentIndex = clamp(currentIndex-1, 0, slideCount-1); setPositionByIndex(); };

    on(prevBtn, "click", prev);
    on(nextBtn, "click", next);
    indicators.forEach(dot => on(dot, "click", (e) => {
      const idx = parseInt(e.currentTarget.dataset.index, 10);
      if (!Number.isNaN(idx)){ currentIndex = idx; setPositionByIndex(); }
    }));

    // drag / touch
    const getX = (e) => e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
    const dragStart = (e) => { isDragging = true; startX = getX(e); track.style.transition = "none"; };
    const dragMove = (e) => {
      if (!isDragging) return;
      const delta = getX(e) - startX;
      const edge = (currentIndex===0 && delta>0) || (currentIndex===slideCount-1 && delta<0);
      currentTranslate = prevTranslate + delta * (edge ? 0.3 : 1);
      track.style.transform = `translateX(${currentTranslate}px)`;
    };
    const dragEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      const movedBy = currentTranslate - prevTranslate;
      const w = getSlideWidth();
      if (movedBy < -w*0.2 && currentIndex < slideCount - 1) currentIndex++;
      if (movedBy >  w*0.2 && currentIndex > 0) currentIndex--;
      setPositionByIndex();
    };

    on(track, "touchstart", dragStart, {passive:true});
    on(track, "touchmove",  dragMove,  {passive:true});
    on(track, "touchend",   dragEnd);
    on(track, "mousedown",  dragStart);
    on(track, "mousemove",  dragMove);
    on(track, "mouseup",    dragEnd);
    on(track, "mouseleave", dragEnd);

    // keyboard
    on(scope, "keydown", (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
    });

    // responsive
    const ro = new ResizeObserver(() => setPositionByIndex(false));
    ro.observe(scope);

    setTimeout(()=> setPositionByIndex(false), 0);
  }

  // 폰 자동 포맷
  const phoneInput = purchaseForm.querySelector('[name="phone"]');
  on(phoneInput, "input", () => {
    let v = phoneInput.value.replace(/[^\d]/g,'');
    if (v.startsWith("02")){
      if (v.length > 2) v = v.slice(0,2) + "-" + v.slice(2);
      if (v.length > 6) v = v.slice(0,6) + "-" + v.slice(6,10);
    } else {
      if (v.length > 3) v = v.slice(0,3) + "-" + v.slice(3);
      if (v.length > 8) v = v.slice(0,8) + "-" + v.slice(8,12);
    }
    phoneInput.value = v;
  });

  // 구매 제출
  on(purchaseForm, "submit", async (e) => {
    e.preventDefault();

    const btn = purchaseForm.querySelector('button[type="submit"]');
    const fd = new FormData(purchaseForm);
    const payload = {
      product_id : fd.get("product_id"),
      buyer_name : (fd.get("buyer_name") || "").toString().trim(),
      phone      : (fd.get("phone") || "").toString().trim(),
      address    : (fd.get("address") || "").toString().trim(),
      message    : (fd.get("message") || "").toString().trim(),
    };

    if (!payload.product_id || !payload.buyer_name || !payload.phone || !payload.address){
      showPurchaseMessage("❌ 입력값을 확인하세요.", "err");
      return;
    }

    const prevLabel = btn.textContent;
    btn.disabled = true; btn.textContent = "전송 중…";

    try{
      const res = await fetch(API_PURCHASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json().catch(()=> ({}));
      if (res.ok){
        showPurchaseMessage("✅ 신청이 완료되었습니다! 입금 시 배송해드려요!", "ok");
        purchaseForm.reset();
      }else{
        showPurchaseMessage(`❌ ${result.error || "신청 실패"}`, "err");
      }
    }catch(err){
      console.error("❌ 구매 요청 오류:", err);
      showPurchaseMessage("❌ 요청 중 오류 발생", "err");
    }finally{
      btn.disabled = false; btn.textContent = prevLabel;
    }
  });

  function showPurchaseMessage(text, type){
    purchaseResult.hidden = false;
    purchaseResult.className = "msg " + (type === "ok" ? "ok" : "err");
    purchaseResult.textContent = text;
    purchaseResult.scrollIntoView({ behavior:"smooth", block:"nearest" });
  }

  // 스와이프 다운 닫기 (모바일 UX)
  (() => {
    let startY = 0, dy = 0, dragging = false;
    const panel = document.querySelector(".shop-panel");
    if (!panel) return;
    const THRESH = 120;

    function ts(e){
      if (!modal.classList.contains("show") || !isMobile()) return;
      const scrollables = panel.querySelectorAll(".pm-left, .pm-right");
      // 어느 영역이라도 스크롤이 최상단이면 시작 허용
      const atTop = [...scrollables].some(el => el.scrollTop === 0);
      if (!atTop) return;
      dragging = true;
      startY = e.touches[0].clientY;
      panel.style.transition = "none";
    }
    function tm(e){
      if (!dragging) return;
      dy = e.touches[0].clientY - startY;
      if (dy > 0){
        panel.style.transform = `translateY(${dy}px)`;
        panel.style.opacity = String(Math.max(0.6, 1 - dy/600));
      }
    }
    function te(){
      if (!dragging) return;
      dragging = false;
      panel.style.transition = "transform .25s ease, opacity .25s ease";
      if (dy > THRESH){
        panel.style.transform = `translateY(100%)`;
        setTimeout(() => { panel.style.transform = ""; panel.style.opacity = ""; }, 260);
        closeModal();
      }else{
        panel.style.transform = "";
        panel.style.opacity = "";
      }
      dy = 0;
    }

    panel.addEventListener("touchstart", ts, {passive:true});
    panel.addEventListener("touchmove",  tm, {passive:true});
    panel.addEventListener("touchend",   te);
  })();

  // Init
  loadProducts();
})();
