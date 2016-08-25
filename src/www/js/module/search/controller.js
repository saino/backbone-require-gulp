/**
 * 寿险产品搜索页
 * add by guYY 2016/8/25 14:26
 */
define([
    'module/search/views/searchView'
],function(SearchView){
    return {
        search:function(){
            app.page.show(SearchView);
        }
    }
});