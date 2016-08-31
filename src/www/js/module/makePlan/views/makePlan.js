
define([
    'common/base/base_view',
    'text!module/makePlan/templates/makePlan.html',
    'marionette'
],function(BaseView, tpl, mn) {
    return BaseView.extend({
        id : "make-plan-container",

        template : _.template(tpl),

        _mouseLock : false,
        _isShow : false,

        // key : selector
        ui : {
            topTitleLeft: "#top-title-left"
        },
        //事件添加
        events : {
            "tap @ui.topTitleLeft": "clickTopTitleLeftHandler"
        },

        clickTopTitleLeftHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            app.goBack();
        },

        /**初始化**/
        initialize : function(){
        },
        //在开始渲染模板前执行，此时当前page没有添加到document
        onBeforeRender : function(){

        },
        //渲染完模板后执行,此时当前page没有添加到document
        onRender : function(){

        },
        //页间动画已经完成，当前page已经加入到document
        pageIn : function(){
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
        },

        //当页面销毁时触发
        onDestroy : function(){
//            console.log("footer destroy");
        }

    });
});