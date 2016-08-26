/**
 * Created by GYY on 2016/8/22.
 * 条款页面
 */
define([
    'common/base/base_view',
    'text!module/productDetails/templates/productDetails.html',
    "msgbox"
],function(BaseView, Tpl, MsgBox){
    var ProductDetailsView = BaseView.extend({
        template: _.template(Tpl),
        id:"product-details-container",
        ui:{
            topCon : ".top-title",
            backBtn : ".top-title-left", //点击返回
            shareBtn : ".top-title-right-2",              //分享按钮
            collectBtn : ".top-title-right-1",            //收藏按钮
            productDetailsMain : "#product-details-main",
            summaryContent : ".insure-summary-content" ,     //保障概览
            featureContent : ".insure-feature-content",     //产品特色
            dutyTitle : ".insure-duty-title",               //责任标题
            dutyTitleBtn : ".insure-duty-title .pull-icon-big", //责任下拉按钮
            dutyContent : ".insure-duty-content",           //保险责任
            planTitle : ".insure-plan-title",               //计划标题
            planTitleBtn : ".insure-plan-title .pull-icon-big", //计划下拉按钮
            planContent : ".insure-plan-content",           //产品组合计划列表
            subjoinTitle : ".insure-subjoin-title",         //附加标题
            subjoinTitleBtn : ".insure-subjoin-title .pull-icon-big",   //附加下拉按钮
            subjoinContent : ".insure-subjoin-content"     //推荐附加险
        },
        events:{
            "tap @ui.backBtn":"onBackBtnHandler",
            "tap @ui.shareBtn":"onShareInsureHandler",      //分享保险
            "tap @ui.collectBtn":"onCollectInsureHandler",        //收藏保险
            "tap @ui.dutyTitleBtn":"onToggleDutyContentHandler",
            "tap @ui.dutyContent" :  "onToggleDutyItemSummaryHandler",
            "tap @ui.planTitleBtn":"onTogglePlanContentHandler",
            "tap @ui.planContent" :  "onGoToPlanItemHandler",
            "tap @ui.subjoinTitleBtn":"onToggleSubjoinContentHandler",
            "tap @ui.subjoinContent" : "onGoToSubjoinItemHandler"
        },
        initialize:function(){

        },
        onRender:function(){
            var self = this;
            if(device.ios()){
                self.ui.topCon.css("padding-top",utils.toolHeight+"px");
            }
            setTimeout(function(){
                var height = self.ui.topCon.outerHeight(true);
                self.ui.productDetailsMain.css({height: "calc(100% - " + height + "px)"});
            }, 0)

            self.productId = self.getOption("productId");   //获取产品ID
            console.log(self.productId);

        },
        pageIn:function(){
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
        /**
         * 分享保险
         * @param e
         */
        onShareInsureHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            MsgBox.alert("点击了分享保险");
        },
        /**
         * 收藏保险
         * @param e
         */
        onCollectInsureHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            MsgBox.alert("点击了收藏保险");
        },
        /**
         *点击显示或者隐藏保险责任
         * @param e
         */
        onToggleDutyContentHandler : function(e) {
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            self.ui.dutyTitle.toggleClass("on");
        },
        /**
         *点击显示或者隐藏保险责任列表的简介
         * @param e
         */
        onToggleDutyItemSummaryHandler : function(e) {
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var target = e.target;
            var $target = $(target);
            var parent = null;
            if($target.hasClass("pull-icon-small")){
                parent = $target.parent();
            }
            if(parent){
                parent.toggleClass("on");
            }
        },
        /**
         *点击显示或者隐藏保险计划列表
         * @param e
         */
        onTogglePlanContentHandler : function(e) {
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            self.ui.planTitle.toggleClass("on");
        },
        /**
         * 跳转到计划组合列表的选项页
         * @param e
         */
        onGoToPlanItemHandler : function(e) {
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var target = e.target;
            var $target = $(target);
            var dataType = $target.attr("data-type");
            if(dataType){
                MsgBox.alert("计划组合列表");
            }
        },
        /**
         *点击显示或者隐藏附加险
         * @param e
         */
        onToggleSubjoinContentHandler : function(e) {
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            self.ui.subjoinTitle.toggleClass("on");
        },
        /**
         * 跳转到附加险列表的选项页
         * @param e
         */
        onGoToSubjoinItemHandler : function(e) {
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var target = e.target;
            var $target = $(target);
            var dataType = $target.attr("data-type");
            if(dataType){
                MsgBox.alert("推荐附加险列表");
            }
        },
        close:function(){
            var self = this;
            self.remove();
            if(MsgBox && MsgBox.isShow()) {
                MsgBox.clear();
            }
        }
    });
    return ProductDetailsView;
});
