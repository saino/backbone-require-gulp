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
        pageIn:function(){
//            if(utils.currValueAdded != null) {
//                this.model.setDetail(utils.currValueAdded?utils.currValueAdded.valueAddedDesc:"");
//            }
            var self = this;
            var valueAddedId = self.getOption("valueAddedId");
            self.model.getIncrementInfo(valueAddedId);
        },
        //点击返回
        _clickBackHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            app.goBack();
        },
        close:function(){

        }
    });
    return IncrementView;
});
