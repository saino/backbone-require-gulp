define([
    'common/base/base_view',
    'marionette',
    'text!module/lifeInsurance/templates/lifeInsurance.html',
    'msgbox'
], function(BaseView, mn, tpl, MsgBox) {
    return BaseView.extend({
        id: "lifeInsurancePage",
        template: _.template(tpl),
        forever: false,

        ui: {
            back: "#top-title-left",
            productInsureDuty: ".product-insure-duty",
            searchDefaultSort: "#search-default-sort",
            defaultSortLayoutFloat: "#default-sort-layout-float",
            defaultSortContent: ".default-sort-content"
        },

        events: {
            "tap @ui.back": "clickBackHandler",
            "tap @ui.productInsureDuty": "clickProductInsureDutyHandler",
            "tap @ui.searchDefaultSort": "clickSearchDefaultSortHandler",
            "tap @ui.defaultSortContent": "clickDefaultSortContentHandler"
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
        clickDefaultSortContentHandler: function(event){
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
        show: function(){
            console.log("测试用");
        }
    });
});