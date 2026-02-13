// ===== أرقام الفروع (مؤقتاً رقمك) =====
// wa.me يحتاج صيغة دولية بدون 0
const PHONE_MAJIDIYA = "966593937921";
const PHONE_MIYAS    = "966593937921";

// ===== منيو تجريبي (بدّل لاحقاً بالشيت) =====
const MENU = [
  {
    category: "سمبوسة",
    items: [
      {
        id: "s1",
        name: "بوكس سمبوسة (36 حبة)",
        price: 30,
        img: "assets/box.jpg",
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
      { id:"f1", name:"بوكس فلافل (45 حبة)", price:15, img:"assets/falafel.jpg", desc:"فلافل طازج ومقرمش." }
    ]
  },
  {
    category: "مقالي",
    items: [
      { id:"m1", name:"بوكس مبصل (باكورة) (20 حبة)", price:15, img:"assets/box.jpg", desc:"مقرمش وخفيف." },
      { id:"m2", name:"بوكس كباب عروق (20 حبة)", price:0, img:"assets/box.jpg", desc:"ضع السعر لاحقاً (حالياً 0)." }
    ]
  }
];

// ===== State =====
const state = {
  branch: localStorage.getItem("branch") || "",
  cart: JSON.parse(localStorage.getItem("cart") || "{}") // {id: qty}
};

// ===== DOM =====
const pageBranch = document.getElementById("pageBranch");
const pageMenu   = document.getElementById("pageMenu");

const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutCount = document.getElementById("checkoutCount");

const tabs = document.getElementById("tabs");
const items = document.getElementById("items");
const branchPill = document.getElementById("branchPill");
const changeBranch = document.getElementById("changeBranch");

const overlay = document.getElementById("overlay");
const closeOverlay = document.getElementById("closeOverlay");
const sheetBranch = document.getElementById("sheetBranch");
const cartList = document.getElementById("cartList");
const totalPriceEl = document.getElementById("totalPrice");
const custName = document.getElementById("custName");
const custPhone = document.getElementById("custPhone");
const sendWA = document.getElementById("sendWA");

// ===== Helpers =====
function saveCart(){
  localStorage.setItem("cart", JSON.stringify(state.cart));
}

function formatSAR(n){
  const num = Number(n || 0);
  return `${num.toFixed(num % 1 === 0 ? 0 : 2)} ريال`;
}

function cartTotalCount(){
  return Object.values(state.cart).reduce((a,b)=>a + b, 0);
}

function getItemById(id){
  for(const c of MENU){
    const it = c.items.find(x => x.id === id);
    if(it) return { ...it, category: c.category };
  }
  return null;
}

function cartTotalPrice(){
  let t = 0;
  for(const [id, qty] of Object.entries(state.cart)){
    const it = getItemById(id);
    if(it) t += (Number(it.price)||0) * qty;
  }
  return t;
}

function branchLabel(){
  if(state.branch === "majidiya") return "الفرع المختار: فرع المجيدية";
  if(state.branch === "miyas") return "الفرع المختار: فرع مياس";
  return "اختر الفرع";
}

function branchPhone(){
  return state.branch === "miyas" ? PHONE_MIYAS : PHONE_MAJIDIYA;
}

function updateCounts(){
  const c = cartTotalCount();
  cartCount.textContent = String(c);
  checkoutCount.textContent = String(c);
}

// ===== Page control =====
function showBranch(){
  pageMenu.hidden = true;
  pageBranch.hidden = false;
}

function showMenu(){
  pageBranch.hidden = true;
  pageMenu.hidden = false;
  branchPill.textContent = branchLabel();
}

// ===== Render =====
function renderTabs(){
  tabs.innerHTML = "";
  MENU.forEach((cat, idx) => {
    const b = document.createElement("button");
    b.className = "tab" + (idx === 0 ? " active" : "");
    b.type = "button";
    b.textContent = cat.category;
    b.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      const sec = document.getElementById("sec-" + cat.category);
      if(sec) sec.scrollIntoView({behavior:"smooth", block:"start"});
    });
    tabs.appendChild(b);
  });
}

function renderItems(){
  items.innerHTML = "";
  MENU.forEach((cat) => {
    const title = document.createElement("div");
    title.className = "section";
    title.id = "sec-" + cat.category;
    title.textContent = cat.category;
    items.appendChild(title);

    cat.items.forEach((it) => {
      const card = document.createElement("div");
      card.className = "card";

      const img = document.createElement("img");
      img.className = "photo";
      img.src = it.img || "";
      img.alt = it.name;
      img.onerror = () => img.removeAttribute("src");

      const info = document.createElement("div");
      info.className = "info";

      const name = document.createElement("h3");
      name.className = "name";
      name.textContent = it.name;

      const desc = document.createElement("div");
      desc.className = "desc";
      desc.textContent = it.desc || "";

      const row = document.createElement("div");
      row.className = "row";

      const price = document.createElement("div");
      price.className = "price";
      price.textContent = formatSAR(it.price);

      const qty = document.createElement("div");
      qty.className = "qty";

      const minus = document.createElement("button");
      minus.className = "qbtn";
      minus.type = "button";
      minus.textContent = "−";

      const qnum = document.createElement("div");
      qnum.className = "qnum";
      qnum.textContent = String(state.cart[it.id] || 0);

      const plus = document.createElement("button");
      plus.className = "qbtn";
      plus.type = "button";
      plus.textContent = "+";

      minus.addEventListener("click", () => {
        const cur = state.cart[it.id] || 0;
        if(cur > 0){
          const next = cur - 1;
          if(next === 0) delete state.cart[it.id];
          else state.cart[it.id] = next;
          saveCart();
          qnum.textContent = String(state.cart[it.id] || 0);
          updateCounts();
        }
      });

      plus.addEventListener("click", () => {
        const cur = state.cart[it.id] || 0;
        state.cart[it.id] = cur + 1;
        saveCart();
        qnum.textContent = String(state.cart[it.id] || 0);
        updateCounts();
      });

      qty.append(minus, qnum, plus);
      row.append(price, qty);

      info.append(name, desc, row);
      card.append(img, info);
      items.appendChild(card);
    });
  });
}

