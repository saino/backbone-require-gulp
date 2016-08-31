/**
 * Created by GYY on 2016/8/22.
 * 条款页面
 */
define([
    'common/base/base_view',
    'text!module/clause/templates/clause.html',
    'module/clause/model/clauseModel'
],function(BaseView, ClauseTpl, clauseModel){
    var ClauseView = BaseView.extend({
        template: _.template(ClauseTpl),
        id:"clause-container",
        ui:{
            "topCon":"#top-title",
            "btnBack":"#top-title-left", //点击返回
            infoDiv : "#clause-main"
        },
        events:{
            "tap #top-title-left":"_clickBackHandler"
        },
        initialize:function(){

        },
        onRender:function(){
            var self = this;
            if(device.ios()){
                self.ui.topCon.css("padding-top",utils.toolHeight+"px");
            }

            var productId = self.getOption("productId");
            clauseModel.getTermInfo(productId, function(data){
                self.initData(data);
            }, function(){

            })
        },

        initData : function(data){
            this.ui.infoDiv.html(data.itemDesc);
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
    return ClauseView;
});
