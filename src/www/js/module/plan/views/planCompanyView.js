/**
 * 计划书-公司介绍
 * add by guYY 2016/8/24
 */
define([
    'common/base/base_view',
    'module/plan/model/planModel',
    'text!module/plan/templates/planCompany.html'
],function(BaseView, planModel, planCompanyTpl){
    var planCompanyView = BaseView.extend({
        id:"plan-company-container",
        template: _.template(planCompanyTpl),
        ui:{
            "planCompanyCon":"#plan-company-content",
            "planCompanyLogo":"#plan-company-logo"
        },
        events:{
            "tap .menu-item":"_clickMenuItemHandler"
        },
        initialize:function(){
            this.showCompany(0);//默认显示服务商
        },
        _clickMenuItemHandler:function(e){
            var target = e.target;            
            $(target).addClass("menu-item-ck").siblings().removeClass("menu-item-ck");
            this.showCompany($(target).data("index"));            
        },
        onBeforeRender:function(){
            debugger;
            var arr = planModel.getCompanyInfo();
            console.log(arr);
        },
        /**
         * 根据索引显示公司信息
         * @index 索引 0服务商   1承保商
         */
        showCompany:function(index){
            
        },
        setHeight:function(hei){
            this.ui.planCompanyCon.css({"height":(hei-70-139)+"px"});
        }

    });
    return planCompanyView;
});