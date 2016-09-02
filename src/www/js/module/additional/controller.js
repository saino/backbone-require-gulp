// 文件名称: controllers.js
//
// 创 建 人: guyy
// 创建日期: 2016/8/22
// 描    述: controllers.js
define([
    'module/additional/views/additionalView'
],function(AdditionalView){
    return {
        additional : function(id, param){
            var opt = {};
            opt.planId = id;
            opt.list = JSON.stringify(utils.myDecodeURIComponent(param));
            app.page.show(AdditionalView, opt);
        }
    };
});