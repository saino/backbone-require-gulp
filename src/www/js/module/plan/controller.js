// 文件名称: controllers.js
//
// 创 建 人: guyy
// 创建日期: 2016/8/10 15:08
// 描    述: controllers.js
define([
    'module/plan/views/planView'
],function(PlanView){
    return {
        plan : function(id){
            var opt = {};
            opt.planId = id;
            app.page.show(PlanView, opt);
        }
    };
});