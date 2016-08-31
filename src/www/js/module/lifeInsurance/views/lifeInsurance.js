define([
    'common/base/base_view',
    'marionette',
    'text!module/lifeInsurance/templates/lifeInsurance.html',
    'msgbox',
    'module/lifeInsurance/model/lifeInsurance'
], function(BaseView, mn, tpl, MsgBox, lifeInsuranceModel) {
    return BaseView.extend({
        id: "lifeInsurancePage",
        template: _.template(tpl),
        forever: false,

        ui: {
            back: "#top-title-left",
            productInsureDuty: ".product-insure-duty",
            searchDefaultSort: "#search-default-sort",
            defaultSortLayoutFloat: "#default-sort-layout-float",
            // defaultSortContent: ".default-sort-content",
            searchText: "#search-text",                                 //搜索框
            searchAdvancedScreening: "#search-advanced-screening"       //高级筛选

        },

        events: {
            "tap @ui.back": "clickBackHandler",
            "tap @ui.productInsureDuty": "clickProductInsureDutyHandler",
            "tap @ui.searchDefaultSort": "clickSearchDefaultSortHandler",
            "tap @ui.defaultSortLayoutFloat": "clickDefaultSortLayoutFloatHandler",
            "tap @ui.searchText": "clickSearchTextHandler",
            "tap @ui.searchAdvancedScreening": "clickSearchAdvancedScreeningHandler"
        },

        clickSearchAdvancedScreeningHandler: function(event){
            event.stopPropagation();
            event.preventDefault();

            app.navigate("in/advanceQuery", {replace: true, trigger: true});
        },

        clickSearchTextHandler: function(event){
            event.stopPropagation();
            event.preventDefault();

            app.navigate("in/search", {replace: true, trigger: true});
        },

        clickBackHandler: function (event) {
            event.stopPropagation();
            event.preventDefault();

            app.goBack();
        },

        clickProductInsureDutyHandler: function(event){
            event.stopPropagation();
            event.preventDefault();

            var self = this;
            var target = event.target;
            var $target = $(target);
            var parent = null;
            if($target.hasClass("pull-icon-small")){
                parent = $target.parent();
                parent.toggleClass("on-small");
                //$target.css({"background-image":})
            }
            if($target.hasClass("pull-icon-big")){
                parent = $target.parent();
                parent.toggleClass("on-big");
            }
            if(parent){
               parent.next().slideToggle();
            }
        },

        clickSearchDefaultSortHandler: function(event){
            event.stopPropagation();
            event.preventDefault();

            this.ui.defaultSortLayoutFloat.show();

        },

        clickDefaultSortLayoutFloatHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            var self = this;

            //self.ui.defaultSortLayoutFloat.hidden();

            var target = event.target;
            var $target = $(target);
            if($target.attr("class") == "default-sort-item"){
                self.ui.defaultSortLayoutFloat.find(".default-sort-item-selected").attr("class", "default-sort-item");
                $target.attr("class","default-sort-item default-sort-item-selected");
            }
            self.ui.defaultSortLayoutFloat.hide();
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
        show: function(){
            lifeInsuranceModel.getLifeInsuranceCard();
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