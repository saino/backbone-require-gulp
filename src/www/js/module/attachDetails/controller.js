// 文件名称: controllers.js
//
// 创 建 人: fishYu
// 创建日期: 2016/8/26
// 描    述: controllers.js
define([
    'module/attachDetails/views/attachDetailsView'
],function(attachDetailsView){
    return {
        attachDetails : function(productId){
            app.page.show(attachDetailsView, {productId: productId});
        }
    };
});