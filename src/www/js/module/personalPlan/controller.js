// 文件名称: controllers.js
//
// 创 建 人: fishYu
// 创建日期: 2016/9/2
// 描    述: controllers.js
define([
    'module/personalPlan/views/personalPlanView'
],function(personalPlanView){
    return {
        personalPlan : function(){
            app.page.show(personalPlanView);
        }
    };
});