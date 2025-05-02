// دالة لإرسال تفاصيل الطلب إلى بوت تليجرام
function sendOrderToTelegram(orderData) {
    // معلومات بوت تليجرام
    const telegramToken = '7664660691:AAELGdXk_Aky8_lWckjiQgQ1x0Di17QUFLI';
    const chatId = '1448102314';
    const apiUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
    
    // تنسيق تفاصيل المنتجات
    let itemsDetails = '';
    orderData.items.forEach((item, index) => {
        // الحصول على الكود الفريد للمنتج
        const productCode = getProductCode(item.id);
        
        itemsDetails += `\n🛒 المنتج ${index + 1}:\n`;
        itemsDetails += `📦 الاسم: ${item.title}\n`;
        itemsDetails += `🔢 الكمية: ${item.quantity}\n`;
        itemsDetails += `🎨 اللون: ${item.color}\n`;
        itemsDetails += `📏 المقاس: ${item.size}\n`;
        itemsDetails += `💰 السعر: ${item.price} جنيه مصري\n`;
        itemsDetails += `💵 المجموع: ${(item.price * item.quantity).toFixed(2)} جنيه مصري\n`;
        itemsDetails += `🔐 كود المنتج: ${productCode}\n`;
    });
    
    // تنسيق الرسالة الكاملة
    const message = `🔔 *طلب جديد*\n\n` +
        `👤 *معلومات العميل*:\n` +
        `الاسم: ${orderData.fullname}\n` +
        `رقم الهاتف الأساسي: ${orderData.phone1}\n` +
        `رقم الهاتف البديل: ${orderData.phone2 || 'غير متوفر'}\n\n` +
        `📍 *عنوان التوصيل*:\n` +
        `المحافظة: ${orderData.governorate}\n` +
        `المدينة: ${orderData.city}\n` +
        `العنوان: ${orderData.address}\n` +
        `رقم المنزل: ${orderData.house_number}\n` +
        `رقم الشقة: ${orderData.apartment_number}\n\n` +
        `📝 *ملاحظات*: ${orderData.notes || 'لا توجد ملاحظات'}\n\n` +
        `🛍️ *تفاصيل المنتجات*:${itemsDetails}\n` +
        `💰 *المجموع الكلي*: ${orderData.total.toFixed(2)} جنيه مصري`;
    
    // إعداد بيانات الطلب
    const requestData = {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
    };
    
    // إرسال الطلب إلى API تليجرام
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            console.error('فشل في إرسال الرسالة إلى تليجرام');
        }
        return response.json();
    })
    .then(data => {
        console.log('تم إرسال تفاصيل الطلب إلى تليجرام بنجاح');
    })
    .catch(error => {
        console.error('حدث خطأ أثناء إرسال الرسالة إلى تليجرام:', error);
    });
}