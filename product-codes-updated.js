// تكوين البيانات الأولية للمنتجات
let productCodes = {
    1: "g120",
    2: "b250",
    3: "r310",
    4: "p430",
    5: "y520",
    6: "w610",
    7: "s710",
    8: "m810"
};

// بيانات المنتجات مع الألوان والصور
let productData = {
    1: {
        name: "قميص",
        colors: {
            "أزرق": "images/product1-blue.jpg",
            "أحمر": "images/product1-red.jpg",
            "أسود": "images/product1-black.jpg"
        }
    },
    2: {
        name: "بنطلون",
        colors: {
            "أسود": "images/product2-black.jpg",
            "بني": "images/product2-brown.jpg"
        }
    },
    3: {
        name: "حذاء",
        colors: {
            "أسود": "images/product3-black.jpg",
            "بني": "images/product3-brown.jpg",
            "أبيض": "images/product3-white.jpg"
        }
    }
};

// دالة للحصول على كود المنتج بناءً على معرف المنتج
function getProductCode(productId) {
    return productCodes[productId] || `UNKNOWN-${productId}`;
}

// دالة للحصول على بيانات المنتج بناءً على معرف المنتج
function getProductData(productId) {
    return productData[productId] || null;
}

// دالة للحصول على صورة المنتج بناءً على معرف المنتج واللون
function getProductImage(productId, color) {
    const product = getProductData(productId);
    if (product && product.colors && product.colors[color]) {
        return product.colors[color];
    }
    return null;
}

// دالة لإضافة أو تحديث بيانات المنتج
function updateProductData(productId, name, colors) {
    if (!productId || !name) {
        console.error("خطأ: يجب توفير معرف المنتج والاسم");
        return false;
    }
    
    // إنشاء أو تحديث بيانات المنتج
    if (!productData[productId]) {
        productData[productId] = { name: name, colors: {} };
    } else {
        productData[productId].name = name;
    }
    
    // إضافة الألوان إذا تم توفيرها
    if (colors) {
        productData[productId].colors = { ...productData[productId].colors, ...colors };
    }
    
    // محاولة حفظ التغييرات في التخزين المحلي
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('productData', JSON.stringify(productData));
        }
    } catch (error) {
        console.warn("تعذر حفظ بيانات المنتج في التخزين المحلي:", error);
    }
    
    // إطلاق حدث لإعلام التطبيق بتحديث البيانات
    const event = new CustomEvent('productDataUpdated');
    document.dispatchEvent(event);
    
    return true;
}

// دالة لإضافة أو تحديث كود منتج
function updateProductCode(productId, code) {
    // التحقق من صحة المدخلات
    if (!productId || !code) {
        console.error("خطأ: يجب توفير معرف المنتج والكود");
        return false;
    }
    
    // تحديث الكود (بدون قيود على التنسيق)
    productCodes[productId] = code;
    
    // محاولة حفظ التغييرات في التخزين المحلي إذا كان متاحًا
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('productCodes', JSON.stringify(productCodes));
        }
    } catch (error) {
        console.warn("تعذر حفظ التغييرات في التخزين المحلي:", error);
    }
    
    // إطلاق حدث لإعلام التطبيق بتحديث البيانات
    const event = new CustomEvent('productCodesUpdated');
    document.dispatchEvent(event);
    
    // إطلاق حدث لإعلام الصفحة الرئيسية بالتغييرات
    const storeEvent = new CustomEvent('productDataChanged', {
        detail: { source: 'productCodes', timestamp: new Date().toISOString() }
    });
    document.dispatchEvent(storeEvent);
    
    return true;
}

// دالة لحذف كود منتج
function deleteProductCode(productId) {
    if (productCodes.hasOwnProperty(productId)) {
        delete productCodes[productId];
        
        // حفظ التغييرات في التخزين المحلي
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('productCodes', JSON.stringify(productCodes));
            }
        } catch (error) {
            console.warn("تعذر حفظ التغييرات في التخزين المحلي:", error);
        }
        
        // إطلاق حدث لإعلام التطبيق بتحديث البيانات
        const event = new CustomEvent('productCodesUpdated');
        document.dispatchEvent(event);
        
        // إطلاق حدث لإعلام الصفحة الرئيسية بالتغييرات
        const storeEvent = new CustomEvent('productDataChanged', {
            detail: { source: 'productCodes', timestamp: new Date().toISOString() }
        });
        document.dispatchEvent(storeEvent);
        
        return true;
    }
    return false;
}

// دالة لتحميل البيانات من التخزين المحلي
function loadFromLocalStorage() {
    try {
        // تحميل أكواد المنتجات
        const savedCodes = localStorage.getItem('productCodes');
        if (savedCodes) {
            productCodes = JSON.parse(savedCodes);
            console.log("تم تحميل أكواد المنتجات من التخزين المحلي");
            
            // إطلاق حدث لإعلام التطبيق بتحديث البيانات
            const event = new CustomEvent('productCodesUpdated');
            document.dispatchEvent(event);
        }
        
        // تحميل بيانات المنتجات
        const savedProductData = localStorage.getItem('productData');
        if (savedProductData) {
            productData = JSON.parse(savedProductData);
            console.log("تم تحميل بيانات المنتجات من التخزين المحلي");
            
            // إطلاق حدث لإعلام التطبيق بتحديث البيانات
            const event = new CustomEvent('productDataUpdated');
            document.dispatchEvent(event);
        }
        
        return true;
    } catch (error) {
        console.error("خطأ في تحميل البيانات من التخزين المحلي:", error);
    }
    return false;
}

// تحميل البيانات من التخزين المحلي عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
});

// دالة مساعدة لعرض الإشعارات
function showNotification(message, type) {
    // التحقق من وجود عنصر الإشعارات
    let notificationElement = document.getElementById('notification');
    
    // إنشاء عنصر الإشعارات إذا لم يكن موجودًا
    if (!notificationElement) {
        notificationElement = document.createElement('div');
        notificationElement.id = 'notification';
        document.body.appendChild(notificationElement);
    }
    
    // تعيين نص الإشعار ونوعه
    notificationElement.textContent = message;
    notificationElement.className = 'notification';
    
    if (type === 'success') {
        notificationElement.classList.add('success');
    } else if (type === 'error') {
        notificationElement.classList.add('error');
    } else if (type === 'warning') {
        notificationElement.classList.add('warning');
    } else if (type === 'info') {
        notificationElement.classList.add('info');
    }
    
    // عرض الإشعار
    notificationElement.style.display = 'block';
    
    // إخفاء الإشعار بعد 3 ثوانٍ
    setTimeout(function() {
        notificationElement.style.display = 'none';
    }, 3000);
}
