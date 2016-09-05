// 文件名称: PersonalCustomerModel
//
// 创 建 人: fishYu
// 创建日期: 2016/9/5 11:46
// 描    述: 我的计划书数据对象
"use strict";
define([], function () {
    var PersonalCustomerModel = function () {
    };

    var test = {
        "status": "0",
        "errorMessages": [],
        "userId": 9100001,
        "planItemList": [{
            applicantName: "王五",        //投保人名称
            createTime: "2016年8月24日",
            planName: "华夏贴心宝",
            recognizeeInfo : "张三 男 33岁",    //被保人，性别，年龄
            transferDeadline: "交20年保险",     //交费期限
            safeguardDeadline: "保终身",             //保障期限
            coverage: "保额100万",            //保额
            premium: "首年保费20735.37元",    //首年保费
            objectId : "123456"
        },{
            applicantName: "王五",        //投保人名称
            createTime: "2016年8月24日",
            planName: "华夏贴心宝",
            recognizeeInfo : "张三 男 33岁",    //被保人，性别，年龄
            transferDeadline: "交20年保险",     //交费期限
            safeguardDeadline: "保终身",             //保障期限
            coverage: "保额100万",            //保额
            premium: "首年保费20735.37元",    //首年保费
            objectId : "123456"
        },{
            applicantName: "王五",        //投保人名称
            createTime: "2016年8月24日",
            planName: "华夏贴心宝",
            recognizeeInfo : "张三 男 33岁",    //被保人，性别，年龄
            transferDeadline: "交20年保险",     //交费期限
            safeguardDeadline: "保终身",             //保障期限
            coverage: "保额100万",            //保额
            premium: "首年保费20735.37元",    //首年保费
            objectId : "123456"
        },{
            applicantName: "王五",        //投保人名称
            createTime: "2016年8月24日",
            planName: "华夏贴心宝",
            recognizeeInfo : "张三 男 33岁",    //被保人，性别，年龄
            transferDeadline: "交20年保险",     //交费期限
            safeguardDeadline: "保终身",             //保障期限
            coverage: "100万元",            //保额
            premium: "20735.37元",    //首年保费
            objectId : "123456"
        }]
    };

    /**
     * 知识搜索
     * @param currentUserId  当前用户ID
     * @param cb_ok
     * @param cb_err
     */
    PersonalCustomerModel.prototype.getPlanItemList = function (currentUserId, cb_ok, cb_err) {
        if (cb_ok) {
            cb_ok(test);
        }
    };

    /**
     * 知识搜索
     * @param currentUserId  当前用户ID
     * @param key  当前模糊搜索的内容
     * @param cb_ok
     * @param cb_err
     */
    PersonalCustomerModel.prototype.searchPlanItemList = function (currentUserId, key, cb_ok, cb_err) {
        if (cb_ok) {
            cb_ok(test);
        }
    };


    var personalCustomerModel = new PersonalCustomerModel();
    return personalCustomerModel;
});