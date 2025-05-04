// ملف JavaScript للتحكم في واجهة إدارة SheetBest

document.addEventListener('DOMContentLoaded', function() {
    // عناصر واجهة المستخدم
    const syncDataButton = document.getElementById('syncData');
    const viewDataButton = document.getElementById('viewData');
    const statusDiv = document.getElementById('status');
    const productTableBody = document.getElementById('productTableBody');
    const productIdInput = document.getElementById('productId');
    const productCodeInput = document.getElementById('productCode');
    const addProductButton = document.getElementById('addProduct');
    const apiUrlDisplay = document.getElementById('apiUrlDisplay');
    
    // عرض رابط SheetBest API
    if (window.SHEETBEST_API_URL) {
        apiUrlDisplay.textContent = window.SHEETBEST_API_URL;
    } else {
        apiUrlDisplay.textContent = 'غير متوفر';
    }
    
    // إضافة مستمعي الأحداث للأزرار
    syncDataButton.addEventListener('click', syncData);
    viewDataButton.addEventListener('click', displayProductData);
    addProductButton.addEventListener('click', addOrUpdateProduct);
    
    // مستمع حدث لتحديث واجهة المستخدم عند تحديث البيانات
    document.addEventListener('productCodesUpdated', displayProductData);
    
    // عرض البيانات الحالية عند تحميل الصفحة
    displayProductData();
    
    // دالة لمزامنة البيانات مع SheetBest
    function syncData() {
        // التحقق من توفر رابط SheetBest API
        if (!window.SHEETBEST_API_URL) {
            showStatus('خطأ: رابط SheetBest API غير متوفر', 'error');
            return;
        }
        
        showStatus('جاري مزامنة البيانات...', '');
        
        // استدعاء دالة تحميل البيانات من SheetBest
        if (typeof loadFromSheetBest === 'function') {
            loadFromSheetBest();
            showStatus('تم بدء عملية المزامنة', 'success');
        } else {
            showStatus('خطأ: دالة loadFromSheetBest غير متوفرة', 'error');
        }
    }
    
    // دالة لعرض بيانات المنتجات في الجدول
    function displayProductData() {
        // مسح محتوى الجدول
        productTableBody.innerHTML = '';
        
        // التحقق من وجود بيانات
        if (typeof productCodes !== 'object' || Object.keys(productCodes).length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="3">لا توجد بيانات متاحة</td>';
            productTableBody.appendChild(row);
            return;
        }
        
        // إضافة صفوف للجدول لكل منتج
        for (const productId in productCodes) {
            if (productCodes.hasOwnProperty(productId)) {
                const productCode = productCodes[productId];
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${productId}</td>
                    <td>${productCode}</td>
                    <td>
                        <button onclick="editProduct('${productId}', '${productCode}')">تعديل</button>
                        <button onclick="deleteProduct('${productId}')">حذف</button>
                    </td>
                `;
                
                productTableBody.appendChild(row);
            }
        }
    }
    
    // دالة لإضافة أو تحديث منتج
    function addOrUpdateProduct() {
        const productId = productIdInput.value.trim();
        const productCode = productCodeInput.value.trim();
        
        // التحقق من صحة المدخلات
        if (!productId) {
            showStatus('يرجى إدخال معرف المنتج', 'error');
            return;
        }
        
        if (!productCode) {
            showStatus('يرجى إدخال رمز المنتج', 'error');
            return;
        }
        
        // استدعاء دالة تحديث رمز المنتج
        if (typeof updateProductCode === 'function') {
            const result = updateProductCode(productId, productCode);
            
            if (result) {
                showStatus(`تم ${productCodes.hasOwnProperty(productId) ? 'تحديث' : 'إضافة'} المنتج بنجاح`, 'success');
                
                // مسح حقول الإدخال
                productIdInput.value = '';
                productCodeInput.value = '';
                
                // تحديث عرض البيانات
                displayProductData();
                
                // إطلاق حدث لتحديث المتجر
                const updateEvent = new CustomEvent('productDataChanged', {
                    detail: { productId, productCode }
                });
                document.dispatchEvent(updateEvent);
            } else {
                showStatus('فشل في تحديث المنتج. تأكد من صحة تنسيق رمز المنتج', 'error');
            }
        } else {
            showStatus('خطأ: دالة updateProductCode غير متوفرة', 'error');
        }
    }
    
    // دالة لعرض رسائل الحالة
    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = 'status';
        
        if (type === 'success') {
            statusDiv.classList.add('success');
        } else if (type === 'error') {
            statusDiv.classList.add('error');
        }
        
        statusDiv.style.display = 'block';
        
        // إخفاء الرسالة بعد 5 ثوانٍ إذا كانت رسالة نجاح
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        }
    }
});

// دالة لتعديل منتج (تستدعى من زر التعديل في الجدول)
function editProduct(productId, productCode) {
    document.getElementById('productId').value = productId;
    document.getElementById('productCode').value = productCode;
}

// دالة لحذف منتج (تستدعى من زر الحذف في الجدول)
function deleteProduct(productId) {
    if (confirm(`هل أنت متأكد من رغبتك في حذف المنتج رقم ${productId}؟`)) {
        if (typeof deleteProductCode === 'function') {
            const result = deleteProductCode(productId);
            
            if (result) {
                // عرض رسالة نجاح
                const statusDiv = document.getElementById('status');
                statusDiv.textContent = 'تم حذف المنتج بنجاح';
                statusDiv.className = 'status success';
                statusDiv.style.display = 'block';
                
                // إخفاء الرسالة بعد 5 ثوانٍ
                setTimeout(() => {
                    statusDiv.style.display = 'none';
                }, 5000);
                
                // تحديث عرض البيانات
                document.dispatchEvent(new Event('productCodesUpdated'));
                
                // إطلاق حدث لتحديث المتجر
                const updateEvent = new CustomEvent('productDataChanged', {
                    detail: { productId, action: 'delete' }
                });
                document.dispatchEvent(updateEvent);
            }
        }
    }
}