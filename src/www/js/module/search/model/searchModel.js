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

    /*****************************搜索功能************************************************/
    /**
     * 获取历史记录和热搜索
     * @param cb_ok
     * @param cb_err
     */
    p.getSearchHistoryAndHotKeywords = function(cb_ok, cb_err){
        var opt = {};
        opt.url = "/ls/services/dt/productService/getSearchHistoryHotKeywords";
        opt.type = "POST";
        var data = {};
        data.encryptedUserData = utils.userObj.id;
        opt.data = data;
        opt.success = function(result){
            if(result.status == 0) {
                if(cb_ok) cb_ok(result);
            }else {
                if(cb_err) cb_err(result.errorMessages);
            }
        };
        opt.error = function(err){
            if(cb_err) cb_err(err);
        };
        utils.requestData(opt);
    };

    /**
     * 删除搜索历史
     * @param keywords （选填）
     * @param cb_ok
     * @param cb_err
     */
    p.clearSearchHistory = function(keywords, cb_ok, cb_err){
        var opt = {};
        opt.url = "/ls/services/dt/productService/clearSearchHistory";
        opt.type = "POST";
        var data = {};
        data.encryptedUserData = utils.userObj.id;
        opt.data = data;
        if(keywords){
            opt.searchWords = keywords;
        }
        opt.success = function(result){
            if(result.status == 0) {
                if(cb_ok) cb_ok(result);
            }else {
                if(cb_err) cb_err(result.errorMessages);
            }
        };
        opt.error = function(err){
            if(cb_err) cb_err(err);
        };
        utils.requestData(opt);
    };

    /*********************************高级筛选**************************************/
    p.getAdvancedFilters = function(cb_ok, cb_err){
        var opt = {};
        opt.url = "/ls/services/dt/productService/getAdvancedFilters";
        opt.type = "GET";
        opt.success = function(result){
            if(result.status == 0) {
                if(cb_ok) cb_ok(result);
            }else {
                if(cb_err) cb_err(result.errorMessages);
            }
        };
        opt.error = function(err){
            if(cb_err) cb_err(err);
        };
        utils.requestData(opt);
    };

    var searchModel = new SearchModel();
    return searchModel;
});