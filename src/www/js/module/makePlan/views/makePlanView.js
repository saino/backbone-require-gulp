//计划书制作页 add by guYY 2016/8/31
define([
    'common/base/base_view',
    'text!module/makePlan/templates/makePlan.html',
    'module/plan/model/planModel',
    'marionette',
    'msgbox'
],function(BaseView, tpl,planModel, mn,MsgBox) {
    var makePlanView =  BaseView.extend({
        id : "make-plan-container",
        template : _.template(tpl),
        _mouseLock : false,
        _isShow : false,
        forever:true,
        mainPlanNum:0,      //主险个数
        currProductId:0,        //当前产品ID
        currCompany:{},         //当前计划书所属公司对象
        currPlanList:[],        //当前销售产品列表（主产品、附加产品）
        hasPolicyHolder:false,//是否显示投保人
        hasSecInsured:false,    //是否指向第二被保人  Y是  N否
        hasSmoking:false,   //是否与被保人吸烟有关
        hasJob:false,       //是否与被保人职业有关
        hasSocialInsure:false,   //是否与被保人吸烟有关
        occupationList:[{name:"教师",id:1},{name:"医生",id:2},{name:"广告",id:3}],      //职业类别
        occupationListHtml:"",//职位列表html
        ageRangeOfLifeAssured:null, //被保人年龄范围对象
        ageRangeOfLifeAssuredHtml:"",//被保人年龄范围html
        ageRangeOfPolicyHolder:null, //投保人年龄范围对象
        ageRangeOfPolicyHolderHtml:"",//投保人年龄范围html
        ui : {
            topTitleLeft : "#top-title-left",
            topCon : "#top-title",
            makePlanMain : "#make-plan-main",
            firstInsured:".first-insured",  //第一被保人
            secondInsured:".second-insured",  //第二被保人
            secondInsured:".second-insured",  //第一被保人
            policyHolder:".policy-holder",    //投保人
            planInfoCon:"#make-plane-title" //计划书名称及所属公司
        },
        //事件添加
        events : {
            "tap @ui.topTitleLeft": "clickTopTitleLeftHandler",
            "tap .property-radio-item":"clickRadioHandler"
        },
        /**初始化**/
        initialize : function(){

        },
        //在开始渲染模板前执行，此时当前page没有添加到document
        onBeforeRender : function(){
            var self = this;
        },
        //渲染完模板后执行,此时当前page没有添加到document
        onRender : function(){
            var self = this;
            console.log("onRender");
            if(device.ios()){
                self.ui.topCon.css("padding-top",utils.toolHeight+"px");
                self.ui.makePlanMain.css("height","-webkit-calc(100% - "+(85+utils.toolHeight)+"px)");
            }
        },
        //页间动画已经完成，当前page已经加入到document
        pageIn : function(){
            var self = this;
            var tempProductId = this.getOption("productId");
            if(tempProductId == null){
                MsgBox.alert("路由错误","",function(){
                    app.goBack();
                });
                return;
            }
            //返回进入 或进入不同产品计划书 重置输入
            if(self.currProductId == 0 || self.currProductId != tempProductId){
                self.currProductId = tempProductId;
                planModel.getPlanInitiaData(self.currProductId,function(data){
                    self.initializeUI(data);
                },function(err){
                    MsgBox.alert(err);
                });
            }
        },
        //根据数据初始化UI
        initializeUI:function(data){
            var self = this;
            console.log(data);
            //公司LOGO  计划书名称
            self.ui.planInfoCon.html(data.packageName || "");
            self.currCompany = data.company;
            self.currPlanList = data.planList;
            self.ageRangeOfLifeAssured = data.ageRangeOfLifeAssured;
            self.ageRangeOfPolicyHolder = data.ageRangeOfPolicyHolder;
            //根据对象初始化
            self.setRelevantProperty();
            //拼接第一被保人信息
            var firstInsuredHtml = "";
            firstInsuredHtml += self.insuredNameTpl();
            firstInsuredHtml += self.insuredOldTpl({oldOptions:self.ageRangeOfLifeAssuredHtml});
            firstInsuredHtml += self.insuredSexTpl();
            if(self.hasJob){  //职位
                firstInsuredHtml += self.insuredOccupationsTpl({occupationOptions:self.occupationListHtml});
            }
            if(self.hasSmoking){//吸烟
                firstInsuredHtml += self.insuredSmokingTpl();
            }
            if(self.hasSocialInsure){ //社保
                firstInsuredHtml += self.insuredSocialTpl();
            }
            self.ui.firstInsured.find(".insured-property").html(firstInsuredHtml);
            //拼接第二被保人
            if(!self.hasSecInsured){
                self.ui.secondInsured.css("display","none");
            }else{
                var secondInsuredHtml = "";
                secondInsuredHtml += self.insuredNameTpl();
                secondInsuredHtml += self.insuredOldTpl({oldOptions:self.ageRangeOfLifeAssuredHtml});
                secondInsuredHtml += self.insuredSexTpl();
                if(self.hasJob){  //职位
                    secondInsuredHtml += self.insuredOccupationsTpl({occupationOptions:self.occupationListHtml});
                }
                if(self.hasSmoking){//吸烟
                    secondInsuredHtml += self.insuredSmokingTpl();
                }
                if(self.hasSocialInsure){ //社保
                    secondInsuredHtml += self.insuredSocialTpl();
                }
                self.ui.secondInsured.find(".insured-property").html(secondInsuredHtml);
            }
            if(data.company && data.company.organLogo ){
                self.ui.planInfoCon.css("background",'background: url("'+data.company.organLogo+'") no-repeat right 30px center #fff;');
            }
            //是否显示投保人
            if(!self.hasPolicyHolder){
                self.ui.policyHolder.css("display","none");
            }else{
                var policyHolderHtml = "";
                policyHolderHtml += self.policyHolderOldTpl({oldOptions:self.ageRangeOfPolicyHolderHtml});
                policyHolderHtml += self.policyHolderSexTpl();
                self.ui.policyHolder.find(".insured-property").html(policyHolderHtml);
            }

        },
        //被保人属性
        insuredNameTpl: _.template('<div class="insured-property-item"><span>被保人姓名：</span><input type="text" class="property-input insured-name"/></div>'),
        insuredOldTpl: _.template('<div class="insured-property-item"> <span>被保人年龄：</span><select name="old"  class="property-input property-select insured-old"><%=oldOptions %></select></div>'),
        insuredSexTpl: _.template('<div class="insured-property-item"><span>被保人性别：</span><div class="property-radio insured-sex" data-val="M">' +
                            '<div class="property-radio-item property-radio-item-ck" data-val="M"><span class="circle"><span class="circle-ck"></span></span>男</div>'+
                            '<div class="property-radio-item" data-val="F"><span class="circle"><span class="circle-ck"></span></span>女</div></div></div>'),
        insuredOccupationsTpl: _.template('<div class="insured-property-item"><span>被保人职业类别：</span>' +
                                    '<select name="old" class="property-input property-select insured-job"><%=occupationOptions %></select>' +
                                    '</div>'),
        insuredSocialTpl: _.template('<div class="insured-property-item"><span>被保人社保：</span><div class="property-radio insured-social" data-val="N">' +
                                    ' <div class="property-radio-item" data-val="Y"><span class="circle"><span class="circle-ck"></span></span>有</div>' +
                                    '<div class="property-radio-item property-radio-item-ck" data-val="N"><span class="circle"><span class="circle-ck"></span></span>无</div> </div></div>'),
        insuredSmokingTpl:_.template('<div class="insured-property-item"><span>被保人吸烟：</span><div class="property-radio insured-smoking" data-val="N">' +
                                    '<div class="property-radio-item" data-val="Y"><span class="circle"><span class="circle-ck"></span></span>是' +
                                    '</div><div class="property-radio-item property-radio-item-ck" data-val="N"><span class="circle"><span class="circle-ck"></span></span>否</div></div></div>'),

        //投保人属性
        policyHolderOldTpl : _.template('<div class="insured-property-item"><span>投保人年龄：</span>' +
                             '<select name="old" class="property-input property-select insured-old"><%=oldOptions %></select></div>'),
        policyHolderSexTpl: _.template('<div class="insured-property-item"><span>投保人性别：</span>' +
                             '<div class="property-radio insured-sex" data-val="M"><div class="property-radio-item property-radio-item-ck" data-val="M">' +
                            '<span class="circle"><span class="circle-ck"></span></span>男</div>' +
                            '<div class="property-radio-item" data-val="F"><span class="circle"><span class="circle-ck"></span></span>女</div></div></div>'),
        //设置被保人相关属性 否存在第二被保人、是否与被保人吸烟有关、是否与被保人职业有关、是否与被保人社保有关
        setRelevantProperty:function(){
            var self = this;
            self.hasPolicyHolder = false;//投保人
            self.hasSecInsured = false;
            self.hasSmoking = false;
            self.hasJob = false;
            self.hasSocialInsure = false;
            if(!self.currPlanList || self.currPlanList.length <= 0)
                return false;
            for(var i = 0; i < self.currPlanList.length; i++){
                if(self.currPlanList[i].pointToPH == "Y"){
                    self.hasPolicyHolder = true;
                }
                if(self.currPlanList[i].pointToSecInsured == "Y")//第二被保人
                {
                    self.hasSecInsured = true;
                }
                if(self.currPlanList[i].smokingIndi == "Y")//吸烟
                {
                    self.hasSmoking = true;
                }
                if(self.currPlanList[i].jobIndi == "Y")    //职业
                {
                    self.hasJob = true;
                }
                if(self.currPlanList[i].socialInsureIndi == "Y") //社保
                {
                    self.hasSocialInsure = true;
                }
            }
            //设置职位列表HTML、被保人年龄限制列表HTML，投保人年龄限制列表HTML
            self.occupationListHtml = "";
            self.ageRangeOfLifeAssuredHtml = "";
            self.ageRangeOfPolicyHolderHtml = "";
            for(var i = self.ageRangeOfLifeAssured.minAge; i <= self.ageRangeOfLifeAssured.maxAge; i++){
                self.ageRangeOfLifeAssuredHtml += '<option value="'+i+'">'+i+'</option>';
            }
            for(i = self.ageRangeOfPolicyHolder.minAge; i <= self.ageRangeOfPolicyHolder.maxAge; i++){
                self.ageRangeOfPolicyHolderHtml += '<option value="'+i+'">'+i+'</option>';
            }
            for(i = 0; i < self.occupationList.length;i++){
                self.occupationListHtml += '<option value="'+self.occupationList[i].id+'">'+self.occupationList[i].name+'</option>';
            }
        },
        //点击返回
        clickTopTitleLeftHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            app.goBack();
        },
        //点击单选框
        clickRadioHandler:function(event){
            var target = $(event.currentTarget);
            if(target.hasClass("property-radio-item-ck")){
                return;
            }
            target.siblings(".property-radio-item").removeClass("property-radio-item-ck");
            target.addClass("property-radio-item-ck")
            target.parent().attr("data-val",target.data("val"))
        },
        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            //返回重置当前产品计划ID，返回进入重置所有
            this.currProductId = 0;
        },

        //当页面销毁时触发
        onDestroy : function(){
//            console.log("footer destroy");
        }

    });
    return makePlanView;
});