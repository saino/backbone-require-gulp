/**
 * 简单模块通用数据类 
 * add by guYY 2016/8/24
 */
define([
    'backbone',
],function(){
    var detailModel = Backbone.Model.extend({
        constructor:function(){
            Backbone.Model.apply(this,arguments);
        },
        initialize:function(){
            var self = this;
            self.set({"title":"","detailContent":"","btnsHtml":"","isIos":device.ios()});//是否函分享按钮
            if(device.ios()){
                self.set({"paddingTop":'style="padding-top:'+utils.toolHeight+'px"',"conHeight":'style="height:-webkit-calc(100% - '+(utils.toolHeight+85)+'px)"'});
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
            if(share){
                this.set({"btnsHtml":'<div id="top-title-right-2"></div><div id="top-title-right-1"></div>'});
            }else{
                this.set({"btnsHtml":''});
            }            
        },

        /**
         * 获取某一产品的病种详情
         */
        getDeseaseInfo : function(packageId,productId,libId,cb_err){
            var self = this;
            var opt = {};
            opt.url = "/ls/services/dt/planService/getLiabDiseaseInfo";
            opt.type = "POST";
            var data = {};
            data.packageId = packageId;
            data.productId = productId;
            data.liabId = libId;
            opt.data = data;
            opt.success = function(result){
                if(result.status == 0){
                    self.setDetail(result.diseaseDesc||"");
                }else{
                    self.setDetail('<p class="no-data-p2">病种详情查询失败</p>');
                    console.log("病种详情加载失败packageId="+packageId+",productId="+productId+",libId="+libId);
                }
            };
            opt.error = function(err){
                self.setDetail('<p class="no-data-p2">病种详情查询失败</p>');
                console.log("病种详情加载失败packageId="+packageId+",productId="+productId+",libId="+libId);
            };
            utils.requestData(opt);
        }

    });
    return detailModel;
});