const WHATSAPP_NUMBER = "917000887436";
const SITE_BASE_URL = "https://farhan700088.github.io/shoe-mart-website";

// Yahan aap apne hisab se "shoename" aur "price" edit kar sakte hain
const catalogData = {
  bestOffer: {
    title: "SPECIAL OFFER",
    folder: "Best Offer",
    items: [
      { id: "shoe01", name: "Black Bolt", price: "1999", images: ["1.png", "2.png"] },
      { id: "shoe02", name: "Green Mint", price: "1999", images: ["1.png", "2.png"] },
      { id: "shoe03", name: "Black Flash", price: "1999", images: ["1.png", "2.png"] },
      { id: "shoe04", name: "White Snow", price: "1999", images: ["1.png", "2.png"] }
    ]
  },
  poloShoe: {
    title: "POLO SHOE",
    folder: "Polo Shoe",
    items: [
      { id: "shoe01", name: "Polo", price: "1999", images: ["1.png", "2.png", "3.png"] },
      { id: "shoe02", name: "Polo", price: "1999", images: ["1.png", "2.png", "3.png"] },
      { id: "shoe03", name: "Polo", price: "1999", images: ["1.png", "2.png", "3.png"] }
    ]
  }
};

let currentCategoryKey = null;
let currentCategoryTitle = "";
let currentShoe = null;
let currentFolder = "";
let currentImgIdx = 0;

function formatPrice(rawPrice) {
  const clean = String(rawPrice).replace(/[₹/-]/g, "").trim();
  return `₹${clean}/-`;
}

function buildImagePath(categoryFolder, shoeId, fileName) {
  return encodeURI(`Shoe Mart/${categoryFolder}/${shoeId}/${fileName}`);
}

function switchPage(pageId) {
  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  window.scrollTo(0, 0);
}

function showPage1() {
  switchPage("page1");
}

function goHome() {
  if (!document.getElementById("page1").classList.contains("active")) {
    history.pushState({ page: "page1" }, "", "#home");
    showPage1();
  }
}

function openCategory(categoryKey, pushHistory = true) {
  currentCategoryKey = categoryKey;
  const category = catalogData[categoryKey];

  document.getElementById("categoryTitle").textContent = category.title;
  const grid = document.getElementById("shoeGrid");
  grid.innerHTML = "";

  category.items.forEach((shoe, index) => {
    const card = document.createElement("div");
    card.className = "shoe-card";
    card.onclick = () => openShoeDetail(categoryKey, index, true);

    const firstImg = buildImagePath(category.folder, shoe.id, shoe.images[0]);

    card.innerHTML = `
      <div class="shoe-thumb">
        <img src="${firstImg}" alt="${shoe.name.toUpperCase()}">
      </div>
      <p class="grid-price">${formatPrice(shoe.price)}</p>
    `;

    grid.appendChild(card);
  });

  if (pushHistory) {
    history.pushState({ page: "page2", categoryKey }, "", `#${categoryKey}`);
  }
  switchPage("page2");
}

