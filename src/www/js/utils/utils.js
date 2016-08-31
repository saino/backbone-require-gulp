// 文件名称: utils.js
// 创 建 人: guyy
// 描    述: 工具类
(function(window){
    var utils = {};
    window.utils = utils;
    //IOS顶部工具栏高度
    utils.toolHeight = 40;
    utils.userObj = {id:"QKHoHCHlTFwrBzCO8oY0l3S/TYOEKh66n5TxkNeVCuA3wOlrnDesxD7eOFE1VqVToOYrXB5X5CkCx3huc3yXfvknChUaBEjKeGyYfJSKzUVZA+1gisIy5aUmEZZSZimrHKT0NWJ9IwnRQxCdPsXKSK5k1noMI7C3LxZYwl2dcm0="};
    utils.serverConfig = {
        serverUrl : "http://172.25.13.166:8080"
    };

    /**
     * 检测是否是正确的邮箱
     * @param val
     * @returns {boolean}
     */
    utils.checkIsEmail = function(val){
        var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if(reg.test(val)){
            return true;
        }
        return false;
    };

    /**
     * 检测手机号是否正确
     * @param val
     * @returns {boolean}
     */
    utils.checkIsPhone = function(val){
        var reg = /^1[3-9][0-9]\d{8}$/;
        if(reg.test(val)){
            return true;
        }
        return false;
    };

//    /**
//     * 显示app顶端时间等
//     * @param cb_ok
//     * @param cb_err
//     */
//    utils.showTopBar = function(){
//        if(navigator && navigator.device && navigator.device.capture)
//            navigator.device.capture.showBar("white",null, null);
//    }

    /**
     * requestData 请求数据
     * @param opts ajax配置对象
     * {
     * url：url 路径和参数,       (必填)
     * success：成功回调              (必填)
     * data：向服务器发送的数据       (选填) 如果contentType = "application/json"，data可以用Object或json string,其他类型data只能为string
     * error：失败回调                (选填)
     * type : 请求类型               （选填）
    * dataType ：返回类型，默认为"json"，支持ajax支持的类型 (选填)
     * }
     */
    utils.requestData = function (opts) {
        if (typeof opts.url != "string") {
            throw "url must provided";
        }

        if (typeof opts.success != "function") {
            throw "success must provided";
        }

        if (!opts.type) opts.type = "GET";

        utils.exChangeResultFullData(opts.url, opts.data, opts.success, opts.error, opts.type, opts.dataType)
    };

    /**
     * 获取和提交RESTful数据接口
     * @param url 接口地址
     * @param data  传输数据 如果contentType = "application/json"，data可以用Object或json string,其他类型data只能为string
     * @param success 成功回调
     * @param error  失败回调
     * @param type  取数据type = "GET"，提交数据type = "POST"
     * @param dataType 成功返回数据的格式dataType= "json"或dataType= "text"等ajax支持的格式
     */
    utils.exChangeResultFullData = function (url, data, success, error, type, dataType, contentType) {
        var _type = type || "POST";
        var _dataType = dataType || "json";
        var _contentType = contentType || "application/json";
        $.ajax({
            type       : _type,
            url        : utils.serverConfig.serverUrl + url,
            contentType: _contentType,
            data       : _contentType == "application/json" && typeof data == "object" ? JSON.stringify(data) : data,
            success    : function (result) {
                success && success(result);
            },
            error      : function (msg) {
                error && error(msg);
            },
            dataType   : _dataType
        });
    };

    
})(window);
