// 文件名称: controllers.js
//
// 创 建 人: guyy
// 创建日期: 2016/8/10 15:00
// 描    述: controllers.js
define([
    'module/insurance/views/insuranceListView'
],function(InsuranceListView){
    return {
        insurance : function(){
            app.page.show(InsuranceListView);
        }
    };
});