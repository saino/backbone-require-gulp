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
            this.model.setDetail("<h1>增值服务介绍</h1>"+
                                "<p>VIP增值服务内容</p>"+
                                "<p>3.脑中风后遗症</p>"+
                                "<p>4.重大器官移植术和造血干细胞移植术</p>"+
                                "<p>4.重大器官移植术和造血干细胞移植术</p>"+
                                "<p>4.重大器官移植术和造血干细胞移植术</p>"+
                                "<p>4.重大器官移植术和造血干细胞移植术</p>"+
                                "<p>4.重大器官移植术和造血干细胞移植术</p>"+
                                "<p>4.重大器官移植术和造血干细胞移植术</p>"+
                                "<p>4.重大器官移植术和造血干细胞移植术</p>"+
                                "<p>4.重大器官移植术和造血干细胞移植.重大器官移植术和造血干细胞移植.重大器官移植术和造血干细胞移植术</p>");
            this.model.setHasShare(true);
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
