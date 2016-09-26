define([
    'common/base/base_view',
    'marionette',
    'text!module/detailsDescription/templates/detailsDescription.html',
    'msgbox',
    'module/detailsDescription/model/detailsDescriptionModel',
    'common/views/circle'
], function(BaseView, mn, tpl, MsgBox, detailsDescriptionModel, loadingCircle) {
    return BaseView.extend({
        id: "detailsDescriptionPage",
        template: _.template(tpl),
        forever: false,
        descriptionData : null,

        ui: {
            topTitle: "#top-title",
            back: "#top-title-left",
            topTitleCenter: "#top-title-center",
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
            if(utils.clickLock()){
                return;
            }

            app.goBack();
        },
        clickDetailsDescriptionRuleName1Handler: function(event){
            event.stopPropagation();
            event.preventDefault();
            if(utils.clickLock()){
                return;
            }

            this.ui.detailsDescriptionRuleName1.attr("class","details-description-rule-name1 button details-description-rule-name-selected");
            this.ui.detailsDescriptionRuleName2.attr("class","details-description-rule-name2 button");
            if(this.descriptionData){
                this.ui.detailsDescriptionRuleContent.html(this.descriptionData.productUnderwritingRule);
            }
            
        },
        clickDetailsDescriptionRuleName2Handler: function(event){
            event.stopPropagation();
            event.preventDefault();
            if(utils.clickLock()){
                return;
            }

            this.ui.detailsDescriptionRuleName2.attr("class","details-description-rule-name2 button details-description-rule-name-selected");
            this.ui.detailsDescriptionRuleName1.attr("class","details-description-rule-name1 button");
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
            // self.ui.detailsDescriptionName1.html(utils.productName); 
            self.ui.topTitleCenter.html(utils.productName);
            LoadingCircle && LoadingCircle.start();
            detailsDescriptionModel.getRuleInfo(productId, organId, function(data){
                console.log(data);
                if(data.status == "0"){
                    self.descriptionData = data;
                    self.ui.detailsDescriptionRuleContent.html(self.descriptionData.productUnderwritingRule);
                }else{
                    setTimeout(function(){
                        MsgBox.alert("数据获取失败");
                    }, 350);
                }
                LoadingCircle && LoadingCircle.end();
            }, function(){
                setTimeout(function(){
                    MsgBox.alert("数据获取失败");
                }, 350);
                LoadingCircle && LoadingCircle.end();
            });
        },

        show: function(){
            var self = this;
            if(device.ios()){
                self.ui.topTitle.css("padding-top",utils.toolHeight+"px");
                self.ui.detailsDescriptionContent.css("height", "-webkit-calc(100% - 84px - "+utils.toolHeight+"px)");
            }
            self.ui.detailsDescriptionRuleName1.attr("class","details-description-rule-name1 button details-description-rule-name-selected");
            self.ui.detailsDescriptionRuleName2.attr("class","details-description-rule-name2 button");
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