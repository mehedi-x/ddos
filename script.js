// Toggle mobile menu
const menuToggleBtn = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggleBtn.addEventListener('click', () => {
    const expanded = menuToggleBtn.getAttribute('aria-expanded') === 'true' || false;
    menuToggleBtn.setAttribute('aria-expanded', !expanded);
    navMenu.classList.toggle('open');
});

// Toggle dark/light mode
const modeToggleBtn = document.getElementById('mode-toggle');
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

function getStoredTheme() {
    return localStorage.getItem('theme');
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark');
        modeToggleBtn.textContent = '☀️';
        modeToggleBtn.title = 'লাইট মোড চালু করুন';
    } else {
        document.body.classList.remove('dark');
        modeToggleBtn.textContent = '🌙';
        modeToggleBtn.title = 'ডার্ক মোড চালু করুন';
    }
}

// Initialize theme on page load
(function initTheme() {
    const savedTheme = getStoredTheme();
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // If user prefers dark by OS default
        applyTheme(prefersDarkScheme.matches ? 'dark' : 'light');
    }
})();

modeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark');
    if (isDark) {
        applyTheme('light');
        localStorage.setItem('theme', 'light');
    } else {
        applyTheme('dark');
        localStorage.setItem('theme', 'dark');
    }
});

// Order form show/hide logic
const orderButtons = document.querySelectorAll('.order-btn');
const orderSection = document.getElementById('order-section');
const orderForm = document.getElementById('order-form');
const thankYouMessage = document.getElementById('thankyou-message');
const formCloseBtn = document.getElementById('form-close');

// Show order form when clicking any "অর্ডার করুন" button
orderButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        orderSection.classList.remove('hidden');
        thankYouMessage.classList.add('hidden');
        orderForm.classList.remove('hidden');
        orderForm.reset();
        orderForm.scrollIntoView({ behavior: 'smooth' });

        // Autofill message with product name
        const productCard = btn.closest('.product-card');
        const productName = productCard.querySelector('h2').textContent;
        const messageTextarea = orderForm.querySelector('#message');
        messageTextarea.value = `আমি ${productName} অর্ডার করতে চাই।`;
        
        // Open mobile menu closed if open (optional UX)
        if(navMenu.classList.contains('open')){
          navMenu.classList.remove('open');
          menuToggleBtn.setAttribute('aria-expanded', 'false');
        }
    });
});

formCloseBtn.addEventListener('click', () => {
    orderSection.classList.add('hidden');
    thankYouMessage.classList.add('hidden');
    orderForm.classList.remove('hidden');
});

// Form submission handler
orderForm.addEventListener('submit', e => {
    e.preventDefault();

    // Basic validation
    if(!orderForm.checkValidity()){
        orderForm.reportValidity();
        return;
    }

    // Show thank you message and hide form
    orderForm.classList.add('hidden');
    thankYouMessage.textContent = `${orderForm.name.value}님, আপনার অর্ডার গ্রহণ করা হয়েছে। ধন্যবাদ!`;
    thankYouMessage.classList.remove('hidden');
    thankYouMessage.focus();
});
