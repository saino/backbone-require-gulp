/**
 * Created by GYY on 2016/8/24.
 * 增值服务详情页面
 */
define([
    'common/base/base_view',
    'module/disease/model/detailModel',
    'text!module/disease/templates/disease.html'
],function(BaseView,detailModel, DiseaseTpl){
    var IncrementView = BaseView.extend({
        template: _.template(DiseaseTpl),
        id:"disease-container",
        forever:false,
        ui:{
            "topCon":"#top-title",
            "diseaseContent":"#disease-main",
            "btnBack":"#top-title-left" //点击返回
        },
        events:{
            "tap #top-title-left":"_clickBackHandler",
            "tap #top-title-right-1":"_clickShareHandler",  //点击分享
            "tap #top-title-right-2":"_clickCollectHandler"   //点击收藏
        },
        initialize:function(){
            this.model = new detailModel();
            this.model.on("change",this.render,this);
            this.model.setTitle("增值服务详情");
            this.model.setHasShare(false);
        },
        render: function() {
            this.$el.html(this.template(this.model.attributes));
            return this;
        },
        onRender:function(){
            // if(device.ios()){
            //     self.ui.topCon.css("padding-top",utils.toolHeight+"px");
            //     self.ui.diseaseContent.css("height","-webkit-calc(100% - "+(utils.toolHeight+85)+"px)");
            // }
        },
        pageIn:function(){
            if(utils.currValueAdded != null) {
                this.model.setDetail(utils.currValueAdded.valueAddedDesc);
            }
        },
        //点击返回
        _clickBackHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            app.goBack();
        },
        //点击分享
        _clickShareHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            alert("点击分享");
        },
        //点击收藏
        _clickCollectHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            alert("点击收藏");
        },
        close:function(){

        }
    });
    return IncrementView;
});
