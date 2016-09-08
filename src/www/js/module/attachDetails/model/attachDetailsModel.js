// 文件名称: productDetailsModel
//
// 创 建 人: fishYu
// 创建日期: 2016/8/25 18:46
// 描    述: 产品详情数据对象
"use strict";
define([], function () {
    var AttachDetailsModel = function () {
    };


    /**
     * 知识搜索
     * @param packageId  产品卡ID
     * @param productId  精算产品ID
     * @param salesProductId  售卖的保险ID
     * @param cb_ok
     * @param cb_err
     */
    AttachDetailsModel.prototype.getRiderInfo = function (packageId, productId, salesProductId, cb_ok, cb_err) {
        var opt = {};
        opt.url = "/ls/services/dt/productService/getRiderInfo";
        opt.type = "POST";
        var data = {};
        data.packageId = packageId;
        // data.productId = productId;
        data.salesProductId = salesProductId;
        opt.data = data;
        opt.success = function(result){
            if(result.status == 0){
                if (cb_ok) cb_ok(result);
            }else{
                if(cb_err) cb_err(result)
            }
        };
        opt.error = function(err){
            if(cb_err) cb_err(err)
        };
        utils.requestData(opt);
    };


    var attachDetailsModel = new AttachDetailsModel();
    return attachDetailsModel;
});