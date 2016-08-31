/**
 * 产品搜索页
 * add by guYY 2016/8/25
 */
define([
    'common/base/base_view',
    'text!module/search/templates/search.html'
],function(BaseView,searchTpl){
    var SearchView = BaseView.extend({
        id:"search-container",
        template: _.template(searchTpl),
        ui:{
           "topCon":"#top-title",
           "historyContent":"#history-main"
        },
        events:{
            "tap #top-title-left-2":"_clickBackHandler"
        },
        onRender:function(){
            var self = this;
            if(device.ios()){
                self.ui.topCon.css("padding-top",utils.toolHeight+"px");
                self.ui.historyContent.css("height","-webkit-calc(100% - "+(utils.toolHeight+85)+"px)");
            }
        },
        pageIn:function(){
        },
        //点击返回
        _clickBackHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            app.goBack();
        }
    });
    return SearchView;
});