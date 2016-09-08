define([
    'common/base/base_view',
    'marionette',
    'text!module/detailsDescription/templates/detailsDescription.html',
    'msgbox',
    'module/detailsDescription/model/detailsDescriptionModel'
], function(BaseView, mn, tpl, MsgBox, detailsDescriptionModel) {
    return BaseView.extend({
        id: "detailsDescriptionPage",
        template: _.template(tpl),
        forever: false,
        descriptionData : null,

        ui: {
            topTitle: "#top-title",
            back: "#top-title-left",
            detailsDescriptionContent: "#details-description-content",
            detailsDescriptionName1: "#details-description-name1",
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
            if(this.descriptionData){
                this.ui.detailsDescriptionRuleContent.html(this.descriptionData.productUnderwritingRule);
            }
            
        },
        clickDetailsDescriptionRuleName2Handler: function(event){
            event.stopPropagation();
            event.preventDefault();

            this.ui.detailsDescriptionRuleName2.attr("class","details-description-rule-name2 details-description-rule-name-selected");
            this.ui.detailsDescriptionRuleName1.attr("class","details-description-rule-name1");
            if(this.descriptionData){
                this.ui.detailsDescriptionRuleContent.html(this.descriptionData.companyUnderwritingRule);
            }

        },
        initialize: function(){
            // console.log("initialize!!!");
            //console.log(this.getOption("detailsDescriptionId"));
        },

        onBeforeRender: function(){
            // console.log("onBeforeRender!!!");
        },

        onRender: function(){
            var self = this;
            var productId = parseInt(self.getOption("detailsDescriptionId"));
            var organId = parseInt(self.getOption("organId"));
            self.ui.detailsDescriptionName1.html(utils.productName); 
            detailsDescriptionModel.getRuleInfo(productId, organId, function(data){
                console.log(data);
                self.descriptionData = data;
                self.ui.detailsDescriptionRuleContent.html(self.descriptionData.productUnderwritingRule);
            }, function(){

            });
        },

        show: function(){
            var self = this;
            if(device.ios()){
                self.ui.topTitle.css("padding-top",utils.toolHeight+"px");
                self.ui.detailsDescriptionContent.css("height", "calc(100% - 84px - "+utils.toolHeight+"px)");
            }
            self.ui.detailsDescriptionRuleName1.attr("class","details-description-rule-name1 details-description-rule-name-selected");
            self.ui.detailsDescriptionRuleName2.attr("class","details-description-rule-name2");
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