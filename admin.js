// ملف إدارة المتجر - admin.js

// متغيرات عامة
let editingProductId = null;
let editingCodeId = null;

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تحميل المنتجات من localStorage إذا كانت موجودة
    loadProductsFromLocalStorage();
    
    // إعداد علامات التبويب
    setupTabs();
    
    // عرض المنتجات وأكواد المنتجات
    displayProducts();
    displayProductCodes();
    
    // إعداد أحداث النماذج
    setupFormEvents();

    // الوصول السريع للوحة الإدارة من الصفحة الرئيسية
    setupAdminAccess();
});

// حفظ المنتجات في localStorage
function saveProductsToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

// تحميل المنتجات من localStorage
function loadProductsFromLocalStorage() {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        // تحديث مصفوفة المنتجات العالمية بالبيانات المحفوظة
        const parsedProducts = JSON.parse(savedProducts);
        // استبدال المنتجات الموجودة بالمنتجات المحفوظة
        products.length = 0; // تفريغ المصفوفة
        parsedProducts.forEach(product => products.push(product));
    }
}

// إعداد الوصول السريع للوحة الإدارة
function setupAdminAccess() {
    const logoElement = document.querySelector('.logo h1');
    const copyrightElement = document.getElementById('copyright');
    let clickCount = 0;
    let clickTimer;

    // الوصول عن طريق الشعار (الطريقة القديمة)
    if (logoElement) {
        logoElement.addEventListener('click', function(e) {
            e.preventDefault();
            clickCount++;
            
            // إعادة ضبط العداد بعد ثانيتين
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 2000);
            
            // الانتقال إلى لوحة الإدارة بعد 5 نقرات متتالية
            if (clickCount >= 5) {
                window.location.href = 'admin.html';
                clickCount = 0;
            }
        });
    }

    // الوصول عن طريق حقوق النشر (الطريقة الجديدة)
    if (copyrightElement) {
        let copyrightClickCount = 0;
        let copyrightClickTimer;

        copyrightElement.addEventListener('click', function(e) {
            e.preventDefault();
            copyrightClickCount++;
            
            // إعادة ضبط العداد بعد ثانيتين
            clearTimeout(copyrightClickTimer);
            copyrightClickTimer = setTimeout(() => {
                copyrightClickCount = 0;
            }, 2000);
            
            // طلب كلمة المرور بعد 5 نقرات متتالية
            if (copyrightClickCount >= 5) {
                const password = prompt('الرجاء إدخال كلمة المرور للوصول إلى لوحة الإدارة:');
                if (password === '0') {
                    window.location.href = 'admin.html';
                } else if (password !== null) {
                    alert('كلمة المرور غير صحيحة!');
                }
                copyrightClickCount = 0;
            }
        });
    }
}

// إعداد علامات التبويب
function setupTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // إزالة الفئة النشطة من جميع علامات التبويب
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // إضافة الفئة النشطة للعلامة المحددة
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// عرض المنتجات في الجدول
function displayProducts() {
    const tableBody = document.getElementById('products-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.image}" alt="${product.title}" width="50"></td>
            <td>${product.title}</td>
            <td>${getCategoryName(product.category)}</td>
            <td>${product.price} جنيه مصري</td>
            <td>${product.inStock ? 'نعم' : 'لا'}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${product.id}">تعديل</button>
                <button class="action-btn delete-btn" data-id="${product.id}">حذف</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // إضافة أحداث للأزرار
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            editProduct(productId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            deleteProduct(productId);
        });
    });
}

// عرض أكواد المنتجات في الجدول
function displayProductCodes() {
    const tableBody = document.getElementById('codes-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // تحويل كائن productCodes إلى مصفوفة للعرض
    Object.entries(productCodes).forEach(([id, code]) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${id}</td>
            <td>${code}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${id}">تعديل</button>
                <button class="action-btn delete-btn" data-id="${id}">حذف</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // إضافة أحداث للأزرار
    document.querySelectorAll('#codes-table-body .edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const codeId = this.getAttribute('data-id');
            editProductCode(codeId);
        });
    });
    
    document.querySelectorAll('#codes-table-body .delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const codeId = this.getAttribute('data-id');
            deleteProductCode(codeId);
        });
    });
}

