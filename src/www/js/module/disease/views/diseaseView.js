/**
 * Created by GYY on 2016/8/22.
 * 病种详情页面
 */
define([
    'common/base/base_view',
    'module/disease/model/detailModel',
    'text!module/disease/templates/disease.html',
    'msgbox'
],function(BaseView, detailModel,DiseaseTpl,MsgBox){
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
            var packageId = this.getOption("packageId");
            var productId = this.getOption("productId");
            var libId = this.getOption("libId");
            this.model.getDeseaseInfo(packageId,productId,libId);
        },
        render: function() {
            this.$el.html(this.template(this.model.attributes));
            return this;
        },
        onRender:function(){
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
