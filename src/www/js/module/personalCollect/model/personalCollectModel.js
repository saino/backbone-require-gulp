// 文件名称: PersonalCollectModel
//
// 创 建 人: fishYu
// 创建日期: 2016/9/5 09：26
// 描    述: 我的收藏数据对象
"use strict";
define([], function () {
    var PersonalCollectModel = function () {
    };
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