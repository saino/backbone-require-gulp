/**
 * Created by FishYu on 2016/9/5
 * 我的收藏页面
 */
define([
    'common/base/base_view',
    'text!module/personalCollect/templates/personalCollect.html',
    'module/personalCollect/model/personalCollectModel',
    "msgbox"
], function (BaseView, Tpl, personalCollectModel, MsgBox) {
    var collectItemTemp = '<div class="personal-collect-item">'+
        '<div class="personal-collect-item-title" >{insuranceName}</div>'+  //保险名称
        '<div class="personal-collect-item-content" >'+
            '<p>年龄：<span>{ageTerm}</span></p>'+         //年龄期间
            '<p>保障期间：<span>{safeguardTerm}</span></p>'+     //保障期间
            '{itemFeature}'+ //<div class="item-feature">被保豁免</div>
        '</div>'+
        '<div class="personal-collect-delect" data-id={objectId}></div>'+       //产品ID 
    '</div>';
    var PersonalCollectView = BaseView.extend({
        template: _.template(Tpl),
        id:"personal-collect-container",
        currentUserId: "",     //当前用户ID
        currentListData : [],     //当前收藏数据的列表
        ui:{
            topCon : ".top-title",
            backBtn : ".top-title-left", //点击返回
            clearBtn: ".top-title-right",              //清除按钮
            personalCollectMain: "#personal-collect-main"
        },
        events:{
            "tap @ui.backBtn":"onBackBtnHandler",
            "tap @ui.clearBtn": "onClearCollectHandler",      //清空所有收藏
            "tap @ui.personalCollectMain": "onDeleteCollectItemHandler"     //删除单条收藏
        },
        initialize:function(){

        },
        onRender:function(){
            var self = this;
            if(device.ios()){
                self.ui.topCon.css("padding-top",utils.toolHeight+"px");
            }
            setTimeout(function(){
                var height = self.ui.topCon.outerHeight(true);
                self.ui.personalCollectMain.css({height: "calc(100% - " + height + "px)"});
            }, 0)
            // self._initView = self.initView.bind(self);
            // //TODO 需要真实的接口和数据
            // // personalCollectModel.getCollectItemList(self.currentUserId,  self._initView, function(err){
            // //     console.log(err);
            // // });
            // // var options = {
            // //     encryptedUserData: utils.userObj.id
            // // };
            // // personalCollectModel.getCollectedProductList(options, self._initView, function(error){
            // //     console.log(err);
            // // });

        },
        pageIn:function(){
            var self = this;
            self.loadData();
        },

        loadData: function(){
            var self = this;
            var options = {
                "encryptedUserData": utils.userObj.id
            }
            personalCollectModel.getCollectedProductList(options, function(data){
                console.log(data);
                if(data.status == "0"){
                    var insuranceProductCard = data.salesPackageCollectHistory;
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
                        insuranceProductCardHtml = '<div id="browse-records-noting">暂无收藏记录</div>';
                    }
                    self.ui.personalCollectMain.html(insuranceProductCardHtml);
                } else{
                    var insuranceProductCardHtml = '<div id="browse-records-noting">暂无收藏记录</div>';
                    self.ui.personalCollectMain.html(insuranceProductCardHtml);
                    console("数据返回错误", data);
                }
            }, function(error){
                var insuranceProductCardHtml = '<div id="browse-records-noting">暂无收藏记录</div>';
                self.ui.personalCollectMain.html(insuranceProductCardHtml);
                console.log("数据查询失败", error);
            });
        },
        // /**
        //  * 初始化界面的动态数据
        //  * @param data
        //  */
        // initView : function(data){
        //     console.log(data);
        //     var self = this;
        //     //TODO 以下为模拟的数据，需要调试的，会有细微的改动
        //     var list = data.salesPackageCollectHistory;
        //     self.currentListData = list;
        //     var collectItemStr = "";
        //     if (list.length > 0){
        //         for (var i = 0; i < list.length; i++){
        //             var obj = list[i];
        //             var date = obj.createTime;      //格式最后需要转换
        //             var applicantName = "投保人：" + obj.applicantName; //投保人名称
        //             var planName = obj.planName;    //计划书名称
        //             var recognizeeInfo = obj.recognizeeInfo + " " + obj.transferDeadline + " " + obj.safeguardDeadline;             //被保人信息
        //             var costInfo = "保额" + obj.coverage + " 首年保费" + obj.premium;      //费用信息
        //             var objectId = obj.objectId;    //计划ID
        //             var realItemTemp = collectItemTemp.replace("{applicantName}", applicantName).replace("{itemDate}", date)
        //                 .replace("{planName}", planName).replace("{recognizeeInfo}", recognizeeInfo)
        //                 .replace("{costInfo}", costInfo).replace("{dataId}", objectId);
        //             collectItemStr += realItemTemp;
        //         }
        //         self.ui.personalCollectMain.html(collectItemStr);
        //     }else{
        //         self.ui.personalCollectMain.html('<div class="collect-item-noting">暂无浏览记录</div>');
        //     }
            
        // },
        /**
         * 点击返回
         * @param e
         */
        onBackBtnHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            app.goBack();
        },
        /**
         * 点击清空所有收藏
         * @param e
         */
        onClearCollectHandler:function(event){
            event.stopPropagation();
            event.preventDefault();
            var self = this;
             MsgBox.ask("你确定删除所有浏览记录吗？","bbbbbbb",function(type){
                if(type == 2) { //确定  0=取消
                    var options = {
                        "encryptedUserData": utils.userObj.id,
                    };
                    personalCollectModel.deleteCollectProduct(options, function(data){
                        console.log(data);
                        if(data.status == "0"){
                          self.ui.personalCollectMain.html('<div id="browse-records-noting">暂无浏览记录</div>');
                        }else{
                            console.log("删除失败",data);
                        }
                    }, function(error){
                        console.log("删除失败",error);
                    });
                }
                if(type == 0) {
                    console.log("取消删除");
                }
            });  
        },
        /**
         * 点击删除单条收藏
         * @param e
         */
        onDeleteCollectItemHandler:function(event){
            event.stopPropagation();
            event.preventDefault();
            var self = this;
            //删除单条计划书
            // var target = e.target;
            // var $target = $(target);
            // var dataId = $target.attr("data-id");
            // var parent = "";
            // if (dataId){
            //     parent = $target.parent();
            //     if (parent) {
            //         MsgBox.ask("你确定要删除该收藏的产品吗？","bbbbbbb",function(type){
            //             if(type == 2) { //确定  0=取消
            //                 console.log("删除了1111");
            //                 var pparent = parent.parent();
            //                 parent.slideUp(function(){
            //                     parent.remove();
            //                     //TODO 需要真实删除该条计划
            //                     if (!(pparent.children().length)) {
            //                         self.currentListData = [];
            //                         self.ui.personalCollectMain.html('<div class="collect-item-noting">暂无浏览记录</div>');
            //                     }
            //                 });
            //             }
            //             if(type == 0) {
            //                 console.log("取消删除");
            //             }
            //         });  
            //     }
            // }
            if(event.target.getAttribute("class") == "insurance-product-delete"){
                MsgBox.ask("你确定删除该条收藏的产品吗？","bbbbbbb",function(type){
                    if(type == 2) { //确定  0=取消
                        // console.log("删除了");
                        var parent = $(event.target).parent();
                        var  packageId = parseInt(parent.attr("data-id"));
                        var options = {
                            "encryptedUserData": utils.userObj.id,
                            "packageId": packageId,
                        };
                        personalCollectModel.deleteCollectProduct(options, function(data){
                            console.log(data);
                            if(data.status == "0"){
                                var pparent = parent.parent();
                                parent.slideUp(function(){
                                    parent.remove();
                                    if(!(pparent.children().length)){
                                        self.ui.personalCollectMain.html('<div id="browse-records-noting">暂无浏览记录</div>');
                                    }
                                });
                            }else{
                                console.log("删除失败");
                            }
                        }, function(error){
                            console.log("删除失败");
                        });
                  

                    }
                    if(type == 0) {
                        console.log("取消删除");
                    }
                });
            }
        },
        close:function(){
            var self = this;
            self._initView = null;
            self.remove();
            if(MsgBox && MsgBox.isShow()) {
                MsgBox.clear();
            }
        }
    });
    return PersonalCollectView;
});
