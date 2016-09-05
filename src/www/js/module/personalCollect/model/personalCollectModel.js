// 文件名称: PersonalCollectModel
//
// 创 建 人: fishYu
// 创建日期: 2016/9/5 09：26
// 描    述: 我的收藏数据对象
"use strict";
define([], function () {
    var PersonalCollectModel = function () {
    };
    // var test = {
    //     "status": "0",
    //     "errorMessages": [],
    //     "userId": 9100001,
    //     "planItemList": [{
    //         applicantName: "王五",        //投保人名称
    //         createTime: "2016年8月24日",
    //         planName: "华夏贴心宝",
    //         recognizeeInfo : "张三 男 33岁",    //被保人，性别，年龄
    //         transferDeadline: "交20年保险",     //交费期限
    //         safeguardDeadline: "保终身",             //保障期限
    //         coverage: "保额100万",            //保额
    //         premium: "首年保费20735.37元",    //首年保费
    //         objectId : "123456"
    //     },{
    //         applicantName: "王五",        //投保人名称
    //         createTime: "2016年8月24日",
    //         planName: "华夏贴心宝",
    //         recognizeeInfo : "张三 男 33岁",    //被保人，性别，年龄
    //         transferDeadline: "交20年保险",     //交费期限
    //         safeguardDeadline: "保终身",             //保障期限
    //         coverage: "保额100万",            //保额
    //         premium: "首年保费20735.37元",    //首年保费
    //         objectId : "123456"
    //     },{
    //         applicantName: "王五",        //投保人名称
    //         createTime: "2016年8月24日",
    //         planName: "华夏贴心宝",
    //         recognizeeInfo : "张三 男 33岁",    //被保人，性别，年龄
    //         transferDeadline: "交20年保险",     //交费期限
    //         safeguardDeadline: "保终身",             //保障期限
    //         coverage: "保额100万",            //保额
    //         premium: "首年保费20735.37元",    //首年保费
    //         objectId : "123456"
    //     },{
    //         applicantName: "王五",        //投保人名称
    //         createTime: "2016年8月24日",
    //         planName: "华夏贴心宝",
    //         recognizeeInfo : "张三 男 33岁",    //被保人，性别，年龄
    //         transferDeadline: "交20年保险",     //交费期限
    //         safeguardDeadline: "保终身",             //保障期限
    //         coverage: "100万元",            //保额
    //         premium: "20735.37元",    //首年保费
    //         objectId : "123456"
    //     }]
    // };

    /**
     * 获取收藏的列表
     * @param currentUserId  当前用户ID
     * @param cb_ok
     * @param cb_err
     */
    // PersonalCollectModel.prototype.getCollectItemList = function (currentUserId, cb_ok, cb_err) {
    //     if (cb_ok) {
    //         cb_ok(test);
    //     }
    // };

    //获取收藏产品
    PersonalCollectModel.prototype.getCollectedProductList = function(options, cb_ok, cb_err){
        var url = utils.serverConfig.serverUrl + "/ls/services/dt/productService/getCollectedProductList";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(options),
            contentType: "application/json",
            dataType: "json",
            processData: false,
            success: function(data){
                cb_ok && cb_ok(data);
            },
            error: function(data){
                cb_err && cb_err(data);
            }
        });

    };

    //删除收藏产品
    PersonalCollectModel.prototype.deleteCollectProduct = function(options, cb_ok, cb_err){
        var url = utils.serverConfig.serverUrl + "/ls/services/dt/productService/deleteCollectProduct";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(options),
            contentType: "application/json",
            dataType: "json",
            processData: false,
            success: function(data){
                cb_ok && cb_ok(data);
            },
            error: function(data){
                cb_err && cb_err(data);
            }
        });
    };

    var personalCollectModel = new PersonalCollectModel();
    return personalCollectModel;
});