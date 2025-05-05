// ملف إدارة المنتجات المبسطة - simple-admin.js

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إعداد وصول المسؤول
    setupAdminAccess();
    
    // إعداد نموذج إدارة المنتجات
    setupSimpleAdminForm();
});

// إعداد الوصول السريع لإدارة المنتجات
function setupAdminAccess() {
    const copyrightElement = document.getElementById('copyright');
    if (copyrightElement) {
        let clickCount = 0;
        let clickTimer;

        copyrightElement.addEventListener('click', function(e) {
            e.preventDefault();
            clickCount++;
            
            // إعادة ضبط العداد بعد ثانيتين
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 2000);
            
            // إظهار نموذج إدارة المنتجات بعد 5 نقرات متتالية
            if (clickCount >= 5) {
                const password = prompt('الرجاء إدخال كلمة المرور للوصول إلى إدارة المنتجات:');
                if (password === '29/5/2005=Jo-Egypt') {
                    toggleAdminPanel();
                } else if (password !== null) {
                    alert('كلمة المرور غير صحيحة!');
                }
                clickCount = 0;
            }
        });
    }
}

// إظهار/إخفاء لوحة الإدارة المبسطة
function toggleAdminPanel() {
    const adminPanel = document.getElementById('simple-admin-panel');
    if (adminPanel) {
        // تبديل حالة العرض بناءً على الحالة الحالية
        if (adminPanel.style.display === 'block') {
            adminPanel.style.display = 'none';
        } else {
            adminPanel.style.display = 'block';
        }
    } else {
        // إنشاء لوحة الإدارة إذا لم تكن موجودة
        createAdminPanel();
        // التأكد من أن اللوحة مرئية بعد إنشائها
        setTimeout(() => {
            const newPanel = document.getElementById('simple-admin-panel');
            if (newPanel) {
                newPanel.style.display = 'block';
            }
        }, 100);
    }
}

// إنشاء لوحة الإدارة المبسطة
function createAdminPanel() {
    // إنشاء عنصر لوحة الإدارة
    const adminPanel = document.createElement('div');
    adminPanel.id = 'simple-admin-panel';
    adminPanel.className = 'simple-admin-panel';
    
    // إضافة العنوان وزر الإغلاق
    adminPanel.innerHTML = `
        <div class="admin-header">
            <h2>إدارة المنتجات</h2>
            <button id="close-admin-panel" class="close-btn">&times;</button>
        </div>
        <div class="admin-content">
            <div class="admin-actions">
                <button id="add-product-btn" class="admin-btn">إضافة منتج جديد</button>
                <button id="manage-products-btn" class="admin-btn">إدارة المنتجات الحالية</button>
            </div>
            <div id="admin-form-container" style="display: none;">
                <h3 id="form-title">إضافة منتج جديد</h3>
                <form id="simple-product-form">
                    <input type="hidden" id="product-id">
                    
                    <div class="form-group">
                        <label for="title">اسم المنتج:</label>
                        <input type="text" id="title" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="category">الفئة:</label>
                        <select id="category" required>
                            <option value="tshirts">تيشيرتات</option>
                            <option value="pants">بناطيل</option>
                            <option value="shoes">أحذية</option>
                            <option value="accessories">إكسسوارات</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="price">السعر:</label>
                        <input type="number" id="price" step="0.01" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="oldPrice">السعر القديم (اختياري):</label>
                        <input type="number" id="oldPrice" step="0.01">
                    </div>
                    
                    <div class="form-group">
                        <label for="image">رابط الصورة:</label>
                        <input type="text" id="image" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="description">وصف المنتج:</label>
                        <textarea id="description" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="colors">الألوان (مفصولة بفواصل):</label>
                        <input type="text" id="colors" placeholder="أبيض, أسود, أزرق" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="sizes">المقاسات (مفصولة بفواصل):</label>
                        <input type="text" id="sizes" placeholder="S, M, L, XL" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="inStock">متوفر في المخزون:</label>
                        <select id="inStock" required>
                            <option value="true">نعم</option>
                            <option value="false">لا</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="badge">شارة (اختياري):</label>
                        <input type="text" id="badge" placeholder="جديد, خصم, الخ">
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="submit-btn">حفظ المنتج</button>
                        <button type="button" id="cancel-form" class="cancel-btn">إلغاء</button>
                    </div>
                </form>
            </div>
            
            <div id="products-list-container" style="display: none;">
                <h3>قائمة المنتجات</h3>
                <div id="products-list"></div>
            </div>
        </div>
    `;
    
    // إضافة لوحة الإدارة إلى الصفحة
    document.body.appendChild(adminPanel);
    
    // إضافة الأحداث للأزرار
    document.getElementById('close-admin-panel').addEventListener('click', toggleAdminPanel);
    document.getElementById('add-product-btn').addEventListener('click', showAddProductForm);
    document.getElementById('manage-products-btn').addEventListener('click', showProductsList);
    document.getElementById('cancel-form').addEventListener('click', hideProductForm);
    
    // إضافة حدث لنموذج المنتج
    document.getElementById('simple-product-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProduct();
    });
    
    // إضافة الأنماط CSS للوحة الإدارة
    addAdminStyles();
}

