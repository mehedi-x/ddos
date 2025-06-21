// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];

// Theme management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.setAttribute('data-feather', theme === 'dark' ? 'sun' : 'moon');
        feather.replace();
    }
}

// Cart management
function addToCart(productId, quantity = 1) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        // Find product details
        const product = products.find(p => p.id === productId);
        if (product) {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
    }
    
    saveCart();
    updateCartCount();
    showCartNotification();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
}

function updateCartItemQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart();
            updateCartCount();
        }
    }
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const countElements = document.querySelectorAll('#cart-count');
    countElements.forEach(element => {
        element.textContent = cartCount;
        if (cartCount > 0) {
            element.classList.add('cart-badge-animate');
            setTimeout(() => element.classList.remove('cart-badge-animate'), 500);
        }
    });
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function showCartNotification() {
    // Simple notification - you can enhance this with a toast library
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed';
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 250px;';
    notification.innerHTML = `
        <i data-feather="check-circle" style="width: 16px; height: 16px;"></i>
        Product added to cart!
    `;
    
    document.body.appendChild(notification);
    feather.replace();
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Product loading
async function loadProducts() {
    const loadingElement = document.getElementById('loading-products');
    const gridElement = document.getElementById('products-grid');
    const noProductsElement = document.getElementById('no-products');
    
    try {
        // List of known product files - in a real scenario, you'd need a manifest or index
        const productFiles = [
            'gulder.html'
            // Add more product files here as they are created
        ];
        
        products = [];
        
        for (const file of productFiles) {
            try {
                const response = await fetch(`products/${file}`);
                if (response.ok) {
                    const html = await response.text();
                    const product = extractProductData(html, file);
                    if (product) {
                        products.push(product);
                    }
                }
            } catch (error) {
                console.log(`Could not load product: ${file}`);
            }
        }
        
        loadingElement.style.display = 'none';
        
        if (products.length > 0) {
            displayProducts(products);
            gridElement.style.display = 'flex';
            noProductsElement.style.display = 'none';
        } else {
            gridElement.style.display = 'none';
            noProductsElement.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading products:', error);
        loadingElement.style.display = 'none';
        noProductsElement.style.display = 'block';
    }
}

function extractProductData(html, filename) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract product data from the HTML
        const name = doc.querySelector('[data-product="name"]')?.textContent || 'Unknown Product';
        const price = parseFloat(doc.querySelector('[data-product="price"]')?.textContent?.replace('$', '') || 0);
        const image = doc.querySelector('[data-product="image"]')?.src || 'https://via.placeholder.com/300x250';
        const description = doc.querySelector('[data-product="description"]')?.textContent || '';
        const category = doc.querySelector('[data-product="category"]')?.textContent || '';
        
        return {
            id: filename.replace('.html', ''),
            name,
            price,
            image,
            description,
            category,
            url: `products/${filename}`
        };
    } catch (error) {
        console.error('Error extracting product data:', error);
        return null;
    }
}

function displayProducts(products) {
    const gridElement = document.getElementById('products-grid');
    if (!gridElement) return;
    
    gridElement.innerHTML = products.map(product => `
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="card product-card h-100" onclick="openProductDetail('${product.url}')">
                <img src="${product.image}" class="card-img-top" alt="${product.name}" 
                     onerror="this.src='https://via.placeholder.com/300x250?text=No+Image'">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted">${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}</p>
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="product-price">$${product.price.toFixed(2)}</span>
                            ${product.category ? `<small class="text-muted">${product.category}</small>` : ''}
                        </div>
                        <button class="btn btn-primary w-100" onclick="event.stopPropagation(); addToCart('${product.id}')">
                            <i data-feather="shopping-cart" style="width: 16px; height: 16px;"></i>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    feather.replace();
}

function openProductDetail(url) {
    window.open(url, '_blank');
}

// Cart page functions
function loadCartItems() {
    const cartItemsList = document.getElementById('cart-items-list');
    const emptyCart = document.getElementById('empty-cart');
    const cartItems = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('cart-subtotal');
    const totalElement = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartItems) cartItems.style.display = 'none';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartItems) cartItems.style.display = 'block';
    
    if (cartItemsList) {
        cartItemsList.innerHTML = cart.map(item => `
            <div class="cart-item d-flex align-items-center">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image me-3"
                     onerror="this.src='https://via.placeholder.com/80x80?text=No+Image'">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.name}</h6>
                    <p class="text-muted mb-2">$${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateCartItemQuantity('${item.id}', ${item.quantity - 1})">
                            <i data-feather="minus" style="width: 16px; height: 16px;"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" 
                               onchange="updateCartItemQuantity('${item.id}', parseInt(this.value))">
                        <button class="quantity-btn" onclick="updateCartItemQuantity('${item.id}', ${item.quantity + 1})">
                            <i data-feather="plus" style="width: 16px; height: 16px;"></i>
                        </button>
                    </div>
                </div>
                <div class="text-end">
                    <p class="fw-bold mb-2">$${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart('${item.id}'); loadCartItems();">
                        <i data-feather="trash-2" style="width: 16px; height: 16px;"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        feather.replace();
    }
    
    const total = getCartTotal();
    if (subtotalElement) subtotalElement.textContent = `$${total.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

// WhatsApp order
function placeWhatsAppOrder(customerName, customerPhone, customerAddress) {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = getCartTotal();
    const orderSummary = cart.map(item => 
        `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const message = `🛒 *New Order*\n\n` +
                   `*Customer Details:*\n` +
                   `Name: ${customerName}\n` +
                   `Phone: ${customerPhone}\n` +
                   `Address: ${customerAddress}\n\n` +
                   `*Order Summary:*\n${orderSummary}\n\n` +
                   `*Total: $${total.toFixed(2)}*\n\n` +
                   `Please confirm this order. Thank you!`;
    
    // WhatsApp business number - replace with your actual WhatsApp Business number
    const whatsappNumber = "+1234567890"; // Replace with your WhatsApp number
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Clear cart after order
    if (confirm('Order sent via WhatsApp! Would you like to clear your cart?')) {
        clearCart();
        window.location.href = 'index.html';
    }
}

// Initialize theme and event listeners on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    
    // Theme toggle event listener
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Window scroll event for navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'var(--navbar-bg)';
        } else {
            navbar.style.backgroundColor = 'var(--navbar-bg)';
        }
    }
});
