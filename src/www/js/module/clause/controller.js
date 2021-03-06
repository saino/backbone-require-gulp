// 文件名称: controllers.js
//
// 创 建 人: guyy
// 创建日期: 2016/8/22
// 描    述: controllers.js
define([
    'module/clause/views/clauseView',
    'module/clause/views/clauseListView'
],function(ClauseView,ClauseViewView){
    return {
        clause : function(id){
            var opt = {};
            opt.productId = id;
            app.page.show(ClauseView, opt);
        },
        clauseList : function(id){
            var opt = {};
            opt.packageId = id;
            app.page.show(ClauseViewView, opt);
        }
    };
});