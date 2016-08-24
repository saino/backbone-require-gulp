define([
    'common/base/base_view',
    'marionette',
    'text!module/browseRecords/templates/browseRecords.html',
    'msgbox'
], function(BaseView, mn, tpl, MsgBox) {
    return BaseView.extend({
        id: "browseRecordsPage",
        template : _.template(tpl),
        forever : false,

        ui: {
            back: "#browse-records-title-left",
            browseRecordsContent: "#browse-records-content",
            browseRecordsTitleRight: "#browse-records-title-right"
        },

        events: {
            "tap @ui.back": "clickBackHandler",
            "tap @ui.browseRecordsContent": "clickDeleteHandler",
            "tap @ui.browseRecordsTitleRight": "clickDeleteAllHandler"
        },

        clickBackHandler: function(event){
            event.stopPropagation();
            event.preventDefault();

            app.goBack();
        },
        clickDeleteHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            var self = this;

            if(event.target.getAttribute("class") == "insurance-product-delete"){
                MsgBox.ask("你认定删除该条浏览记录吗？","bbbbbbb",function(type){
                    if(type == 2) { //确定  0=取消
                        console.log("删除了");
                        var pparent = $(event.target).parent().parent();
                        $(event.target).parent().slideUp(function(){
                            $(event.target).parent().remove();
                            if(!(pparent.children().length)){
                                self.ui.browseRecordsContent.html('<div id="browse-records-noting">暂无浏览记录</div>');
                            }
                        });

                    }
                    if(type == 0) {
                        console.log("取消删除");
                    }
                });
            }
        },
        clickDeleteAllHandler: function(event){
            event.stopPropagation();
            event.preventDefault();

            var self = this;
            MsgBox.ask("你认定删除所有浏览记录吗？","bbbbbbb",function(type){
                if(type == 2) { //确定  0=取消
                    console.log("删除了");
                    self.ui.browseRecordsContent.html('<div id="browse-records-noting">暂无浏览记录</div>');
                }
                if(type == 0) {
                    console.log("取消删除");
                }
            });

        },


        initialize: function(){
            console.log("initialize!!!");
        },

        onBeforeRender: function(){
            console.log("onBeforeRender!!!");
        },

        onRender: function(){
            console.log("render!!!ww");
        },

        show: function(){
            console.log("show!!!");
            var insuranceProductCard = [
                {
                    isNew: true,
                    insuranceProductCardName: "华夏贴心宝",
                    insuranceProductCardPv: 13241,
                    equityLabelName: [
                        "被保豁免",
                        "轻症",
                        "身故",
                        "疾病终末",
                        "疾病终末",
                        "疾病终末"
                    ]
                },{
                    insuranceProductCardName: "华夏贴心宝1",
                    insuranceProductCardPv: 13241,
                    equityLabelName: [
                        "被保豁免1",
                        "轻症1",
                        "身故1",
                        "疾病终末1",
                        "疾病终末1",
                        "疾病终末1"
                    ]
                },{
                    insuranceProductCardName: "华夏贴心宝2",
                    insuranceProductCardPv: 13241,
                    equityLabelName: [
                        "被保豁免2",
                        "轻症2",
                        "身故2",
                        "疾病终末2",
                        "疾病终末2",
                        "疾病终末2"
                    ]
                },{
                    isNew: true,
                    insuranceProductCardName: "华夏贴心宝3",
                    insuranceProductCardPv: 13241,
                    equityLabelName: [
                        "被保豁免3",
                        "轻症3",
                        "身故3",
                        "疾病终末3",
                        "疾病终末3",
                        "疾病终末3"
                    ]
                }
            ];
            var equityLabelWidth = (this.$el.width() - 100)/3;
            var insuranceProductCardHtml = "";
            for(var i=0; i<insuranceProductCard.length; i++) {
                var bgImg = "";
                if(insuranceProductCard[i].isNew){
                    bgImg = 'style="background-image: url(./images/new.png)"';
                }
                insuranceProductCardHtml += '<div class="insurance-product-card" '+ bgImg +'>' +
                                                '<div class="insurance-product-card-up">' +
                                                    '<div class="insurance-product-card-name">' + insuranceProductCard[i].insuranceProductCardName + '</div>' +
                                                    '<div class="insurance-product-card-look-pv">' +
                                                        '<div class="insurance-product-card-pv">' + insuranceProductCard[i].insuranceProductCardPv + '</div>' +
                                                        '<div class="insurance-product-card-eye"></div>' +
                                                    '</div>' +
                                                '</div>' +
                                                '<div class="insurance-product-card-down">';

                var equityLabelHtml = "";
                for (var j = 0; j < insuranceProductCard[i].equityLabelName.length; j++) {
                    var currentEquityLabelWidth = insuranceProductCard[i].equityLabelName[j].length * 26 + 55;
                    var n = Math.ceil(currentEquityLabelWidth / equityLabelWidth);
                    n = n > 3 ? 3 : n;
                    n = n * 33.3333333333333;
                        equityLabelHtml += '<div class="equity-label" style="width: '+ n +'%;">' +
                                            '<div class="equity-label-select"></div>' +
                                            '<div class="equity-label-name">' + insuranceProductCard[i].equityLabelName[j] + '</div>' +
                                        '</div>';
                }
                insuranceProductCardHtml += equityLabelHtml;
                insuranceProductCardHtml +=     '</div>' +
                                                '<div class="insurance-product-delete"> </div>' +
                                            '</div>';
            }
            if(!insuranceProductCard.length){
                insuranceProductCardHtml = '<div id="browse-records-noting">暂无浏览记录</div>';
            }
            this.ui.browseRecordsContent.html(insuranceProductCardHtml);

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