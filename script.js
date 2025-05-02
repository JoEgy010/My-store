// بيانات المنتجات
const products = [
    {
        id: 1,
        title: "تيشيرت قطني بأكمام قصيرة",
        category: "tshirts",
        price: 79.99,
        oldPrice: 99.99,
        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        description: "تيشيرت قطني مريح بأكمام قصيرة، مناسب للإستخدام اليومي مع تصميم أنيق وعصري.",
        colors: ["أبيض", "أسود", "رمادي"],
        sizes: ["S", "M", "L", "XL"],
        inStock: true,
        badge: "جديد"
    },
    {
        id: 2,
        title: "بنطلون جينز كاجوال",
        category: "pants",
        price: 149.99,
        oldPrice: 189.99,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        description: "بنطلون جينز كاجوال بقصة مستقيمة، مصنوع من قماش الدنيم عالي الجودة ومريح للاستخدام اليومي.",
        colors: ["أزرق غامق", "أزرق فاتح", "أسود"],
        sizes: ["30", "32", "34", "36", "38"],
        inStock: true
    },
    {
        id: 3,
        title: "حذاء رياضي خفيف",
        category: "shoes",
        price: 199.99,
        oldPrice: 249.99,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        description: "حذاء رياضي خفيف الوزن مع نعل مريح، مثالي للمشي والاستخدام اليومي.",
        colors: ["أبيض", "أسود", "رمادي"],
        sizes: ["40", "41", "42", "43", "44", "45"],
        inStock: true,
        badge: "خصم 20%"
    },
    {
        id: 4,
        title: "ساعة يد أنيقة",
        category: "accessories",
        price: 299.99,
        oldPrice: 399.99,
        image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        description: "ساعة يد أنيقة بتصميم كلاسيكي، مقاومة للماء ومناسبة للاستخدام اليومي والمناسبات.",
        colors: ["فضي", "ذهبي", "أسود"],
        sizes: ["واحد"],
        inStock: true
    },
    {
        id: 5,
        title: "تيشيرت بولو قطني",
        category: "tshirts",
        price: 89.99,
        oldPrice: 119.99,
        image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        description: "تيشيرت بولو قطني بأكمام قصيرة، مناسب للإطلالة الأنيقة غير الرسمية.",
        colors: ["أزرق", "أحمر", "أسود", "أبيض"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        inStock: true
    },
    {
        id: 6,
        title: "بنطلون قماش أنيق",
        category: "pants",
        price: 159.99,
        oldPrice: 199.99,
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        description: "بنطلون قماش أنيق بقصة مستقيمة، مناسب للمناسبات الرسمية وشبه الرسمية.",
        colors: ["كحلي", "رمادي", "بني"],
        sizes: ["30", "32", "34", "36", "38"],
        inStock: true
    },
    {
        id: 7,
        title: "حذاء كاجوال جلد",
        category: "shoes",
        price: 249.99,
        oldPrice: 299.99,
        image: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        description: "حذاء كاجوال من الجلد الطبيعي، مريح وأنيق ومناسب للاستخدام اليومي.",
        colors: ["بني", "أسود"],
        sizes: ["40", "41", "42", "43", "44"],
        inStock: true
    },
    {
        id: 8,
        title: "نظارة شمسية عصرية",
        category: "accessories",
        price: 129.99,
        oldPrice: 159.99,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        description: "نظارة شمسية بتصميم عصري، توفر حماية كاملة من أشعة الشمس الضارة.",
        colors: ["أسود", "بني", "أزرق"],
        sizes: ["واحد"],
        inStock: true,
        badge: "الأكثر مبيعاً"
    }
];

// متغيرات عامة
let cart = [];
let currentFilter = 'all';

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // عرض المنتجات
    displayProducts();
    
    // إعداد النوافذ المنبثقة
    setupModals();
    
    // إعداد أحداث سلة التسوق
    setupCartEvents();
});

