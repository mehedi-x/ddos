// DOM Elements
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const modeToggle = document.getElementById('mode-toggle');
const productList = document.getElementById('product-list');
const orderSection = document.getElementById('order-section');
const orderForm = document.getElementById('order-form');
const orderCancel = document.getElementById('order-cancel');
const confirmationMessage = document.getElementById('confirmation-message');
const productNameInput = document.getElementById('product-name');

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', !expanded);
  navMenu.classList.toggle('open');
});

// Dark/light mode toggle
const preferredDark = window.matchMedia('(prefers-color-scheme: dark)');
function setTheme(theme) {
  if(theme === 'dark') {
    document.body.classList.add('dark');
    modeToggle.textContent = '☀️';
    modeToggle.title = 'লাইট মোড চালু করুন';
  } else {
    document.body.classList.remove('dark');
    modeToggle.textContent = '🌙';
    modeToggle.title = 'ডার্ক মোড চালু করুন';
  }
  localStorage.setItem('theme', theme);
}

(function initTheme(){
  const savedTheme = localStorage.getItem('theme');
  if(savedTheme) setTheme(savedTheme);
  else setTheme(preferredDark.matches ? 'dark' : 'light');
})();

modeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark');
  setTheme(isDark ? 'light' : 'dark');
});


// Fetch product data and render dynamically
fetch('products/products.json')
  .then(response => response.json())
  .then(products => {
    if(!Array.isArray(products)) return;
    productList.innerHTML = '';
    products.forEach(product => {
      const productCard = document.createElement('article');
      productCard.className = 'product-card';
      productCard.setAttribute('tabindex', '0');
      productCard.innerHTML = `
        <img src="products/${product.image}" alt="${product.name}" loading="lazy" />
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <button type="button" class="buy-btn" aria-label="${product.name} কিনুন বাটন">${product.price} - কিনুন</button>
        </div>
      `;
      // Add event listener to buy button
      productCard.querySelector('.buy-btn').addEventListener('click', () => {
        openOrderSection(product.name);
      });
      productList.appendChild(productCard);
    });
  })
  .catch(err => {
    productList.innerHTML = '<p style="text-align:center;color:#cc0000;">প্রোডাক্ট লোড করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।</p>';
    console.error(err);
  });

function openOrderSection(productName) {
  orderSection.classList.remove('hidden');
  confirmationMessage.classList.add('hidden');
  orderForm.classList.remove('hidden');
  orderForm.reset();
  productNameInput.value = productName;
  orderSection.scrollIntoView({behavior: 'smooth'});
  orderForm['customer-name'].focus();
}

// Cancel order form
orderCancel.addEventListener('click', () => {
  orderSection.classList.add('hidden');
  confirmationMessage.classList.add('hidden');
  orderForm.classList.remove('hidden');
});

// Handle order submission
orderForm.addEventListener('submit', e => {
  e.preventDefault();

  if(!orderForm.checkValidity()) {
    orderForm.reportValidity();
    return;
  }

  // Construct WhatsApp message
  const name = orderForm['customer-name'].value.trim();
  const address = orderForm['customer-address'].value.trim();
  const phone = orderForm['customer-phone'].value.trim();
  const product = orderForm['product-name'].value;

  // Basic phone validation message indicates Bangladeshi mobile number 01XXXXXXXXX
  const whatsappNumber = '8801712345678'; // <-- আপনার WhatsApp নম্বর এখানে প্রবেশ করান (দেশের কোডসহ, যেমন বাংলাদেশ=+880)

  const message = `হ্যালো, আমি অর্ডার করতে চাই:\n\n` +
                  `প্রোডাক্ট: ${product}\n` +
                  `নাম: ${name}\n` +
                  `ঠিকানা: ${address}\n` +
                  `মোবাইল: ${phone}`;

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  
  // Open WhatsApp link in new tab/window while showing confirmation
  confirmationMessage.textContent = 'আপনার অর্ডারটি WhatsApp এ পাঠানো হচ্ছে...';
  confirmationMessage.classList.remove('hidden');
  orderForm.classList.add('hidden');

  window.open(url, '_blank');

  // Optionally reset form after few seconds or wait for user to close
  setTimeout(() => {
    orderSection.classList.add('hidden');
    confirmationMessage.classList.add('hidden');
    orderForm.classList.remove('hidden');
    orderForm.reset();
  }, 8000);
});
