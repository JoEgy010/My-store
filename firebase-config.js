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

// معلومات Google Sheets (متغيرات عامة للوصول إليها من ملفات أخرى)
window.SPREADSHEET_ID = '1cCxI4npcslNa0dnwhxy9wDmcVWGU_jn21G-HX4k-72w'; // أدخل معرف جدول البيانات الخاص بك هنا
window.API_KEY = '9%RfRwvxhszd@vc0C%z7bEnVC#uLmunTmt48@U!cLBDeVZMrSIPdccyLT4e0-Q%b'; // أدخل مفتاح API الخاص بك هنا
window.SHEET_NAME = 'products_db'; // اسم ورقة العمل في جدول البيانات

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
    
    // حفظ التغييرات في Google Sheets
    saveToGoogleSheets();
    
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
        
        // حفظ التغييرات في Google Sheets
        saveToGoogleSheets();
        
        return true;
    }
    return false;
}

// دالة لتحميل البيانات من Google Sheets
function loadFromGoogleSheets() {
    // التحقق من توفر معرف جدول البيانات ومفتاح API
    if (!window.SPREADSHEET_ID || !window.API_KEY) {
        console.error("خطأ: يجب توفير معرف جدول البيانات ومفتاح API");
        return;
    }
    
    // بناء رابط API لجلب البيانات
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${window.SPREADSHEET_ID}/values/${window.SHEET_NAME}?key=${window.API_KEY}`;
    
    // إظهار رسالة تحميل
    console.log("جاري تحميل البيانات من Google Sheets...");
    
    // استخدام Fetch API لجلب البيانات
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`خطأ في الاستجابة: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // التحقق من وجود بيانات
            if (data && data.values && data.values.length > 1) {
                // إعادة تعيين كائن رموز المنتجات
                productCodes = {};
                
                // تجاهل الصف الأول (العناوين) وتحويل البيانات
                for (let i = 1; i < data.values.length; i++) {
                    const row = data.values[i];
                    if (row.length >= 2) {
                        const productId = row[0];
                        const productCode = row[1];
                        productCodes[productId] = productCode;
                    }
                }
                
                console.log("تم تحميل البيانات بنجاح من Google Sheets");
                
                // تحديث التخزين المحلي بالبيانات الجديدة
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
            } else {
                console.warn("لم يتم العثور على بيانات في جدول البيانات");
            }
        })
        .catch(error => {
            console.error("خطأ في تحميل البيانات من Google Sheets:", error);
        });
}

// دالة لحفظ البيانات في Google Sheets
function saveToGoogleSheets() {
    // التحقق من توفر معرف جدول البيانات ومفتاح API
    if (!window.SPREADSHEET_ID || !window.API_KEY) {
        console.error("خطأ: يجب توفير معرف جدول البيانات ومفتاح API");
        return;
    }
    
    // تحويل كائن رموز المنتجات إلى مصفوفة لإرسالها إلى Google Sheets
    const values = [
        ["معرف المنتج", "رمز المنتج"] // صف العناوين
    ];
    
    // إضافة البيانات
    for (const productId in productCodes) {
        if (productCodes.hasOwnProperty(productId)) {
            values.push([productId, productCodes[productId]]);
        }
    }
    
    // بناء رابط API لتحديث البيانات
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${window.SPREADSHEET_ID}/values/${window.SHEET_NAME}?valueInputOption=RAW&key=${window.API_KEY}`;
    
    // إعداد بيانات الطلب
    const requestData = {
        range: window.SHEET_NAME,
        majorDimension: "ROWS",
        values: values
    };
    
    // إرسال طلب PUT لتحديث البيانات
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`خطأ في الاستجابة: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("تم حفظ البيانات بنجاح في Google Sheets");
    })
    .catch(error => {
        console.error("خطأ في حفظ البيانات في Google Sheets:", error);
    });
}

// دالة لتهيئة الاتصال بـ Google Sheets
function initGoogleSheets() {
    // التحقق من توفر معرف جدول البيانات ومفتاح API
    if (!window.SPREADSHEET_ID || !window.API_KEY) {
        console.warn("تنبيه: لم يتم تكوين معرف جدول البيانات أو مفتاح API");
        return;
    }
    
    // محاولة تحميل البيانات من التخزين المحلي أولاً
    try {
        if (typeof localStorage !== 'undefined') {
            const storedData = localStorage.getItem('productCodes');
            if (storedData) {
                productCodes = JSON.parse(storedData);
                console.log("تم تحميل البيانات من التخزين المحلي");
            }
        }
    } catch (error) {
        console.warn("تعذر تحميل البيانات من التخزين المحلي:", error);
    }
    
    // تحميل البيانات من Google Sheets
    loadFromGoogleSheets();
}

// تشغيل وظيفة التهيئة عند تحميل الصفحة
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', initGoogleSheets);
}
