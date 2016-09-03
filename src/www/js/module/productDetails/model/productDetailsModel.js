// 文件名称: productDetailsModel
//
// 创 建 人: fishYu
// 创建日期: 2016/8/25 18:46
// 描    述: 产品详情数据对象
"use strict";
define([], function () {
    var ProductDetailsModel = function () {
    };

    var test = {
        "status": "0",
        "errorMessages": [],
        "packageId": 9100001,
        "packageName": "华夏健康人生计划",
        "company": {
            "listId": 3,
            "companyName": "华夏人寿保险股份有限公司",
            "organLogo": "./images/temp/hx-logo.png",
            "abbrName": "华夏",
            "organDesc": null,
            "telephone": "95300",
            "url": null
        },
        "totalVisitCount": 999,
        "amountLimit": {   //保额限制
            "minAmount": 1000000,
            "maxAmount": 9999999999999,
            "moneyId": 1,
            "limitUnit": "元"
        },
        "ageRange": {          //年龄区间
            "minAge": 1,
            "minUnit": "天",
            "maxAge": 999,
            "maxUnit": "周岁"
        },
        "prdtTermChargeList": [{      //费用期间
            "periodType": "3",
            "periodValue": 1      //期限值
        }, {      //费用期间
            "periodType": "3",
            "periodValue": 5      //期限值
        }, {      //费用期间
            "periodType": "3",
            "periodValue": 15      //期限值
        }, {      //费用期间
            "periodType": "3",
            "periodValue": 20      //期限值
        }],
        "prdtTermCoverageList": [
            { //保障期间
                "periodType": "3",
                "periodValue": 60
            }, { //保障期间
                "periodType": "3",
                "periodValue": 70
            }, {
                "periodType": "3",
                "periodValue": 20
            }, {
                "periodType": "3",
                "periodValue": 30
            }],
        "salesRightsList": [{
            "rightId": 1,
            "rightName": "终身寿险",
            "rightDesc": "终身寿险",
            "displayOrder": 1
        }, {
            "rightId": 4,
            "rightName": "单次重疾",
            "rightDesc": null,
            "displayOrder": 2
        }, {
            "rightId": 5,
            "rightName": "多次轻症",
            "rightDesc": null,
            "displayOrder": 3
        }, {
            "rightId": 9,
            "rightName": "重疾豁免",
            "rightDesc": null,
            "displayOrder": 6
        }, {
            "rightId": 10,
            "rightName": "轻症豁免",
            "rightDesc": null,
            "displayOrder": 7
        }, {
            "rightId": 28,
            "rightName": "投保豁免",
            "rightDesc": null,
            "displayOrder": 4
        }, {
            "rightId": 29,
            "rightName": "被保豁免",
            "rightDesc": null,
            "displayOrder": 5
        }],
        "productFeatureList": [{      //特色
            "listId": 100001,
            "featurePic": "./images/temp/range.png",
            "displayOrder": 1,
            "packageId": 9100001
        }, {
            "listId": 100002,
            "featurePic": "./images/temp/long.png",
            "displayOrder": 2,
            "packageId": 9100001
        }, {
            "listId": 100003,
            "featurePic": "./images/temp/limit.png",
            "displayOrder": 3,
            "packageId": 9100001
        }],
        "salesLiabilityList": [        //责任
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
                "liabName": "<em style='color:#e39b2a'>33</em>种轻症疾病额外赔付保险金<em style='color:#e39b2a'>20%</em>，最多<em style='color:#e39b2a'>5</em>次",
                "liabDesc": "未满18周岁，因意外或者90天等待期后因非意外导致身故，给付1.5倍保费，或者90天等待期内因非意外导致身故，给付已交保费；18周岁后，因意外或者90天等待期后因非意外导致身故，给付保额，或者90天等待期内因非意外导致身故，给付已交保费。",
                "liabType": null
            },
            {
                "liabId": 2016004,
                "displayOrder": 4,
                "liabName": "<em style='color:#e39b2a'>77</em>种重疾赔付保险金",
                "liabDesc": "未满18周岁，因意外或者90天等待期后因非意外导致身故，给付1.5倍保费，或者90天等待期内因非意外导致身故，给付已交保费；18周岁后，因意外或者90天等待期后因非意外导致身故，给付保额，或者90天等待期内因非意外导致身故，给付已交保费。",
                "liabType": null
            },
            {
                "liabId": 2016005,
                "displayOrder": 5,
                "liabName": "疾病终末期赔付已交保费",
                "liabDesc": "未满18周岁，因意外或者90天等待期后因非意外导致身故，给付1.5倍保费，或者90天等待期内因非意外导致身故，给付已交保费；18周岁后，因意外或者90天等待期后因非意外导致身故，给付保额，或者90天等待期内因非意外导致身故，给付已交保费。",
                "liabType": null
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
                "liabName": "投保人患<em style='color:#e39b2a'>77</em>种重疾豁免后期保险费",
                "liabDesc": "未满18周岁，因意外或者90天等待期后因非意外导致身故，给付1.5倍保费，或者90天等待期内因非意外导致身故，给付已交保费；18周岁后，因意外或者90天等待期后因非意外导致身故，给付保额，或者90天等待期内因非意外导致身故，给付已交保费。",
                "liabType": null
            },
            {
                "liabId": 2016008,
                "displayOrder": 8,
                "liabName": "投保人患<em style='color:#e39b2a'>33</em>种轻疾豁免后期保险费",
                "liabDesc": "未满18周岁，因意外或者90天等待期后因非意外导致身故，给付1.5倍保费，或者90天等待期内因非意外导致身故，给付已交保费；18周岁后，因意外或者90天等待期后因非意外导致身故，给付保额，或者90天等待期内因非意外导致身故，给付已交保费。",
                "liabType": null
            }, {
                "liabId": 2016009,
                "displayOrder": 9,
                "liabName": "投保人身故豁免后期保险费",
                "liabDesc": "未满18周岁，因意外或者90天等待期后因非意外导致身故，给付1.5倍保费，或者90天等待期内因非意外导致身故，给付已交保费；18周岁后，因意外或者90天等待期后因非意外导致身故，给付保额，或者90天等待期内因非意外导致身故，给付已交保费。",
                "liabType": null
            }, {
                "liabId": 20160010,
                "displayOrder": 10,
                "liabName": "投保人全残豁免后期保险费",
                "liabDesc": "未满18周岁，因意外或者90天等待期后因非意外导致身故，给付1.5倍保费，或者90天等待期内因非意外导致身故，给付已交保费；18周岁后，因意外或者90天等待期后因非意外导致身故，给付保额，或者90天等待期内因非意外导致身故，给付已交保费。",
                "liabType": null
            }],
        "attachProductList": [{        //附加险
            "salesProductId": 100003,
            "salesProductName": "华夏附加住院费用补偿医疗2014",
            "insType": "2"
        }],
        "packageList": [{     //组合列表
            "salesProductId": 100001,
            "salesProductName": "华夏健康人生重大疾病保险",
            "insType": "1"
        }, {
            "salesProductId": 100002,
            "salesProductName": "华夏附加投保人豁免保费重大疾病保险",
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
    ProductDetailsModel.prototype.getProductInfo = function (options, cb_ok, cb_err) {
        // if (cb_ok) {
            // cb_ok(test);
        // }
        var url = utils.serverConfig.serverUrl + "/ls/services/dt/productService/getProductInfo";
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

    //分享产品接口
    ProductDetailsModel.prototype.sharePackage = function(options, cb_ok, cb_err){
        var url = utils.serverConfig.serverUrl + "/ls/services/dt/productService/sharePackage";
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

    //收藏产品接口
    ProductDetailsModel.prototype.collectProduct = function(options, cb_ok, cb_err){
        var url = utils.serverConfig.serverUrl + "/ls/services/dt/productService/collectProduct";
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
    }

    var productDetailsModel = new ProductDetailsModel();
    return productDetailsModel;
});