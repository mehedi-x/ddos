// 🌙 Theme Toggle
document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("theme-toggle");
  const isDark = localStorage.getItem("theme") === "dark";
  if (isDark) document.body.classList.add("dark");

  themeToggle.checked = isDark;

  themeToggle.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  });

  // 🍔 Menu toggle
  const menuBtn = document.getElementById("menu-btn");
  const nav = document.getElementById("main-nav");

  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("show");
    });
  }

  // 🛒 Cart Count
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartCount.innerText = cart.length;
  }

  // 🛍 Load products if on index.html
  if (document.getElementById("product-grid")) {
    loadProducts();
  }

  // 🛒 Load Cart
  if (document.getElementById("cart-items")) {
    loadCart();
  }
});

// 📦 Load products from /products folder (static list)
function loadProducts() {
  const productGrid = document.getElementById("product-grid");
  const loader = document.getElementById("loader");
  if (!productGrid) return;

  const productFiles = [
    "gulder.html",
    // এখানে আপনি product HTML ফাইলের নাম যোগ করবেন
    // "item2.html",
    // "item3.html"
  ];

  productFiles.forEach((file) => {
    fetch("products/" + file)
      .then((res) => res.text())
      .then((html) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        const card = div.querySelector(".product-card");
        if (card) {
          productGrid.appendChild(card);
        }
        loader?.classList.add("hidden");
        productGrid.classList.remove("hidden");
      });
  });
}

// 🛒 Load Cart Page
function loadCart() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const whatsappBtn = document.getElementById("whatsapp-order-btn");

  let total = 0;
  let message = "📦 Order Summary:%0A";

  if (cartItems.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.innerText = "৳0";
    whatsappBtn.style.display = "none";
    return;
  }

  cartItems.forEach((item, index) => {
    const row = document.createElement("div");
    row.innerHTML = `
      <p><strong>${item.name}</strong> - ৳${item.price}</p>
    `;
    cartContainer.appendChild(row);
    total += Number(item.price);
    message += `• ${item.name} - ৳${item.price}%0A`;
  });

  cartTotal.innerText = "৳" + total;
  message += `%0A💰 Total: ৳${total}`;
  whatsappBtn.href = `https://wa.me/8801627647776?text=${message}`;
}

// ➕ Add to cart (from product page)
function addToCart(name, price) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("🛒 Added to cart!");
  location.reload();
}
