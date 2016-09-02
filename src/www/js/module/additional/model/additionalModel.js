// 文件名称: productDetailsModel
//
// 创 建 人: fishYu
// 创建日期: 2016/8/25 18:46
// 描    述: 产品详情数据对象
"use strict";
define([], function () {
    var AdditionalModel = function () {
    };

    var p = AdditionalModel.prototype;

    p.getRiders = function(packageId, addedList, cb_ok, cb_err){
        var opt = {};
        opt.url = "/ls/services/dt/planService/getRiderInfo";
        opt.type = "POST";
        var data = {};
        data.packageId = packageId;
        data.addedRiderIds = addedList;
        opt.data = data;
        opt.success = function(result){
            if(result.status == 0) {
                if(cb_ok) cb_ok(result);
            }else {
                if(cb_err) cb_err(result.errorMessages);
            }
        };
        opt.error = function(err){
            if(cb_err) cb_err(err);
        };
        utils.requestData(opt);
    };

    var additionalModel = new AdditionalModel();
    return additionalModel;
});