// إضافة الأنماط CSS للوحة الإدارة
function addAdminStyles() {
    // لا حاجة لإضافة الأنماط هنا لأننا أضفنا ملف CSS منفصل
    // تم نقل جميع الأنماط إلى ملف simple-admin.css
}

// إظهار نموذج إضافة منتج جديد
function showAddProductForm() {
    document.getElementById('form-title').textContent = 'إضافة منتج جديد';
    document.getElementById('simple-product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('admin-form-container').style.display = 'block';
    document.getElementById('products-list-container').style.display = 'none';
}

// إظهار قائمة المنتجات
function showProductsList() {
    document.getElementById('admin-form-container').style.display = 'none';
    document.getElementById('products-list-container').style.display = 'block';
    displayProductsList();
}

// إخفاء نموذج المنتج
function hideProductForm() {
    document.getElementById('admin-form-container').style.display = 'none';
}

// عرض قائمة المنتجات للإدارة
function displayProductsList() {
    const productsListContainer = document.getElementById('products-list');
    productsListContainer.innerHTML = '';
    
    // تحميل المنتجات من localStorage
    const savedProducts = localStorage.getItem('products');
    let productsList = [];
    
    if (savedProducts) {
        productsList = JSON.parse(savedProducts);
    }
    
    if (productsList.length === 0) {
        productsListContainer.innerHTML = '<p>لا توجد منتجات حالياً</p>';
        return;
    }
    
    // إنشاء عنصر لكل منتج
    productsList.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        
        productItem.innerHTML = `
            <div class="product-info">
                <img src="${product.image}" alt="${product.title}">
                <div>
                    <h4>${product.title}</h4>
                    <p>${product.price} جنيه مصري</p>
                </div>
            </div>
            <div class="product-actions">
                <button class="edit-btn" data-id="${product.id}">تعديل</button>
                <button class="delete-btn" data-id="${product.id}">حذف</button>
            </div>
        `;
        
        productsListContainer.appendChild(productItem);
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

// تحرير منتج
function editProduct(productId) {
    // تحميل المنتجات من localStorage
    const savedProducts = localStorage.getItem('products');
    let productsList = [];
    
    if (savedProducts) {
        productsList = JSON.parse(savedProducts);
    }
    
    const product = productsList.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('form-title').textContent = 'تعديل المنتج';
    document.getElementById('product-id').value = product.id;
    document.getElementById('title').value = product.title;
    document.getElementById('category').value = product.category;
    document.getElementById('price').value = product.price;
    document.getElementById('oldPrice').value = product.oldPrice || '';
    document.getElementById('image').value = product.image;
    document.getElementById('description').value = product.description;
    
    // تحويل مصفوفة الألوان إلى نص مفصول بفواصل
    let colorsText = '';
    if (product.colors && Array.isArray(product.colors)) {
        // التعامل مع الألوان كمصفوفة من الكائنات أو كمصفوفة من النصوص
        colorsText = product.colors.map(color => {
            return typeof color === 'object' ? color.name : color;
        }).join(', ');
    }
    document.getElementById('colors').value = colorsText;
    
    // تحويل مصفوفة المقاسات إلى نص مفصول بفواصل
    document.getElementById('sizes').value = product.sizes.join(', ');
    document.getElementById('inStock').value = product.inStock.toString();
    document.getElementById('badge').value = product.badge || '';
    
    document.getElementById('admin-form-container').style.display = 'block';
    document.getElementById('products-list-container').style.display = 'none';
}

// حذف منتج
function deleteProduct(productId) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    
    // تحميل المنتجات من localStorage
    const savedProducts = localStorage.getItem('products');
    let productsList = [];
    
    if (savedProducts) {
        productsList = JSON.parse(savedProducts);
    }
    
    // حذف المنتج من المصفوفة
    const updatedProducts = productsList.filter(product => product.id !== productId);
    
    // حفظ المصفوفة المحدثة في localStorage
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    // تحديث عرض المنتجات
    displayProductsList();
    
    // إطلاق حدث لإعلام التطبيق بتحديث البيانات
    const event = new CustomEvent('productDataChanged', {
        detail: { source: 'simple-admin', timestamp: new Date().toISOString() }
    });
    document.dispatchEvent(event);
}

// حفظ المنتج
function saveProduct() {
    // الحصول على قيم النموذج
    const productId = document.getElementById('product-id').value;
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const price = parseFloat(document.getElementById('price').value);
    const oldPrice = document.getElementById('oldPrice').value ? parseFloat(document.getElementById('oldPrice').value) : null;
    const image = document.getElementById('image').value;
    const description = document.getElementById('description').value;
    const colorsText = document.getElementById('colors').value;
    const sizesText = document.getElementById('sizes').value;
    const inStock = document.getElementById('inStock').value === 'true';
    const badge = document.getElementById('badge').value || null;
    
    // تحويل نص الألوان إلى مصفوفة
    const colors = colorsText.split(',').map(color => color.trim()).filter(color => color);
    
    // تحويل نص المقاسات إلى مصفوفة
    const sizes = sizesText.split(',').map(size => size.trim()).filter(size => size);
    
    // تحميل المنتجات من localStorage
    const savedProducts = localStorage.getItem('products');
    let productsList = [];
    
    if (savedProducts) {
        productsList = JSON.parse(savedProducts);
    }
    
    // إنشاء كائن المنتج
    const product = {
        title,
        category,
        price,
        oldPrice,
        image,
        description,
        colors,
        sizes,
        inStock,
        badge
    };
    
    // تحديث منتج موجود أو إضافة منتج جديد
    if (productId) {
        // تحديث منتج موجود
        product.id = parseInt(productId);
        const index = productsList.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            productsList[index] = product;
        }
    } else {
        // إضافة منتج جديد
        product.id = generateProductId(productsList);
        productsList.push(product);
    }
    
    // حفظ المصفوفة المحدثة في localStorage
    localStorage.setItem('products', JSON.stringify(productsList));
    
    // إخفاء النموذج وعرض قائمة المنتجات
    hideProductForm();
    showProductsList();
    
    // إطلاق حدث لإعلام التطبيق بتحديث البيانات
    const event = new CustomEvent('productDataChanged', {
        detail: { source: 'simple-admin', timestamp: new Date().toISOString() }
    });
    document.dispatchEvent(event);
    
    alert('تم حفظ المنتج بنجاح!');
}

// توليد معرف فريد للمنتج الجديد
function generateProductId(productsList) {
    if (productsList.length === 0) return 1;
    
    // الحصول على أعلى معرف موجود وإضافة 1
    const maxId = Math.max(...productsList.map(product => product.id));
    return maxId + 1;
}

// إعداد نموذج إدارة المنتجات
function setupSimpleAdminForm() {
    // لا شيء إضافي للإعداد في هذه المرحلة
    // تم إعداد كل شيء في دالة createAdminPanel
}