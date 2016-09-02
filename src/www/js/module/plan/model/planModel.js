define([

],function(){
    var PlanModel = function(){};
    //获取公司信息集合 服务商、承保商
    PlanModel.prototype.getCompanyInfo = function(cb_ok){        
        var arr = [{"logo":"images/logo01.png","content":'<p>大童旗下有大童保险销售服务有限公司、北京大童保险经纪。有限公司等企业， 其中大童保险销售服务有限公司是经中国保。</p>'+
        '<p>大童旗下有大童保险销售服务有限公司、北京大童保险经纪。有限公司等企业， 其中大童保险销售服务有限公司是经中国保。</p>'+
        '<p>大童旗下有大童保险销售服务有限公司、北京大童保险经纪。有限公司等企业， 其中大童保险销售服务有限公司是经中国保。</p>'+
        '<p>大童旗下有大童保险销售服务有限公司、北京大童保险经纪。有限公司等企业， 其中大童保险销售服务有限公司是经中国保。</p>'+
        '<p>大童旗下有大童保险销售服务有限公司、北京大童保险经纪。有限公司等企业， 其中大童保险销售服务有限公司是经中国保。</p>'+
        '<p>大童旗下有大童保险销售服务有限公司、北京大童保险经纪。有限公司等企业， 其中大童保险销售服务有限公司是经中国保。</p>'+
        '<img src="images/temp/icon01.jpg" alt="" style="display:block; margin:0 auto;">'},
        {"logo":"images/logo02.png","content":'<p>长城人寿保险股份有限公司（以下简称）“长城人寿”是一家经中国保险监管管理委员会批准设立的全国性人寿保险公司。以“打造服务最好的保险品牌”为目标，倡导“让服务成功我们的生活方式”，致力于客户提供适合的保险产品和便捷服务，为员工提供良好的工作环境和成长空间。</p>'+
            '<p>成立时间：2005年8月30日</p>'+
            '<p>成立时间：2005年8月30日</p>'+
            '<p>成立时间：2005年8月30日</p>'+
            '<p>成立时间：2005年8月30日</p>',"vipContent":'<img src="images/temp/icon02.png" alt="" style="display:block; margin:0 auto;">',"vipStandard":'<img src="images/temp/icon02.png" alt="" style="display:block; margin:0 auto;">'}];
            
        setTimeout(function(){
            cb_ok && cb_ok(arr);
        },800);
        
    }
    /**
     * 根据产品ID获取用户
     * @param productId 产品ID 例：9100001
     */
    PlanModel.prototype.getPlanInitiaData = function(productId,cb_ok,cb_err){
        var data = {encryptedUserData:utils.userObj.id,salesPackageId:productId};
        var options = {
            url:"/ls/services/dt/planService/getPlanInitialData",
            data:JSON.stringify(data),
            type:"POST",
            dataType:"json"
        };
        options.success = function(data){
            if(data && data.status == 0){
                cb_ok && cb_ok(data);
            }else{
                var errMsg = data.errorMessages ? data.errorMessages:"数据读取失败";
                cb_err && cb_err(errMsg);
            }
        };
        options.error = cb_err;
        utils.requestData(options);
    }
    /**
     * 保险计划书
     */
    PlanModel.prototype.savePlan = function(options){

    }
    var planModel = new PlanModel();
    return planModel;
});