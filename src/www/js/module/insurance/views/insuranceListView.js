// 文件名称: footer.js
//
// 创 建 人: chenshy
// 创建日期: 2015/7/24 14:08
// 描    述: footer.js
define([
    'common/base/base_view',
    'text!module/insurance/templates/insuranceList.html',
    'marionette'
],function(BaseView, tpl, mn) {
    return BaseView.extend({
        id : "insurance-list-container",
        template : _.template(tpl),
        _mouseLock : false,
        _isShow : false,
        ui : {
            btnOpenPlan : "#btnOpenPlan",
            btnOpenBrowseRecords: "#btnOpenBrowseRecords",
            btnOpenAdditional: "#btnOpenAdditional",
            btnOpenDisease: "#btnOpenDisease",
            btnOpenClause: "#btnOpenClause",
            btnOpenDetailsDescription: "#btnOpenDetailsDescription",
            btnLifeInsurance: "#btnLifeInsurance",
            btnOpenProductDetails : "#btnOpenProductDetails",
            btnMakePlan: "#btnMakePlan"
        },
        //事件添加
        events : {
            "tap @ui.btnOpenPlan" : "clickPlanHandler",
            "tap @ui.btnOpenBrowseRecords": "clickBrowseRecordsHandler",
            "tap @ui.btnOpenAdditional": "clickAdditionalHandler",
            "tap @ui.btnOpenDisease": "clickDiseaseHandler",
            "tap @ui.btnOpenClause": "clickClauseHandler",
            "tap @ui.btnOpenDetailsDescription": "clickDetailsDescriptionHandler",
            "tap @ui.btnLifeInsurance": "clickLifeInsuranceHandler",
            "tap @ui.btnOpenProductDetails": "clickOpenProductDetailsHandler",
            "tap @ui.btnMakePlan": "clickBtnMakePlan"
        },
        clickBtnMakePlan: function(event){
            event.stopPropagation();
            event.preventDefault();
            app.navigate("home/makePlan", {replace: true, trigger: true});
        },
        clickPlanHandler : function(){
            console.log(123);
            app.navigate("in/plan", {replace: true, trigger: true});
        },
        clickBrowseRecordsHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            app.navigate("home/browseRecords", {replace: true, trigger: true});
        },
        clickAdditionalHandler:function(events){
            event.stopPropagation();
            event.preventDefault();
            app.navigate("in/additional", {replace: true, trigger: true});
        },
        clickDiseaseHandler:function(event){
            event.stopPropagation();
            event.preventDefault();
            app.navigate("in/disease", {replace: true, trigger: true});
        },
        clickClauseHandler:function(event){
            event.stopPropagation();
            event.preventDefault();
            app.navigate("in/clause", {replace: true, trigger: true});
        },
        clickDetailsDescriptionHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            app.navigate("home/detailsDescription/lkaj3121", {replace: true, trigger: true});
        },
        clickLifeInsuranceHandler: function(event) {
            event.stopPropagation();
            event.preventDefault();
            app.navigate("home/lifeInsurance", {replace: true, trigger: true});
        },
        clickOpenProductDetailsHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            app.navigate("in/productDetails/pd0825", {replace: true, trigger: true});
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