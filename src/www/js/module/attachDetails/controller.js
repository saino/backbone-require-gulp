// 文件名称: controllers.js
//
// 创 建 人: fishYu
// 创建日期: 2016/8/26
// 描    述: controllers.js
define([
    'module/attachDetails/views/attachDetailsView'
],function(attachDetailsView){
    return {
        attachDetails : function(packageId, productId, salesProductId){
            app.page.show(attachDetailsView, {packageId:packageId, productId: productId, salesProductId:salesProductId});
        }
    };
});