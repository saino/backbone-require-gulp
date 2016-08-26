// 文件名称: productDetailsModel
//
// 创 建 人: fishYu
// 创建日期: 2016/8/25 18:46
// 描    述: 产品详情数据对象
"use strict";
define([], function () {
    var AttachDetailsModel = function () {
    };

    var test = {
        "status": "0",
        "errorMessages": [],
        "packageId": 9100001,
        "packageName": "华夏附加住院费用补偿医疗保险（2014）",
        "salesRiderList": [        //附加险列表
            {
                "liabId": 2016001,
                "displayOrder": 1,
                "liabName": "身故赔付已交保费",
                "liabDesc": "未满18周岁，因意外或者90天等待期后因非意外导致身故，给付1.5倍保费，或者90天等待期内因非意外导致身故，给付已交保费；18周岁后，因意外或者90天等待期后因非意外导致身故，给付保额，或者90天等待期内因非意外导致身故，给付已交保费。",
                "liabType": null
            },
            {
                "liabId": 2016002,
                "displayOrder": 2,
                "liabName": "全残赔付已交保费",
                "liabDesc": "未满18周岁，因意外或者90天等待期后因非意外导致身故，给付1.5倍保费，或者90天等待期内因非意外导致身故，给付已交保费；18周岁后，因意外或者90天等待期后因非意外导致身故，给付保额，或者90天等待期内因非意外导致身故，给付已交保费。",
                "liabType": null
            },
            {
                "liabId": 2016003,
                "displayOrder": 3,
                "liabName": "<em style='color:#e39b2a'>33</em>种轻症疾病额外赔付保险金",
                "liabDesc": "未满18周岁，因意外或者90天等待期后因非意外导致身故，给付1.5倍保费，或者90天等待期内因非意外导致身故，给付已交保费；18周岁后，因意外或者90天等待期后因非意外导致身故，给付保额，或者90天等待期内因非意外导致身故，给付已交保费。",
                "liabType": null
            },
            {     //组合列表
                "salesProductId": 100001,
                "salesProductName": "华夏健康人生重大疾病保险",
                "insType": "1"
            }, {
                "salesProductId": 100002,
                "salesProductName": "华夏附加投保人豁免保费重大疾病保险",
                "insType": "0"
            },
            {
                "liabId": 2016006,
                "displayOrder": 6,
                "liabName": "轻疾病豁免保费",
                "liabDesc": "未满18周岁，因意外或者90天等待期后因非意外导致身故，给付1.5倍保费，或者90天等待期内因非意外导致身故，给付已交保费；18周岁后，因意外或者90天等待期后因非意外导致身故，给付保额，或者90天等待期内因非意外导致身故，给付已交保费。",
                "liabType": null
            },
            {
                "liabId": 2016007,
                "displayOrder": 7,
                "liabName": "投保人患<em style='color:#e39b2a'>77</em>种重疾",
                "liabDesc": "未满18周岁，因意外或者90天等待期后因非意外导致身故，给付1.5倍保费，或者90天等待期内因非意外导致身故，给付已交保费；18周岁后，因意外或者90天等待期后因非意外导致身故，给付保额，或者90天等待期内因非意外导致身故，给付已交保费。",
                "liabType": null
            },
            {     //组合列表
                "salesProductId": 100001,
                "salesProductName": "投核保规则",
                "insType": "1"
            }, {
                "salesProductId": 100002,
                "salesProductName": "详细条款",
                "insType": "0"
            }]
    };

    /**
     * 知识搜索
     * @param currentUserId  当前用户ID
     * @param salesPackageId  售卖的保险ID
     * @param cb_ok
     * @param cb_err
     */
    AttachDetailsModel.prototype.getRiderInfo = function (currentUserId, salesPackageId, cb_ok, cb_err) {
        if (cb_ok) {
            cb_ok(test);
        }
    };


    var attachDetailsModel = new AttachDetailsModel();
    return attachDetailsModel;
});