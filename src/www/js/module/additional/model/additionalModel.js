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
    /**
     * 获取附加险列表
     * @param packageId 计划书ID
     * @param addedList 已添加附加险ID
     * @param currMainPlanInfo 主险对象
     * @param cb_ok
     * @param cb_err
     */
    p.getRiders = function(packageId, addedList,currMainPlanInfo,currMainPlanInsured, cb_ok, cb_err){
        var opt = {};
        opt.url = "/ls/services/dt/planService/getRiders";
        opt.type = "POST";
        var data = {};
        data.packageId = packageId;
        if(addedList.length>0) {
            data.addedRiderIds = addedList;
        }
        data.mainCoverages = currMainPlanInfo;
        data.insured = currMainPlanInsured;
        opt.data = data;//JSON.stringify(data);
        opt.success = function(result){
            if(result.status == 0) {
                if(cb_ok) cb_ok(result.ridersList);
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