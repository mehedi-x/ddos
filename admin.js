document.addEventListener('DOMContentLoaded', () => {
    const adminLoginForm = document.getElementById('admin-login-form');
    const adminPasswordInput = document.getElementById('admin-password');
    const loginMessage = document.getElementById('login-message');
    const passwordFormContainer = document.getElementById('password-form-container');
    const productFormContainer = document.getElementById('product-form-container');
    const productForm = document.getElementById('product-form');
    const formMessage = document.getElementById('form-message');
    const downloadArea = document.getElementById('download-area');
    const generatedHtmlProductPageOutput = document.getElementById('generated-html-product-page');
    const generatedHtmlProductCardOutput = document.getElementById('generated-html-product-card');

    const CORRECT_PASSWORD = 'admin0213'; // অ্যাডমিন প্যানেলের পাসওয়ার্ড

    // Check if already logged in (using session storage for simplicity, won't persist across tabs/reloads)
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        passwordFormContainer.style.display = 'none';
        productFormContainer.style.display = 'block';
    }

    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredPassword = adminPasswordInput.value;

        if (enteredPassword === CORRECT_PASSWORD) {
            loginMessage.textContent = 'লগইন সফল হয়েছে!';
            loginMessage.className = 'message success';
            loginMessage.style.display = 'block';
            sessionStorage.setItem('adminLoggedIn', 'true'); // Store login status
            setTimeout(() => {
                passwordFormContainer.style.display = 'none';
                productFormContainer.style.display = 'block';            }, 1000);
        } else {
            loginMessage.textContent = 'ভুল পাসওয়ার্ড। আবার চেষ্টা করুন।';
            loginMessage.className = 'message error';
            loginMessage.style.display = 'block';
        }
    });

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const productId = document.getElementById('product-id').value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
        const productName = document.getElementById('product-name').value.trim();
        const productPrice = parseFloat(document.getElementById('product-price').value.trim());
        const productImage = document.getElementById('product-image').value.trim();
        const productDescription = document.getElementById('product-description').value.trim();

        if (!productId || !productName || isNaN(productPrice) || productPrice <= 0 || !productImage || !productDescription) {
            formMessage.textContent = 'সব ফিল্ড পূরণ করুন এবং সঠিক মূল্য দিন।';
            formMessage.className = 'message error';
            formMessage.style.display = 'block';
            return;
        }

        formMessage.style.display = 'none'; // Hide previous messages

        // Generate HTML for the individual product page (products/ID.html)
        const generatedProductPageHtml = `<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${productName} - পণ্য বিবরণ</title>
    <meta name="description" content="${productDescription.substring(0, 160)}">
    <meta name="keywords" content="${productName}, পণ্য, ই-কমার্স, ${productId}">
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <header class="main-header">
        <div class="container">
            <a href="../index.html" class="logo">আমার স্টোর</a>
            <nav class="main-nav">
                <ul class="nav-list">
                    <li><a href="../index.html">হোম</a></li>
                    <li><a href="../cart.html">কার্ট (<span id="cart-item-count">0</span>)</a></li>
                    <li><a href="../admin.html">অ্যাডমিন</a></li>
                </ul>
            </nav>
            <div class="header-actions">
                <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle dark/light mode">
                    <i class="fas fa-moon"></i>
                </button>
                <div class="hamburger-menu" id="hamburger-menu">
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                </div>
            </div>
        </div>
    </header>

    <main class="container content-area">
        <section class="product-details-section">
            <div class="product-details-container">
                <img src="${productImage}" alt="${productName}" class="product-details-image">
                <div class="product-details-info">
                    <h1>${productName}</h1>
                    <p class="price">${productPrice.toFixed(2)} টাকা</p>
                    <p class="description">${productDescription}</p>
                    <button class="btn btn-primary add-to-cart-btn"
                        data-product-id="${productId}"
                        data-product-name="${productName}"
                        data-product-price="${productPrice.toFixed(2)}"
                        data-product-image="${productImage}">
                        কার্টে যোগ করুন
                    </button>
                </div>
            </div>
        </section>
    </main>    <footer class="main-footer">
        <div class="container">
            <p>&copy; 2023 আমার স্টোর। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
    </footer>    <script src="../script.js"></script>
</body>
</html>`;

        // Generate HTML snippet for the product card to be added to index.html
        const generatedProductCardHtml = `
<div class="product-card">
    <a href="products/${productId}.html">
        <img src="${productImage}" alt="${productName}" class="product-card-image">
        <div class="product-card-content">            <h3>${productName}</h3>
            <p>${productDescription.substring(0, 100)}...</p>
            <div class="product-card-price">${productPrice.toFixed(2)} টাকা</div>
        </div>
    </a>
    <button class="btn btn-primary add-to-cart-btn" data-product-id="${productId}"
        data-product-name="${productName}" data-product-price="${productPrice.toFixed(2)}"
        data-product-image="${productImage}">
        কার্টে যোগ করুন
    </button>
</div>`;

        generatedHtmlProductPageOutput.textContent = generatedProductPageHtml;
        generatedHtmlProductCardOutput.textContent = generatedProductCardHtml;
        downloadArea.style.display = 'block';

        formMessage.textContent = 'HTML কোড সফলভাবে তৈরি হয়েছে। দয়া করে নির্দেশাবলী অনুসরণ করুন।';        formMessage.className = 'message success';
        formMessage.style.display = 'block';
    });
});
