// 文件名称: controllers.js
//
// 创 建 人: fishYu
// 创建日期: 2016/9/5
// 描    述: controllers.js
define([
    'module/personalCollect/views/personalCollectView'
],function(personalCollectView){
    return {
        personalCollect : function(){
            app.page.show(personalCollectView);
        }
    };
});