// عرض المنتجات
function displayProducts() {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';
    
    const filteredProducts = currentFilter === 'all' 
        ? products 
        : products.filter(product => product.category === currentFilter);
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<p class="no-products">لا توجد منتجات في هذا القسم حالياً</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-id', product.id);
        
        let badgeHTML = '';
        if (product.badge) {
            badgeHTML = `<span class="product-badge">${product.badge}</span>`;
        }
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                ${badgeHTML}
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">
                    <span class="current-price">${product.price} جنيه مصري</span>
                    ${product.oldPrice ? `<span class="old-price">${product.oldPrice} جنيه مصري</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> أضف للسلة
                    </button>
                    <button class="view-details" data-id="${product.id}">التفاصيل</button>
                </div>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // إضافة أحداث للأزرار
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId, 1);
        });
    });
    
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = parseInt(this.getAttribute('data-id'));
            showProductDetails(productId);
        });
    });
    
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            showProductDetails(productId);
        });
    });
}

// تصفية المنتجات
function filterProducts(category) {
    currentFilter = category;
    
    // تحديث الزر النشط
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.textContent.trim() === getCategoryButtonText(category)) {
            btn.classList.add('active');
        }
    });
    
    // عرض المنتجات المصفاة
    displayProducts();
    
    // التمرير إلى قسم المنتجات
    document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
}

// الحصول على اسم الفئة بالعربية
function getCategoryName(category) {
    switch(category) {
        case 'tshirts': return 'تيشيرتات';
        case 'pants': return 'بناطيل';
        case 'shoes': return 'أحذية';
        case 'accessories': return 'إكسسوارات';
        default: return 'أخرى';
    }
}

// الحصول على نص زر الفئة
function getCategoryButtonText(category) {
    switch(category) {
        case 'all': return 'الكل';
        case 'tshirts': return 'تيشيرتات';
        case 'pants': return 'بناطيل';
        case 'shoes': return 'أحذية';
        case 'accessories': return 'إكسسوارات';
        default: return 'أخرى';
    }
}

// إضافة منتج إلى سلة التسوق
function addToCart(productId, quantity) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // الحصول على المقاس واللون المحددين (إذا كانت متاحة)
    let selectedSize = product.sizes[0];
    let selectedColor = product.colors[0];
    
    // التحقق من وجود قائمة المقاسات والألوان في النافذة المنبثقة
    const sizeSelect = document.getElementById('product-size');
    const colorSelect = document.getElementById('product-color');
    
    if (sizeSelect) {
        selectedSize = sizeSelect.value;
    }
    
    if (colorSelect) {
        selectedColor = colorSelect.value;
    }
    
    // التحقق مما إذا كان المنتج موجودًا بالفعل في السلة
    const existingItem = cart.find(item => item.id === productId && item.size === selectedSize && item.color === selectedColor);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: quantity,
            size: selectedSize,
            color: selectedColor
        });
    }
    
    // تحديث عدد العناصر في السلة
    updateCartCount();
    
    // عرض رسالة تأكيد
    showToast('تمت إضافة المنتج إلى السلة');
}

// تحديث عدد العناصر في السلة
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// عرض تفاصيل المنتج
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const productDetails = document.getElementById('product-details');
    
    let sizesHTML = '';
    product.sizes.forEach(size => {
        sizesHTML += `<option value="${size}">${size}</option>`;
    });
    
    let colorsHTML = '';
    product.colors.forEach(color => {
        colorsHTML += `<option value="${color}">${color}</option>`;
    });
    
    productDetails.innerHTML = `
        <div class="product-details-container">
            <div class="product-details-image">
                <img src="${product.image}" alt="${product.title}">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-details-info">
                <div class="product-details-category">${getCategoryName(product.category)}</div>
                <h2 class="product-details-title">${product.title}</h2>
                <div class="product-details-price">
                    <span class="product-details-current-price">${product.price} جنيه مصري</span>
                    ${product.oldPrice ? `<span class="product-details-old-price">${product.oldPrice} جنيه مصري</span>` : ''}
                </div>
                <p class="product-details-description">${product.description}</p>
                <div class="product-details-meta">
                    <p><span>الحالة:</span> ${product.inStock ? 'متوفر' : 'غير متوفر'}</p>
                    <p>
                        <span>اللون:</span>
                        <select id="product-color">
                            ${colorsHTML}
                        </select>
                    </p>
                    <p>
                        <span>المقاس:</span>
                        <select id="product-size">
                            ${sizesHTML}
                        </select>
                    </p>
                </div>
                <div class="product-details-quantity">
                    <span>الكمية:</span>
                    <div class="product-details-quantity-control">
                        <button class="product-details-quantity-btn" id="decrease-quantity">-</button>
                        <input type="number" id="product-quantity" class="product-details-quantity-value" value="1" min="1" max="10">
                        <button class="product-details-quantity-btn" id="increase-quantity">+</button>
                    </div>
                </div>
                <div class="product-details-actions">
                    <button class="btn" id="add-to-cart-details" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> أضف للسلة
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // فتح النافذة المنبثقة
    const productModal = document.getElementById('product-modal');
    productModal.style.display = 'block';
    
    // إعداد أحداث الكمية
    const quantityInput = document.getElementById('product-quantity');
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');
    
    decreaseBtn.addEventListener('click', function() {
        if (quantityInput.value > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        if (quantityInput.value < 10) {
            quantityInput.value = parseInt(quantityInput.value) + 1;
        }
    });
    
    // إضافة حدث للزر "أضف للسلة"
    const addToCartBtn = document.getElementById('add-to-cart-details');
    addToCartBtn.addEventListener('click', function() {
        const quantity = parseInt(quantityInput.value);
        addToCart(product.id, quantity);
        productModal.style.display = 'none';
    });
}

// عرض سلة التسوق
function showCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">سلة التسوق فارغة</p>';
        document.getElementById('checkout-btn').disabled = true;
    } else {
        document.getElementById('checkout-btn').disabled = false;
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.title}</h3>
                    <p class="cart-item-meta">
                        <span class="item-color">اللون: ${item.color || 'غير محدد'}</span> | 
                        <span class="item-size">المقاس: ${item.size || 'غير محدد'}</span>
                    </p>
                    <p class="cart-item-price">${item.price} جنيه مصري</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn decrease-quantity" data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increase-quantity" data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        // إضافة أحداث لأزرار الكمية
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                const size = this.getAttribute('data-size');
                const color = this.getAttribute('data-color');
                updateCartItemQuantity(itemId, -1, size, color);
            });
        });
        
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                const size = this.getAttribute('data-size');
                const color = this.getAttribute('data-color');
                updateCartItemQuantity(itemId, 1, size, color);
            });
        });
        
        // إضافة أحداث لأزرار الحذف
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                const size = this.getAttribute('data-size');
                const color = this.getAttribute('data-color');
                removeCartItem(itemId, size, color);
            });
        });
    }
    
    // تحديث المجموع
    updateCartTotal();
    
    // فتح النافذة المنبثقة
    const cartModal = document.getElementById('cart-modal');
    cartModal.style.display = 'block';
}