// إعداد أحداث النماذج
function setupFormEvents() {
    // إضافة مستمع أحداث لتغييرات الألوان
    const colorsContainer = document.getElementById('colors-container');
    if (colorsContainer) {
        const observer = new MutationObserver(function(mutations) {
            updateColorImagesContainer();
        });
        
        observer.observe(colorsContainer, { childList: true });
    }
    
    // زر إضافة منتج جديد
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            showProductForm();
        });
    }
    
    // زر إلغاء نموذج المنتج
    const cancelFormBtn = document.getElementById('cancel-form');
    if (cancelFormBtn) {
        cancelFormBtn.addEventListener('click', function() {
            hideProductForm();
        });
    }
    
    // إضافة لون جديد
    const addColorBtn = document.getElementById('add-color');
    if (addColorBtn) {
        addColorBtn.addEventListener('click', function() {
            addColor();
        });
    }
    
    // إضافة مقاس جديد
    const addSizeBtn = document.getElementById('add-size');
    if (addSizeBtn) {
        addSizeBtn.addEventListener('click', function() {
            addSize();
        });
    }
    
    // تقديم نموذج المنتج
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProduct();
        });
    }
    
    // زر إضافة كود جديد
    const addCodeBtn = document.getElementById('add-code-btn');
    if (addCodeBtn) {
        addCodeBtn.addEventListener('click', function() {
            showCodeForm();
        });
    }
    
    // زر إلغاء نموذج الكود
    const cancelCodeFormBtn = document.getElementById('cancel-code-form');
    if (cancelCodeFormBtn) {
        cancelCodeFormBtn.addEventListener('click', function() {
            hideCodeForm();
        });
    }
    
    // تقديم نموذج الكود
    const codeForm = document.getElementById('code-form');
    if (codeForm) {
        codeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProductCode();
        });
    }
}

// إظهار نموذج المنتج
function showProductForm() {
    document.getElementById('form-title').textContent = 'إضافة منتج جديد';
    document.getElementById('product-form-container').style.display = 'block';
    document.getElementById('product-form').reset();
    document.getElementById('colors-container').innerHTML = '';
    document.getElementById('sizes-container').innerHTML = '';
    editingProductId = null;
}

// إخفاء نموذج المنتج
function hideProductForm() {
    document.getElementById('product-form-container').style.display = 'none';
    editingProductId = null;
}

// إظهار نموذج الكود
function showCodeForm() {
    document.getElementById('code-form-title').textContent = 'إضافة كود منتج جديد';
    document.getElementById('code-form-container').style.display = 'block';
    document.getElementById('code-form').reset();
    editingCodeId = null;
}

// إخفاء نموذج الكود
function hideCodeForm() {
    document.getElementById('code-form-container').style.display = 'none';
    editingCodeId = null;
}

// إضافة لون جديد
function addColor() {
    const colorInput = document.getElementById('new-color');
    const color = colorInput.value.trim();
    
    if (color) {
        const colorsContainer = document.getElementById('colors-container');
        const colorItem = document.createElement('div');
        colorItem.className = 'color-item';
        colorItem.innerHTML = `
            <span>${color}</span>
            <span class="remove-item">×</span>
        `;
        
        colorsContainer.appendChild(colorItem);
        colorInput.value = '';
        
        // إضافة حدث لإزالة اللون
        colorItem.querySelector('.remove-item').addEventListener('click', function() {
            // إزالة اللون من حاوية الألوان
            colorItem.remove();
            
            // إزالة صورة اللون من حاوية صور الألوان
            updateColorImagesContainer();
        });
        
        // تحديث حاوية صور الألوان
        updateColorImagesContainer();
    }
}

// إضافة مقاس جديد
function addSize() {
    const sizeInput = document.getElementById('new-size');
    const size = sizeInput.value.trim();
    
    if (size) {
        const sizesContainer = document.getElementById('sizes-container');
        const sizeItem = document.createElement('div');
        sizeItem.className = 'size-item';
        sizeItem.innerHTML = `
            <span>${size}</span>
            <span class="remove-item">×</span>
        `;
        
        sizesContainer.appendChild(sizeItem);
        sizeInput.value = '';
        
        // إضافة حدث لإزالة المقاس
        sizeItem.querySelector('.remove-item').addEventListener('click', function() {
            sizeItem.remove();
        });
    }
}

