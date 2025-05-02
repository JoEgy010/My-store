// استدعاء بيانات السلة من التخزين المحلي
document.addEventListener('DOMContentLoaded', function() {
    // استرجاع بيانات السلة من التخزين المحلي
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // تحديث عدد العناصر في أيقونة السلة
    updateCartCount(cartItems);
    
    // عرض عناصر السلة في صفحة الدفع
    displayCheckoutItems(cartItems);
    
    // إعداد نموذج الدفع
    setupCheckoutForm(cartItems);
});

// تحديث عدد العناصر في السلة
function updateCartCount(cartItems) {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// عرض عناصر السلة في صفحة الدفع
function displayCheckoutItems(cartItems) {
    const checkoutItems = document.getElementById('checkout-items');
    checkoutItems.innerHTML = '';
    
    if (cartItems.length === 0) {
        checkoutItems.innerHTML = '<p class="empty-cart">لا توجد منتجات في السلة</p>';
        document.querySelector('.submit-order').disabled = true;
        return;
    }
    
    let total = 0;
    
    cartItems.forEach(item => {
        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'checkout-item';
        
        // الحصول على تفاصيل المنتج من المصفوفة العامة
        const productDetails = getProductDetails(item.id);
        
        // إنشاء عنصر HTML لكل منتج
        checkoutItem.innerHTML = `
            <div class="checkout-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="checkout-item-details">
                <h3 class="checkout-item-title">${item.title}</h3>
                <p class="checkout-item-meta">
                    الكمية: ${item.quantity} | 
                    <span class="item-color">${item.color || productDetails.colors[0]}</span> | 
                    <span class="item-size">${item.size || productDetails.sizes[0]}</span>
                </p>
                <p class="checkout-item-price">${(item.price * item.quantity).toFixed(2)} جنيه مصري</p>
            </div>
        `;
        
        checkoutItems.appendChild(checkoutItem);
        
        // حساب المجموع
        total += item.price * item.quantity;
    });
    
    // تحديث المجموع
    document.getElementById('checkout-total').textContent = total.toFixed(2);
}

// الحصول على تفاصيل المنتج من المصفوفة العامة
function getProductDetails(productId) {
    // استدعاء بيانات المنتجات من ملف script.js
    // نظرًا لأن المتغير products قد لا يكون متاحًا مباشرة، نستخدم قيم افتراضية
    return {
        colors: ['أسود', 'أبيض', 'أزرق'],
        sizes: ['M', 'L', 'XL']
    };
}

// إعداد نموذج الدفع
function setupCheckoutForm(cartItems) {
    const checkoutForm = document.getElementById('checkout-form');
    
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (cartItems.length === 0) {
            alert('لا توجد منتجات في السلة');
            return;
        }
        
        // جمع بيانات النموذج
        const formData = {
            fullname: document.getElementById('fullname').value,
            phone1: document.getElementById('phone1').value,
            phone2: document.getElementById('phone2').value,
            governorate: document.getElementById('governorate').value,
            city: document.getElementById('city').value,
            address: document.getElementById('address').value,
            house_number: document.getElementById('house_number').value,
            apartment_number: document.getElementById('apartment_number').value,
            notes: document.getElementById('notes').value,
            items: cartItems,
            total: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
        };
        
        // إرسال تفاصيل الطلب إلى بوت تليجرام
        sendOrderToTelegram(formData);
        
        alert('تم استلام طلبك بنجاح! سنتواصل معك قريبًا.');
        
        // مسح بيانات السلة من التخزين المحلي
        localStorage.removeItem('cartItems');
        
        // إعادة توجيه المستخدم إلى الصفحة الرئيسية
        window.location.href = 'index.html';
    });
}


// إضافة حدث لأيقونة السلة
document.getElementById('cart-icon').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'index.html';
});