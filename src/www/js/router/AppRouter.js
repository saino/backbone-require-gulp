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
            "": "insurance",

            /*登陆注册*/
            "in/plan": "plan",
            "in/additional":"additional",
            "home/browseRecords": "browseRecords"
        },

        /**未登陆时需要过滤的路由**/
        loginFilters: {

        },
        /**当前路由，如果调用返回，返回到指定路由**/
        backRoutes: {

        }
    });
});