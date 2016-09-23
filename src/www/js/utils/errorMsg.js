/**
 * Created by Administrator on 2016/9/7.
 */
(function(window){
    var errorMsg = {};
    window.errorMsg = errorMsg;
    errorMsg.makePlanMsg1 = "被保人年龄不能为空，请录入！";
    errorMsg.makePlanMsg2 = "被保人性别不能为空，请录入！";
    errorMsg.makePlanMsg3 = "保障期限不能为空，请录入！";//前缀加产品名称
    errorMsg.makePlanMsg4 = "交费期限不能为空，请录入！";//前缀加产品名称
    errorMsg.makePlanMsg5 = "保额不能为空，请录入！";//前缀加产品名称
    errorMsg.makePlanMsg6 = "保费不能为空，请录入！";//前缀加产品名称
    errorMsg.makePlanMsg7 = "份数不能为空，请录入！";//前缀加产品名称
    errorMsg.makePlanMsg8 = "档次不能为空，请录入！";//前缀加产品名称
    errorMsg.makePlanMsg9 = "份数必须整数";//前缀加产品名称
    errorMsg.makePlanMsg10 = "不能删除最后一款产品～如需修改请重新选择计划/产品";
    errorMsg.makePlanMsg11 = "年金领取时间不能为空，请录入！";
    errorMsg.makePlanMsg12 = "组合附加险交费期限必须等于主险交费期限";
    errorMsg.makePlanMsg13 = "附加险交费期限必须小于等于主险交费期限";

})(window);
//define([], function(){
//    var errorMsg = function(){};
//    errorMsg.prototype.makePlanMsg1 = "被保人年龄不能为空，请录入！";
//    errorMsg.prototype.makePlanMsg2 = "被保人性别不能为空，请录入！";
//    errorMsg.prototype.makePlanMsg3 = "保障期限不能为空，请录入！";//前缀加产品名称
//    errorMsg.prototype.makePlanMsg4 = "交费期限不能为空，请录入！";//前缀加产品名称
//    errorMsg.prototype.makePlanMsg5 = "保额不能为空，请录入！";//前缀加产品名称
//    errorMsg.prototype.makePlanMsg6 = "保费不能为空，请录入！";//前缀加产品名称
//    errorMsg.prototype.makePlanMsg7 = "份数不能为空，请录入！";//前缀加产品名称
//    errorMsg.prototype.makePlanMsg8 = "档次不能为空，请录入！";//前缀加产品名称
//    errorMsg.prototype.makePlanMsg9 = "份数必须整数";//前缀加产品名称
//    errorMsg.prototype.makePlanMsg10 = "不能删除最后一款产品～如需修改请重新选择计划/产品";
//
//    return new errorMsg();
//});