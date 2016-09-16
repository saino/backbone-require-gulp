/**
 * 公司简介数据类 
 * add by guYY 2016/8/24
 */
define([
    'backbone',
    'msgbox',
    'common/views/circle'
],function(backbone, MsgBox, loadingCircle){
    var companyIntroModel = Backbone.Model.extend({
        constructor:function(){
            Backbone.Model.apply(this,arguments);
        },
        initialize:function(){
            var self = this;
            self.set({"title":"","detailContent":"","hasShare":false,"isIos":device.ios(), companyPhone:""});//是否函分享按钮
            if(device.ios()){
                self.set({"paddingTop":'style="padding-top:'+utils.toolHeight+'px"',"conHeight":'style="height:-webkit-calc(100% - '+(utils.toolHeight+235)+'px)"'});
            }else{
                self.set({"paddingTop":"","conHeight":""});
            }
        },
        //标题 如病种详情、公司介绍等        
        setTitle:function(title){
            if(title && title != ""){
                this.set({"title":title});
            }else{
                this.set({"title":""});
            }
        },
        //内容详情
        setDetail:function(detailContent){
            if(detailContent && detailContent != ""){
                this.set({"detailContent":detailContent});
            }else{
                this.set({"detailContent":""});
            }
        },

        setPhoneNumber : function(number){
            if(number){
                number = "tel:"+number;
            }else{
                number = "";
            }
            this.set({companyPhone:number});
        },
        /**
         * 设置是否可分享收藏
         * share :boolean
         */
        setHasShare:function(share){
            this.set({"hasShare":share});
        },

        getCompanyInfo : function(organId){
            LoadingCircle && LoadingCircle.start();
            var self = this;
            var opt = {};
            opt.url = "/ls/services/dt/productService/getCompanyInfo";
            opt.type = "POST";
            var data = {};
            data.organId = organId;
            opt.data = data;
            opt.success = function(result){
                console.log(result);
                if(result.status == 0) {
                    if(result.companyInfo.length){
                        self.setDetail(result.companyInfo[0].organDesc);
                        self.setPhoneNumber(result.companyInfo[0].telephone);
                    }
                }else{
                    setTimeout(function(){
                        MsgBox.alert("数据获取失败");
                    }, 350);
                }
                LoadingCircle && LoadingCircle.end();
            };
            opt.error = function(err){
                setTimeout(function(){
                    MsgBox.alert("数据获取失败");
                }, 350);
                LoadingCircle && LoadingCircle.end();
            };
            utils.requestData(opt);
        }
    });
    return companyIntroModel;
});