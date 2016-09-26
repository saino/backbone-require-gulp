define([
    'common/base/base_view',
    'marionette',
    'text!module/browseRecords/templates/browseRecords.html',
    'msgbox',
    'module/browseRecords/model/browseRecords',
    'common/views/circle'
], function(BaseView, mn, tpl, MsgBox, browseRecordsModel, loadingCircle) {
    return BaseView.extend({
        id: "browseRecordsPage",
        template : _.template(tpl),
        forever : true,
        isReLoading: true,

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
            if(utils.clickLock()){
                return;
            }

            app.goBack();
        },

        //删除指定
        clickDeleteHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            if(utils.clickLock()){
                return;
            }
            var self = this;
            var $target = $(event.target);
            // console.log(event.target);
            if($target.attr("class") == "insurance-product-delete"){   //点击删除
                MsgBox.ask("你确定删除该条浏览记录吗？","bbbbbbb",function(type){
                    if(type == 2) { //确定  0=取消
                        // console.log("删除了");
                        var parent = $(event.target).parent();
                        var  packageId = parseInt(parent.attr("data-id"));
                        var options = {
                            "encryptedUserData": utils.userObj.id,
                            "packageId": packageId,
                        };
                        LoadingCircle && LoadingCircle.start();
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
                            LoadingCircle && LoadingCircle.end();
                        }, function(error){
                            MsgBox.alert("删除失败");
                            LoadingCircle && LoadingCircle.end();
                            console.log("删除失败");
                        });
                  

                    }
                    if(type == 0) {
                        console.log("取消删除");
                    }
                });
                return;
            }

            // console.log($target.parents(".life-insurance-card"));
            var lifeInsuranceCard = $target.parents(".insurance-product-card")[0];
            if(lifeInsuranceCard){
                var lifeInsuranceCardId = lifeInsuranceCard.getAttribute("data-id");
                lifeInsuranceCardId = lifeInsuranceCardId || "null";
                self.isReLoading = false;
                app.navigate("in/productDetails/"+ lifeInsuranceCardId, {replace: true, trigger: true});
            }
        },

        //删除所有
        clickDeleteAllHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            if(utils.clickLock()){
                return;
            }

            var self = this;
            console.log(self.ui.browseRecordsContent.find(".insurance-product-card").length);
            if(!(self.ui.browseRecordsContent.find(".insurance-product-card").length)){
                MsgBox.alert("浏览记录为空");
                return;
            }
            

            MsgBox.ask("你确定删除所有浏览记录吗？","bbbbbbb",function(type){
                if(type == 2) { //确定  0=取消
                    var options = {
                        "encryptedUserData": utils.userObj.id,
                    };
                    LoadingCircle && LoadingCircle.start();
                    browseRecordsModel.clearBrowseHistory(options, function(data){
                        console.log(data);
                        if(data.status == "0"){
                          self.ui.browseRecordsContent.html('<div id="browse-records-noting">暂无浏览记录</div>');
                        }else{
                            MsgBox.alert("删除失败");
                            // console.log("删除失败",data);
                        }
                        LoadingCircle && LoadingCircle.end();
                    }, function(error){
                        MsgBox.alert("删除失败");
                        LoadingCircle && LoadingCircle.end();
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
            LoadingCircle && LoadingCircle.start();
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
                                                        '<div class="insurance-product-delete button"> </div>' +
                                                    '</div>';
                    }
                    if(!insuranceProductCard.length){
                        insuranceProductCardHtml = '<div id="browse-records-noting">暂无浏览记录</div>';
                    }
                    self.ui.browseRecordsContent.html(insuranceProductCardHtml);
                    LoadingCircle && LoadingCircle.end();
                } else{
                    var insuranceProductCardHtml = '<div id="browse-records-noting">暂无浏览记录</div>';
                    self.ui.browseRecordsContent.html(insuranceProductCardHtml);
                    console("数据返回错误", data);
                    setTimeout(function(){
                        MsgBox.alert("数据获取失败");
                    }, 350);
                    LoadingCircle && LoadingCircle.end();
                }
            }, function(error){
                var insuranceProductCardHtml = '<div id="browse-records-noting">暂无浏览记录</div>';
                self.ui.browseRecordsContent.html(insuranceProductCardHtml);
                console.log("数据查询失败", error);
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
                self.ui.browseRecordsContent.css("height", "-webkit-calc(100% - 84px - "+utils.toolHeight+"px)");
            }
            if(self.isReLoading){
                self.loadData();
            }
            self.isReLoading = true;
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