/**
 * Created by fishYu on 2016/8/26.
 * 附加险详细说明页面
 */
define([
    'common/base/base_view',
    'text!module/attachDetails/templates/attachDetails.html',
    'module/attachDetails/model/attachDetailsModel',
    "msgbox",
    'common/views/circle'
],function(BaseView, Tpl, attachDetailsModel, MsgBox, loadingCircle){
    var pullTemp = '<div class="attach-pull-item">'+
        '<div class="attach-item-title">'+
        '<span>{liabName}</span>'+
        '<span class="pull-icon-big"></span>'+
        '</div>'+
        '<div class="attach-pull-content">{liabDesc}</div>'+
        '</div>';
    var nextTemp = '<div class="attach-next-item" data-type="{salesProductId}">'+
        '<span data-type="{salesProductId}">{salesProductName}</span>'+
        '<span class="pull-icon-next-big" data-type="{salesProductId}"></span>'+
        '</div>';
    var AttachDetailsView = BaseView.extend({
        template: _.template(Tpl),
        id:"attach-details-container",
        currentUserId : "",     //当前用户ID
        productId : "",         //产品ID
        salesProductId: "",     //售卖产品ID
        organId: "",        //投核保ID
        ui:{
            topCon : ".top-title",
            backBtn : ".top-title-left", //点击返回
            attachDetailsTitle : ".attach-details-title",
            attachDetailsMain : "#attach-details-main",

            bxzrTxt : ".bxzr-txt",      //保险责任
            bxzrItem: ".bxzr-item",
            bzxqTxt : ".bzxq-txt",      //病种详情
            bzxqItem: ".bzxq-item",

            thbzTxt : ".thbgz-txt",     //投核保规则
            xxtkTxt : ".xxtk-txt",      //详细条款

            caseExplainNext: "#case-explain-next" //案例说明

        },
        events:{
            "tap @ui.backBtn":"onBackBtnHandler",
            "tap @ui.attachDetailsMain":"onAttachDetailsMainHandler"
        },
        initialize:function(){

        },
        show:function(){
            var self = this;
            if(device.ios()){
                self.ui.topCon.css("padding-top",utils.toolHeight+"px");
            }
            setTimeout(function(){
                var height = self.ui.topCon.outerHeight(true) + self.ui.attachDetailsTitle.height();
                self.ui.attachDetailsMain.css({height: "-webkit-calc(100% - " + height + "px)"});
            }, 0)

            self.packageId = self.getOption("packageId");   //产品卡ID
            self.productId = self.getOption("productId");   //精算产品ID
            self.salesProductId = self.getOption("salesProductId");     //销售产品ID

            LoadingCircle && LoadingCircle.start();
            attachDetailsModel.getRiderInfo(self.packageId, self.productId, self.salesProductId, function(data){
                if(data.status == "0"){
                    console.log(data);
                    self.initData(data);
                }else{
                    setTimeout(function(){
                        MsgBox.alert("数据获取失败");
                    }, 350);
                }
                LoadingCircle && LoadingCircle.end();
            }, function(err){
                setTimeout(function(){
                        MsgBox.alert("数据获取失败");
                }, 350);
                console.log(err);
                LoadingCircle && LoadingCircle.end();
            });
        },
        initData : function(data){
            var self = this;
            utils.productName = data.productName + "";
            utils.caseExplain = data.caseExplain;
            self.organId = data.organId + "";
            self.ui.attachDetailsTitle.html(data.productName);
            if(data.safeDuty){
                self.ui.bxzrTxt.html(data.safeDuty);
                self.ui.bxzrItem.show();
            }else{
                self.ui.bxzrItem.hide();
            }
            if(data.diseaseDetails){
                self.ui.bzxqTxt.html(data.diseaseDetails);
                self.ui.bzxqItem.show();
            }else{
                self.ui.bzxqItem.hide();
            }
            if(data.caseExplain.length && utils.isShowExample){
                self.ui.caseExplainNext.show();
            }else{
                self.ui.caseExplainNext.hide();
            }
            // self.ui.bzxqTxt.html(data.diseaseDetails);
        },
        pageIn:function(){
            var self = this;
        },
        /**
         * 点击返回
         * @param e
         */
        onBackBtnHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            if(utils.clickLock()){
                return;
            }

            app.goBack();
        },
        /**
         * 点击内容
         * @param e
         */
        onAttachDetailsMainHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            if(utils.clickLock()){
                return;
            }

            var self = this;
            var target = e.target;
            var $target = $(target);
            var parent = null;
            if($target.hasClass("pull-icon-big")){
                parent = $target.parent();
            }
            if(parent){ //显示下一级
                parent.toggleClass("on");
                parent.next().slideToggle();
            }
            var dataType = $target.attr("data-type");
            if(dataType){       //next 跳转
                switch(dataType){
                    case "rule":
                        self.organId = self.organId || "null";
                        self.salesProductId = self.salesProductId || "null";
                        app.navigate("home/detailsDescription/"+self.salesProductId+"/" + self.organId, {replace: true,trigger: true})
                        break;
                    case "tk":
                        self.salesProductId = self.salesProductId || "null";
                        app.navigate("in/clause/" + self.salesProductId, {replace: true,trigger: true});
                        break;
                    case "alsm":
                        app.navigate("home/caseExplain", {replace: true, trigger: true});
                        break;
                }
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
    return AttachDetailsView;
});
