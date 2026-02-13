// ===== إعدادات =====
const PHONE_MAJIDIYA = "966593937921"; // مؤقتاً رقمك
const PHONE_MIYAS    = "966593937921"; // مؤقتاً رقمك

// ===== منيو تجريبي (عدّل الصور حسب اللي عندك) =====
const MENU = [
  {
    category: "سمبوسة",
    items: [
      {
        id: "s1",
        name: "بوكس سمبوسة (36 حبة)",
        price: 30,
        img: "assets/box.jpg", // ارفع صورة أو اتركها
        desc: "جميع الأصناف (9 حشوات): ماش، بطاطس، جبن، بيتزا، فلافل باللبنة، لبنة بالزيتون، لحم، فاهيتا دجاج، شاورما دجاج."
      },
      {
        id: "s2",
        name: "بوكس سمبوسة بدون لحم ودجاج (40 حبة)",
        price: 30,
        img: "assets/samosa.jpg",
        desc: "ماش، بطاطس، جبن، بيتزا، فلافل باللبنة، لبنة بالزيتون."
      },
      {
        id: "s3",
        name: "بوكس سمبوسة (30 حبة)",
        price: 22.5,
        img: "assets/samosa.jpg",
        desc: "ماش، بطاطس، جبن، بيتزا، فلافل باللبنة، لبنة بالزيتون."
      }
    ]
  },
  {
    category: "فلافل",
    items: [
      { id: "f1", name: "بوكس فلافل (45 حبة)", price: 15, img: "assets/falafel.jpg", desc: "فلافل طازج ومقرمش." }
    ]
  },
  {
    category: "مقالي",
    items: [
      { id: "m1", name: "بوكس مبصل (باكورة) (20 حبة)", price: 15, img: "assets/box.jpg", desc: "مقرمش وخفيف." },
      { id: "m2", name: "بوكس كباب عروق (20 حبة)", price: 0, img: "assets/box.jpg", desc: "اكتب السعر لاحقاً (حالياً 0)." }
    ]
  }
];

// ===== حالة التطبيق =====
const state = {
  branch: localStorage.getItem("branch") || null,
  cart: JSON.parse(localStorage.getItem("cart") || "{}") // {id: qty}
};

// ===== عناصر DOM =====
const branchPage = document.getElementById("branchPage");
const menuPage   = document.getElementById("menuPage");
const branchPill = document.getElementById("branchPill");
const tabsEl     = document.getElementById("tabs");
const itemsEl    = document.getElementById("items");

const cartMiniBtn = document.getElementById("cartMiniBtn");
const cartCount   = document.getElementById("cartCount");
const fabCount    = document.getElementById("fabCount");
const checkoutFab = document.getElementById("checkoutFab");

const overlay        = document.getElementById("overlay");
const closeOverlayBtn= document.getElementById("closeOverlayBtn");
const cartList       = document.getElementById("cartList");
const totalPriceEl   = document.getElementById("totalPrice");
const sheetBranch    = document.getElementById("sheetBranch");
const sendWhatsAppBtn= document.getElementById("sendWhatsAppBtn");
const customerName   = document.getElementById("customerName");
const customerPhone  = document.getElementById("customerPhone");
const changeBranchBtn= document.getElementById("changeBranchBtn");

// ===== Helpers =====
function saveCart(){
  localStorage.setItem("cart", JSON.stringify(state.cart));
}

function setBranch(branch){
  state.branch = branch;
  localStorage.setItem("branch", branch);
}

function branchLabel(){
  if(state.branch === "majidiya") return "الفرع المختار: فرع المجيدية";
  if(state.branch === "miyas") return "الفرع المختار: فرع مياس";
  return "";
}

function branchPhone(){
  return state.branch === "miyas" ? PHONE_MIYAS : PHONE_MAJIDIYA;
}

function formatSAR(n){
  const num = Number(n || 0);
  return `${num.toFixed(num % 1 === 0 ? 0 : 2)} ريال`;
}

function cartTotalCount(){
  return Object.values(state.cart).reduce((a,b)=>a + b, 0);
}

function getItemById(id){
  for(const cat of MENU){
    const found = cat.items.find(x => x.id === id);
    if(found) return { ...found, category: cat.category };
  }
  return null;
}

