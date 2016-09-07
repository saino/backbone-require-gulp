// 文件名称: AppRouter
//
// 创 建 人: zhao
// 创建日期: 2016/8/8 14:00
// 描    述: AppRouter
define([
    'marionette',
    'router/BaseRouter',
    "msgbox"
], function (mn, BaseRouter, msgbox) {
    return BaseRouter.extend({
        initialize: function () {
        },

        /**配置路由**/
        appRoutes: {
            "": "lifeInsurance",

            "in/plan/:id": "plan",  //计划书页
            "in/additional/:planId":"additional",   //附加险列表
            "in/additional/:planId/:list":"additional",   //附加险列表
            "in/disease/:packageId/:productId/:libId":"disease",   //病种详情
            "in/increment":"increment", //增值服务详情
            "in/clause/:id":"clause",   //条款详情
            "in/clauseList":"clauseList",   //条款列表
            "in/companyIntro/:id":"companyIntro",   //寿险 公司简介
            "in/search":"search", //产品搜索
            'in/advanceQuery':"advanceQuery",//产品高级筛选
            "home/browseRecords": "browseRecords", //浏览记录
            "home/lifeInsurance": "lifeInsurance",       //寿险查询结果列表
            "home/detailsDescription/:detailsDescriptionId/:organId": "detailsDescription",   //详情说明
            "in/productDetails/:productId":"productDetails",   //寿险 产品详情
            "in/attachDetails/:packageId/:productId/:salesProductId" : "attachDetails",   //寿险 附加详情
            "in/makePlan": "makePlan",  //制作计划书
            "in/makePlan/:productId": "makePlan",  //制作计划书
            "in/personalPlan": "personalPlan",  //个人计划书， 这里默认有当前用户ID
            "in/personalCollect": "personalCollect",  //个人收藏， 这里默认有当前用户ID
            "in/personalCustomer/:type": "personalCustomer"  //个人客户， 这里默认有当前用户ID
        },

        /**未登陆时需要过滤的路由**/
        loginFilters: {

        },
        /**当前路由，如果调用返回，返回到指定路由**/
        backRoutes: {

        }
    });
});