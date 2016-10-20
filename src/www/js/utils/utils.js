// 文件名称: utils.js
// 创 建 人: guyy
// 描    述: 工具类
(function(window){
    var utils = {};
    window.utils = utils;
    utils.isDebug = true;//true 原生   faplse 浏览器
    var href = window.location.href;
//    if(href.indexOf("210.13.77.75") >= 0){
//        utils.isDebug = true;
//    }
    utils.isShare = false;//是否分享链接进入
    //IOS顶部工具栏高度
    utils.toolHeight = 40;
    utils.userObj = {id:"mO9Ck8aUljOXBglrKYPu/1gd7T4nTzEFxN0+GruRM9JMCq8a8qRyTaWs7Sh2FpFemRJK6aVGIN7SOThIPHmwbamJKNrEMOsjBQloOj54UxDHBXYmpBSazn0lYxr1LcaTWtPGUGwP2pOXUwo79/4d6IuAy/CEUBIAEufB8NRO2xMxCtW4EiZxxF6VSzigsCXWOWSUcJbNct1igGjl4N/RfwULsNptX/MkfVR+QnppvTwbaU+V9JJ9TisLic14zAAxYoMg8V4ySrwAEtG6WjEoz4Ndm/1wOvgrjtrxwW3KVdGtNWs9ph85f0ejjWN5sAX6/lecd27hhDW60aOGPOhJYg=="};
    if(utils.isDebug){
        utils.userObj.id = "";
    }
    utils.serverConfig = {
        serverUrl: window.cfgServerUrl//"http://210.13.77.75:8080"       //外网开发环境
//        serverUrl: "http://172.25.13.166:8080"       //内网开发环境
//        serverUrl: "http://120.55.176.131:8080"      //外网测试环境
    };
    utils.tempUser = {id:""};//监听用户ID，计划书分享用 add by guYY 9/19 20:22

    //进入寿险列表查询也是否需要重新加载数据
    utils.isLifeInsuranceRefresh = true;
    //是否初始化查询条件
    utils.isInitOption = true;
    //是否初始化保险公司
    utils.isInitCompany = true;

    utils.advanceSaleTypeIds = [];
    utils.advanceRightIds = [];
    // utils.advanceCompanyLists = [];

    utils.companyId = "all";
    utils.advancedCompanyId = [];

    //输入的搜索词
    utils.searchText = "";
    //查找时的搜索词
    utils.toSearchText = "";

    //案例说明的图片地址
    utils.caseExplain = [];
    //当前增值服务详情对象
    utils.currValueAdded = null;
    //年龄单位  暂只判断  天  年
    utils.AGE_0 = 0; //NA
    utils.AGE_1 = 1; //年
    utils.AGE_2 = 2; //半年
    utils.AGE_3 = 3; //季
    utils.AGE_4 = 4; //月
    utils.AGE_5 = 5; //天

    //clickLock
    utils.isClickLock = false;
    utils.clickLock = function(){
        setTimeout(function(){
            utils.isClickLock = false;
            console.log("openLock");
        },300);
        if(utils.isClickLock){
            console.log("isLocked");
            return true;
        }else{
            console.log("noLocked");
            utils.isClickLock = true;
            return false;
        }
    }

    //格式化金额
    utils.formatNumber = function(num){
        if(!num)
            return "0";
        if(num % 10000 == 0){
            return num / 10000 +"万"
        }
        return num;
    }
    //格式化金额2 带"元”
    utils.formatNumber2 = function(num){
        if(!num)
            return "0元";
        if(num % 10000 == 0){
            return num / 10000 +"万元"
        }
        return num+"元";
    }
    //是否正整数
    utils.isPositiveNum = function(s){//是否为正整数
        var re = /^[0-9]*[1-9][0-9]*$/ ;
        return re.test(s)
    }
    //获取年金领取时间 periodType=2 value年后领    periodType=3时 value岁
    utils.getAnnuityText = function(periodType,value){
        var str = "";
        if(periodType == 3){
            str = value+"年后领";
        }else if(periodType == 2){
            str = value+"岁";
        }
        return str;
    }
    /**
     * 根据两个交费期限比较交费时间长短 前者大等于后者返回1  小于返回0
     * @param chargeType1   1趸交  2交value年  3交到value岁 4交终身
     * @param chargeValue1
     * @param chargeAge1
     * @param chargeType2   1趸交  2交value年  3交到value岁 4交终身
     * @param chargeValue2
     * @param chargeAge2
     */
    utils.compareCharge = function(chargeType1,chargeValue1,chargeAge1,chargeType2,chargeValue2,chargeAge2){
        var result = 0;
        chargeValue1 = parseInt(chargeValue1);
        chargeValue2 = parseInt(chargeValue2);
        chargeAge1 = chargeAge1 || 0;
        chargeAge2 = chargeAge2 || 0;
        if(chargeType1 == 1){
            if(chargeType2 == 1){
                result = 1;
            }else if(chargeType2 == 2){
                if(chargeValue2 == 1)
                    return 1;
                else
                    return 0;
            }else if(chargeType2 == 3){
                if(chargeValue2 - chargeAge2 <= 1)
                    return 1;
                else
                    return 0;
            }else{
                result = 0;
            }
        }else if(chargeType1 == 2){
            var num1 = chargeValue1;
            var num2 = chargeValue2;
            if(chargeType2 == 1){
                result = 1;
            }else if(chargeType2 == 2){
                result = num1 >= num2 ? 1:0;
            }else if(chargeType2 == 3){
                num2 = chargeValue2 - chargeAge2;
                result = num1 >= num2 ? 1:0;
            }else if(chargeType2 == 4){
                result = 0;
            }
        }else if(chargeType1 == 3){
            var num1 = chargeValue1 - chargeAge1;
            var num2 = chargeValue2;
            if(chargeType2 == 1){
                result = 1;
            }else if(chargeType2 == 2){
                result = num1 >= num2 ? 1:0;
            }else if(chargeType2 == 3){
                num2 = chargeValue2 - chargeAge2;
                result = num1 >= num2 ? 1:0;
            }else if(chargeType2 == 4){
                result = 0;
            }
        }else if(chargeType1 == 4){
            result = 1;
        }
        return result;
    }
    /**
     * 根据两个保障期限比较保障时间长短 前者大等于后者返回1  小于返回0
     * @param coverageType1   1终身  2保value年  3保到value岁
     * @param coverageValue1
     * @param coverageAge1
     * @param coverageType2   1终身  2保value年  3保到value岁
     * @param coverageValue2
     * @param coverageAge2
     */
    utils.compareCoverage = function(coverageType1,coverageValue1,coverageAge1,coverageType2,coverageValue2,coverageAge2){
        var result = 0;
        coverageValue1 = parseInt(coverageValue1);
        coverageValue2 = parseInt(coverageValue2);
        coverageAge1 = coverageAge1 || 0;
        coverageAge2 = coverageAge2 || 0;
        if(coverageType1 == 1){
            result = 1;
        }else if(coverageType1 == 2){
            var num1 = coverageValue1;
            var num2 = coverageValue2;
            if(coverageType2 == 1){
                result = 0;
            }else if(coverageType2 == 2){
                result = num1 >= num2 ? 1:0;
            }else if(coverageType2 == 3){
                num2 = coverageValue2 - coverageAge2;
                result = num1 >= num2 ? 1:0;
            }
        }else if(coverageType1 == 3){
            var num1 = coverageValue1 - coverageAge1;
            var num2 = coverageValue2;
            if(coverageType2 == 1){
                result = 0;
            }else if(coverageType2 == 2){
                result = num1 >= num2 ? 1:0;
            }else if(coverageType2 == 3){
                num2 = coverageValue2 - coverageAge2;
                result = num1 >= num2 ? 1:0;
            }
        }
        return result;
    }
    /**
     * 交费期限、保障期限
     * @param type  1交费期限   2保障期限
     * @param periodType 1趸交   2交value年 3交到value岁  4交终身
     * @param value  1保终身   2保value年  3保到value岁  4保value个月  5保value天
     * add by guYY
     */
    utils.getPeriodText = function(type,periodType,value){
        var str = "";
        periodType = parseInt(periodType);
        if(type == 1){
            switch (periodType){
                case 1:
                    str = "趸交";
                    break;
                case 2:
                    str = value+"年交"; //由交5年 改5年交  9.11 20:59
                    break;
                case 3:
                    str = "交到"+value+"岁";
                    break;
                case 4:
                    str = "交终身";
                    break;
            }
        }else if(type == 2){
            switch (periodType){
                case 1:
                    str = "终身";//保终身  改为终身 9.11 20:56
                    break;
                case 2:
                    str = value+"年"; //保20年改为20年  9/27 12:12
                    break;
                case 3:
                    str = "至"+value+"周岁";//保到20岁 改为 至20周岁  9/27 12:12
                    break;
                case 4:
                    str = "保"+value+"个月";
                    break;
                case 5:
                    str = "保"+value+"天";
                    break;
            }
        }
        return str;
    }
    //寿险业查询条件
    utils.lifeInsuranceOptions = { 
            "encryptedUserData": "mO9Ck8aUljOXBglrKYPu/1gd7T4nTzEFxN0+GruRM9JMCq8a8qRyTaWs7Sh2FpFemRJK6aVGIN7SOThIPHmwbamJKNrEMOsjBQloOj54UxDHBXYmpBSazn0lYxr1LcaTWtPGUGwP2pOXUwo79/4d6IuAy/CEUBIAEufB8NRO2xMxCtW4EiZxxF6VSzigsCXWOWSUcJbNct1igGjl4N/RfwULsNptX/MkfVR+QnppvTwbaU+V9JJ9TisLic14zAAxYoMg8V4ySrwAEtG6WjEoz4Ndm/1wOvgrjtrxwW3KVdGtNWs9ph85f0ejjWN5sAX6/lecd27hhDW60aOGPOhJYg==",
            // "encryptedUserData": "QKHoHCHlTFwrBzCO8oY0l3S/TYOEKh66n5TxkNeVCuA3wOlrnDesxD7eOFE1VqVToOYrXB5X5CkCx3huc3yXfvknChUaBEjKeGyYfJSKzUVZA+1gisIy5aUmEZZSZimrHKT0NWJ9IwnRQxCdPsXKSK5k1noMI7C3LxZYwl2dcm0=",
            "searchWords": "",
            "saleTypeIds": [],  //选填，种类ID，来自高级过滤接口的返回值
            "examPremOrder": null,    //选填，示例保费排序方式。asc:升序，desc: 降序
            "rightIds": [],       //选填，权益ID，来自高级过滤接口的返回值
            "companyIds": [], //选填，公司ID，来自高级过滤接口的返回值
            "sortOption": 1,     //选填，排序选项。2：按浏览量排序，3：按上架时间排序
            "startPos" : 0,      //查询起始位置
            "pageSize" : 5       //每页查询多少条
        };
    //记录上次排序条件
    utils.preSortOption = 1;

    utils.isKeyWordSearch = false;
    //每个计划书内保障计划下条款(产品)列表，打开保障计划时初始化，离开进清空 add by guYY
    utils.productInfoList = [];
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
            method : _type,
            url : utils.serverConfig.serverUrl + url,
            data : _contentType == "application/json" && typeof data == "object" ? JSON.stringify(data) : data,
            contentType :  _contentType,
            success : function (result) {
                success && success(result);
            },
            error      : function (msg) {
                error && error(msg);
            },
            dataType   : _dataType
        });
    };

    /*
     *把特殊符号%,替换"s百分号b"掉后，编码字符串，
     *@parms : str  需要编码的字符串
     */
    utils.myEncodeURIComponent = function (str){
        var reStr = str;
        if(str.indexOf("%") > -1){
            reStr = str.replace(/\%/g, "s百分号b");
        }
        try {
            return encodeURIComponent(reStr);
        }catch(e){
            return reStr;
        }
    };
    /*
     *解码字符串后，把"s百分号b"替换成%
     *@parms : str  需要解码的字符串
     */
    utils.myDecodeURIComponent = function (str){
        var reStr = str;
        try {
            reStr = decodeURIComponent(str);
        }catch(e){
        }
        if(reStr.indexOf("s百分号b") > -1){
            reStr = reStr.replace(/s百分号b/g, "%");
        }
        return reStr;
    };
    //档次列表  9.12 12:05停用，从后端取
