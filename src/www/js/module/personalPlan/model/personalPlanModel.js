// 文件名称: personalPlanModel
//
// 创 建 人: fishYu
// 创建日期: 2016/9/2 18:46
// 描    述: 我的计划书数据对象
"use strict";
define([], function () {
    var PersonalPlanModel = function () {
    };
    /**
     * 获取我的计划书列表
     * @param currentUserId  当前用户ID
     * @param cb_ok
     * @param cb_err
     */
    PersonalPlanModel.prototype.getPlanItemList = function ( cb_ok, cb_err) {
        var opt = {};
        opt.url = "/ls/services/dt/planService/getPlanList";
        opt.type = "POST";
        var data = {};
        data.encryptedUserData = utils.userObj.id;
        opt.data = data;
        opt.success = function(result){
            if(result.status == 0){
                if (cb_ok) cb_ok(result);
            }else{
                if(cb_err) cb_err("数据错误")
            }
        };
        opt.error = function(err){
            if(cb_err) cb_err(err)
        };
        utils.requestData(opt);
    };

    /**
     * 删除计划
     * @param type  0清空所有   1删除单个计划书
     * @param quotationId  计划书ID
     * @param cb_ok
     * @param cb_err
     */
    PersonalPlanModel.prototype.delPlan = function (type,quotationId, cb_ok, cb_err) {
        var opt = {};
        opt.url = "/ls/services/dt/planService/deletePlan";
        opt.type = "POST";
        var data = {};
        data.encryptedUserData = utils.userObj.id;
        if(type == 1) {
            data.quotationId = quotationId;
        }
        opt.data = data;
        opt.success = function(result){
            if(result.status == 0){
                if (cb_ok) cb_ok(result);
            }else{
                if(cb_err) cb_err("删除失败")
            }
        };
        opt.error = function(err){
            if(cb_err) cb_err(err)
        };
        utils.requestData(opt);
    };
    var personalPlanModel = new PersonalPlanModel();
    return personalPlanModel;
});