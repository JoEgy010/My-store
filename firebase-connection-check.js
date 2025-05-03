// ملف للتحقق من حالة الاتصال بـ Firebase

// دالة للتحقق من حالة الاتصال بـ Firebase
function checkFirebaseConnection() {
    // التحقق من وجود Firebase
    if (typeof firebase === 'undefined' || typeof firebaseDB === 'undefined') {
        console.error('Firebase غير متاح. تأكد من تضمين مكتبة Firebase وملف التكوين.');
        return false;
    }

    // التحقق من حالة الاتصال بالإنترنت
    if (!navigator.onLine) {
        console.warn('غير متصل بالإنترنت. لن تتم مزامنة البيانات مع Firebase.');
        return false;
    }

    // التحقق من حالة الاتصال بـ Firebase
    const connectedRef = firebase.database().ref('.info/connected');
    connectedRef.on('value', (snap) => {
        if (snap.val() === true) {
            console.log('متصل بـ Firebase');
            // إرسال إشعار للمستخدم
            showConnectionStatus('connected');
            return true;
        } else {
            console.warn('غير متصل بـ Firebase');
            // إرسال إشعار للمستخدم
            showConnectionStatus('disconnected');
            return false;
        }
    });
}

// دالة لإظهار حالة الاتصال للمستخدم
function showConnectionStatus(status) {
    // البحث عن عنصر حالة الاتصال أو إنشاؤه إذا لم يكن موجودًا
    let statusElement = document.getElementById('firebase-connection-status');
    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.id = 'firebase-connection-status';
        statusElement.style.position = 'fixed';
        statusElement.style.top = '10px';
        statusElement.style.right = '10px';
        statusElement.style.padding = '5px 10px';
        statusElement.style.borderRadius = '5px';
        statusElement.style.fontSize = '12px';
        statusElement.style.zIndex = '9999';
        document.body.appendChild(statusElement);
    }

    // تحديث حالة الاتصال
    if (status === 'connected') {
        statusElement.style.backgroundColor = '#4CAF50';
        statusElement.style.color = 'white';
        statusElement.textContent = 'متصل بـ Firebase';
        // إخفاء الرسالة بعد 3 ثوانٍ
        setTimeout(() => { statusElement.style.display = 'none'; }, 3000);
    } else {
        statusElement.style.backgroundColor = '#F44336';
        statusElement.style.color = 'white';
        statusElement.textContent = 'غير متصل بـ Firebase';
        statusElement.style.display = 'block';
    }
}

// دالة لإعادة محاولة الاتصال بـ Firebase
function retryFirebaseConnection() {
    // التحقق من وجود Firebase
    if (typeof firebase === 'undefined' || typeof firebaseDB === 'undefined') {
        console.error('Firebase غير متاح. تأكد من تضمين مكتبة Firebase وملف التكوين.');
        return false;
    }

    // التحقق من حالة الاتصال بالإنترنت
    if (!navigator.onLine) {
        console.warn('غير متصل بالإنترنت. لن تتم مزامنة البيانات مع Firebase.');
        return false;
    }

    // إعادة تهيئة Firebase
    try {
        // إعادة الاتصال بقاعدة البيانات
        firebase.database().goOnline();
        console.log('تمت إعادة الاتصال بـ Firebase');
        return true;
    } catch (error) {
        console.error('خطأ في إعادة الاتصال بـ Firebase:', error);
        return false;
    }
}

// الاستماع لأحداث الاتصال بالإنترنت
window.addEventListener('online', () => {
    console.log('متصل بالإنترنت');
    // إعادة محاولة الاتصال بـ Firebase
    retryFirebaseConnection();
});

window.addEventListener('offline', () => {
    console.log('غير متصل بالإنترنت');
    showConnectionStatus('disconnected');
});

// التحقق من حالة الاتصال عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // التحقق من حالة الاتصال بـ Firebase
    checkFirebaseConnection();
});