/**
 * Created by GYY on 2016/8/22.
 * 添加附加险页面
 */
define([
    'common/base/base_view',
    'text!module/additional/templates/additional.html',
    'module/additional/model/additionalModel',
    'common/views/circle',
    'msgbox'
],function(BaseView, AdditionalTpl, additionalModel,loadingCircle,MsgBox){
    var AdditionalView = BaseView.extend({
        template: _.template(AdditionalTpl),
        id:"additional-container",
        currProductId:0,        //当前产品计划书ID
        additionalList:[], //附加险列表
        ui:{
            "topCon":"#top-title",
            "btnBack":"#top-title-left", //点击返回
            mainList : "#additional-main"
        },
        events:{
            "tap #top-title-left":"_clickBackHandler",
            "tap .btnAdd" : "onItemClickHandler"
        },
        initialize:function(){

        },
        onRender:function(){
            var self = this;
            if(device.ios()){
                self.ui.topCon.css("padding-top",utils.toolHeight+"px");
            }
            //重置列表
            self.additionalList = [];
            self.currProductId = 0;
            self.currProductId = self.getOption("productId");
            self.addedList = self.getOption("list") || [];
            LoadingCircle && LoadingCircle.start();
            additionalModel.getRiders(self.currProductId,self.addedList, utils.currMainPlanInfo,utils.currMainPlanInsured,function(data){
                LoadingCircle && LoadingCircle.end();
                self.initData(data);
                console.log("*************附加险列表*************currProductId="+self.currProductId+",addedList="+self.addedList);
                console.log(data);
            }, function(e){
                LoadingCircle && LoadingCircle.end();
                MsgBox.alert("附加险列表获取失败");
            })
        },

        initData : function(data){
            var self = this;
            self.additionalList = data;
            var html = "", i, len = self.additionalList.length;
            for(i=0; i<len;i++){
                var obj = self.additionalList[i];
                html += '<div class="additional-item" data-id="'+obj.salesProductId+'"><div class="content">'+obj.salesProductName+'</div><div class="btnAdd">添加</div></div>'
            }
            if(len <= 0){
                html += '<p class="no-data-p">该主险下还未添加附加险</p>';
            }
            self.ui.mainList.html(html);
        },

        onItemClickHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var target = e.currentTarget;
            var parent = $(target).parent().get(0);
            if(parent){
                var id = parent.dataset.id;
                if(id){
                    this.addToMakePlan(id);
                }
            }
        },
        //根据附加险ID 将对象加到制作计划里
        addToMakePlan:function(id){
            var self = this;
            if(!self.additionalList || self.additionalList.length <= 0)
                return;
            for(var i = 0; i < self.additionalList.length; i++){
                if(self.additionalList[i].salesProductId == id) {
                    app.triggerMethod("common:add:additional",self.additionalList[i]);
                    app.goBack();
                    break;
                }
            }
        },
        pageIn:function(){},
        //点击返回
        _clickBackHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            app.goBack();
        },
        close:function(){

        }
    });
    return AdditionalView;
});
