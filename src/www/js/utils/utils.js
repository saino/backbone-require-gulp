// 文件名称: utils.js
//
// 创 建 人: chenshy
// 创建日期: 2014/08/22
// 描    述: 工具类
(function(window){
    var utils = {};
    window.utils = utils;

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

    /**
     * 显示app顶端时间等
     * @param cb_ok
     * @param cb_err
     */
    utils.showTopBar = function(){
        if(navigator && navigator.device && navigator.device.capture)
            navigator.device.capture.showBar("white",null, null);
    }

    
})(window);
