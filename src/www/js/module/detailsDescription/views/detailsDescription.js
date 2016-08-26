define([
    'common/base/base_view',
    'marionette',
    'text!module/detailsDescription/templates/detailsDescription.html',
    'msgbox'
], function(BaseView, mn, tpl, MsgBox) {
    return BaseView.extend({
        id: "detailsDescriptionPage",
        template: _.template(tpl),
        forever: false,

        ui: {
            back: "#top-title-left",
            detailsDescriptionRuleName1: ".details-description-rule-name1",
            detailsDescriptionRuleName2: ".details-description-rule-name2",
            detailsDescriptionRuleContent: "#details-description-rule-content"
        },

        events: {
            "tap @ui.back": "clickBackHandler",
            "tap @ui.detailsDescriptionRuleName1": "clickDetailsDescriptionRuleName1Handler",
            "tap @ui.detailsDescriptionRuleName2": "clickDetailsDescriptionRuleName2Handler"
        },

        clickBackHandler: function(event){
            event.stopPropagation();
            event.preventDefault();

            app.goBack();
        },
        clickDetailsDescriptionRuleName1Handler: function(event){
            event.stopPropagation();
            event.preventDefault();

            this.ui.detailsDescriptionRuleName1.attr("class","details-description-rule-name1 details-description-rule-name-selected");
            this.ui.detailsDescriptionRuleName2.attr("class","details-description-rule-name2");
            this.ui.detailsDescriptionRuleContent.html("111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111");

        },
        clickDetailsDescriptionRuleName2Handler: function(event){
            event.stopPropagation();
            event.preventDefault();

            this.ui.detailsDescriptionRuleName2.attr("class","details-description-rule-name2 details-description-rule-name-selected");
            this.ui.detailsDescriptionRuleName1.attr("class","details-description-rule-name1");
            this.ui.detailsDescriptionRuleContent.html("222222222222222222222222222222222222222");
        },
        initialize: function(){
            console.log("initialize!!!");
            //console.log(this.getOption("detailsDescriptionId"));
        },

        onBeforeRender: function(){
            console.log("onBeforeRender!!!");
        },

        onRender: function(){
            console.log("render!!!ww");
        },

        show: function(){
            this.ui.detailsDescriptionRuleName1.attr("class","details-description-rule-name1 details-description-rule-name-selected");
            this.ui.detailsDescriptionRuleName2.attr("class","details-description-rule-name2");
            this.ui.detailsDescriptionRuleContent.html("111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111");
            console.log("show!!!");

        },
        pageIn: function(){
            console.log("pageIn!!!");
        },

        close: function(){
            console.log("close!!!");
        },

        onDestroy: function(){
            console.log("destroy!!!");
        }
    });
});