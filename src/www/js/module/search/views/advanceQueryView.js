/**
 * 产品高级筛选页
 * add by guYY 2016/8/25
 */
define([
    'common/base/base_view',
    'text!module/search/templates/advanceQuery.html'
],function(BaseView,queryTpl){
    var AdvanceQueryView = BaseView.extend({
        id:"advance-query-container",
        template: _.template(queryTpl),
        ui:{
           "topCon":"#top-title",
           "advanceQueryContent":"#advanceQuery-main"
        },
        events:{
            "tap #top-title-left":"_clickBackHandler"
        },
        onRender:function(){
            var self = this;
            if(device.ios()){
                self.ui.topCon.css("padding-top",utils.toolHeight+"px");
                self.ui.advanceQueryContent.css("height","-webkit-calc(100% - "+(utils.toolHeight+85)+"px)");
            }
        },
        pageIn:function(){
           
        },
        //点击返回
        _clickBackHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            app.goBack();
        },
    });
    return AdvanceQueryView;
});