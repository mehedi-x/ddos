document.addEventListener('DOMContentLoaded', () => {
    // --- Global Elements ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mainNav = document.querySelector('.main-nav');
    const cartItemCountSpan = document.getElementById('cart-item-count');

    // --- Configuration ---
    const whatsappNumber = '88017XXXXXXXX'; // আপনার WhatsApp নাম্বার দিন (কান্ট্রি কোড সহ)

    // --- Theme Toggle Logic ---
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }    } else {
        // Default to light if no theme is set
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }

    themeToggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });

    // --- Hamburger Menu Logic ---
    hamburgerMenu.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        hamburgerMenu.classList.toggle('open'); // Optional: for animating hamburger icon    });

    // Close menu when a nav link is clicked (for mobile)
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                hamburgerMenu.classList.remove('open');
            }
        });
    });

    // --- Cart Logic (Shared) ---
    function getCart() {
        try {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            return cart;
        } catch (e) {
            console.error("Error parsing cart from localStorage:", e);
            return [];
        }
    }
    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartItemCount();
    }

    function addToCart(product) {
        const cart = getCart();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart(cart);
        alert(`${product.name} কার্টে যোগ করা হয়েছে!`);
    }

    function removeFromCart(productId) {
        let cart = getCart();
        cart = cart.filter(item => item.id !== productId);
        saveCart(cart);
        renderCart(); // Re-render cart after removal
    }

    function updateCartItemQuantity(productId, change) {
        const cart = getCart();
        const item = cart.find(item => item.id === productId);

        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(productId); // Remove if quantity drops to 0 or less
            } else {
                saveCart(cart);
                renderCart(); // Re-render cart to show updated quantity
            }
        }
    }

    function getCartTotal() {
        const cart = getCart();        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    function updateCartItemCount() {
        const cart = getCart();
        const totalItems = cart.reduce((count, item) => count + item.quantity, 0);
        if (cartItemCountSpan) {
            cartItemCountSpan.textContent = totalItems;
        }
    }

    // Initial update of cart count on page load
    updateCartItemCount();

    // --- Page Specific Logic ---

    // Logic for index.html (Product Listing - now uses hardcoded buttons)
    if (document.getElementById('products-grid')) {
        const productsGrid = document.getElementById('products-grid');

        // Add to Cart button listener for index page (delegated to handle hardcoded buttons)
        productsGrid.addEventListener('click', (event) => {
            const button = event.target.closest('.add-to-cart-btn');
            if (button) {
                event.preventDefault();
                const productId = button.dataset.productId;
                const productName = button.dataset.productName;
                const productPrice = parseFloat(button.dataset.productPrice);
                const productImage = button.dataset.productImage;
                addToCart({ id: productId, name: productName, price: productPrice, image: productImage });
            }
        });
    }

    // Logic for products/*.html (Individual Product Page)
    if (document.querySelector('.product-details-section')) {
        const productDetailsSection = document.querySelector('.product-details-section');
        const addToCartBtn = productDetailsSection.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {            addToCartBtn.addEventListener('click', () => {
                const productId = addToCartBtn.dataset.productId;
                const productName = addToCartBtn.dataset.productName;
                const productPrice = parseFloat(addToCartBtn.dataset.productPrice);
                const productImage = addToCartBtn.dataset.productImage;
                addToCart({ id: productId, name: productName, price: productPrice, image: productImage });
            });        }
    }


    // Logic for cart.html
    if (document.getElementById('cart-items')) {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalSpan = document.getElementById('cart-total');
        const checkoutWhatsappBtn = document.getElementById('checkout-whatsapp');
        const emptyCartMessage = document.getElementById('empty-cart-message');

        function renderCart() {            const cart = getCart();
            cartItemsContainer.innerHTML = ''; // Clear previous items

            if (cart.length === 0) {
                emptyCartMessage.style.display = 'block';
                checkoutWhatsappBtn.style.display = 'none';
                cartTotalSpan.textContent = '০.০০ টাকা';
                return;
            }

            emptyCartMessage.style.display = 'none';
            checkoutWhatsappBtn.style.display = 'block';

            cart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="price">${item.price} টাকা</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-increase" data-id="${item.id}">+</button>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });

            // Add event listeners for quantity buttons and remove button
            cartItemsContainer.querySelectorAll('.quantity-decrease').forEach(button => {
                button.addEventListener('click', (event) => {
                    const id = event.currentTarget.dataset.id;
                    updateCartItemQuantity(id, -1);
                });
            });
            cartItemsContainer.querySelectorAll('.quantity-increase').forEach(button => {
                button.addEventListener('click', (event) => {
                    const id = event.currentTarget.dataset.id;
                    updateCartItemQuantity(id, 1);
                });
            });

            cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(button => {
                button.addEventListener('click', (event) => {
                    const id = event.currentTarget.dataset.id;
                    removeFromCart(id);
                });
            });

            cartTotalSpan.textContent = `${getCartTotal().toFixed(2)} টাকা`;
        }

        checkoutWhatsappBtn.addEventListener('click', () => {
            const cart = getCart();
            if (cart.length === 0) {
                alert('আপনার কার্ট খালি। অর্ডার করার জন্য কিছু পণ্য যোগ করুন।');
                return;
            }

            let message = "আমার অর্ডার:\n\n";
            cart.forEach((item, index) => {
                message += `${index + 1}. ${item.name} (পরিমাণ: ${item.quantity}) - ${item.price * item.quantity} টাকা\n`;
            });
            message += `\nমোট: ${getCartTotal().toFixed(2)} টাকা`;
            message += `\n\n[আপনার নাম]:\n[আপনার ঠিকানা]:\n[যোগাযোগের জন্য বিকল্প নাম্বার]:`; // Add placeholders for user to fill

            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });        renderCart(); // Initial render of cart items
    }
});
