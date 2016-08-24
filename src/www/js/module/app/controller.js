// 文件名称: controller.js
//
// 创 建 人: guyy
// 创建日期: 2016/8/10 15:00
// 描    述: app总控制器，只能导入控制器
define([
    'module/insurance/controller',
    'module/plan/controller',
    'module/browseRecords/controller',
    'module/additional/controller',
    'module/disease/controller',
    'module/clause/controller',
    'module/detailsDescription/controller'
],function(){
    var controllers = {
    };

    for(var i = 0;i < arguments.length;i++){
        _.extend(controllers,arguments[i]);
    }

    return controllers;
});