/**
 * Created by GYY on 2016/8/22.
 * 添加附加险页面
 */
define([
    'common/base/base_view',
    'text!module/additional/templates/additional.html',
    'module/additional/model/additionalModel'
],function(BaseView, AdditionalTpl, additionalModel){
    var AdditionalView = BaseView.extend({
        template: _.template(AdditionalTpl),
        id:"additional-container",
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

            self.planId = self.getOption("planId");
            self.addedList = self.getOption("list") || [];
            additionalModel.getRiders(self.planId, self.addedList, function(data){
                self.initData(data);
            }, function(){

            })
        },

        initData : function(data){
            var self = this;
            self.dataList = data.list;
            var html = "", i, len = self.dataList.length;
            for(i=0; i<len;i++){
                var obj = self.dataList[i];
                html += '<div class="additional-item" data-id="'+obj.id+'"><div class="content">'+obj.productName+'</div><div class="btnAdd">添加</div></div>'
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
                    console.log(id);
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