//    utils.benefitPlan = ["Not Relevant","Plan 1","Plan 2","Plan 3","Plan 4","Plan 5","Plan 6","Plan 7","Plan 8","Plan 9",
//        "Plan 10","Plan 11","Plan 12","Plan 13","Plan 14","Plan 15","Plan 16","Plan 17","Plan 18","Plan 19","Plan 20"];

    /**
     * 格式化显示时间
     * @param time
     * @param format  如"yyyy.MM.dd HH:mm"   "yyyy.MM.dd"
     * @returns {*}
     */
    utils.formattime = function(time, format) {
        var t = new Date(time);
        var tf = function (i) { return (i < 10 ? '0' : '') + i };
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
            switch (a) {
                case 'yyyy':
                    return tf(t.getFullYear());
                    break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                    break;
                case 'mm':
                    return tf(t.getMinutes());
                    break;
                case 'dd':
                    return tf(t.getDate());
                    break;
                case 'HH':
                    return tf(t.getHours());
                    break;
                case 'ss':
                    return tf(t.getSeconds());
                    break;
            }
        })
    };

    /**
     * 模糊搜索数组为对象数组
     * @param array 需要搜索的原始数组
     * @param searchVal  搜索的值
     * @keyArr 搜索所需要的几个字段
     * @returns {*}
     */
    utils.searchObjectArray = function(array, searchVal, keyArr) {
        var results = [];
        if(searchVal == "")return array;
        for(var i = 0; i < array.length; i++){
            var obj = array[i];
            for(var j = 0; j < keyArr.length; j++){
                var key = keyArr[j];
                var val = "";
                var temp = [];
                temp = key.split("|");
                if(temp.length > 1 ){
                    val = obj[temp[0]][temp[1]];
                }else{
                    val = obj[key];
                }
                if(val.indexOf(searchVal) > - 1){
                    results.push(obj);
                    break;
                }
            }
        }
        return results;
    };
    /**
     * 分享计划书
     * @param title
     * @param des
     * @param url
     * @param name
     * @param gender  先生、女士
     */
    utils.sharePlan = function(title,des,url,name,gender){
        name = utils.myEncodeURIComponent(name);
        gender = utils.myEncodeURIComponent(gender);
        if(url.lastIndexOf("?") > 0){
            url = url + "&proposerName="+name+"&proposerGender="+gender;
        }else{
            url = url + "?proposerName="+name+"&proposerGender="+gender;
        }
        utils.shareProduct(title,des,url);
    }
    /**
     *
     * 分享产品 （调原生）
     * @param productName
     */
    utils.shareProduct = function(title,des,url){
        if(url.lastIndexOf("?") > 0){
            url = url + "&isShare=1&tempUser="+utils.userObj.id;
        }else{
            url = url + "?isShare=1&tempUser="+utils.userObj.id;
        }
        try {
            if (device.ios()) {
                kbShareAction(title, des, url);
            } else if (device.android()) {
                window.kbShare && window.kbShare.kbShareAction(title, des, url);
            }
        }catch(e){}
    };
    //退出H5  return false表示访问原生报错
    utils.toFinish = function(){
        try{
            if(device.ios()){
                backAction();
            }else{
                if(window.kbFinish){
                    window.kbFinish.toFinish();
                }else{
                    return false;
                }
            }
            return true;
        }catch(e){
            return false;
        }
    }
    /**
     * 登录 （调原生）
     * @param
     */
    utils.toLogin = function(){
        try {
            if (device.ios()) {
                kbLoginAction("0");
                return;
            } else {
                window.kbLogin && window.kbLogin.toLogin("0");
            }
        }catch(e){

        }
    };
    utils.illusType = {
        1:"Sum Assured",2:"Accumulated Premium",3:"Annual Basic Premium",4:"Regular Topup Premium",5:"Annual Investment Premium",
        6:"Annual Invest Top-up",7:"COI",8:"Annual Admin Cost",9:"Total Charges Deducted",10:"Fund Net Value",11:"Basic Yearly Return",
        12:"Basic Investment Fee",13:"Total Investment Value",14:"Net Premium",15:"Regular Investment Premium",16:"Total Investment Premium",
        17:"现金价值",18:"Paidup Value",19:"Cash Bonus",20:"Survival Benefit",21:"退保金",
        22:"身故保险金",23:"Maturity Amount",24:"RB Surrender Value",25:"Annuity Payment",26:"GMDB Amount",27:"GMAB Amount",28:"GMWB Amount",
        29:"GMIB Amount",30:"Annual Withdraw Amount",31:"Annual Recurring Top-up",32:"Adhoc Topup",33:"Adhoc Topup Investment Part",34:"Fund Management Fee",
        35:"Total Fund Value",36:"Accumulated Topup",37:"Accumulated Cash Bonus",38:"Accumulated Reversionary Bonus",39:"Accumulated Survival Benefit",
        40:"生存金",41:"投保人豁免利益",42:"被保人豁免利益",43:"全残保险金",44:"残疾保险金",45:"轻症保险金",46:"重疾保险金",47:"疾病末期保险金",
        48:"特定疾病保险金",49:"医疗保险金",50:"万能账户",51:"疾病身故保险金",52:"护理保险金",53:"特定重疾保险金",54:"身故保险金MAX",55:"轻症保险金MAX",
        56:"特定疾病保险金MAX",57:"重疾保险金MAX",58:"残疾保险金MAX",59:"疾病终末期保险金MAX",60:"护理保险金MAX",61:"医疗保险金MAX"
    };
    /*localStorage 取出对象*/
    utils.getLocalStorageObject = function(prototype){
        var str = window.localStorage.getItem(prototype);
        var result = {};
        if(str && str!=""){
            result = JSON.parse(str);
        }
        return result;
    };
    utils.setLocalStorageObject = function(prototype, obj){
        var str = JSON.stringify(obj);
        window.localStorage.setItem(prototype, str);
    };

    utils.getLocalStorageValue = function(prototype, key){
        var obj = utils.getLocalStorageObject(prototype);
        if(obj[key]){
            return obj[key];
        }
        return null;
    };

    utils.addLocalStorageObject = function(prototype, key, value){
        var obj = utils.getLocalStorageObject(prototype);
        obj[key] = value;
        utils.setLocalStorageObject(prototype, obj);
    };

    utils.delLocalStorageObject = function(prototype, key){
        var obj = utils.getLocalStorageObject(prototype);
        if(obj[key]){
            delete obj[key];
        }
        utils.setLocalStorageObject(prototype, obj);
    };
    //制作计划书 保额 保费 份数 默认取值范围
    utils.defaultMinAmount = 1;
    utils.defaultMaxAmount = 999999999;
    utils.alertMaxAmount = 99999999;
    //点击添加附加险时，传递的主险信息 及对应保人信息
    utils.currMainPlanInfo = null;
    utils.currMainPlanInsured = null
})(window);