// تحديث كمية عنصر في السلة
function updateCartItemQuantity(itemId, change, size, color) {
    const item = cart.find(item => 
        item.id === itemId && 
        item.size === size && 
        item.color === color
    );
    
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeCartItem(itemId, size, color);
    } else {
        // تحديث واجهة المستخدم
        showCart();
        updateCartCount();
    }
}

// إزالة عنصر من السلة
function removeCartItem(itemId, size, color) {
    cart = cart.filter(item => 
        !(item.id === itemId && 
        item.size === size && 
        item.color === color)
    );
    
    // تحديث واجهة المستخدم
    showCart();
    updateCartCount();
}

// تحديث مجموع السلة
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total').textContent = total.toFixed(2);
}

// إعداد النوافذ المنبثقة
function setupModals() {
    // الحصول على النوافذ المنبثقة
    const cartModal = document.getElementById('cart-modal');
    const productModal = document.getElementById('product-modal');
    
    // الحصول على أزرار الإغلاق
    const closeButtons = document.querySelectorAll('.close');
    
    // إضافة أحداث للإغلاق
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            cartModal.style.display = 'none';
            productModal.style.display = 'none';
        });
    });
    
    // إغلاق النافذة عند النقر خارجها
    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
        if (event.target === productModal) {
            productModal.style.display = 'none';
        }
    });
    
    // إعداد زر إتمام الشراء
    document.getElementById('checkout-btn').addEventListener('click', function() {
        if (cart.length > 0) {
            checkout();
        }
    });
}

// إعداد أحداث سلة التسوق
function setupCartEvents() {
    // فتح سلة التسوق عند النقر على أيقونة السلة
    document.getElementById('cart-icon').addEventListener('click', function(e) {
        e.preventDefault();
        showCart();
    });
}

// إتمام عملية الشراء
function checkout() {
    // حفظ بيانات السلة في التخزين المحلي
    localStorage.setItem('cartItems', JSON.stringify(cart));
    
    // توجيه المستخدم إلى صفحة الدفع
    window.location.href = 'checkout.html';
    
    // إغلاق نافذة السلة
    document.getElementById('cart-modal').style.display = 'none';
}

// عرض رسالة تأكيد
function showToast(message) {
    // التحقق من وجود عنصر التوست
    let toast = document.getElementById('toast');
    
    // إنشاء عنصر التوست إذا لم يكن موجوداً
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
        
        // إضافة الستايل للتوست
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = 'var(--primary-color)';
        toast.style.color = 'white';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = 'var(--border-radius)';
        toast.style.boxShadow = 'var(--box-shadow)';
        toast.style.zIndex = '1000';
        toast.style.transition = 'opacity 0.3s ease';
        toast.style.opacity = '0';
    }
    
    // تعيين الرسالة وإظهار التوست
    toast.textContent = message;
    toast.style.opacity = '1';
    
    // إخفاء التوست بعد 3 ثوانٍ
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
}