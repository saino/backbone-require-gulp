// 文件名称: 计划书页 
//
// 创建日期: 2016/8/24
// 描    述: 包含保障计划、保险理念、公司介绍
define([
    'common/base/base_view',
    'text!module/plan/templates/plan.html',
    'module/plan/views/planCompanyView',
    'marionette',
    "msgbox"
],function(BaseView, tpl, planCompanyView, mn, MsgBox) {
    return BaseView.extend({
        id: "plan-container",
        template : _.template(tpl),
        _mouseLock : false,
        forever : false,
        ui : {
            "topCon":"#top-title",
            "planMain":"#plan-main"
        },
        regions:{
            "planMain":"#plan-main"
        },
        //事件添加
        events : {
            "tap #top-title-left":"_clickBackHandler"
        },
        /**初始化**/
        initialize : function(){            
            this.planCompanyView = new planCompanyView();
        },

        //在开始渲染模板前执行，此时当前page没有添加到document
        onBeforeRender : function(){
        },

        //渲染完模板后执行,此时当前page没有添加到document
        onRender : function(){
            var self = this;
            if(device.ios()){
                self.ui.topCon.css("padding-top",utils.toolHeight+"px");
                self.ui.planMain.css("height","-webkit-calc(100% - "+(183+utils.toolHeight)+"px)");
            }            
            this.getRegion("planMain").show(this.planCompanyView);
        },

        //页间动画已经完成，当前page已经加入到document
        pageIn : function(){
            var self = this;
            self.planCompanyView.setHeight(self.ui.planMain[0].offsetHeight);
        },
        //点击返回
        _clickBackHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            app.goBack();
        },
        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            if(MsgBox && MsgBox.isShow()){
                MsgBox.clear();
            }
        },

        /*点击事件不可以重复点*/
        _checkMouseLock : function () {
            var self = this;
            if (self._mouseLock) return true;
            self._mouseLock = true;
            setTimeout(function () {
                self._mouseLock = false;
            }, 200);
            return false;
        },

        //当页面销毁时触发
        onDestroy : function(){
        }
    });
});