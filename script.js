const cartKey = "smartcart_cart";

// Theme toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");
  const darkMode = localStorage.getItem("darkMode") === "true";
  if (darkMode) document.body.classList.add("dark");
  if (toggle) toggle.checked = darkMode;
  if (toggle) {
    toggle.addEventListener("change", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("darkMode", document.body.classList.contains("dark"));
    });
  }

  if (document.getElementById("product-grid")) loadProducts();
  if (document.getElementById("cart-items")) loadCartPage();
  updateCartCount();
});

function loadProducts() {
  const products = [
    {
      id: "gulder",
      name: "Gulder Beer",
      price: 250,
      image: "https://i.ibb.co/k2YdNNz/gulder.jpg"
    }
  ];
  const grid = document.getElementById("product-grid");
  document.getElementById("loader").classList.add("hidden");
  grid.classList.remove("hidden");

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p>Price: ৳${product.price}</p>
      <button onclick="addToCart('${product.id}', '${product.name}', ${product.price})">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

function addToCart(id, name, price) {
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  const existing = cart.find(item => item.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id, name, price, qty: 1 });
  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const counter = document.getElementById("cart-count");
  if (counter) counter.innerText = count;
}

function loadCartPage() {
  const container = document.getElementById("cart-items");
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const div = document.createElement("div");
    div.innerHTML = `
      <p><b>${item.name}</b> x ${item.qty} = ৳${item.price * item.qty}</p>
    `;
    container.appendChild(div);
  });
  document.getElementById("cart-total").innerText = "৳" + total;
  const msg = cart.map(i => `${i.name} x ${i.qty}`).join(", ");
  const phone = "8801627647776";
  document.getElementById("whatsapp-order-btn").href = `https://wa.me/${phone}?text=Order: ${encodeURIComponent(msg)}`;
}