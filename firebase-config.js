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
    // إضافة مؤشر حالة الاتصال بـ Firebase
    let firebaseStatus = document.createElement('div');
    firebaseStatus.id = 'firebase-status';
    firebaseStatus.style.position = 'fixed';
    firebaseStatus.style.bottom = '10px';
    firebaseStatus.style.right = '10px';
    firebaseStatus.style.padding = '5px 10px';
    firebaseStatus.style.borderRadius = '5px';
    firebaseStatus.style.fontSize = '12px';
    firebaseStatus.style.zIndex = '9999';
    firebaseStatus.style.display = 'none'; // سيتم إظهاره فقط عند الحاجة
    document.body.appendChild(firebaseStatus);

    // دالة لتحديث حالة الاتصال
    function updateConnectionStatus(status, message) {
        if (!firebaseStatus) return;
        
        firebaseStatus.style.display = 'block';
        if (status === 'connected') {
            firebaseStatus.style.backgroundColor = '#4CAF50';
            firebaseStatus.style.color = 'white';
            firebaseStatus.textContent = 'متصل بـ Firebase: ' + message;
            // إخفاء الرسالة بعد 3 ثوانٍ
            setTimeout(() => { firebaseStatus.style.display = 'none'; }, 3000);
        } else if (status === 'error') {
            firebaseStatus.style.backgroundColor = '#F44336';
            firebaseStatus.style.color = 'white';
            firebaseStatus.textContent = 'خطأ في الاتصال: ' + message;
        } else if (status === 'offline') {
            firebaseStatus.style.backgroundColor = '#FF9800';
            firebaseStatus.style.color = 'white';
            firebaseStatus.textContent = 'غير متصل بالإنترنت';
        }
    }

    // مراقبة حالة الاتصال بالإنترنت
    window.addEventListener('online', () => {
        console.log('متصل بالإنترنت');
        if (typeof firebaseDB !== 'undefined') {
            // إعادة محاولة الاتصال بـ Firebase
            loadFromFirebase();
        }
    });

    window.addEventListener('offline', () => {
        console.log('غير متصل بالإنترنت');
        updateConnectionStatus('offline', '');
    });

    // دالة لتحميل البيانات من Firebase
    function loadFromFirebase() {
        if (!navigator.onLine) {
            console.warn('غير متصل بالإنترنت. سيتم تحميل البيانات من التخزين المحلي.');
            updateConnectionStatus('offline', '');
            loadFromLocalStorage();
            return;
        }

        firebaseDB.getProductCodes()
            .then(data => {
                if (data) {
                    // دمج الأكواد المحفوظة مع الأكواد الافتراضية
                    Object.assign(productCodes, data);
                    updateConnectionStatus('connected', 'تم تحميل البيانات بنجاح');
                } else {
                    // إذا لم تكن هناك بيانات في Firebase، حاول التحميل من localStorage
                    loadFromLocalStorage();
                    // حفظ البيانات في Firebase للمزامنة
                    return firebaseDB.saveProductCodes(productCodes)
                        .then(() => {
                            updateConnectionStatus('connected', 'تم حفظ البيانات الافتراضية');
                        });
                }
            })
            .catch(error => {
                console.error("خطأ في تحميل أكواد المنتجات من Firebase:", error);
                updateConnectionStatus('error', error.message || 'خطأ غير معروف');
                // في حالة الخطأ، حاول التحميل من localStorage
                loadFromLocalStorage();
            });
        
        // الاستماع للتغييرات في أكواد المنتجات من Firebase
        firebaseDB.onProductCodesChange(data => {
            if (data) {
                // تحديث فقط إذا كانت البيانات مختلفة عن البيانات الحالية
                if (JSON.stringify(productCodes) !== JSON.stringify(data)) {
                    Object.assign(productCodes, data);
                    console.log('تم تحديث أكواد المنتجات من Firebase');
                    updateConnectionStatus('connected', 'تم تحديث البيانات');
                }
            }
        });
    }

    // تحميل من Firebase إذا كان متاحًا
    if (typeof firebaseDB !== 'undefined') {
        loadFromFirebase();
    } else {
        // إذا لم يكن Firebase متاحًا، حاول التحميل من localStorage
        console.warn('Firebase غير متاح. سيتم تحميل البيانات من التخزين المحلي فقط.');
        updateConnectionStatus('error', 'Firebase غير متاح');
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
        // التحقق من حالة الاتصال بالإنترنت
        if (navigator.onLine) {
            // استخدام Promise للتأكد من اكتمال عملية الحفظ
            return firebaseDB.saveProductCodes(productCodes)
                .then(() => {
                    console.log("تم حفظ أكواد المنتجات في Firebase بنجاح");
                    // حفظ في التخزين المحلي كنسخة احتياطية
                    saveToLocalStorage();
                    return true;
                })
                .catch(error => {
                    console.error("خطأ في حفظ أكواد المنتجات في Firebase:", error);
                    // في حالة الخطأ، حفظ في التخزين المحلي على الأقل
                    saveToLocalStorage();
                    return false;
                });
        } else {
            console.warn("لا يوجد اتصال بالإنترنت. سيتم حفظ التغييرات محليًا فقط.");
            // حفظ في التخزين المحلي عند عدم وجود اتصال
            saveToLocalStorage();
            return false;
        }
    } else {
        // إذا لم يكن Firebase متاحًا، حفظ في التخزين المحلي فقط
        saveToLocalStorage();
        return true;
    }
    
    // دالة مساعدة لحفظ البيانات في التخزين المحلي
    function saveToLocalStorage() {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('productCodes', JSON.stringify(productCodes));
                console.log("تم حفظ أكواد المنتجات في التخزين المحلي");
            }
        } catch (error) {
            console.warn("تعذر حفظ التغييرات في التخزين المحلي:", error);
        }
    }
}

// دالة لحذف كود منتج
function deleteProductCode(productId) {
    if (productCodes.hasOwnProperty(productId)) {
        delete productCodes[productId];
        
        // حفظ التغييرات في Firebase للمزامنة بين جميع المستخدمين
        if (typeof firebaseDB !== 'undefined') {
            // التحقق من حالة الاتصال بالإنترنت
            if (navigator.onLine) {
                // استخدام Promise للتأكد من اكتمال عملية الحفظ
                return firebaseDB.saveProductCodes(productCodes)
                    .then(() => {
                        console.log("تم حذف وحفظ أكواد المنتجات في Firebase بنجاح");
                        // حفظ في التخزين المحلي كنسخة احتياطية
                        saveToLocalStorage();
                        return true;
                    })
                    .catch(error => {
                        console.error("خطأ في حفظ أكواد المنتجات في Firebase بعد الحذف:", error);
                        // في حالة الخطأ، حفظ في التخزين المحلي على الأقل
                        saveToLocalStorage();
                        return false;
                    });
            } else {
                console.warn("لا يوجد اتصال بالإنترنت. سيتم حفظ التغييرات محليًا فقط.");
                // حفظ في التخزين المحلي عند عدم وجود اتصال
                saveToLocalStorage();
                return true;
            }
        } else {
            // إذا لم يكن Firebase متاحًا، حفظ في التخزين المحلي فقط
            saveToLocalStorage();
            return true;
        }
        
        // دالة مساعدة لحفظ البيانات في التخزين المحلي
        function saveToLocalStorage() {
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('productCodes', JSON.stringify(productCodes));
                    console.log("تم حفظ أكواد المنتجات في التخزين المحلي بعد الحذف");
                }
            } catch (error) {
                console.warn("تعذر حفظ التغييرات في التخزين المحلي بعد الحذف:", error);
            }
        }
    }
    return false;
}
