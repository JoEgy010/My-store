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

// رابط SheetBest API
window.SHEETBEST_API_URL = 'https://api.sheetbest.com/sheets/26863760-01bd-42aa-81d1-8fd45397d754';

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
    
    // حفظ التغييرات في SheetBest
    saveToSheetBest();
    
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
        
        // حفظ التغييرات في SheetBest
        saveToSheetBest();
        
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

// دالة لتحميل البيانات من SheetBest
function loadFromSheetBest() {
    // التحقق من توفر رابط SheetBest API
    if (!window.SHEETBEST_API_URL) {
        console.error("خطأ: رابط SheetBest API غير متوفر");
        return;
    }
    
    // إظهار رسالة تحميل
    console.log("جاري تحميل البيانات من SheetBest...");
    
    // استخدام Fetch API لجلب البيانات
    fetch(window.SHEETBEST_API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`خطأ في الاستجابة: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // التحقق من وجود بيانات
            if (data && data.length > 0) {
                // إعادة تعيين كائن رموز المنتجات
                productCodes = {};
                
                // تحويل البيانات
                for (let i = 0; i < data.length; i++) {
                    const row = data[i];
                    if (row["معرف المنتج"] && row["رمز المنتج"]) {
                        const productId = row["معرف المنتج"];
                        const productCode = row["رمز المنتج"];
                        productCodes[productId] = productCode;
                    }
                }
                
                console.log("تم تحميل البيانات بنجاح من SheetBest");
                
                // تحديث التخزين المحلي بالبيانات الجديدة
                try {
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem('productCodes', JSON.stringify(productCodes));
                        // تحديث وقت آخر تحديث
                        localStorage.setItem('lastSheetBestUpdate', new Date().toISOString());
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
            } else {
                console.warn("لم يتم العثور على بيانات في جدول البيانات");
            }
        })
        .catch(error => {
            console.error("خطأ في تحميل البيانات من SheetBest:", error);
        });
}

// دالة لحفظ البيانات في SheetBest
function saveToSheetBest() {
    // التحقق من توفر رابط SheetBest API
    if (!window.SHEETBEST_API_URL) {
        console.error("خطأ: رابط SheetBest API غير متوفر");
        return;
    }
    
    // تحويل كائن رموز المنتجات إلى مصفوفة لإرسالها إلى SheetBest
    const data = [];
    
    // إضافة البيانات
    for (const productId in productCodes) {
        if (productCodes.hasOwnProperty(productId)) {
            data.push({
                "معرف المنتج": productId,
                "رمز المنتج": productCodes[productId]
            });
        }
    }
    
    // حذف جميع البيانات الموجودة أولاً ثم إضافة البيانات الجديدة
    // استخدام طريقة DELETE لحذف جميع البيانات
    fetch(window.SHEETBEST_API_URL, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`خطأ في حذف البيانات: ${response.status}`);
        }
        return response.json();
    })
    .then(() => {
        // بعد حذف البيانات، إضافة البيانات الجديدة
        return fetch(window.SHEETBEST_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`خطأ في إضافة البيانات: ${response.status}`);
        }
        return response.json();
    })
    .then(() => {
        console.log("تم حفظ البيانات بنجاح في SheetBest");
        
        // تحديث وقت آخر تحديث
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('lastSheetBestUpdate', new Date().toISOString());
            }
        } catch (error) {
            console.warn("تعذر حفظ وقت التحديث في التخزين المحلي:", error);
        }
        
        // إطلاق حدث لإعلام التطبيق بتحديث البيانات
        const event = new CustomEvent('productCodesUpdated');
        document.dispatchEvent(event);
    })
    .catch(error => {
        console.error("خطأ في حفظ البيانات في SheetBest:", error);
    });
}

// دالة لتهيئة الاتصال بـ SheetBest
function initSheetBest() {
    // محاولة تحميل البيانات من التخزين المحلي أولاً
    try {
        if (typeof localStorage !== 'undefined') {
            const savedCodes = localStorage.getItem('productCodes');
            if (savedCodes) {
                productCodes = JSON.parse(savedCodes);
                console.log("تم تحميل البيانات من التخزين المحلي");
                
                // إطلاق حدث لإعلام التطبيق بتحديث البيانات
                const event = new CustomEvent('productCodesUpdated');
                document.dispatchEvent(event);
            }
        }
    } catch (error) {
        console.warn("تعذر تحميل البيانات من التخزين المحلي:", error);
    }
    
    // تحميل البيانات من SheetBest
    loadFromSheetBest();
}

// تهيئة الاتصال عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initSheetBest();
});

// تعريف دالة لتحرير المنتج (تستخدم في واجهة المستخدم)
function editProduct(productId, productCode) {
    // ملء حقول النموذج بالقيم الحالية
    document.getElementById('productId').value = productId;
    document.getElementById('productCode').value = productCode;
}