// تحرير منتج
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    editingProductId = productId;
    document.getElementById('form-title').textContent = 'تعديل المنتج';
    document.getElementById('product-id').value = product.id;
    document.getElementById('title').value = product.title;
    document.getElementById('category').value = product.category;
    document.getElementById('price').value = product.price;
    document.getElementById('oldPrice').value = product.oldPrice || '';
    document.getElementById('image').value = product.image;
    document.getElementById('description').value = product.description;
    document.getElementById('badge').value = product.badge || '';
    document.getElementById('inStock').value = product.inStock.toString();
    
    // إضافة الألوان
    const colorsContainer = document.getElementById('colors-container');
    colorsContainer.innerHTML = '';
    product.colors.forEach(color => {
        const colorItem = document.createElement('div');
        colorItem.className = 'color-item';
        colorItem.innerHTML = `
            <span>${color}</span>
            <span class="remove-item">×</span>
        `;
        
        colorsContainer.appendChild(colorItem);
        
        // إضافة حدث لإزالة اللون
        colorItem.querySelector('.remove-item').addEventListener('click', function() {
            colorItem.remove();
            updateColorImagesContainer();
        });
    });
    
    // تحديث حاوية صور الألوان
    updateColorImagesContainer(product.colorImages);
    
    // إضافة المقاسات
    const sizesContainer = document.getElementById('sizes-container');
    sizesContainer.innerHTML = '';
    product.sizes.forEach(size => {
        const sizeItem = document.createElement('div');
        sizeItem.className = 'size-item';
        sizeItem.innerHTML = `
            <span>${size}</span>
            <span class="remove-item">×</span>
        `;
        
        sizesContainer.appendChild(sizeItem);
        
        // إضافة حدث لإزالة المقاس
        sizeItem.querySelector('.remove-item').addEventListener('click', function() {
            sizeItem.remove();
        });
    });
    
    // إضافة عرض مرئي للألوان
    const colorPreviewContainer = document.getElementById('color-preview-container') || createColorPreviewContainer();
    colorPreviewContainer.innerHTML = '';
    
    // إنشاء عناصر الألوان المرئية
    product.colors.forEach((color, index) => {
        const colorElement = document.createElement('div');
        colorElement.className = 'color-option admin-color';
        colorElement.setAttribute('data-color', color);
        colorElement.setAttribute('title', color);
        
        const colorName = document.createElement('span');
        colorName.className = 'color-name';
        colorName.textContent = color;
        
        colorElement.appendChild(colorName);
        colorPreviewContainer.appendChild(colorElement);
    });
    
    document.getElementById('product-form-container').style.display = 'block';
}

// إنشاء حاوية معاينة الألوان
function createColorPreviewContainer() {
    const colorsField = document.getElementById('edit-product-colors');
    const container = document.createElement('div');
    container.id = 'color-preview-container';
    container.className = 'color-options-container';
    
    // إضافة عنوان
    const title = document.createElement('p');
    title.innerHTML = '<strong>معاينة الألوان:</strong>';
    title.style.marginTop = '10px';
    
    // إدراج العناصر في الصفحة
    colorsField.parentNode.insertBefore(title, colorsField.nextSibling);
    colorsField.parentNode.insertBefore(container, title.nextSibling);
    
    // إضافة مستمع أحداث لحقل الألوان لتحديث المعاينة
    colorsField.addEventListener('input', updateColorPreview);
    
    return container;
}

