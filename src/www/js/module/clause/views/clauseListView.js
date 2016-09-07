/**
 * Created by Administrator on 2016/9/4.
 */
define([
    'common/base/base_view',
    'text!module/clause/templates/clauseList.html',
    'module/clause/model/clauseModel'
],function(BaseView,tpl,clauseModel){
    var clauseListView = BaseView.extend({
        id:"clause-list-container",
        template : _.template(tpl),
        ui: {
            "topCon": "#top-title",
            "mainCon":"#clause-list-main"
        },
        events:{
            "tap .clause-item":"clickItemHandler",
            "tap #top-title-left":"clickBackHandler"
        },
        initialize:function(){

        },
        onRender:function(){
            var self = this;
            if(device.ios()){
                self.ui.topCon.css("padding-top",utils.toolHeight+"px");
                self.ui.mainCon.css("height","-webkit-calc(100% - "+(utils.toolHeight+85)+"px)");
            }
            self.initData();
        },
        initData:function(){
            var tempHtml = '', self = this;
            if(utils.productInfoList && utils.productInfoList.length > 0){
                for(var i = 0; i < utils.productInfoList.length; i++){
                    tempHtml += '<div class="clause-item" data-id="'+utils.productInfoList[i].productId+'">'+utils.productInfoList[i].productName+'</div>';
                }
            }else{
                tempHtml+= '<p class="no-data-p">该计划书下无产品信息列表</p>';
            }
            self.ui.mainCon.html($(tempHtml));
        },
        //原定取接口  需求修改，此函数暂不用
        initData_old:function(){
            var self = this;
            var packageId = self.getOption("packageId");
            clauseModel.getClauseList(packageId,function(data){
                if(data.tremInfoItem){
                    var tempHtml = "";
                    for(var i = 0; i < data.tremInfoItem.length; i++){
                        tempHtml += '<div class="clause-item" data-id="'+data.tremInfoItem[i].productId+'">'+data.tremInfoItem[i].prodectName+'</div>';
                    }
                    self.ui.mainCon.html($(tempHtml));
                }
            },function(err){
                console.log(err)
            })
        },
        //点击返回
        clickBackHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            app.goBack();
        },
        clickItemHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var target = $(e.target);
            app.navigate("in/clause/"+target.data("id"),{trigger:true,replace:true});
        }
    });
    return clauseListView;
})