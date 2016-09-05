// 文件名称: controllers.js
//
// 创 建 人: fishYu
// 创建日期: 2016/9/2
// 描    述: controllers.js
define([
    'module/personalCustomer/views/personalCustomerView'
],function(personalCustomerView){
    return {
        personalCustomer : function(){
            app.page.show(personalCustomerView);
        }
    };
});