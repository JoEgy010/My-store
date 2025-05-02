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

// دالة للحصول على كود المنتج بناءً على معرف المنتج
function getProductCode(productId) {
    return productCodes[productId] || `UNKNOWN-${productId}`;
}

// دالة لإضافة أو تحديث كود منتج
function updateProductCode(productId, code) {
    productCodes[productId] = code;
    return true;
}

// دالة لحذف كود منتج
function deleteProductCode(productId) {
    if (productCodes.hasOwnProperty(productId)) {
        delete productCodes[productId];
        return true;
    }
    return false;
}