// Elements
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const modeToggle = document.getElementById('mode-toggle');
const orderBtn = document.getElementById('order-btn');
const orderSection = document.getElementById('order-section');
const orderForm = document.getElementById('order-form');
const orderCancel = document.getElementById('order-cancel');
const confirmationMessage = document.getElementById('confirmation-message');

// Mobile menu toggle
if(menuToggle && navMenu){
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !expanded);
    navMenu.classList.toggle('open');
  });
}

// Dark mode toggle
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

const savedTheme = localStorage.getItem('theme');
if(savedTheme) setTheme(savedTheme);
else setTheme(preferredDark.matches ? 'dark' : 'light');

if(modeToggle){
  modeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  });
}

// Show order form when user clicks "অর্ডার করুন" button on product page
if(orderBtn && orderSection && orderForm){
  orderBtn.addEventListener('click', () => {
    orderSection.classList.remove('hidden');
    confirmationMessage.classList.add('hidden');
    orderForm.classList.remove('hidden');
    orderForm.reset();
    orderForm['customer-name'].focus();

    // Scroll smoothly to order section
    orderSection.scrollIntoView({behavior: 'smooth'});
  });

  // Cancel order
  orderCancel.addEventListener('click', () => {
    orderSection.classList.add('hidden');
    confirmationMessage.classList.add('hidden');
    orderForm.classList.remove('hidden');
  });

  // Handle order form submission and open WhatsApp
  orderForm.addEventListener('submit', e => {
    e.preventDefault();

    if(!orderForm.checkValidity()){
      orderForm.reportValidity();
      return;
    }

    const name = orderForm['customer-name'].value.trim();
    const address = orderForm['customer-address'].value.trim();
    const phone = orderForm['customer-phone'].value.trim();
    const product = orderForm['product-name'] ? orderForm['product-name'].value : document.title.replace(' – আমার স্টোর', '');

    // Your WhatsApp number with country code (example for Bangladesh, change as needed)
    const whatsappNumber = '8801712345678';

    const message = `হ্যালো, আমি অর্ডার করতে চাই:\n\n` +
      `প্রোডাক্ট: ${product}\n` +
      `নাম: ${name}\n` +
      `ঠিকানা: ${address}\n` +
      `মোবাইল: ${phone}`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    confirmationMessage.textContent = 'আপনার অর্ডারটি WhatsApp এ পাঠানো হচ্ছে...';
    confirmationMessage.classList.remove('hidden');
    orderForm.classList.add('hidden');

    window.open(url, '_blank');

    // Hide order form after delay
    setTimeout(() => {
      orderSection.classList.add('hidden');
      confirmationMessage.classList.add('hidden');
      orderForm.classList.remove('hidden');
      orderForm.reset();
    }, 7000);
  });
}
