const WHATSAPP_NUMBER = "917000887436";

// Yahan aap apne hisab se "shoename" aur "price" edit kar sakte hain
const catalogData = {
    bestOffer: {
        title: "BEST OFFER",
        folder: "Best Offer",
        items: [
            { id: "shoe01", name: "Black Bolt", price: "price", images: ["1.png", "2.png"] },
            { id: "shoe02", name: "shoename", price: "price", images: ["1.png", "2.png"] },
            { id: "shoe03", name: "shoename", price: "price", images: ["1.png", "2.png"] },
            { id: "shoe04", name: "shoename", price: "price", images: ["1.png", "2.png"] }
        ]
    },
    poloShoe: {
        title: "POLO SHOE",
        folder: "Polo Shoe",
        items: [
            { id: "shoe01", name: "shoename", price: "price", images: ["1.png", "2.png", "3.png"] },
            { id: "shoe02", name: "shoename", price: "price", images: ["1.png", "2.png", "3.png"] },
            { id: "shoe03", name: "shoename", price: "price", images: ["1.png", "2.png", "3.png"] }
        ]
    }
};

let currentCategoryKey = null;
let slideInterval = null;

function buildImagePath(categoryFolder, shoeId, fileName) {
    return encodeURI(`Shoe Mart/${categoryFolder}/${shoeId}/${fileName}`);
}

function switchPage(pageId) {
    document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
    window.scrollTo(0, 0);
}

function stopSlideshow() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

function showPage1() {
    stopSlideshow();
    switchPage("page1");
}

function openCategory(categoryKey) {
    stopSlideshow();
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

function openShoeDetail(categoryKey, shoeIndex) {
    stopSlideshow();
    const category = catalogData[categoryKey];
    const shoe = category.items[shoeIndex];

    const upperShoeName = shoe.name.toUpperCase();
    document.getElementById("detailShoeName").textContent = upperShoeName;
    document.getElementById("detailShoePrice").textContent = shoe.price;

    const message = `Hello SHOE MART, I want details for:\nCategory: ${category.title}\nShoe: ${upperShoeName}\nPrice: ${shoe.price}`;
    document.getElementById("whatsappBtn").href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    const slideImgEl = document.getElementById("slideImage");
    let currentImgIdx = 0;

    slideImgEl.src = buildImagePath(category.folder, shoe.id, shoe.images[currentImgIdx]);

    if (shoe.images.length > 1) {
        slideInterval = setInterval(() => {
            currentImgIdx = (currentImgIdx + 1) % shoe.images.length;
            slideImgEl.src = buildImagePath(category.folder, shoe.id, shoe.images[currentImgIdx]);
        }, 1000);
    }

    switchPage("page3");
}
