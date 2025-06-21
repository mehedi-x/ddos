// Theme toggle with localStorage
const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
  themeToggle.checked = localStorage.getItem("theme") === "dark";
  document.body.classList.toggle("dark", themeToggle.checked);
  themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark", themeToggle.checked);
    localStorage.setItem("theme", themeToggle.checked ? "dark" : "light");
  });
}

// Cart logic
const cartKey = "smartcart";
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  const existing = cart.find(p => p.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({...product, qty: 1});
  }
  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  const count = cart.reduce((acc, item) => acc + item.qty, 0);
  const el = document.getElementById("cart-count");
  if (el) el.innerText = count;
}
updateCartCount();

// Load cart page
function loadCartPage() {
  const container = document.getElementById("cart-items");
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  if (!container) return;
  container.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    const div = document.createElement("div");
    div.innerHTML = `
      <div style="margin:10px; border-bottom:1px solid #ccc; padding-bottom:10px;">
        <h3>${item.name}</h3>
        <p>৳${item.price} x 
          <input type="number" min="1" value="${item.qty}" onchange="updateQty(${index}, this.value)">
          = ৳${item.price * item.qty}</p>
        <button onclick="removeItem(${index})" style="background:red;color:white;padding:5px 10px;border:none;">Remove</button>
      </div>
    `;
    container.appendChild(div);
  });

  document.getElementById("cart-total").innerText = "৳" + total;
  const msg = cart.map(i => `${i.name} x ${i.qty}`).join(", ");
  const phone = "8801627647776";
  document.getElementById("whatsapp-order-btn").href = `https://wa.me/${phone}?text=Order: ${encodeURIComponent(msg)}`;
}

function updateQty(index, qty) {
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  qty = parseInt(qty);
  if (qty < 1) qty = 1;
  cart[index].qty = qty;
  localStorage.setItem(cartKey, JSON.stringify(cart));
  loadCartPage();
  updateCartCount();
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  cart.splice(index, 1);
  localStorage.setItem(cartKey, JSON.stringify(cart));
  loadCartPage();
  updateCartCount();
}

// Mobile menu toggle
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector("#menu-btn");
  const navLinks = document.querySelector(".nav-links");
  if(menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }

  // Product loading
  const grid = document.getElementById("product-grid");
  if (grid) {
    fetchProducts(grid);
  }

  // Load cart
  if (window.location.pathname.includes("cart.html")) {
    loadCartPage();
  }
});

// Show Product Details (modal)
function showDetails(id) {
  const modal = document.createElement("div");
  modal.className = "product-modal";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <img src='https://i.ibb.co/k2YdNNz/gulder.jpg' alt='Gulder'>
      <h2>Gulder Beer</h2>
      <p><b>Size:</b> 500ml</p>
      <p><b>Alcohol:</b> 5.2%</p>
      <p><b>Price:</b> ৳250</p>
      <button onclick="addToCart({id:'gulder',name:'Gulder Beer',price:250})">🛒 Add to Cart</button>
      <a href="https://wa.me/8801627647776?text=I want to order Gulder Premium Lager (৳250)"
         target="_blank" class="whatsapp-btn">📲 Order on WhatsApp</a>
    </div>
  `;
  document.body.appendChild(modal);
}

// Load products from HTML manually
function fetchProducts(container) {
  container.innerHTML = "";
  document.getElementById("loader").classList.add("hidden");

  const product = document.createElement("div");
  product.className = "product-card";
  product.innerHTML = `
    <img src="https://i.ibb.co/k2YdNNz/gulder.jpg" alt="Gulder">
    <h2>Gulder Beer</h2>
    <p>৳250</p>
    <button onclick="showDetails('gulder')">🔍 View</button>
  `;
  container.appendChild(product);
  container.classList.remove("hidden");
}
