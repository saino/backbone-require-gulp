// 文件名称: PersonalCollectModel
//
// 创 建 人: fishYu
// 创建日期: 2016/9/5 09：26
// 描    述: 我的收藏数据对象
"use strict";
define([], function () {
    var PersonalCollectModel = function () {
    };

    var test = {
        "status": "0",
        "errorMessages": [],
        "userId": 9100001,
        "collectItemList": [{
            planName: "华夏贴心宝",
            transferDeadline: "28天-60周岁",     //交费期限
            safeguardDeadline: "终身",             //保障期限
            salesRightsList : [ {
                "rightId" : 1,
                "rightName" : "终身寿险",
                "rightDesc" : "终身寿险",
                "displayOrder" : 1
            }, {
                "rightId" : 4,
                "rightName" : "单次重疾",
                "rightDesc" : null,
                "displayOrder" : 2
            }, {
                "rightId" : 5,
                "rightName" : "多次轻症",
                "rightDesc" : null,
                "displayOrder" : 3
            }, {
                "rightId" : 9,
                "rightName" : "重疾豁免",
                "rightDesc" : null,
                "displayOrder" : 6
            }, {
                "rightId" : 10,
                "rightName" : "轻症豁免",
                "rightDesc" : null,
                "displayOrder" : 7
            } ],
            objectId : "123456"
        },{
            planName: "华夏贴心宝",
            transferDeadline: "28天-60周岁",     //交费期限
            safeguardDeadline: "终身",             //保障期限
            salesRightsList : [ {
                "rightId" : 1,
                "rightName" : "终身寿险",
                "rightDesc" : "终身寿险",
                "displayOrder" : 1
            }, {
                "rightId" : 4,
                "rightName" : "单次重疾",
                "rightDesc" : null,
                "displayOrder" : 2
            }, {
                "rightId" : 5,
                "rightName" : "多次轻症",
                "rightDesc" : null,
                "displayOrder" : 3
            }, {
                "rightId" : 9,
                "rightName" : "重疾豁免",
                "rightDesc" : null,
                "displayOrder" : 6
            }, {
                "rightId" : 10,
                "rightName" : "轻症豁免",
                "rightDesc" : null,
                "displayOrder" : 7
            } ],
            objectId : "123456"
        },{
            planName: "华夏贴心宝",
            transferDeadline: "28天-60周岁",     //交费期限
            safeguardDeadline: "终身",             //保障期限
            salesRightsList : [ {
                "rightId" : 1,
                "rightName" : "终身寿险",
                "rightDesc" : "终身寿险",
                "displayOrder" : 1
            }, {
                "rightId" : 4,
                "rightName" : "单次重疾",
                "rightDesc" : null,
                "displayOrder" : 2
            }, {
                "rightId" : 5,
                "rightName" : "多次轻症",
                "rightDesc" : null,
                "displayOrder" : 3
            }, {
                "rightId" : 9,
                "rightName" : "重疾豁免",
                "rightDesc" : null,
                "displayOrder" : 6
            }, {
                "rightId" : 10,
                "rightName" : "轻症豁免",
                "rightDesc" : null,
                "displayOrder" : 7
            } ],
            objectId : "123456"
        },{
            planName: "华夏贴心宝",
            transferDeadline: "28天-60周岁",     //交费期限
            safeguardDeadline: "终身",             //保障期限
            salesRightsList : [ {
                "rightId" : 1,
                "rightName" : "终身寿险",
                "rightDesc" : "终身寿险",
                "displayOrder" : 1
            }, {
                "rightId" : 4,
                "rightName" : "单次重疾",
                "rightDesc" : null,
                "displayOrder" : 2
            }, {
                "rightId" : 5,
                "rightName" : "多次轻症",
                "rightDesc" : null,
                "displayOrder" : 3
            }, {
                "rightId" : 9,
                "rightName" : "重疾豁免",
                "rightDesc" : null,
                "displayOrder" : 6
            }, {
                "rightId" : 10,
                "rightName" : "轻症豁免",
                "rightDesc" : null,
                "displayOrder" : 7
            } ],
            objectId : "123456"
        }]
    };

    /**
     * 获取收藏的列表
     * @param currentUserId  当前用户ID
     * @param cb_ok
     * @param cb_err
     */
    PersonalCollectModel.prototype.getCollectItemList = function (currentUserId, cb_ok, cb_err) {
        if (cb_ok) {
            cb_ok(test);
        }
    };


    var personalCollectModel = new PersonalCollectModel();
    return personalCollectModel;
});