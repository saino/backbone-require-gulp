/**
 * Created by fishYu on 2016/8/26.
 * 附加险详细说明页面
 */
define([
    'common/base/base_view',
    'text!module/attachDetails/templates/attachDetails.html',
    'module/attachDetails/model/attachDetailsModel',
    "msgbox"
],function(BaseView, Tpl, attachDetailsModel, MsgBox){
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
        productId : "",         //售卖产品ID
        ui:{
            topCon : ".top-title",
            backBtn : ".top-title-left", //点击返回
            attachDetailsTitle : ".attach-details-title",
            attachDetailsMain : "#attach-details-main"

        },
        events:{
            "tap @ui.backBtn":"onBackBtnHandler",
            "tap @ui.attachDetailsMain":"onAttachDetailsMainHandler"
        },
        initialize:function(){

        },
        onRender:function(){
            var self = this;
            if(device.ios()){
                self.ui.topCon.css("padding-top",utils.toolHeight+"px");
            }
            setTimeout(function(){
                var height = self.ui.topCon.outerHeight(true) + self.ui.attachDetailsTitle.height();
                self.ui.attachDetailsMain.css({height: "calc(100% - " + height + "px)"});
            }, 0)

            self.productId = self.getOption("productId");   //获取产品ID
            console.log(self.productId);
            self._initView = self.initView.bind(self);
            //TODO 需要真实的接口和数据
            attachDetailsModel.getRiderInfo(self.currentUserId, self.productId, self._initView, function(err){
                console.log(err);
            });
        },
        initView : function(data){
            var self = this;
            var packageName = data.packageName;
            self.ui.attachDetailsTitle.text(packageName);
            var salesRiderList = data.salesRiderList;
            var attachStr = "";
            for(var i = 0; i < salesRiderList.length; i++){
                var temp = "";
                var obj = salesRiderList[i];
                //TODO 这里区分到底是下拉还是下一页需要准确字段判断
                if(obj.hasOwnProperty("liabDesc")){
                    temp = pullTemp;
                    var realTemp = temp.replace("{liabName}", obj.liabName).replace(/\{liabDesc\}/g, obj.liabDesc);
                    attachStr += realTemp;
                }else{
                    temp = nextTemp;
                    var realTemp = temp.replace("{salesProductName}", obj.salesProductName).replace(/\{salesProductId\}/g, obj.salesProductId);
                    attachStr += realTemp;
                }
            }
            self.ui.attachDetailsMain.html(attachStr);
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
            app.goBack();
        },
        /**
         * 点击返回
         * @param e
         */
        onAttachDetailsMainHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
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
                MsgBox.alert(dataType);
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
