/**
 * Created by GYY on 2016/8/22.
 * 病种详情页面
 */
define([
    'common/base/base_view',
    'module/disease/model/detailModel',
    'text!module/disease/templates/disease.html'
],function(BaseView, detailModel,DiseaseTpl){
    var DiseaseView = BaseView.extend({
        template: _.template(DiseaseTpl),
        id:"disease-container",
        ui:{
            "topCon":"#top-title",
            "diseaseContent":"#disease-main",
            "btnBack":"#top-title-left" //点击返回
        },
        events:{
            "tap #top-title-left":"_clickBackHandler"
        },
        initialize:function(){
            this.model = new detailModel();
            this.model.on("change",this.render,this);
            this.model.setTitle("病种详情");
            var productId = this.getOption("productId");
            this.model.getDeseaseInfo(productId);
        },
        render: function() {
            this.$el.html(this.template(this.model.attributes));
            return this;
        },
        onRender:function(){
            var self = this;
            // if(device.ios()){
            //     self.ui.topCon.css("padding-top",utils.toolHeight+"px");
            //     self.ui.diseaseContent.css("height","-webkit-calc(100% - "+(utils.toolHeight+85)+"px)");
            // }
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
    return DiseaseView;
});