// ===== Overlay cart =====
function openOverlay(){
  sheetBranch.textContent = branchLabel();
  overlay.hidden = false;
  document.body.style.overflow = "hidden";
  renderCart();
}

function closeOverlayFn(){
  overlay.hidden = true;
  document.body.style.overflow = "";
}

function renderCart(){
  cartList.innerHTML = "";
  const entries = Object.entries(state.cart);

  if(entries.length === 0){
    const e = document.createElement("div");
    e.style.textAlign = "center";
    e.style.color = "#64748B";
    e.style.padding = "10px 0";
    e.textContent = "سلتك فاضية. اختر أصناف من المنيو.";
    cartList.appendChild(e);
  } else {
    for(const [id, qty] of entries){
      const it = getItemById(id);
      if(!it) continue;

      const row = document.createElement("div");
      row.className = "cart-row";

      const left = document.createElement("div");
      left.className = "c-left";

      const n = document.createElement("div");
      n.className = "c-name";
      n.textContent = it.name;

      const m = document.createElement("div");
      m.className = "c-meta";
      m.textContent = `${formatSAR(it.price)} • الكمية: ${qty}`;

      left.append(n, m);

      const right = document.createElement("div");
      right.className = "qty";

      const minus = document.createElement("button");
      minus.className = "qbtn";
      minus.type = "button";
      minus.textContent = "−";

      const qn = document.createElement("div");
      qn.className = "qnum";
      qn.textContent = String(qty);

      const plus = document.createElement("button");
      plus.className = "qbtn";
      plus.type = "button";
      plus.textContent = "+";

      const del = document.createElement("button");
      del.className = "del";
      del.type = "button";
      del.textContent = "حذف";

      minus.addEventListener("click", () => {
        const cur = state.cart[id] || 0;
        if(cur > 0){
          const next = cur - 1;
          if(next === 0) delete state.cart[id];
          else state.cart[id] = next;
          saveCart(); updateCounts(); renderCart();
        }
      });

      plus.addEventListener("click", () => {
        state.cart[id] = (state.cart[id] || 0) + 1;
        saveCart(); updateCounts(); renderCart();
      });

      del.addEventListener("click", () => {
        delete state.cart[id];
        saveCart(); updateCounts(); renderCart();
      });

      right.append(minus, qn, plus);
      row.append(left, right, del);
      cartList.appendChild(row);
    }
  }

  totalPriceEl.textContent = formatSAR(cartTotalPrice());
}

// ===== WhatsApp =====
function buildMessage(){
  const name  = (custName.value || "").trim() || "غير مذكور";
  const phone = (custPhone.value || "").trim() || "غير مذكور";

  const lines = [];
  lines.push("طلب جديد - سمبوساتي");
  lines.push(branchLabel());
  lines.push("—");

  for(const [id, qty] of Object.entries(state.cart)){
    const it = getItemById(id);
    if(!it) continue;
    const t = (Number(it.price)||0) * qty;
    lines.push(`• ${it.name} × ${qty} = ${formatSAR(t)}`);
  }

  lines.push("—");
  lines.push(`الإجمالي: ${formatSAR(cartTotalPrice())}`);
  lines.push("—");
  lines.push(`اسم العميل: ${name}`);
  lines.push(`رقم الجوال: ${phone}`);

  return lines.join("\n");
}

function sendToWA(){
  if(cartTotalCount() === 0){
    alert("سلتك فاضية. اختر أصناف قبل الإرسال.");
    return;
  }
  const url = `https://wa.me/${branchPhone()}?text=${encodeURIComponent(buildMessage())}`;
  window.open(url, "_blank");
}

// ===== Events =====
document.querySelectorAll(".branch-card").forEach(btn => {
  btn.addEventListener("click", () => {
    state.branch = btn.dataset.branch;
    localStorage.setItem("branch", state.branch);
    showMenu();
    renderTabs();
    renderItems();
    updateCounts();
  });
});

changeBranch.addEventListener("click", () => {
  state.branch = "";
  localStorage.removeItem("branch");
  showBranch();
});

cartBtn.addEventListener("click", openOverlay);
checkoutBtn.addEventListener("click", openOverlay);
closeOverlay.addEventListener("click", closeOverlayFn);
overlay.addEventListener("click", (e) => { if(e.target === overlay) closeOverlayFn(); });

sendWA.addEventListener("click", sendToWA);

// ===== Init =====
(function init(){
  // شيل وضع preload بعد ما يبدأ JS (هذا اللي يمنع ظهور الصفحات مع بعض)
  document.body.classList.remove("preload");

  updateCounts();

  if(state.branch){
    showMenu();
    renderTabs();
    renderItems();
  } else {
    showBranch();
  }
})();
