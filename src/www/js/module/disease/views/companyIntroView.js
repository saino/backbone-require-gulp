/**
 * 寿险公司简介
 * add by guYY 2016/8/24
 */
define([
    'common/base/base_view',
    'module/disease/model/companyIntroModel',
    'text!module/disease/templates/companyIntro.html',
    'msgbox'
],function(BaseView, companyIntroModel, companyIntroTpl, MsgBox){
    var companyIntroView = BaseView.extend({
         id:'companyIntro-container',
         template: _.template(companyIntroTpl),
         ui:{
            "topCon":"#top-title",
            "diseaseContent":"#disease-main",
            "btnBack":"#top-title-left" //点击返回
        },
        events:{
            "tap #top-title-left":"_clickBackHandler"
        },
        initialize:function(){
            this.model = new companyIntroModel();
            this.model.on("change",this.render,this);
            this.model.setTitle("公司简介");
            var organId = this.getOption("organId");
            this.model.getCompanyInfo(organId);
            //this.model.setDetail("<p>长城人寿保险股份有限公司（简称）“长城人寿”是一家经中国保险监督管理委员会批准设立的全国性人寿保险公司。以“打造服务最好的保险品牌”为目标，倡导“让服务成为我们的生活方式 ”，致力于为客户提供适合的保险产品和便捷的服务，为员工提供良好的工作环境和成长空间</p>"+
            //                    "<p>成立时间：2016年8月23日</p>"+
            //                    "<p>注册资金：2，335，351，522元</p>");
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
    return companyIntroView;
}); 