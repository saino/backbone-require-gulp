define([
    'common/base/base_view',
    'marionette',
    'text!module/browseRecords/templates/browseRecords.html',
    'msgbox',
    'module/browseRecords/model/browseRecords'
], function(BaseView, mn, tpl, MsgBox, browseRecordsModel) {
    return BaseView.extend({
        id: "browseRecordsPage",
        template : _.template(tpl),
        forever : false,

        ui: {
            topTitle: "#top-title",
            back: "#top-title-left",
            browseRecordsContent: "#browse-records-content",
            browseRecordsTitleRight: "#top-title-right"
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

        //删除指定
        clickDeleteHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            var self = this;
            // console.log(event.target);
            if(event.target.getAttribute("class") == "insurance-product-delete"){
                MsgBox.ask("你确定删除该条浏览记录吗？","bbbbbbb",function(type){
                    if(type == 2) { //确定  0=取消
                        // console.log("删除了");
                        var parent = $(event.target).parent();
                        var  packageId = parseInt(parent.attr("data-id"));
                        var options = {
                            "encryptedUserData": utils.userObj.id,
                            "packageId": packageId,
                        };
                        browseRecordsModel.clearBrowseHistory(options, function(data){
                            if(data.status == "0"){
                                var pparent = parent.parent();
                                parent.slideUp(function(){
                                    parent.remove();
                                    if(!(pparent.children().length)){
                                        self.ui.browseRecordsContent.html('<div id="browse-records-noting">暂无浏览记录</div>');
                                    }
                                });
                            }else{
                                MsgBox.alert("删除失败");
                                console.log("删除失败");
                            }
                        }, function(error){
                            MsgBox.alert("删除失败");
                            console.log("删除失败");
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
            MsgBox.ask("你确定删除所有浏览记录吗？","bbbbbbb",function(type){
                if(type == 2) { //确定  0=取消
                    var options = {
                        "encryptedUserData": utils.userObj.id,
                    };
                    browseRecordsModel.clearBrowseHistory(options, function(data){
                        if(data.status == "0"){
                          self.ui.browseRecordsContent.html('<div id="browse-records-noting">暂无浏览记录</div>');
                        }else{
                            MsgBox.alert("删除失败");
                            console.log("删除失败",data);
                        }
                    }, function(error){
                        MsgBox.alert("删除失败");
                        console.log("删除失败",error);
                    });
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

        loadData: function(){
            var self = this;
            var options = {
                "encryptedUserData": utils.userObj.id
            }
            browseRecordsModel.getProductBrowseHistory(options, function(data){
                console.log(data);
                if(data.status == "0"){
                    var insuranceProductCard = data.salesPackagebrowsehistory;
                    var equityLabelWidth = (self.$el.width() - 100)/3;
                    var insuranceProductCardHtml = "";
                    for(var i=0; i<insuranceProductCard.length; i++) {
                        var bgImg = "";
                        
                        for(var j=0; insuranceProductCard[i].labels&&j<insuranceProductCard[i].labels.length; j++){
                               //推荐
                            if(insuranceProductCard[i].labels[j].listId == 1){
                                bgImg += '<div class="life-insurance-flag life-insurance-label-1"></div>';
                            }

                            //热销
                            if(insuranceProductCard[i].labels[j].listId == 2){
                                bgImg += '<div class="life-insurance-flag life-insurance-label-2"></div>';
                            }
                        }
                        //最新
                        if(insuranceProductCard[i].isNew){
                            bgImg += '<div class="life-insurance-flag life-insurance-label-3"></div>';
                        }
                        insuranceProductCardHtml += '<div class="insurance-product-card" data-id="'+insuranceProductCard[i].packageId+'">' + bgImg +
                                                        '<div class="insurance-product-card-up">' +
                                                            '<div class="insurance-product-card-name">' + insuranceProductCard[i].packageName + '</div>' +
                                                            '<div class="insurance-product-card-look-pv">' +
                                                                '<div class="insurance-product-card-pv">' + insuranceProductCard[i].visitNum + '</div>' +
                                                                '<div class="insurance-product-card-eye"></div>' +
                                                            '</div>' +
                                                        '</div>' +
                                                        '<div class="insurance-product-card-down">';

                        var equityLabelHtml = "";
                        for (var k = 0; insuranceProductCard[i].rights&&k<insuranceProductCard[i].rights.length; k++) {
                            var currentEquityLabelWidth = insuranceProductCard[i].rights[k].rightName.length * 26 + 55;
                            var n = Math.ceil(currentEquityLabelWidth / equityLabelWidth);
                            n = n > 3 ? 3 : n;
                            n = n * 33.3333333333333;
                                equityLabelHtml += '<div class="equity-label" style="width: '+ n +'%;">' +
                                                    '<div class="equity-label-select"></div>' +
                                                    '<div class="equity-label-name">' + insuranceProductCard[i].rights[k].rightName + '</div>' +
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
                    self.ui.browseRecordsContent.html(insuranceProductCardHtml);
                } else{
                    var insuranceProductCardHtml = '<div id="browse-records-noting">暂无浏览记录</div>';
                    self.ui.browseRecordsContent.html(insuranceProductCardHtml);
                    console("数据返回错误", data);
                    MsgBox.alert("获取数据失败");
                }
            }, function(error){
                var insuranceProductCardHtml = '<div id="browse-records-noting">暂无浏览记录</div>';
                self.ui.browseRecordsContent.html(insuranceProductCardHtml);
                console.log("数据查询失败", error);
                MsgBox.alert("获取数据失败");
            });
        },

        show: function(){
            var self = this;
            if(device.ios()){
                self.ui.topTitle.css("padding-top",utils.toolHeight+"px");
                self.ui.browseRecordsContent.css("height", "calc(100% - 84px - "+utils.toolHeight+"px)");
            }
            self.loadData();
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