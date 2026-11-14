const WHATSAPP_NUMBER = "917000887436";

// Yahan aap apne hisab se "shoename" aur "price" edit kar sakte hain
const catalogData = {
  bestOffer: {
    title: "BEST OFFER",
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
let currentShoe = null;
let currentFolder = "";
let currentImgIdx = 0;

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

function openCategory(categoryKey) {
  currentCategoryKey = categoryKey;
  const category = catalogData[categoryKey];

  document.getElementById("categoryTitle").textContent = category.title;
  const grid = document.getElementById("shoeGrid");
  grid.innerHTML = "";

  category.items.forEach((shoe, index) => {
    const card = document.createElement("div");
    card.className = "shoe-card";
    card.onclick = () => openShoeDetail(categoryKey, index);

    const firstImg = buildImagePath(category.folder, shoe.id, shoe.images[0]);

    card.innerHTML = `
      <div class="shoe-thumb">
        <img src="${firstImg}" alt="${shoe.name.toUpperCase()}">
      </div>
      <p class="grid-price">${shoe.price}</p>
    `;

    grid.appendChild(card);
  });

  switchPage("page2");
}

function backToPage2() {
  if (currentCategoryKey) {
    openCategory(currentCategoryKey);
  } else {
    showPage1();
  }
}

function updateSlide(index) {
  if (!currentShoe) return;
  const total = currentShoe.images.length;
  currentImgIdx = (index + total) % total;

  document.getElementById("slideImage").src = buildImagePath(
    currentFolder,
    currentShoe.id,
    currentShoe.images[currentImgIdx]
  );

  document.querySelectorAll("#sliderDots .dot").forEach((dot, idx) => {
    dot.classList.toggle("active", idx === currentImgIdx);
  });
}

function openShoeDetail(categoryKey, shoeIndex) {
  const category = catalogData[categoryKey];
  currentFolder = category.folder;
  currentShoe = category.items[shoeIndex];
  currentImgIdx = 0;

  const upperShoeName = currentShoe.name.toUpperCase();
  document.getElementById("detailShoeName").textContent = upperShoeName;
  document.getElementById("detailShoePrice").textContent = currentShoe.price;

  const message = `Hello SHOE MART, I want details for:\nCategory: ${category.title}\nShoe: ${upperShoeName}\nPrice: ${currentShoe.price}`;
  document.getElementById("whatsappBtn").href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  const dotsContainer = document.getElementById("sliderDots");
  dotsContainer.innerHTML = "";

  currentShoe.images.forEach((_, idx) => {
    const dot = document.createElement("span");
    dot.className = idx === 0 ? "dot active" : "dot";
    dot.onclick = () => updateSlide(idx);
    dotsContainer.appendChild(dot);
  });

  updateSlide(0);
  switchPage("page3");
}

// Mobile Touch Swipe & Desktop Drag Support
const sliderEl = document.getElementById("sliderContainer");
let startX = 0;

sliderEl.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
}, { passive: true });

sliderEl.addEventListener("touchend", (e) => {
  const diffX = startX - e.changedTouches[0].clientX;
  if (Math.abs(diffX) > 40) {
    updateSlide(diffX > 0 ? currentImgIdx + 1 : currentImgIdx - 1);
  }
});

sliderEl.addEventListener("mousedown", (e) => {
  startX = e.clientX;
});

sliderEl.addEventListener("mouseup", (e) => {
  const diffX = startX - e.clientX;
  if (Math.abs(diffX) > 40) {
    updateSlide(diffX > 0 ? currentImgIdx + 1 : currentImgIdx - 1);
  }
});
