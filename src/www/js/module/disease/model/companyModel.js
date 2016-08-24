/**
 * 公司简介数据类 
 * add by guYY 2016/8/24
 */
define([
    'backbone'
],function(){
    var detailModel = Backbone.Model.extend({
        constructor:function(){
            Backbone.Model.apply(this,arguments);
        },
        initialize:function(){
            var self = this;
            self.set({"title":"","detailContent":"","hasShare":false,"isIos":device.ios()});//是否函分享按钮
            if(device.ios()){
                self.set({"paddingTop":'style="padding-top:'+utils.toolHeight+'px"',"conHeight":'style="height:-webkit-calc(100% - '+(utils.toolHeight+85+130)+'px)"'});
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
        /**
         * 设置是否可分享收藏
         * share :boolean
         */
        setHasShare:function(share){
            this.set({"hasShare":share});
        }    
    });
    return detailModel;
});