function updateWhatsappLink() {
  if (!currentShoe) return;
  const upperShoeName = currentShoe.name.toUpperCase();
  const formattedPrice = formatPrice(currentShoe.price);
  const relativeImgPath = buildImagePath(currentFolder, currentShoe.id, currentShoe.images[currentImgIdx]);
  const fullImageUrl = `${SITE_BASE_URL}/${relativeImgPath}`;

  const message = `Hello SHOE MART, I want to order:\nCategory: ${currentCategoryTitle}\nShoe: ${upperShoeName}\nPrice: ${formattedPrice}\nPhoto: ${fullImageUrl}`;
  document.getElementById("whatsappBtn").href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function goToSlide(index, animate = true) {
  if (!currentShoe) return;
  const total = currentShoe.images.length;
  currentImgIdx = Math.max(0, Math.min(index, total - 1));

  const track = document.getElementById("sliderTrack");
  track.style.transition = animate ? "transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)" : "none";
  track.style.transform = `translate3d(-${currentImgIdx * 100}%, 0, 0)`;

  document.querySelectorAll("#sliderDots .dot").forEach((dot, idx) => {
    dot.classList.toggle("active", idx === currentImgIdx);
  });

  updateWhatsappLink();
}

function openShoeDetail(categoryKey, shoeIndex, pushHistory = true) {
  const category = catalogData[categoryKey];
  currentCategoryTitle = category.title;
  currentFolder = category.folder;
  currentShoe = category.items[shoeIndex];
  currentImgIdx = 0;

  const upperShoeName = currentShoe.name.toUpperCase();
  const formattedPrice = formatPrice(currentShoe.price);

  document.getElementById("detailShoeName").textContent = upperShoeName;
  document.getElementById("detailShoePrice").textContent = formattedPrice;

  const track = document.getElementById("sliderTrack");
  const dotsContainer = document.getElementById("sliderDots");
  track.innerHTML = "";
  dotsContainer.innerHTML = "";

  currentShoe.images.forEach((imgFile, idx) => {
    const slide = document.createElement("div");
    slide.className = "slide-item";
    const img = document.createElement("img");
    img.src = buildImagePath(currentFolder, currentShoe.id, imgFile);
    img.alt = `${upperShoeName} ${idx + 1}`;
    img.decoding = "sync";
    slide.appendChild(img);
    track.appendChild(slide);

    const dot = document.createElement("span");
    dot.className = idx === 0 ? "dot active" : "dot";
    dot.onclick = () => goToSlide(idx, true);
    dotsContainer.appendChild(dot);
  });

  goToSlide(0, false);

  if (pushHistory) {
    history.pushState({ page: "page3", categoryKey, shoeIndex }, "", `#${categoryKey}-${shoeIndex}`);
  }
  switchPage("page3");
}

// Phone Back Button & Side-Swipe Gesture Support
history.replaceState({ page: "page1" }, "", "#home");

window.addEventListener("popstate", (event) => {
  const state = event.state;
  if (!state || state.page === "page1") {
    showPage1();
  } else if (state.page === "page2") {
    openCategory(state.categoryKey, false);
  } else if (state.page === "page3") {
    openShoeDetail(state.categoryKey, state.shoeIndex, false);
  }
});

// Live Finger-Follow Touch Swipe & Mouse Drag
const sliderEl = document.getElementById("sliderContainer");
const trackEl = document.getElementById("sliderTrack");
let startX = 0;
let currentDeltaX = 0;
let isDragging = false;

function handleStart(clientX) {
  if (!currentShoe || currentShoe.images.length <= 1) return;
  isDragging = true;
  startX = clientX;
  currentDeltaX = 0;
  trackEl.style.transition = "none";
}

function handleMove(clientX) {
  if (!isDragging) return;
  currentDeltaX = clientX - startX;
  const containerWidth = sliderEl.offsetWidth || 1;
  const percentOffset = (currentDeltaX / containerWidth) * 100;
  const basePercent = -currentImgIdx * 100;
  trackEl.style.transform = `translate3d(${basePercent + percentOffset}%, 0, 0)`;
}

function handleEnd() {
  if (!isDragging) return;
  isDragging = false;
  if (currentDeltaX < -35 && currentImgIdx < currentShoe.images.length - 1) {
    goToSlide(currentImgIdx + 1, true);
  } else if (currentDeltaX > 35 && currentImgIdx > 0) {
    goToSlide(currentImgIdx - 1, true);
  } else {
    goToSlide(currentImgIdx, true);
  }
}

sliderEl.addEventListener("touchstart", (e) => handleStart(e.touches[0].clientX), { passive: true });
sliderEl.addEventListener("touchmove", (e) => handleMove(e.touches[0].clientX), { passive: true });
sliderEl.addEventListener("touchend", handleEnd);

sliderEl.addEventListener("mousedown", (e) => handleStart(e.clientX));
window.addEventListener("mousemove", (e) => handleMove(e.clientX));
window.addEventListener("mouseup", handleEnd);
