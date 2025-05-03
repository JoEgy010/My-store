const productCodes = {
    1: "TS001-XYZ",
    2: "JP002-XYZ",
    3: "SH003-XYZ",
    4: "WA004-XYZ",
    5: "PL005-XYZ",
    6: "FP006-XYZ",
    7: "LS007-XYZ",
    8: "SG008-XYZ"
};

// تحميل أكواد المنتجات من Firebase أو التخزين المحلي
document.addEventListener('DOMContentLoaded', function() {
    // تحميل من Firebase إذا كان متاحًا
    if (typeof firebaseDB !== 'undefined') {
        firebaseDB.getProductCodes()
            .then(data => {
                if (data) {
                    // دمج الأكواد المحفوظة مع الأكواد الافتراضية
                    Object.assign(productCodes, data);
                } else {
                    // إذا لم تكن هناك بيانات في Firebase، حاول التحميل من localStorage
                    loadFromLocalStorage();
                    // حفظ البيانات في Firebase للمزامنة
                    firebaseDB.saveProductCodes(productCodes);
                }
            })
            .catch(error => {
                console.error("خطأ في تحميل أكواد المنتجات من Firebase:", error);
                // في حالة الخطأ، حاول التحميل من localStorage
                loadFromLocalStorage();
            });
        
        // الاستماع للتغييرات في أكواد المنتجات من Firebase
        firebaseDB.onProductCodesChange(data => {
            if (data) {
                // تحديث فقط إذا كانت البيانات مختلفة عن البيانات الحالية
                if (JSON.stringify(productCodes) !== JSON.stringify(data)) {
                    Object.assign(productCodes, data);
                }
            }
        });
    } else {
        // إذا لم يكن Firebase متاحًا، حاول التحميل من localStorage
        loadFromLocalStorage();
    }
});

// دالة مساعدة لتحميل البيانات من التخزين المحلي
function loadFromLocalStorage() {
    try {
        if (typeof localStorage !== 'undefined') {
            const savedCodes = localStorage.getItem('productCodes');
            if (savedCodes) {
                const parsedCodes = JSON.parse(savedCodes);
                // دمج الأكواد المحفوظة مع الأكواد الافتراضية
                Object.assign(productCodes, parsedCodes);
            }
        }
    } catch (error) {
        console.warn("تعذر تحميل أكواد المنتجات من التخزين المحلي:", error);
    }
}

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
    
    // حفظ التغييرات في Firebase للمزامنة بين جميع المستخدمين
    if (typeof firebaseDB !== 'undefined') {
        firebaseDB.saveProductCodes(productCodes)
            .catch(error => console.error("خطأ في حفظ أكواد المنتجات في Firebase:", error));
    }
    
    // محاولة حفظ التغييرات في التخزين المحلي إذا كان متاحًا (للتوافق مع الكود القديم)
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('productCodes', JSON.stringify(productCodes));
        }
    } catch (error) {
        console.warn("تعذر حفظ التغييرات في التخزين المحلي:", error);
    }
    
    return true;
}

// دالة لحذف كود منتج
function deleteProductCode(productId) {
    if (productCodes.hasOwnProperty(productId)) {
        delete productCodes[productId];
        
        // حفظ التغييرات في Firebase للمزامنة بين جميع المستخدمين
        if (typeof firebaseDB !== 'undefined') {
            firebaseDB.saveProductCodes(productCodes)
                .catch(error => console.error("خطأ في حفظ أكواد المنتجات في Firebase:", error));
        }
        
        // حفظ في التخزين المحلي للتوافق مع الكود القديم
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('productCodes', JSON.stringify(productCodes));
            }
        } catch (error) {
            console.warn("تعذر حفظ التغييرات في التخزين المحلي:", error);
        }
        
        return true;
    }
    return false;
}