function cartTotalPrice(){
  let total = 0;
  for(const [id, qty] of Object.entries(state.cart)){
    const item = getItemById(id);
    if(item) total += (Number(item.price)||0) * qty;
  }
  return total;
}

function updateCounts(){
  const c = cartTotalCount();
  cartCount.textContent = String(c);
  fabCount.textContent  = String(c);
  cartMiniBtn.style.opacity = c > 0 ? "1" : ".85";
}

// ===== UI Render =====
function showBranchPage(){
  branchPage.classList.remove("hidden");
  menuPage.classList.add("hidden");
}

function showMenuPage(){
  branchPage.classList.add("hidden");
  menuPage.classList.remove("hidden");
  branchPill.textContent = branchLabel();
}

function renderTabs(){
  tabsEl.innerHTML = "";
  MENU.forEach((cat, idx) => {
    const btn = document.createElement("button");
    btn.className = "tab" + (idx === 0 ? " active" : "");
    btn.textContent = cat.category;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      btn.classList.add("active");
      const el = document.getElementById(`sec-${cat.category}`);
      if(el) el.scrollIntoView({behavior:"smooth", block:"start"});
    });
    tabsEl.appendChild(btn);
  });
}

function renderItems(){
  itemsEl.innerHTML = "";
  MENU.forEach((cat) => {
    const title = document.createElement("div");
    title.className = "section-title";
    title.id = `sec-${cat.category}`;
    title.textContent = cat.category;
    itemsEl.appendChild(title);

    cat.items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "item-card";

      const img = document.createElement("img");
      img.className = "item-img";
      img.src = item.img || "";
      img.alt = item.name;

      // لو الصورة غير موجودة
      img.onerror = () => {
        img.removeAttribute("src");
        img.style.background = "linear-gradient(135deg, rgba(47,75,91,.12), rgba(195,122,99,.10))";
      };

      const info = document.createElement("div");
      info.className = "item-info";

      const name = document.createElement("h3");
      name.className = "item-name";
      name.textContent = item.name;

      const desc = document.createElement("p");
      desc.className = "item-desc";
      desc.textContent = item.desc || "";

      const bottom = document.createElement("div");
      bottom.className = "item-bottom";

      const price = document.createElement("div");
      price.className = "price";
      price.textContent = formatSAR(item.price);

      const qtyWrap = document.createElement("div");
      qtyWrap.className = "qty";

      const minus = document.createElement("button");
      minus.className = "qbtn";
      minus.textContent = "−";

      const qnum = document.createElement("div");
      qnum.className = "qnum";
      qnum.textContent = String(state.cart[item.id] || 0);

      const plus = document.createElement("button");
      plus.className = "qbtn";
      plus.textContent = "+";

      minus.addEventListener("click", () => {
        const cur = state.cart[item.id] || 0;
        if(cur > 0){
          const next = cur - 1;
          if(next === 0) delete state.cart[item.id];
          else state.cart[item.id] = next;
          saveCart();
          qnum.textContent = String(state.cart[item.id] || 0);
          updateCounts();
        }
      });

      plus.addEventListener("click", () => {
        const cur = state.cart[item.id] || 0;
        state.cart[item.id] = cur + 1;
        saveCart();
        qnum.textContent = String(state.cart[item.id] || 0);
        updateCounts();
      });

      qtyWrap.append(minus, qnum, plus);
      bottom.append(price, qtyWrap);

      info.append(name, desc, bottom);
      card.append(img, info);
      itemsEl.appendChild(card);
    });
  });
}

function openOverlay(){
  sheetBranch.textContent = branchLabel();
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  renderCartOverlay();
}

function closeOverlay(){
  overlay.classList.add("hidden");
  document.body.style.overflow = "";
}

