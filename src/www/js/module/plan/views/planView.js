// 文件名称: login
//
// 创建日期: 2015/01/08
// 描    述: 用户登录
define([
    'common/base/base_view',
    'text!module/plan/templates/plan.html',
    'marionette',
    "msgbox"
],function(BaseView, tpl, mn, MsgBox) {
    return BaseView.extend({
        id: "plan-container",
        template : _.template(tpl),
        _mouseLock : false,
        forever : false,
        ui : {
        },

        //事件添加
        events : {
            "tap #back":"_clickBackHandler",
            "tap #btnBuy":"_clickBuyHandler"
        },
        /**初始化**/
        initialize : function(){
        },

        //在开始渲染模板前执行，此时当前page没有添加到document
        onBeforeRender : function(){
        },

        //渲染完模板后执行,此时当前page没有添加到document
        onRender : function(){
            var self = this;
            if(device.ios()){
                utils.showTopBar();

            }
        },

        //页间动画已经完成，当前page已经加入到document
        pageIn : function(){

        },
        _clickBackHandler:function(e){
            e.preventDefault();
            e.stopPropagation();
            app.goBack();
        },
        _clickBuyHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            MsgBox.ask("你认定删除该条浏览记录吗？确定确定确定要删除吗？你认定删除该条浏览记录吗？确定确定确定要删除吗？","bbbbbbb",function(type){
                if(type == 2) { //确定  0=取消
                    console.log("cccccc" + type);
                }
            });
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