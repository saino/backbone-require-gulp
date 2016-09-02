/**
 * Created by GYY on 2016/8/22.
 * 条款页面
 */
define([
    'common/base/base_view',
    'text!module/personalPlan/templates/personalPlan.html',
    'module/personalPlan/model/personalPlanModel',
    "msgbox"
],function(BaseView, Tpl, personalPlanModel, MsgBox){
    var PersonalPlanView = BaseView.extend({
        template: _.template(Tpl),
        id:"personal-plan-container",
        currentUserId : "",     //当前用户ID
        ui:{
            topCon : ".top-title",
            backBtn : ".top-title-left", //点击返回
            clearBtn: ".top-title-right",              //清除按钮
            planSearchContainer : ".plan-search-container",    //搜索框
            personalPlanMain : "#personal-plan-main"
        },
        events:{
            "tap @ui.backBtn":"onBackBtnHandler",
            "tap @ui.clearBtn":"onClearPlanHandler"      //清空计划书
        },
        initialize:function(){

        },
        onRender:function(){
            var self = this;
            if(device.ios()){
                self.ui.topCon.css("padding-top",utils.toolHeight+"px");
            }
            setTimeout(function(){
                var height = self.ui.topCon.outerHeight(true) + self.ui.planSearchContainer.height();
                self.ui.personalPlanMain.css({height: "calc(100% - " + height + "px)"});
            }, 0)


        },
        pageIn:function(){
            var self = this;

        },
        /**
         * 初始化界面的动态数据
         * @param data
         */
        initView : function(data){
            var self = this;
            
        },
        /**
         * 点击返回
         * @param e
         */
        onBackBtnHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            app.goBack();
        },
        close:function(){
            var self = this;
            self.remove();
            if(MsgBox && MsgBox.isShow()) {
                MsgBox.clear();
            }
        }
    });
    return PersonalPlanView;
});
