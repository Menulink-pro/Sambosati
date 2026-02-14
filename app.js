// ========= أرقام الفروع (مؤقتاً رقمك) =========
// WhatsApp يحتاج صيغة دولية بدون 0
const BRANCH_PHONES = {
  majidiya: "966593937921",
  miyas:    "966593937921"
};

// ========= منيو (مؤقتاً) — بعدين تربطه بالشيت =========
const MENU_DATA = [
  {
    category: "سمبوسة",
    items: [
      {
        id: "s1",
        name: "بوكس سمبوسة (36 حبة)",
        price: 30,
        img: "assets/samosa.jpg"
      },
      {
        id: "s2",
        name: "بوكس سمبوسة بدون لحم ودجاج (40 حبة)",
        price: 30,
        img: "assets/samosa.jpg"
      },
      {
        id: "s3",
        name: "بوكس سمبوسة (30 حبة)",
        price: 22.5,
        img: "assets/samosa.jpg"
      }
    ]
  },
  {
    category: "فلافل",
    items: [
      { id: "f1", name: "بوكس فلافل (45 حبة)", price: 15, img: "assets/falafel.jpg" }
    ]
  },
  {
    category: "مقالي",
    items: [
      { id: "m1", name: "بوكس مبصل (باكورة) (20 حبة)", price: 15, img: "assets/box.jpg" },
      { id: "m2", name: "بوكس كباب عروق (20 حبة)", price: 0, img: "assets/box.jpg" }
    ]
  }
];

// ========= State =========
const state = {
  branch: localStorage.getItem("branch") || "",
  cart: JSON.parse(localStorage.getItem("cart") || "{}"),     // { id: qty }
  notes: JSON.parse(localStorage.getItem("notes") || "{}")    // { id: noteText }
};

// ========= DOM =========
const branchPage = document.getElementById("branchPage");
const menuPage   = document.getElementById("menuPage");

const branchPill = document.getElementById("branchPill");
const changeBranchBtn = document.getElementById("changeBranchBtn");
const miniCartBtn = document.getElementById("miniCartBtn");
const miniCartCount = document.getElementById("miniCartCount");

const tabsEl = document.getElementById("tabs");
const menuEl = document.getElementById("menu");

const cartBar = document.getElementById("cartBar");
const cartTotalText = document.getElementById("cartTotalText");
const cartItemsText = document.getElementById("cartItemsText");
const checkoutBtn = document.getElementById("checkoutBtn");

// Product Sheet
const productOverlay = document.getElementById("productOverlay");
const sheetProductName = document.getElementById("sheetProductName");
const sheetProductPrice = document.getElementById("sheetProductPrice");
const sheetNote = document.getElementById("sheetNote");
const sheetQty = document.getElementById("sheetQty");
const qtyMinus = document.getElementById("qtyMinus");
const qtyPlus = document.getElementById("qtyPlus");
const addToCartBtn = document.getElementById("addToCartBtn");
const closeProductSheet = document.getElementById("closeProductSheet");

// Cart Sheet
const cartOverlay = document.getElementById("cartOverlay");
const closeCartSheet = document.getElementById("closeCartSheet");
const cartBranchText = document.getElementById("cartBranchText");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalPrice = document.getElementById("cartTotalPrice");
const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");
const sendWhatsappBtn = document.getElementById("sendWhatsappBtn");

// ========= Helpers =========
function save(){
  localStorage.setItem("branch", state.branch);
  localStorage.setItem("cart", JSON.stringify(state.cart));
  localStorage.setItem("notes", JSON.stringify(state.notes));
}

function formatSAR(n){
  const num = Number(n || 0);
  return `${num.toFixed(num % 1 === 0 ? 0 : 2)} ريال`;
}

function getTotalItems(){
  return Object.values(state.cart).reduce((a,b)=>a + b, 0);
}

function getTotalPrice(){
  let t = 0;
  for(const [id, qty] of Object.entries(state.cart)){
    const item = findItem(id);
    if(item) t += (Number(item.price)||0) * qty;
  }
  return t;
}

function branchLabel(){
  if(state.branch === "majidiya") return "الفرع المختار: فرع المجيدية";
  if(state.branch === "miyas") return "الفرع المختار: فرع مياس";
  return "اختر الفرع";
}

function findItem(id){
  for(const cat of MENU_DATA){
    const it = cat.items.find(x => x.id === id);
    if(it) return it;
  }
  return null;
}

