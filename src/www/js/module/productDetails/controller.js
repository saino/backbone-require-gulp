// 文件名称: controllers.js
//
// 创 建 人: guyy
// 创建日期: 2016/8/22
// 描    述: controllers.js
define([
    'module/productDetails/views/productDetailsView'
],function(productDetailsView){
    return {
        productDetails : function(productId){
            app.page.show(productDetailsView, {productId: productId});
        }
    };
});