function renderCartOverlay(){
  cartList.innerHTML = "";
  const entries = Object.entries(state.cart);

  if(entries.length === 0){
    const empty = document.createElement("div");
    empty.style.color = "#64748B";
    empty.style.textAlign = "center";
    empty.style.padding = "10px 0";
    empty.textContent = "سلتك فاضية حالياً. اختر أصناف من المنيو.";
    cartList.appendChild(empty);
  } else {
    entries.forEach(([id, qty]) => {
      const item = getItemById(id);
      if(!item) return;

      const row = document.createElement("div");
      row.className = "cart-row";

      const left = document.createElement("div");
      left.className = "left";

      const cname = document.createElement("div");
      cname.className = "cname";
      cname.textContent = item.name;

      const cprice = document.createElement("div");
      cprice.className = "cprice";
      cprice.textContent = `${formatSAR(item.price)} • الكمية: ${qty}`;

      left.append(cname, cprice);

      const right = document.createElement("div");
      right.style.display = "flex";
      right.style.alignItems = "center";
      right.style.gap = "8px";

      const minus = document.createElement("button");
      minus.className = "qbtn";
      minus.textContent = "−";

      const qnum = document.createElement("div");
      qnum.className = "qnum";
      qnum.textContent = String(qty);

      const plus = document.createElement("button");
      plus.className = "qbtn";
      plus.textContent = "+";

      const del = document.createElement("button");
      del.className = "del";
      del.textContent = "حذف";

      minus.addEventListener("click", () => {
        const cur = state.cart[id] || 0;
        if(cur > 0){
          const next = cur - 1;
          if(next === 0) delete state.cart[id];
          else state.cart[id] = next;
          saveCart();
          updateCounts();
          renderCartOverlay();
        }
      });

      plus.addEventListener("click", () => {
        state.cart[id] = (state.cart[id] || 0) + 1;
        saveCart();
        updateCounts();
        renderCartOverlay();
      });

      del.addEventListener("click", () => {
        delete state.cart[id];
        saveCart();
        updateCounts();
        renderCartOverlay();
      });

      right.append(minus, qnum, plus, del);

      row.append(left, right);
      cartList.appendChild(row);
    });
  }

  totalPriceEl.textContent = formatSAR(cartTotalPrice());
}

// ===== WhatsApp إرسال =====
function buildWhatsAppMessage(){
  const name  = (customerName.value || "").trim();
  const phone = (customerPhone.value || "").trim();

  const branchText = branchLabel();
  const lines = [];
  lines.push("طلب جديد - سمبوساتي");
  lines.push(branchText);
  lines.push("—");

  const entries = Object.entries(state.cart);
  if(entries.length === 0){
    lines.push("السلة فارغة");
  } else {
    for(const [id, qty] of entries){
      const item = getItemById(id);
      if(!item) continue;
      const itemTotal = (Number(item.price)||0) * qty;
      lines.push(`• ${item.name} × ${qty} = ${formatSAR(itemTotal)}`);
    }
  }

  lines.push("—");
  lines.push(`الإجمالي: ${formatSAR(cartTotalPrice())}`);
  lines.push("—");
  lines.push(`اسم العميل: ${name || "غير مذكور"}`);
  lines.push(`رقم الجوال: ${phone || "غير مذكور"}`);

  return lines.join("\n");
}

function openWhatsApp(){
  if(cartTotalCount() === 0){
    alert("سلتك فاضية. اختر أصناف قبل الإرسال.");
    return;
  }

  const msg = buildWhatsAppMessage();
  const to  = branchPhone(); // رقم الفرع
  const url = `https://wa.me/${to}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}

// ===== Events =====
document.querySelectorAll(".branch-card").forEach(btn => {
  btn.addEventListener("click", () => {
    setBranch(btn.dataset.branch);
    showMenuPage();
    renderTabs();
    renderItems();
    updateCounts();
  });
});

changeBranchBtn.addEventListener("click", () => {
  setBranch(null);
  localStorage.removeItem("branch");
  showBranchPage();
});

checkoutFab.addEventListener("click", openOverlay);
cartMiniBtn.addEventListener("click", openOverlay);
closeOverlayBtn.addEventListener("click", closeOverlay);
overlay.addEventListener("click", (e) => {
  if(e.target === overlay) closeOverlay();
});

sendWhatsAppBtn.addEventListener("click", openWhatsApp);

// ===== Init =====
(function init(){
  updateCounts();
  if(state.branch){
    showMenuPage();
    renderTabs();
    renderItems();
  } else {
    showBranchPage();
  }
})();