// تحديث معاينة الألوان
function updateColorPreview() {
    const colorsField = document.getElementById('edit-product-colors');
    const colorPreviewContainer = document.getElementById('color-preview-container');
    
    if (!colorPreviewContainer) return;
    
    // تقسيم النص إلى مصفوفة ألوان
    const colors = colorsField.value.split(',').map(color => color.trim()).filter(color => color);
    
    // تحديث حاوية الألوان
    colorPreviewContainer.innerHTML = '';
    
    colors.forEach(color => {
        const colorElement = document.createElement('div');
        colorElement.className = 'color-option admin-color';
        colorElement.setAttribute('data-color', color);
        colorElement.setAttribute('title', color);
        
        const colorName = document.createElement('span');
        colorName.className = 'color-name';
        colorName.textContent = color;
        
        colorElement.appendChild(colorName);
        colorPreviewContainer.appendChild(colorElement);
    });
}

// تحديث حاوية صور الألوان
function updateColorImagesContainer(existingColorImages = {}) {
    const colorImagesContainer = document.getElementById('color-images-container');
    if (!colorImagesContainer) return;
    
    // الحصول على قائمة الألوان الحالية
    const colors = [];
    document.querySelectorAll('#colors-container .color-item span:first-child').forEach(span => {
        colors.push(span.textContent);
    });
    
    // إعادة تعيين المحتوى
    colorImagesContainer.innerHTML = '';
    
    if (colors.length === 0) {
        colorImagesContainer.innerHTML = '<p class="color-image-note">أضف الألوان أولاً ثم أضف صورة لكل لون</p>';
        return;
    }
    
    // إنشاء حقل إدخال لكل لون
    colors.forEach(color => {
        const colorImageItem = document.createElement('div');
        colorImageItem.className = 'color-image-item';
        colorImageItem.setAttribute('data-color', color);
        
        // الحصول على رابط الصورة الحالي إذا كان موجودًا
        const imageUrl = existingColorImages && existingColorImages[color] ? existingColorImages[color] : '';
        
        // إنشاء عناصر واجهة المستخدم
        const imagePreview = document.createElement('img');
        imagePreview.className = 'color-image-preview';
        imagePreview.src = imageUrl || 'https://via.placeholder.com/50?text=صورة';
        imagePreview.alt = `صورة ${color}`;
        
        const colorLabel = document.createElement('span');
        colorLabel.className = 'color-name-label';
        colorLabel.textContent = color;
        
        const imageInput = document.createElement('input');
        imageInput.type = 'text';
        imageInput.className = 'color-image-input';
        imageInput.placeholder = 'أدخل رابط صورة اللون';
        imageInput.value = imageUrl;
        
        // تحديث معاينة الصورة عند تغيير الرابط
        imageInput.addEventListener('input', function() {
            const newUrl = this.value.trim();
            if (newUrl) {
                imagePreview.src = newUrl;
            } else {
                imagePreview.src = 'https://via.placeholder.com/50?text=صورة';
            }
        });
        
        // إضافة العناصر إلى العنصر الرئيسي
        colorImageItem.appendChild(imagePreview);
        colorImageItem.appendChild(colorLabel);
        colorImageItem.appendChild(imageInput);
        
        // إضافة العنصر إلى الحاوية
        colorImagesContainer.appendChild(colorImageItem);
    });
}

// حذف منتج
function deleteProduct(productId) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products.splice(index, 1);
            // حفظ التغييرات في localStorage
            saveProductsToLocalStorage();
            displayProducts();
            showNotification('تم حذف المنتج بنجاح', 'success');
        }
    }
}

