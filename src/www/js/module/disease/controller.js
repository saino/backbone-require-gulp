// 文件名称: controllers.js
//
// 创 建 人: guyy
// 创建日期: 2016/8/22
// 描    述: controllers.js
define([
    'module/disease/views/diseaseView'
],function(DiseaseView){
    return {
        disease : function(){
            app.page.show(DiseaseView);
        }
    };
});