// Admin authentication
const ADMIN_PASSWORD = 'admin0213';

function showAdminPanel() {
    document.getElementById('login-section').style.display = 'none';
    llrdocument.getElementById('admin-panel').style.display = 'block';
    localStorage.setItem('adminLoggedIn', 'true');
}

function hideAdminPanel() {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('admin-panel').style.display = 'none';
    localStorage.removeItem('adminLoggedIn');
}

// Admin login handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const productForm = document.getElementById('product-form');
    const logoutBtn = document.getElementById('logout-btn');
    const loginError = document.getElementById('login-error');
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('admin-password').value;
            
            if (password === ADMIN_PASSWORD) {
                showAdminPanel();
                loginError.style.display = 'none';
            } else {
                loginError.style.display = 'block';
                document.getElementById('admin-password').value = '';
            }
        });
    }
    
    // Logout handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            hideAdminPanel();
            document.getElementById('admin-password').value = '';
        });
    }
    
    // Product form submission
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            generateProductHTML();
        });
    }
});

function generateProductHTML() {
    // Get form data
    const productName = document.getElementById('product-name').value.trim();
    const productPrice = parseFloat(document.getElementById('product-price').value);
    const productDescription = document.getElementById('product-description').value.trim();
    const productImage = document.getElementById('product-image').value.trim() || 'https://via.placeholder.com/600x400?text=No+Image';
    const productCategory = document.getElementById('product-category').value.trim();
    const productBrand = document.getElementById('product-brand').value.trim();
    const productStock = parseInt(document.getElementById('product-stock').value) || 0;
    const productFeatures = document.getElementById('product-features').value.trim();
    
    // Validate required fields
    if (!productName || !productPrice || !productDescription) {
        alert('Please fill in all required fields (Name, Price, Description)');
        return;
    }
    
    // Generate filename
    const filename = productName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') + '.html';
    
    // Convert features to array
    const featuresArray = productFeatures ? productFeatures.split('\n').filter(f => f.trim()) : [];
    
    // Generate HTML content
    const htmlContent = generateProductPageHTML({
        id: filename.replace('.html', ''),
        name: productName,
        price: productPrice,
        description: productDescription,
        image: productImage,
        category: productCategory,
        brand: productBrand,
        stock: productStock,
        features: featuresArray
    });
    
    // Download the HTML file
    downloadHTML(htmlContent, filename);
    
    // Reset form
    document.getElementById('product-form').reset();
    
    // Show success message
    alert(`Product HTML generated successfully!\n\nFilename: ${filename}\n\nUpload this file to the /products/ folder in your repository to make it live on your website.`);
}

function generateProductPageHTML(product) {
    const featuresHTML = product.features.map(feature => `<li>${feature}</li>`).join('');
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.name} - E-Store</title>
    <meta name="description" content="${product.description}">
    <meta name="keywords" content="${product.category}, ${product.brand}, ecommerce, whatsapp">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Feather Icons -->
    <script src="https://unpkg.com/feather-icons"></script>
    <!-- Custom CSS -->
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg fixed-top">
        <div class="container">
            <a class="navbar-brand fw-bold" href="../index.html">
                <i data-feather="shopping-bag" class="me-2"></i>
                E-Store
            </a>
            
            <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <i data-feather="menu"></i>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto align-items-center">
                    <li class="nav-item">
                        <a class="nav-link" href="../index.html">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../cart.html">
                            <i data-feather="shopping-cart" class="me-1"></i>
                            Cart (<span id="cart-count">0</span>)
                        </a>
                    </li>
                    <li class="nav-item">
                        <button class="btn btn-outline-secondary btn-sm ms-2" id="theme-toggle">
                            <i data-feather="moon" id="theme-icon"></i>
                        </button>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-success" href="../admin.html">
                            <i data-feather="settings" class="me-1"></i>
                            Admin
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Product Detail Section -->
    <section class="py-5" style="margin-top: 80px;">
        <div class="container">
            <!-- Breadcrumb -->
            <nav aria-label="breadcrumb" class="mb-4">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="../index.html">Home</a></li>
                    <li class="breadcrumb-item"><a href="../index.html#products">Products</a></li>
                    ${product.category ? `<li class="breadcrumb-item"><span>${product.category}</span></li>` : ''}
                    <li class="breadcrumb-item active" aria-current="page">${product.name}</li>
                </ol>
            </nav>
            
            <div class="row">
                <!-- Product Image -->
                <div class="col-lg-6 mb-4">
                    <div class="text-center">
                        <img src="${product.image}" alt="${product.name}" class="product-detail-image w-100"
                             data-product="image" onerror="this.src='https://via.placeholder.com/600x400?text=No+Image'">
                    </div>
                </div>
                
                <!-- Product Details -->
                <div class="col-lg-6">
                    <div class="card h-100">
                        <div class="card-body">
                            <h1 class="h2 fw-bold mb-3" data-product="name">${product.name}</h1>
                            
                            ${product.brand ? `<p class="text-muted mb-2"><strong>Brand:</strong> <span data-product="brand">${product.brand}</span></p>` : ''}
                            ${product.category ? `<p class="text-muted mb-2"><strong>Category:</strong> <span data-product="category">${product.category}</span></p>` : ''}
                            
                            <div class="mb-4">
                                <span class="product-price h3" data-product="price">$${product.price.toFixed(2)}</span>
                                ${product.stock > 0 ? 
                                    `<span class="badge bg-success ms-2">In Stock (${product.stock})</span>` : 
                                    `<span class="badge bg-warning ms-2">Limited Stock</span>`
                                }
                            </div>
                            
                            <div class="mb-4">
                                <h5>Description</h5>
                                <p class="text-muted" data-product="description">${product.description}</p>
                            </div>
                            
                            ${featuresHTML ? `
                            <div class="mb-4">
                                <h5>Features</h5>
                                <ul class="product-features">
                                    ${featuresHTML}
                                </ul>
                            </div>
                            ` : ''}
                            
                            <div class="d-grid gap-2">
                                <button class="btn btn-primary btn-lg" onclick="addToCart('${product.id}')">
                                    <i data-feather="shopping-cart" class="me-2"></i>
                                    Add to Cart
                                </button>
                                <a href="../cart.html" class="btn btn-outline-secondary">
                                    <i data-feather="eye" class="me-2"></i>
                                    View Cart
                                </a>
                            </div>
                            
                            <div class="mt-4 pt-3 border-top">
                                <div class="row text-center">
                                    <div class="col-4">
                                        <i data-feather="truck" class="text-primary mb-2"></i>
                                        <p class="small mb-0">Free Shipping</p>
                                    </div>
                                    <div class="col-4">
                                        <i data-feather="shield" class="text-primary mb-2"></i>
                                        <p class="small mb-0">Secure Payment</p>
                                    </div>
                                    <div class="col-4">
                                        <i data-feather="message-circle" class="text-primary mb-2"></i>
                                        <p class="small mb-0">WhatsApp Support</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer py-4">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h5 class="fw-bold">E-Store</h5>
                    <p class="text-muted">Your trusted WhatsApp-based shopping destination.</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <p class="text-muted">&copy; 2025 E-Store. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom JS -->
    <script src="../script.js"></script>
    
    <script>
        // Initialize product page
        document.addEventListener('DOMContentLoaded', function() {
            feather.replace();
            updateCartCount();
        });
    </script>
</body>
</html>`;
}

function downloadHTML(content, filename) {
    const blob = new Blob([content], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}
