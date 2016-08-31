// 文件名称: productDetailsModel
//
// 创 建 人: fishYu
// 创建日期: 2016/8/25 18:46
// 描    述: 产品详情数据对象
"use strict";
define([], function () {
    var SearchModel = function () {
    };

    var p = SearchModel.prototype;
    p.getSearchHistoryAndHotKeywords = function(cb_ok, cb_err){
        var opt = {};
        opt.url = "/ls/services/dt/productService/getSearchHistoryAndHotKeywords";
        opt.type = "POST";
        var data = {};
        data.encryptedUserData = utils.userObj.id;
        opt.data = data;
        opt.success = function(result){
            if(cb_ok) cb_ok(result);
        };
        opt.error = function(err){
            if(cb_ok) cb_ok(err);
        };
        utils.requestData(opt);
    };

    var searchModel = new SearchModel();
    return searchModel;
});