// حفظ المنتج
function saveProduct() {
    // التحقق من صحة المدخلات
    const title = document.getElementById('title').value.trim();
    const category = document.getElementById('category').value;
    const priceInput = document.getElementById('price').value;
    const oldPriceInput = document.getElementById('oldPrice').value;
    const image = document.getElementById('image').value.trim();
    const description = document.getElementById('description').value.trim();
    const badge = document.getElementById('badge').value.trim() || null;
    const inStock = document.getElementById('inStock').value === 'true';
    
    // التحقق من الحقول المطلوبة
    if (!title) {
        showNotification('يرجى إدخال عنوان المنتج', 'error');
        return;
    }
    
    if (!category) {
        showNotification('يرجى اختيار فئة المنتج', 'error');
        return;
    }
    
    if (!priceInput || isNaN(parseFloat(priceInput)) || parseFloat(priceInput) <= 0) {
        showNotification('يرجى إدخال سعر صحيح للمنتج', 'error');
        return;
    }
    
    if (oldPriceInput && (isNaN(parseFloat(oldPriceInput)) || parseFloat(oldPriceInput) <= 0)) {
        showNotification('يرجى إدخال سعر قديم صحيح للمنتج', 'error');
        return;
    }
    
    if (!image) {
        showNotification('يرجى إدخال رابط صورة المنتج', 'error');
        return;
    }
    
    if (!description) {
        showNotification('يرجى إدخال وصف المنتج', 'error');
        return;
    }
    
    // تحويل القيم إلى الأنواع المناسبة
    const price = parseFloat(priceInput);
    const oldPrice = oldPriceInput ? parseFloat(oldPriceInput) : null;
    
    // جمع الألوان
    const colors = [];
    document.querySelectorAll('#colors-container .color-item span:first-child').forEach(span => {
        colors.push(span.textContent);
    });
    
    // التحقق من وجود لون واحد على الأقل
    if (colors.length === 0) {
        showNotification('يرجى إضافة لون واحد على الأقل', 'error');
        return;
    }
    
    // جمع المقاسات
    const sizes = [];
    document.querySelectorAll('#sizes-container .size-item span:first-child').forEach(span => {
        sizes.push(span.textContent);
    });
    
    // التحقق من وجود مقاس واحد على الأقل
    if (sizes.length === 0) {
        showNotification('يرجى إضافة مقاس واحد على الأقل', 'error');
        return;
    }
    
    // جمع صور الألوان
    const colorImages = {};
    document.querySelectorAll('.color-image-item').forEach(item => {
        const colorName = item.getAttribute('data-color');
        const imageUrl = item.querySelector('.color-image-input').value.trim();
        if (imageUrl) {
            colorImages[colorName] = imageUrl;
        }
    });
    
    if (editingProductId) {
        // تحديث منتج موجود
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            products[index] = {
                id: editingProductId,
                title,
                category,
                price,
                oldPrice,
                image,
                description,
                colors,
                sizes,
                inStock,
                badge,
                colorImages // إضافة صور الألوان
            };
            showNotification('تم تحديث المنتج بنجاح', 'success');
        }
    } else {
        // إضافة منتج جديد
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({
            id: newId,
            title,
            category,
            price,
            oldPrice,
            image,
            description,
            colors,
            sizes,
            inStock,
            badge,
            colorImages // إضافة صور الألوان
        });
        showNotification('تم إضافة المنتج بنجاح', 'success');
    }
    
    // حفظ التغييرات في localStorage
    saveProductsToLocalStorage();
    
    hideProductForm();
    displayProducts();
}

// تحرير كود منتج
function editProductCode(codeId) {
    const code = productCodes[codeId];
    if (!code) return;
    
    editingCodeId = codeId;
    document.getElementById('code-form-title').textContent = 'تعديل كود المنتج';
    document.getElementById('product-code-id').value = codeId;
    document.getElementById('product-code').value = code;
    
    document.getElementById('code-form-container').style.display = 'block';
}

// حذف كود منتج
function deleteProductCode(codeId) {
    if (confirm('هل أنت متأكد من حذف هذا الكود؟')) {
        if (productCodes.hasOwnProperty(codeId)) {
            delete productCodes[codeId];
            displayProductCodes();
            showNotification('تم حذف كود المنتج بنجاح', 'success');
        }
    }
}

// حفظ كود المنتج
function saveProductCode() {
    const codeId = document.getElementById('product-code-id').value;
    const code = document.getElementById('product-code').value;
    
    productCodes[codeId] = code;
    
    hideCodeForm();
    displayProductCodes();
    showNotification('تم حفظ كود المنتج بنجاح', 'success');
}

// عرض إشعار
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    // إزالة الإشعار بعد 3 ثواني
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
    
    // التمرير إلى أعلى الصفحة لضمان رؤية الإشعار
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// الحصول على اسم الفئة
function getCategoryName(category) {
    const categories = {
        'tshirts': 'تيشيرتات',
        'pants': 'بناطيل',
        'shoes': 'أحذية',
        'accessories': 'إكسسوارات'
    };
    
    return categories[category] || category;
}