// ========= Page Flow =========
function showBranch(){
  branchPage.hidden = false;
  menuPage.hidden = true;
}
function showMenu(){
  branchPage.hidden = true;
  menuPage.hidden = false;
  branchPill.textContent = branchLabel();
}

// ========= Render Tabs & Menu =========
function renderTabs(){
  tabsEl.innerHTML = "";
  MENU_DATA.forEach((cat, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "category-tab" + (idx === 0 ? " active" : "");
    btn.textContent = cat.category;
    btn.onclick = () => {
      document.querySelectorAll(".category-tab").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      const sec = document.getElementById("sec-" + cat.category);
      if(sec) sec.scrollIntoView({behavior:"smooth", block:"start"});
    };
    tabsEl.appendChild(btn);
  });
}

function renderMenu(){
  menuEl.innerHTML = "";
  MENU_DATA.forEach((cat) => {
    const section = document.createElement("div");
    section.className = "category-section";
    section.id = "sec-" + cat.category;

    const title = document.createElement("div");
    title.className = "category-title";
    title.textContent = cat.category;

    section.appendChild(title);

    cat.items.forEach((it) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.onclick = () => openProductSheet(it);

      const img = document.createElement("img");
      img.className = "product-img";
      img.src = it.img || "";
      img.alt = it.name;
      img.onerror = () => { img.removeAttribute("src"); };

      const info = document.createElement("div");
      info.style.flex = "1";

      const name = document.createElement("div");
      name.className = "product-name";
      name.textContent = it.name;

      const price = document.createElement("div");
      price.className = "product-price";
      price.textContent = formatSAR(it.price);

      info.appendChild(name);
      info.appendChild(price);

      const arrow = document.createElement("div");
      arrow.className = "product-arrow";
      arrow.textContent = "›";

      card.appendChild(img);
      card.appendChild(info);
      card.appendChild(arrow);

      section.appendChild(card);
    });

    menuEl.appendChild(section);
  });
}

// ========= Product Sheet =========
let currentItem = null;
let currentQty = 1;

function openProductSheet(item){
  currentItem = item;
  currentQty = 1;

  sheetProductName.textContent = item.name;
  sheetProductPrice.textContent = formatSAR(item.price);

  sheetQty.textContent = String(currentQty);
  sheetNote.value = state.notes[item.id] || "";

  productOverlay.classList.add("active");
}

function closeProduct(){
  productOverlay.classList.remove("active");
  currentItem = null;
}

qtyMinus.onclick = () => {
  if(currentQty > 1){
    currentQty--;
    sheetQty.textContent = String(currentQty);
  }
};
qtyPlus.onclick = () => {
  currentQty++;
  sheetQty.textContent = String(currentQty);
};

addToCartBtn.onclick = () => {
  if(!currentItem) return;

  state.notes[currentItem.id] = (sheetNote.value || "").trim();

  const prev = state.cart[currentItem.id] || 0;
  state.cart[currentItem.id] = prev + currentQty;

  save();
  updateCartUI();
  closeProduct();
};

closeProductSheet.onclick = closeProduct;
productOverlay.onclick = (e) => { if(e.target === productOverlay) closeProduct(); };

// ========= Cart UI =========
function updateCartUI(){
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  miniCartCount.textContent = String(totalItems);

  if(totalItems === 0){
    cartBar.classList.add("hidden");
  } else {
    cartBar.classList.remove("hidden");
  }

  cartTotalText.textContent = formatSAR(totalPrice);
  cartItemsText.textContent = `${totalItems} صنف`;
}

function openCart(){
  const totalItems = getTotalItems();
  if(totalItems === 0){
    alert("سلتك فاضية، اختر صنف أولاً ✅");
    return;
  }
  cartBranchText.textContent = branchLabel();
  cartOverlay.classList.add("active");
  renderCartItems();
}

function closeCart(){
  cartOverlay.classList.remove("active");
}

