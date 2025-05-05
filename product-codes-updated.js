// تكوين البيانات الأولية للمنتجات
let productCodes = {
    1: "TS001-XYZ",
    2: "JP002-XYZ",
    3: "SH003-XYZ",
    4: "WA004-XYZ",
    5: "PL005-XYZ",
    6: "FP006-XYZ",
    7: "LS007-XYZ",
    8: "SG008-XYZ"
};

// دالة للحصول على كود المنتج بناءً على معرف المنتج
function getProductCode(productId) {
    return productCodes[productId] || `UNKNOWN-${productId}`;
}

// دالة لإضافة أو تحديث كود منتج
function updateProductCode(productId, code) {
    // التحقق من صحة المدخلات
    if (!productId || !code) {
        console.error("خطأ: يجب توفير معرف المنتج والكود");
        return false;
    }
    
    // التحقق من تنسيق الكود (يجب أن يتبع نمط XX000-XYZ)
    const codePattern = /^[A-Z]{2}\d{3}-[A-Z]{3}$/;
    if (!codePattern.test(code)) {
        console.error("خطأ: تنسيق الكود غير صحيح. يجب أن يكون بتنسيق XX000-XYZ");
        return false;
    }
    
    // تحديث الكود
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
        const savedCodes = localStorage.getItem('productCodes');
        if (savedCodes) {
            productCodes = JSON.parse(savedCodes);
            console.log("تم تحميل البيانات من التخزين المحلي");
            
            // إطلاق حدث لإعلام التطبيق بتحديث البيانات
            const event = new CustomEvent('productCodesUpdated');
            document.dispatchEvent(event);
            
            return true;
        }
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
