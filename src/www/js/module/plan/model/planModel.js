define([

],function(){
    var PlanModel = function(){};
    //获取公司信息集合 服务商、承保商
    PlanModel.prototype.getCompanyInfo = function(planId, cb_ok, cb_err){
        var opt = {};
        opt.url = "/ls/services/dt/planService/getDaTongInfo";
        opt.type = "POST";
        var data = {};
        data.quotationId = planId;
        opt.data = data;
        opt.success = function(result){
            if(result.status == 0){
                if (cb_ok) cb_ok(result);
            }else{
                if(cb_err) cb_err(err)
            }
        };
        opt.error = function(err){
            if(cb_err) cb_err(err)
        };
        utils.requestData(opt);
    };
    var planModel = new PlanModel();
    return planModel;
});