function renderCartItems(){
  cartItemsEl.innerHTML = "";

  const entries = Object.entries(state.cart);
  if(entries.length === 0){
    cartItemsEl.innerHTML = `<div style="text-align:center;color:#6b7280;padding:10px 0">السلة فاضية</div>`;
    cartTotalPrice.textContent = formatSAR(0);
    return;
  }

  entries.forEach(([id, qty]) => {
    const it = findItem(id);
    if(!it) return;

    const row = document.createElement("div");
    row.className = "cart-item-row";

    const info = document.createElement("div");
    info.className = "cart-item-info";

    const name = document.createElement("div");
    name.style.fontWeight = "900";
    name.textContent = it.name;

    const note = document.createElement("small");
    const n = (state.notes[id] || "").trim();
    note.textContent = n ? `ملاحظة: ${n}` : `الكمية: ${qty}`;

    info.appendChild(name);
    info.appendChild(note);

    const actions = document.createElement("div");
    actions.className = "cart-item-actions";

    const minus = document.createElement("button");
    minus.className = "qty-btn";
    minus.type = "button";
    minus.textContent = "−";
    minus.onclick = () => {
      const cur = state.cart[id] || 0;
      if(cur <= 1) delete state.cart[id];
      else state.cart[id] = cur - 1;
      save();
      updateCartUI();
      renderCartItems();
    };

    const q = document.createElement("div");
    q.style.minWidth = "18px";
    q.style.textAlign = "center";
    q.style.fontWeight = "900";
    q.textContent = String(qty);

    const plus = document.createElement("button");
    plus.className = "qty-btn";
    plus.type = "button";
    plus.textContent = "+";
    plus.onclick = () => {
      state.cart[id] = (state.cart[id] || 0) + 1;
      save();
      updateCartUI();
      renderCartItems();
    };

    const price = document.createElement("div");
    price.className = "cart-item-price";
    price.textContent = formatSAR((Number(it.price)||0) * qty);

    const del = document.createElement("button");
    del.className = "cart-remove";
    del.type = "button";
    del.textContent = "✕";
    del.onclick = () => {
      delete state.cart[id];
      delete state.notes[id];
      save();
      updateCartUI();
      renderCartItems();
    };

    actions.appendChild(minus);
    actions.appendChild(q);
    actions.appendChild(plus);
    actions.appendChild(price);
    actions.appendChild(del);

    row.appendChild(info);
    row.appendChild(actions);

    cartItemsEl.appendChild(row);
  });

  cartTotalPrice.textContent = formatSAR(getTotalPrice());
}

checkoutBtn.onclick = openCart;
miniCartBtn.onclick = openCart;
closeCartSheet.onclick = closeCart;
cartOverlay.onclick = (e) => { if(e.target === cartOverlay) closeCart(); };

// ========= WhatsApp =========
function buildOrderMessage(){
  const name = (customerName.value || "").trim() || "غير مذكور";
  const phone = (customerPhone.value || "").trim() || "غير مذكور";

  const lines = [];
  lines.push("طلب جديد - سمبوساتي");
  lines.push(branchLabel());
  lines.push("—");

  for(const [id, qty] of Object.entries(state.cart)){
    const it = findItem(id);
    if(!it) continue;

    const itemTotal = (Number(it.price)||0) * qty;
    const note = (state.notes[id] || "").trim();

    if(note){
      lines.push(`• ${it.name} × ${qty} = ${formatSAR(itemTotal)} (ملاحظة: ${note})`);
    } else {
      lines.push(`• ${it.name} × ${qty} = ${formatSAR(itemTotal)}`);
    }
  }

  lines.push("—");
  lines.push(`الإجمالي: ${formatSAR(getTotalPrice())}`);
  lines.push("—");
  lines.push(`اسم العميل: ${name}`);
  lines.push(`رقم الجوال: ${phone}`);

  return lines.join("\n");
}

sendWhatsappBtn.onclick = () => {
  if(getTotalItems() === 0){
    alert("سلتك فاضية، اختر صنف أولاً ✅");
    return;
  }

  const phone = BRANCH_PHONES[state.branch] || BRANCH_PHONES.majidiya;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(buildOrderMessage())}`;
  window.open(url, "_blank");
};

// ========= Branch Selection =========
document.querySelectorAll(".branch-card").forEach(card => {
  card.addEventListener("click", () => {
    state.branch = card.dataset.branch;
    save();
    showMenu();
    renderTabs();
    renderMenu();
    updateCartUI();
    window.scrollTo({top:0, behavior:"smooth"});
  });
});

changeBranchBtn.onclick = () => {
  state.branch = "";
  save();
  closeCart();
  closeProduct();
  showBranch();
};

// ========= Init =========
(function init(){
  // شيل preload حتى ما يطلع كل شيء فوق بعض
  document.body.classList.remove("preload");

  updateCartUI();

  if(state.branch){
    showMenu();
    renderTabs();
    renderMenu();
  } else {
    showBranch();
  }
})();
