/**
 * Created by GYY on 2016/8/22.
 * 条款页面
 */
define([
    'common/base/base_view',
    'text!module/productDetails/templates/productDetails.html'
],function(BaseView, Tpl){
    var ProductDetailsView = BaseView.extend({
        template: _.template(Tpl),
        id:"product-details-container",
        ui:{
            "topCon":".top-title",
            "btnBack":".top-title-left", //点击返回
            "productDetailsMain" : "#product-details-main"
        },
        events:{
            "tap @ui.btnBack":"onBtnBackHandler"
        },
        initialize:function(){

        },
        onRender:function(){
            var self = this;
            if(device.ios()){
                self.ui.topCon.css("padding-top",utils.toolHeight+"px");
            }
            setTimeout(function(){
                var height = self.ui.topCon.outerHeight(true);
                self.ui.productDetailsMain.css({height: "calc(100% - " + height + "px)"});
            }, 0)

        },
        pageIn:function(){

        },
        //点击返回
        onBtnBackHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            app.goBack();
        },
        close:function(){

        }
    });
    return ProductDetailsView;
});
