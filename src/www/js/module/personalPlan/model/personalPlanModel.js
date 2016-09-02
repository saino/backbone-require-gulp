// 文件名称: personalPlanModel
//
// 创 建 人: fishYu
// 创建日期: 2016/9/2 18:46
// 描    述: 我的计划书数据对象
"use strict";
define([], function () {
    var PersonalPlanModel = function () {
    };

    var test = {
        
    };

    /**
     * 知识搜索
     * @param currentUserId  当前用户ID
     * @param salesPackageId  售卖的保险ID
     * @param cb_ok
     * @param cb_err
     */
    PersonalPlanModel.prototype.getProductInfo = function (currentUserId, salesPackageId, cb_ok, cb_err) {
        if (cb_ok) {
            cb_ok(test);
        }
    };


    var personalPlanModel = new PersonalPlanModel();
    return personalPlanModel;
});