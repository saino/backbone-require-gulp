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
        "status": "0",
        "errorMessages": [
            
        ],
        "planCardList": [
            {
            "quotationId": 1011203,
            "phName": "五大",
            "generateDate": "2016-09-05T06:18:27",
            "packageName": "福临门2015铂金版",
            "insured": {        //
                "id": "0",
                "name": "五大",
                "age": 28,
                "gender": "M",      //被保人性别。M：男，F：女
                "jobCateId": null,
                "socialInsuranceIndi": "Y",
                "smoking": null
            },
            "mainCoverage": {           //主险
                "productId": 100009,
                "masterProductId": null,
                "unitFlag": 7,
                "sa": 1000,     //保额
                "premium": 10000,
                "unit": null,
                "benefitlevel": null,
                "chargePeriod": {   //交费期限
                    "periodType": 1,
                    "periodValue": 1
                },
                "coveragePeriod": {     //保障期限
                    "periodType": 1,
                    "periodValue": 0
                },
                "firstYearPrem": 1000,
                "planLiabilityList": [
                    {
                        "liabId": 8016,
                        "unitFlag": 7,
                        "value": 100
                    }
                ],
                "insuredIds": [
                    "0"
                ]
            },
            "totalFirstYearPrem": 1000      //保费
            },
            {
            "quotationId": 1011204,
            "phName": "张三",
            "generateDate": "2016-09-04T07:18:27",
            "packageName": "福临门2015铂金版",
            "insured": {        //
                "id": "0",
                "name": "张三",
                "age": 28,
                "gender": "M",      //被保人性别。M：男，F：女
                "jobCateId": null,
                "socialInsuranceIndi": "Y",
                "smoking": null
            },
            "mainCoverage": {           //主险
                "productId": 100009,
                "masterProductId": null,
                "unitFlag": 7,
                "sa": 1000,     //保额
                "premium": 10000,
                "unit": null,
                "benefitlevel": null,
                "chargePeriod": {   //交费期限
                    "periodType": 4,
                    "periodValue": 1
                },
                "coveragePeriod": {     //保障期限
                    "periodType": 1,
                    "periodValue": 0
                },
                "firstYearPrem": 1000,
                "planLiabilityList": [
                    {
                        "liabId": 8016,
                        "unitFlag": 7,
                        "value": 100
                    }
                ],
                "insuredIds": [
                    "0"
                ]
            },
            "totalFirstYearPrem": 1000      //保费
            },{
            "quotationId": 1011205,
            "phName": "李四",
            "generateDate": "2016-09-03T08:18:27",
            "packageName": "福临门2015铂金版",
            "insured": {        //
                "id": "0",
                "name": "李四",
                "age": 28,
                "gender": "M",      //被保人性别。M：男，F：女
                "jobCateId": null,
                "socialInsuranceIndi": "Y",
                "smoking": null
            },
            "mainCoverage": {           //主险
                "productId": 100009,
                "masterProductId": null,
                "unitFlag": 7,
                "sa": 1000,     //保额
                "premium": 10000,
                "unit": null,
                "benefitlevel": null,
                "chargePeriod": {   //交费期限
                    "periodType": 1,
                    "periodValue": 1
                },
                "coveragePeriod": {     //保障期限
                    "periodType": 1,
                    "periodValue": 0
                },
                "firstYearPrem": 1000,
                "planLiabilityList": [
                    {
                        "liabId": 8016,
                        "unitFlag": 7,
                        "value": 100
                    }
                ],
                "insuredIds": [
                    "0"
                ]
            },
            "totalFirstYearPrem": 1000      //保费
            },{
            "quotationId": 1011206,
            "phName": "陈六",         //投保人
            "generateDate": "2016-09-02T09:18:27",
            "packageName": "福临门2015铂金版",
            "insured": {        //被保人
                "id": "0",
                "name": "陈六",
                "age": 28,
                "gender": "F",      //被保人性别。M：男，F：女
                "jobCateId": null,
                "socialInsuranceIndi": "Y",
                "smoking": null
            },
            "mainCoverage": {           //主险
                "productId": 100009,
                "masterProductId": null,
                "unitFlag": 7,
                "sa": 1000,     //保额
                "premium": 10000,
                "unit": null,
                "benefitlevel": null,
                "chargePeriod": {   //交费期限
                    "periodType": 2,
                    "periodValue": 20
                },
                "coveragePeriod": {     //保障期限
                    "periodType": 1,
                    "periodValue": 0
                },
                "firstYearPrem": 1000,
                "planLiabilityList": [
                    {
                        "liabId": 8016,
                        "unitFlag": 7,
                        "value": 100
                    }
                ],
                "insuredIds": [
                    "0"
                ]
            },
            "totalFirstYearPrem": 1000      //保费
            },{
            "quotationId": 1011207,
            "phName": "武大郎",
            "generateDate": "2016-09-01T10:18:27",
            "packageName": "福临门2015铂金版",
            "insured": {        //
                "id": "0",
                "name": "武大郎",
                "age": 28,
                "gender": "M",      //被保人性别。M：男，F：女
                "jobCateId": null,
                "socialInsuranceIndi": "Y",
                "smoking": null
            },
            "mainCoverage": {           //主险
                "productId": 100009,
                "masterProductId": null,
                "unitFlag": 7,
                "sa": 1000,     //保额
                "premium": 10000,
                "unit": null,
                "benefitlevel": null,
                "chargePeriod": {   //交费期限
                    "periodType": 3,
                    "periodValue": 50
                },
                "coveragePeriod": {     //保障期限
                    "periodType": 1,
                    "periodValue": 0
                },
                "firstYearPrem": 1000,
                "planLiabilityList": [
                    {
                        "liabId": 8016,
                        "unitFlag": 7,
                        "value": 100
                    }
                ],
                "insuredIds": [
                    "0"
                ]
            },
            "totalFirstYearPrem": 1000      //保费
            }
        ]
        };

    /**
     * 知识搜索
     * @param currentUserId  当前用户ID
     * @param cb_ok
     * @param cb_err
     */
    PersonalPlanModel.prototype.getPlanItemList = function (currentUserId, cb_ok, cb_err) {
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
    PersonalPlanModel.prototype.searchPlanItemList = function (currentUserId, key, cb_ok, cb_err) {
        if (cb_ok) {
            cb_ok(test);
        }
    };


    var personalPlanModel = new PersonalPlanModel();
    return personalPlanModel;
});