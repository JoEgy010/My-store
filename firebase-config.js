// تكوين Firebase

// تهيئة Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDYrcJmNxJCuYVl0HYm4YTBk5Cwl-E6XPk",
  authDomain: "style-shop-db.firebaseapp.com",
  databaseURL: "https://style-shop-db-default-rtdb.firebaseio.com",
  projectId: "style-shop-db",
  storageBucket: "style-shop-db.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:1234567890abcdef"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// الحصول على مرجع قاعدة البيانات
const database = firebase.database();

// دوال لإدارة المنتجات
const firebaseDB = {
  // حفظ المنتجات في قاعدة البيانات
  saveProducts: function(products) {
    return database.ref('products').set(products);
  },
  
  // الحصول على المنتجات من قاعدة البيانات
  getProducts: function() {
    return database.ref('products').once('value')
      .then(snapshot => snapshot.val() || []);
  },
  
  // الاستماع للتغييرات في المنتجات
  onProductsChange: function(callback) {
    database.ref('products').on('value', snapshot => {
      const data = snapshot.val() || [];
      callback(data);
    });
  },
  
  // حفظ أكواد المنتجات
  saveProductCodes: function(codes) {
    return database.ref('productCodes').set(codes);
  },
  
  // الحصول على أكواد المنتجات
  getProductCodes: function() {
    return database.ref('productCodes').once('value')
      .then(snapshot => snapshot.val() || {});
  },
  
  // الاستماع للتغييرات في أكواد المنتجات
  onProductCodesChange: function(callback) {
    database.ref('productCodes').on('value', snapshot => {
      const data = snapshot.val() || {};
      callback(data);
    });
  }
};