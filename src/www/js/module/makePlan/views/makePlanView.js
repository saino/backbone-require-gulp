//计划书制作页 add by guYY 2016/8/31
define([
    'common/base/base_view',
    'text!module/makePlan/templates/makePlan.html',
    'text!module/makePlan/templates/unitFlag1.html',
    'text!module/makePlan/templates/unitFlag2.html',
    'text!module/makePlan/templates/unitFlag3.html',
    'text!module/makePlan/templates/unitFlag4.html',
    'text!module/makePlan/templates/unitFlag5.html',
    'text!module/makePlan/templates/unitFlag6.html',
    'text!module/makePlan/templates/additionalUnitFlag1.html',
    'text!module/makePlan/templates/additionalUnitFlag2.html',
    'text!module/makePlan/templates/additionalUnitFlag3.html',
    'text!module/makePlan/templates/additionalUnitFlag4.html',
    'text!module/makePlan/templates/additionalUnitFlag5.html',
    'text!module/makePlan/templates/additionalUnitFlag6.html',
    'text!module/makePlan/templates/calculationResult.html',
    'module/plan/model/planModel',
    'marionette',
    'common/views/circle',
    'msgbox'
],function(BaseView, tpl,unitFlag1Tpl,unitFlag2Tpl,unitFlag3Tpl,unitFlag4Tpl,unitFlag5Tpl,unitFlag6Tpl,additionalUnitFlag1Tpl,additionalUnitFlag2Tpl,additionalUnitFlag3Tpl,additionalUnitFlag4Tpl,additionalUnitFlag5Tpl,additionalUnitFlag6Tpl ,calcResultTpl,planModel, mn,loadingCircle,MsgBox) {
    var makePlanView =  BaseView.extend({
        id : "make-plan-container",
        template : _.template(tpl),
        unitFlag1Tpl: _.template(unitFlag1Tpl), //销售方式unitFlag=6 保额
        unitFlag2Tpl: _.template(unitFlag2Tpl),//销售方式unitFlag=7 保费
        unitFlag3Tpl: _.template(unitFlag3Tpl),//销售方式unitFlag=1 份数
        unitFlag4Tpl: _.template(unitFlag4Tpl),//销售方式unitFlag=3 档次、份数
        unitFlag5Tpl: _.template(unitFlag5Tpl),//销售方式unitFlag=4 档次
        unitFlag6Tpl: _.template(unitFlag6Tpl),//销售方式为其他是 不显示任何输入项
        additionalUnitFlag1Tpl: _.template(additionalUnitFlag1Tpl),  //附加险销售方式录入规则 同主险
        additionalUnitFlag2Tpl: _.template(additionalUnitFlag2Tpl),
        additionalUnitFlag3Tpl: _.template(additionalUnitFlag3Tpl),
        additionalUnitFlag4Tpl: _.template(additionalUnitFlag4Tpl),
        additionalUnitFlag5Tpl: _.template(additionalUnitFlag5Tpl),
        additionalUnitFlag6Tpl: _.template(additionalUnitFlag6Tpl),
        calcResultTpl: _.template(calcResultTpl),
        _mouseLock : false,
        _isShow : false,
        forever:true,
        isCalcOver:false,       //是否已经计算过保费
        mainPlanNum:0,          //主险个数
        mainPlanIdArr:[],           //主险ID数组
        additionalIdArr:[],         //附加险ID
        insuredPlanIdArr:[],        //a类产品（第一被保人相关产品ID） 9/21 0:14
        secInsuredPlanIdArr:[],    //b类产品（第二被保人相关产品ID） 9/21 0:14
        policyPlanIdArr:[],    //c类产品（投保人相关产品ID） 9/21 0:14
        insuredGender:"N",      //被保人性别，M：男，F：女，N：无关
        secInsuredGender:"N",  //第二被保人性别，M：男，F：女，N：无关
        policyGender:"N",       //投保人性别，M：男，F：女，N：无关
        currProductId:0,        //当前产品ID
        currCompany:{},         //当前计划书所属公司对象
        currPlanList:[],        //当前销售产品列表（主产品、附加产品）
        hasPolicyHolder:false,//是否显示投保人
        hasSecInsured:false,    //是否指向第二被保人  Y是  N否
        smokingType:0,      //和吸烟无关  1下拉框 2下拉框
        hasJob:false,       //是否与被保人职业有关
        hasSocialInsure:false,   //是否与被保人吸烟有关
        smokingList1:[{id:1,name:"不吸烟-超优体"},{id:2,name:"不吸烟-优选体"},{id:3,name:"不吸烟-优标体"},{id:4,name:"不吸烟-标准体"},{id:5,name:"吸烟-次选体"},{id:6,name:"吸烟-次标准体"}],  //吸烟smokingType=1时有效
        smokingList2:[{id:"N",name:"不吸烟"},{id:"Y",name:"吸烟"}],  //吸烟smokingType=2时有效
        occupationList:[{name:"1",id:1},{name:"2",id:2},{name:"3",id:3},{name:"4",id:4},{name:"5",id:5},{name:"6",id:6}],      //职业类别
        occupationListHtml:"",//职位列表html
        smokingListHtml:"",//吸烟类型=1列表html
        smokingList2Html:"",//吸烟类型=2列表html
        ageRangeOfLifeAssured:null, //被保人年龄范围对象
        ageRangeOfLifeAssuredHtml:"",//被保人年龄范围html
        ageRangeOfPolicyHolder:null, //投保人年龄范围对象
        ageRangeOfPolicyHolderHtml:"",//投保人年龄范围html
        ageRangeSecondOfLifeAssured:null, //第二被保人年龄范围对象
        ageRangeSecondOfLifeAssuredHtml:"",//第二被保人年龄范围html
        focusInput:null,//验证失败后 获取焦点对象

        totalFirstYearPrem:0,       //首年总保费
        valueadded:[],  //增值服务列表

        ui : {
            topTitleLeft : "#top-title-left",
            topCon : "#top-title",
            makePlanMain : "#make-plan-main",
            planTitle:"#planTitle",          //标题只一个主险时：投保选择   多个主险时：主险
            firstInsured:".first-insured",  //第一被保人
            secondInsured:".second-insured",  //第二被保人
            policyHolder:".policy-holder",    //投保人
            sendName:".send-input",//投保人名称 敬呈对象
            makePlanInput:"#make-plan-select", //主险输入区域
            additionalPlanInput:"#make-plan-additional", //附加险输入区域
            incrementCon:"#make-plan-increment",//增值服务
            ideaCon:"#make-plan-idea",              //保险理念
            planInfoCon:"#make-plane-title", //计划书名称及所属公司
            incrementCheck:"#make-plan-comment", //留言勾选框
            commentTxt:"#comment", //留言框
            totalFirstYearPremium:"#totalFirstYearPremium", //总保费
            calcResultCon:".first-year-list",        //计算结果
            sendSex:"#send-sex"  //页面底部的 先生  女士
        },
        //事件添加
        events : {
            "change #testSelect":"testHandler",
            "tap @ui.topTitleLeft": "clickTopTitleLeftHandler",
            "tap .property-radio-item":"clickRadioHandler",//点击单选按钮  通用
            "tap .duty-item-left":"clickLiabilityHandler",  //点击选中可选责任
            "tap .duty-tip":"clickDutyTipHandler",           //点击展开/收起 可选责任
            "tap .increment-check":"clickCheckHandler",     //增值服务、留言是否显示在保障书
            "tap .first-year-tip":"clickFirstYearTipHandler",//点击展开/收起 计算结果
            "tap .accordion-tip":"clickAccordionHandler", //保险理念、增值服务手风琴效果 点击展开 点击收起
            "tap .idea-item":"clickIdeaItemHandler", //保险理念列表 单选
            "tap #btnTotalFirstYear":"clickCalcPremiumHandler",//点击计算保费
            "tap #make-plan-btn":"clickMakePlanHandler",//点击生成计划书
            "tap #make-plan-add-additional":"addAdditionalPlanHandler",//点击添加附加险
            "tap .additional-del":"delAdditionPlanHandler", //删除附加险
            "tap .import":"clickImportHandler",  //点击客户导入
            "change #send-sex":"changeSexHandler",
            "tap .increment-item":"clickIncrementHandler",//点击查看增值服务详情
            "change .insured-old":"changeOldHandler",  //年龄下拉更新 相关联动
            "change .payment-period":"changeChargeHandler",  //交费期间下拉更新 相关联动
            "change .guarantee-period":"changeCoverageHandler",  //保障期间下拉更新 相关联动
            "blur .insured-sa":"blurInsuredSAHandler",  //保额输入框 变化
            "blur .insured-premium":"blurInsuredPremiumHandler",  //保费输入框 变化
            "blur .insured-unit":"blurInsuredUnitHandler"  //份数输入框 变化
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
            app.on("common:add:additional", self.onAddAdditional, self);
            app.on("common:import:user", self.onImportUser, self);
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
                self.resetUI();
                LoadingCircle && LoadingCircle.start();
                planModel.getPlanInitiaData(self.currProductId,function(data){
                    LoadingCircle && LoadingCircle.end();
                    console.log("*************制作计划书"+self.currProductId+"*************");
                    console.log(data);
                    self.initializeUI(data);
                },function(err){
                    LoadingCircle && LoadingCircle.end();
                    MsgBox.alert("初始化失败");
                    self.resetUI();
                });
            }
        },
        //重置UI
        resetUI:function(){
            var self = this;
            self.initializeUI({});
            //计算结果清空
            self.ui.calcResultCon.find(".first-year-table").remove();
            self.ui.totalFirstYearPremium.html("");
        },
        //根据数据初始化UI
        initializeUI:function(data){
            var self = this;
            //公司LOGO  计划书名称
            self.ui.planInfoCon.html(data.packageName || "");
            self.currCompany = data.company;
            self.currPlanList = data.planList || [];
            self.ageRangeOfLifeAssured = null;//年龄段修改后取自险种列表
            self.ageRangeOfLifeAssuredHtml = "";
            self.ageRangeOfPolicyHolder = null;
            self.ageRangeOfPolicyHolderHtml = "";
            self.ageRangeSecondOfLifeAssured = null;
            self.ageRangeSecondOfLifeAssuredHtml = "";
            if(data.suggestReason){
                self.ui.commentTxt.val(data.suggestReason);
            }else{
                self.ui.commentTxt.val("");
            }
            //初始化根据险种列表初始化 被保人、第二被保人、投保人 输入
            self.resetAllInput();
            if(data.company && data.company.organLogo){
                self.ui.planInfoCon.css("background",'url("'+(utils.serverConfig.serverUrl+data.company.organLogo)+'") no-repeat right 30px center #fff');
            }
            //主险标题
            if(self.mainPlanNum > 1){
                self.ui.planTitle.html("主险")
            }else{
                self.ui.planTitle.html("投保选择")
            }
            //根据销售方式、主险个数拼接投保输入框html
            var inputHtml = "";
            //添加前选清空原有
            self.ui.makePlanInput.find(".main-insured-item").remove();
            if(self.currPlanList && self.currPlanList.length > 0) {
                for (var i = 0; i < self.currPlanList.length; i++) {
                    if (self.currPlanList[i].insType == 1) {
                        self.mainPlanIdArr.push(self.currPlanList[i].salesProductId);
                        inputHtml += self.getMainPlanInputHtml(self.currPlanList[i]);
                    }
                }
            }
            self.ui.makePlanInput.append($(inputHtml));
            //根据销售方式，附加险拼接输入
            var additionalInputHtml = "";
            self.ui.additionalPlanInput.find(".additional-item").remove();
            if(self.currPlanList && self.currPlanList.length > 0) {
                for (var i = 0; i < self.currPlanList.length; i++) {
                    if (self.currPlanList[i].insType == 2) {
                        self.additionalIdArr.push(self.currPlanList[i].salesProductId);
                        additionalInputHtml += self.getAdditionalPlanInputHtml(self.currPlanList[i], 0);
                    }
                }
            }
            self.ui.additionalPlanInput.append($(additionalInputHtml));
            //增值服务 初始化不显示增值服务
            self.ui.incrementCon.css("display","none");
            //保险理念
            self.ui.ideaCon.find(".accordion-list").find(".idea-item").remove();
            var ideaHtml = "";
            if(data.insuranceSpirit && data.insuranceSpirit.length > 0){
                ideaHtml = self.getIdeaHtml(data.insuranceSpirit);
            }
            self.ui.ideaCon.find(".accordion-list").append($(ideaHtml));
            if(self.ui.ideaCon.find(".accordion-list").find(".idea-item-ck").size() <=0){
                self.ui.ideaCon.find(".accordion-list .idea-item:eq(0)").addClass("idea-item-ck");
            }
            self.ui.ideaCon.find(".accordion-list").slideUp();//默认收起
            self.ui.firstInsured.find(".insured-name").focus();//加载完成 被保人获取焦点
            //触发被保人、第二被保人、投保人 年龄下拉更新 触发联动
            if(self.currPlanList.length > 0){
                self.ui.firstInsured.find(".insured-old").change();
                self.ui.secondInsured.find(".insured-old").change();
                self.ui.policyHolder.find(".insured-old").change();
            }
        },
        //添加删除险种后 数据重置
        resetAllInput:function(){
            var self = this;
            self.setRelevantProperty();
            self.renderInsured();
            self.renderSecondInsured();
            self.renderPolicyHolder();
        },
        /**
         * 根据全局属性，渲染被保人输入框
         * 吸烟类型smokingType,职业hasJob，社保hasSocialInsure
         * ageRangeOfLifeAssuredHtml 被保人年龄段
          */
        renderInsured:function(){
            var self = this;
            //如果原始有值，需取出再赋值
            var insured = {};
            insured.name = self.ui.firstInsured.find(".insured-name").val();
            insured.age = self.ui.firstInsured.find(".insured-old").val();
            insured.gender = self.ui.firstInsured.find(".insured-sex").attr("data-val");
            insured.jobCateId = self.ui.firstInsured.find(".insured-job").val();//职位
            insured.socialInsuranceIndi = self.ui.firstInsured.find(".insured-social").attr("data-val");//社保
            insured.smoking = self.ui.firstInsured.find(".insured-smoking").val();//吸烟

            var firstInsuredHtml = "";
            firstInsuredHtml += self.insuredNameTpl({nameTxt:insured.name});
            firstInsuredHtml += self.insuredOldTpl({oldOptions:self.ageRangeOfLifeAssuredHtml});
            if(self.insuredGender == "N"){
                firstInsuredHtml += self.insuredSexTpl();
            }else if(self.insuredGender == "M"){
                firstInsuredHtml += self.insuredSexTpl_M();
            }else if(self.insuredGender == "F"){
                firstInsuredHtml += self.insuredSexTpl_F();
            }
            if(self.hasJob){  //职位
                firstInsuredHtml += self.insuredOccupationsTpl({occupationOptions:self.occupationListHtml});
            }
            if(self.smokingType == 1){
                firstInsuredHtml += self.insuredSmokingTpl2({smokingOptions:self.smokingListHtml});
            }else if(self.smokingType == 2){
                firstInsuredHtml += self.insuredSmokingTpl2({smokingOptions:self.smokingList2Html});
            }
            if(self.hasSocialInsure){ //社保
                firstInsuredHtml += self.insuredSocialTpl();
            }
            self.ui.firstInsured.find(".insured-property").html(firstInsuredHtml);
            //如果有年龄值
            if(insured.age){
                self.ui.firstInsured.find(".insured-old").val(insured.age);
                if(!self.ui.firstInsured.find(".insured-old").val() && self.ui.firstInsured.find(".insured-old").get(0)){ //如果原始值不在下拉范围 选第一个
                    self.ui.firstInsured.find(".insured-old").get(0).selectedIndex = 0;
                }
            }
            //赋值性别
            if(insured.gender && self.ui.firstInsured.find(".insured-sex .property-radio-item").size() > 1){
                self.ui.firstInsured.find(".insured-sex").attr("data-val",insured.gender);
                self.ui.firstInsured.find(".insured-sex .property-radio-item").removeClass("property-radio-item-ck");
                if(insured.gender == "F"){//女士F
                    self.ui.firstInsured.find(".insured-sex .property-radio-item:eq(1)").addClass("property-radio-item-ck");
                }else{ //先生
                    self.ui.firstInsured.find(".insured-sex .property-radio-item:eq(0)").addClass("property-radio-item-ck");
                }
            }
            //职位
            if(insured.jobCateId){
                self.ui.firstInsured.find(".insured-job").val(insured.jobCateId);
                if(!self.ui.firstInsured.find(".insured-job").val() && self.ui.firstInsured.find(".insured-job").get(0)){
                     self.ui.firstInsured.find(".insured-job").get(0).selectedIndex = 0;
                }
            }
            //吸烟属性
            if(insured.smoking){
                self.ui.firstInsured.find(".insured-smoking").val(insured.smoking);
                if(!self.ui.firstInsured.find(".insured-smoking").val() && self.ui.firstInsured.find(".insured-smoking").get(0)){
                    self.ui.firstInsured.find(".insured-smoking").get(0).selectedIndex = 0;
                }
            }
            //社保
            if(insured.socialInsuranceIndi){
                self.ui.firstInsured.find(".insured-social").attr("data-val",insured.socialInsuranceIndi);
                self.ui.firstInsured.find(".insured-social .property-radio-item").removeClass("property-radio-item-ck");
                if(insured.socialInsuranceIndi == "Y"){//有社保
                    self.ui.firstInsured.find(".insured-social .property-radio-item:eq(0)").addClass("property-radio-item-ck");
                }else{ //先生
                    self.ui.firstInsured.find(".insured-social .property-radio-item:eq(1)").addClass("property-radio-item-ck");
                }
            }
        },
        /**
         * 根据全局属性，渲染第二被保人输入框
         * hasSecInsured是否存在第二被保人
         * 吸烟类型smokingType,职业hasJob，社保hasSocialInsure
         * ageRangeSecondOfLifeAssuredHtml 第二被保人年龄段
         */
        renderSecondInsured:function(){
            var self = this;
            //如果无第二被保人相关，直接隐藏 并清除属性项
            if(!self.hasSecInsured){
                self.ui.secondInsured.find(".insured-property").html("");
                self.ui.secondInsured.css("display","none");
                return;
            }
            self.ui.secondInsured.css("display","block");
            //第二被保人
            var secInsured = {};
            secInsured.name = self.ui.secondInsured.find(".insured-name").val();
            secInsured.age = self.ui.secondInsured.find(".insured-old").val();
            secInsured.gender = self.ui.secondInsured.find(".insured-sex").attr("data-val");
            secInsured.jobCateId = self.ui.secondInsured.find(".insured-job").val();//职位
            secInsured.socialInsuranceIndi = self.ui.secondInsured.find(".insured-social").attr("data-val");//社保
            secInsured.smoking = self.ui.secondInsured.find(".insured-smoking").val();//吸烟

            //拼接第二被保人
            var secondInsuredHtml = "";
            secondInsuredHtml += self.insuredNameTpl({nameTxt:secInsured.name});
            secondInsuredHtml += self.insuredOldTpl({oldOptions:self.ageRangeSecondOfLifeAssuredHtml});
            if(self.secInsuredGender == "N"){
                secondInsuredHtml += self.insuredSexTpl();
            }else if(self.secInsuredGender == "M"){
                secondInsuredHtml += self.insuredSexTpl_M();
            }else if(self.secInsuredGender == "F"){
                secondInsuredHtml += self.insuredSexTpl_F();
            }
            if(self.hasJob){  //职位
                secondInsuredHtml += self.insuredOccupationsTpl({occupationOptions:self.occupationListHtml});
            }
            if(self.smokingType == 1){
                secondInsuredHtml += self.insuredSmokingTpl2({smokingOptions:self.smokingListHtml});
            }else if(self.smokingType == 2){
                secondInsuredHtml += self.insuredSmokingTpl2({smokingOptions:self.smokingList2Html});
            }
            if(self.hasSocialInsure){ //社保
                secondInsuredHtml += self.insuredSocialTpl();
            }
            self.ui.secondInsured.find(".insured-property").html(secondInsuredHtml);
            //如果有年龄值
            if(secInsured.age){
                self.ui.secondInsured.find(".insured-old").val(secInsured.age);
                if(!self.ui.secondInsured.find(".insured-old").val() && self.ui.secondInsured.find(".insured-old").get(0)){ //如果原始值不在下拉范围 选第一个
                    self.ui.secondInsured.find(".insured-old").get(0).selectedIndex = 0;
                }
            }
            //赋值性别
            if(secInsured.gender && self.ui.secondInsured.find(".insured-sex .property-radio-item").size() > 1){
                self.ui.secondInsured.find(".insured-sex").attr("data-val",secInsured.gender);
                self.ui.secondInsured.find(".insured-sex .property-radio-item").removeClass("property-radio-item-ck");
                if(secInsured.gender == "F"){//女士F
                    self.ui.secondInsured.find(".insured-sex .property-radio-item:eq(1)").addClass("property-radio-item-ck");
                }else{ //先生
                    self.ui.secondInsured.find(".insured-sex .property-radio-item:eq(0)").addClass("property-radio-item-ck");
                }
            }
            //职位
            if(secInsured.jobCateId){
                self.ui.secondInsured.find(".insured-job").val(secInsured.jobCateId);
                if(!self.ui.secondInsured.find(".insured-job").val() && self.ui.secondInsured.find(".insured-job").get(0)){
                    self.ui.secondInsured.find(".insured-job").get(0).selectedIndex = 0;
                }
            }
            //吸烟属性
            if(secInsured.smoking){
                self.ui.secondInsured.find(".insured-smoking").val(secInsured.smoking);
                if(!self.ui.secondInsured.find(".insured-smoking").val() && self.ui.secondInsured.find(".insured-smoking").get(0)){
                    self.ui.secondInsured.find(".insured-smoking").get(0).selectedIndex = 0;
                }
            }
            //社保
            if(secInsured.socialInsuranceIndi){
                self.ui.secondInsured.find(".insured-social").attr("data-val",secInsured.socialInsuranceIndi);
                self.ui.secondInsured.find(".insured-social .property-radio-item").removeClass("property-radio-item-ck");
                if(secInsured.socialInsuranceIndi == "Y"){//有社保
                    self.ui.secondInsured.find(".insured-social .property-radio-item:eq(0)").addClass("property-radio-item-ck");
                }else{ //先生
                    self.ui.secondInsured.find(".insured-social .property-radio-item:eq(1)").addClass("property-radio-item-ck");
                }
            }
        },
        /**
         * hasPolicyHolder 是否存在投保人
         * ageRangeOfPolicyHolderHtml 投保人年龄段
         */
        renderPolicyHolder:function(){
            var self = this;
            //是否显示投保人
            if(!self.hasPolicyHolder){
                self.ui.policyHolder.css("display","none");
                self.ui.policyHolder.find(".insured-property").html("");
                return;
            }
            var proposer = {};
            proposer.name = self.ui.sendName.val();
            proposer.age = self.ui.policyHolder.find(".insured-old").val();
            proposer.gender = self.ui.policyHolder.find(".insured-sex").attr("data-val");

            self.ui.policyHolder.css("display","block");
            var policyHolderHtml = "";
            policyHolderHtml += self.policyHolderOldTpl({oldOptions:self.ageRangeOfPolicyHolderHtml});
            if(self.policyGender == "N"){
                policyHolderHtml += self.policyHolderSexTpl();
            }else if(self.policyGender == "M"){
                policyHolderHtml += self.policyHolderSexTpl_M();
            }else if(self.policyGender == "F"){
                policyHolderHtml += self.policyHolderSexTpl_F();
            }
            self.ui.policyHolder.find(".insured-property").html(policyHolderHtml);
            //如果有年龄值
            if(proposer.age){
                self.ui.policyHolder.find(".insured-old").val(proposer.age);
                if(!self.ui.policyHolder.find(".insured-old").val() && self.ui.policyHolder.find(".insured-old").get(0)){ //如果原始值不在下拉范围 选第一个
                    self.ui.policyHolder.find(".insured-old").get(0).selectedIndex = 0;
                }
            }
            //赋值性别
            if(proposer.gender && self.ui.policyHolder.find(".insured-sex .property-radio-item").size() > 1){
                self.ui.policyHolder.find(".insured-sex").attr("data-val",proposer.gender);
                self.ui.policyHolder.find(".insured-sex .property-radio-item").removeClass("property-radio-item-ck");
                if(proposer.gender == "F"){//女士F
                    self.ui.policyHolder.find(".insured-sex .property-radio-item:eq(1)").addClass("property-radio-item-ck");
                }else{ //先生
                    self.ui.policyHolder.find(".insured-sex .property-radio-item:eq(0)").addClass("property-radio-item-ck");
                }
            }
        },
        //渲染增值服务列表
        renderValueAdded:function(valueadded){
            var self = this;
            self.valueadded = valueadded;//存全局
            var valueAddedHtml = "";
            self.ui.incrementCon.css("display","block");
            self.ui.incrementCon.find(".accordion-list").find(".increment-item").remove();
            if(valueadded && valueadded.length > 0) {
                valueAddedHtml = self.getValueAddedHtml(valueadded);
            }
            if(valueadded && valueadded.length > 0){
                self.ui.incrementCon.find(".increment-check").addClass("increment-check-ck");
            }else{
                self.ui.incrementCon.find(".increment-check").removeClass("increment-check-ck");
            }
            self.ui.incrementCon.find(".accordion-list").html($(valueAddedHtml));
            if(valueAddedHtml == "")
            {
                self.ui.incrementCon.css("display","none");
            }
        },
        //被保人属性
        insuredNameTpl: _.template('<div class="insured-property-item"><span>被保人姓名：</span><input type="text" class="property-input insured-name" value="<%=nameTxt %>"/></div>'),
        insuredOldTpl: _.template('<div class="insured-property-item"> <span>被保人年龄：</span><select class="property-input property-select insured-old"><%=oldOptions %></select></div>'),
        insuredSexTpl: _.template('<div class="insured-property-item"><span>被保人性别：</span><div class="property-radio insured-sex" data-val="M">' +
                            '<div class="property-radio-item property-radio-item-ck" data-val="M"><span class="circle"><span class="circle-ck"></span></span>男</div>'+
                            '<div class="property-radio-item" data-val="F"><span class="circle"><span class="circle-ck"></span></span>女</div></div></div>'),
        insuredSexTpl_M: _.template('<div class="insured-property-item"><span>被保人性别：</span><div class="property-radio insured-sex" data-val="M">' +
            '<div class="property-radio-item property-radio-item-ck" data-val="M"><span class="circle"><span class="circle-ck"></span></span>男</div>'+
            '</div></div>'),
        insuredSexTpl_F: _.template('<div class="insured-property-item"><span>被保人性别：</span><div class="property-radio insured-sex" data-val="F">' +
            '<div class="property-radio-item property-radio-item-ck" data-val="F"><span class="circle"><span class="circle-ck"></span></span>女</div>'+
            '</div></div>'),
        insuredOccupationsTpl: _.template('<div class="insured-property-item"><span>被保人职业类别：</span>' +
                                    '<select class="property-input property-select insured-job"><%=occupationOptions %></select>' +
                                    '</div>'),
        insuredSocialTpl: _.template('<div class="insured-property-item"><span>被保人社保：</span><div class="property-radio insured-social" data-val="N">' +
                                    ' <div class="property-radio-item" data-val="Y"><span class="circle"><span class="circle-ck"></span></span>有</div>' +
                                    '<div class="property-radio-item property-radio-item-ck" data-val="N"><span class="circle"><span class="circle-ck"></span></span>无</div> </div></div>'),
        //单选按钮的吸烟 属性 暂时不用了
        insuredSmokingTpl:_.template('<div class="insured-property-item"><span>被保人吸烟：</span><div class="property-radio insured-smoking" data-val="N">' +
                                    '<div class="property-radio-item" data-val="Y"><span class="circle"><span class="circle-ck"></span></span>是' +
                                    '</div><div class="property-radio-item property-radio-item-ck" data-val="N"><span class="circle"><span class="circle-ck"></span></span>否</div></div></div>'),
        insuredSmokingTpl2 : _.template('<div class="insured-property-item"><span>被保人吸烟：</span>' +
                                '<select class="property-input property-select insured-smoking"><%=smokingOptions %></select>' +
                                '</div>'),
        //投保人属性
        policyHolderOldTpl : _.template('<div class="insured-property-item"><span>投保人年龄：</span>' +
                             '<select class="property-input property-select insured-old"><%=oldOptions %></select></div>'),
        policyHolderSexTpl: _.template('<div class="insured-property-item"><span>投保人性别：</span>' +
                             '<div class="property-radio insured-sex" data-val="M"><div class="property-radio-item property-radio-item-ck" data-val="M">' +
                            '<span class="circle"><span class="circle-ck"></span></span>男</div>' +
                            '<div class="property-radio-item" data-val="F"><span class="circle"><span class="circle-ck"></span></span>女</div></div></div>'),
        policyHolderSexTpl_M: _.template('<div class="insured-property-item"><span>投保人性别：</span>' +
            '<div class="property-radio insured-sex" data-val="M">' +
            '<div class="property-radio-item property-radio-item-ck" data-val="M">' +
            '<span class="circle"><span class="circle-ck"></span></span>男</div>' +
            '</div></div>'),
        policyHolderSexTpl_F: _.template('<div class="insured-property-item"><span>投保人性别：</span>' +
            '<div class="property-radio insured-sex" data-val="F"><div class="property-radio-item property-radio-item-ck" data-val="F">' +
            '<span class="circle"><span class="circle-ck"></span></span>女</div>' +
            '</div></div>'),

       dutyItemTpl: _.template('<div class="duty-item"><div class="duty-item-left" data-liabId="<%=liabId %>">' +
                            '<div class="duty-item-check"></div><div class="duty-item-name"><%=liabName %></div></div>' +
                            '<input class="duty-item-input" placeholder="请输入<%=inputText %>" type="number"/></div>'),
        //可选责任列表 输入下拉框时（档次）
        dutyItem2Tpl: _.template('<div class="duty-item"><div class="duty-item-left" data-liabId="<%=liabId %>">' +
            '<div class="duty-item-check"></div><div class="duty-item-name"><%=liabName %></div></div>' +
            '<select class="property-input property-select insured-benefitlevel duty-item-select"><%=benefitlevelOptions %></select></div>'),
//            '<input class="duty-item-input" placeholder="请输入<%=inputText %>" type="number"/></div>'),
       //根据险种拼接Html-主险
       getMainPlanInputHtml:function(plan){
           var tempHtml = "";
           var self = this;
           if(!plan)return tempHtml;
           var displayClass = "";
           if(self.mainPlanNum <= 1){
               displayClass = 'style="display:none;"';
           }
           //交费期限
           var paymentPeriodHtml = "";
           //保障期限
           var guaranteePeriodHtml = "";
           //可选责任列表
           var dutyHtml = "";
           var dutyShow = "";
           //档次下拉框   修改成后台取的9.12 12:05
           var benefitLevelHtml = "";
           if(plan.benefitLevelList && plan.benefitLevelList.length > 0){
               for(i = 0; i < plan.benefitLevelList.length; i++){
                   var num = plan.benefitLevelList[i].benefitLevel || "";
                   var levelName = plan.benefitLevelList[i].levelDesc || "";
                   benefitLevelHtml += '<option value="'+num+'">'+levelName+'</option>';
               }
           }
           //可选责任列表
           if(plan.productLiabilityList && plan.productLiabilityList.length > 0){
               for(i = 0; i < plan.productLiabilityList.length; i++){
                   var inputText = "";
                   if(plan.unitFlag == 6){
                       inputText = "保额";
                   }else if(plan.unitFlag == 7){
                       inputText = "保费";
                   }else if(plan.unitFlag == 1){
                       inputText = "份数";
                   }else if(plan.unitFlag == 4){
                       inputText = "档次";
                   }
                   if(plan.unitFlag == 4){//可选责任对应输入档次 下拉框
                       dutyHtml += self.dutyItem2Tpl({liabId:plan.productLiabilityList[i].liabId,liabName:plan.productLiabilityList[i].liabName,benefitlevelOptions:benefitLevelHtml});
                   }else{
                       dutyHtml += self.dutyItemTpl({liabId:plan.productLiabilityList[i].liabId,liabName:plan.productLiabilityList[i].liabName,inputText:inputText});
                   }
               }
           }
            if(dutyHtml == ""){
                dutyShow = 'style="display:none;"';
            }
           //年金  初始化为空显示
           var annuityHtml = "";
           var showAnnuity = "style='display:none'";
           var isAnnuityProduct = plan.isAnnuityProduct;
           if(isAnnuityProduct == "Y"){
               showAnnuity = "";
           }
           var minAmount = utils.defaultMinAmount, maxAmount = utils.defaultMaxAmount; //保额、保费、份数区间限制
           if(plan.unitFlag == 6) {//保额
               tempHtml = self.unitFlag1Tpl({insType:1,displayClass:displayClass,productId:plan.salesProductId,productName:plan.salesProductName,mainPlanName:plan.salesProductName,unitflag:plan.unitFlag,paymentPeriodHtml:paymentPeriodHtml,guaranteePeriodHtml:guaranteePeriodHtml,dutyHtml:dutyHtml,minAmount:minAmount,maxAmount:maxAmount,dutyShow:dutyShow,showAnnuity:showAnnuity,annuityHtml:annuityHtml,isAnnuity:isAnnuityProduct});
           }else if(plan.unitFlag == 7) {//保费区间需根据年龄加交费方式
               tempHtml = self.unitFlag2Tpl({insType:1,displayClass:displayClass,productId:plan.salesProductId,productName:plan.salesProductName,mainPlanName:plan.salesProductName,unitflag:plan.unitFlag,paymentPeriodHtml:paymentPeriodHtml,guaranteePeriodHtml:guaranteePeriodHtml,dutyHtml:dutyHtml,minAmount:minAmount,maxAmount:maxAmount,dutyShow:dutyShow,showAnnuity:showAnnuity,annuityHtml:annuityHtml,isAnnuity:isAnnuityProduct});
           }else if(plan.unitFlag == 1) {//份数
               tempHtml = self.unitFlag3Tpl({insType:1,displayClass:displayClass,productId:plan.salesProductId,productName:plan.salesProductName,mainPlanName:plan.salesProductName,unitflag:plan.unitFlag,paymentPeriodHtml:paymentPeriodHtml,guaranteePeriodHtml:guaranteePeriodHtml,dutyHtml:dutyHtml,minAmount:minAmount,maxAmount:maxAmount,dutyShow:dutyShow,showAnnuity:showAnnuity,annuityHtml:annuityHtml,isAnnuity:isAnnuityProduct});
           }else if(plan.unitFlag == 3) {//份数 档次
               tempHtml = self.unitFlag4Tpl({insType:1,displayClass:displayClass,productId:plan.salesProductId,productName:plan.salesProductName,mainPlanName:plan.salesProductName,unitflag:plan.unitFlag,paymentPeriodHtml:paymentPeriodHtml,guaranteePeriodHtml:guaranteePeriodHtml,dutyHtml:dutyHtml,minAmount:minAmount,maxAmount:maxAmount,benefitLevelHtml:benefitLevelHtml,dutyShow:dutyShow,showAnnuity:showAnnuity,annuityHtml:annuityHtml,isAnnuity:isAnnuityProduct});
           }else if(plan.unitFlag == 4) {//档次
               tempHtml = self.unitFlag5Tpl({insType:1,displayClass:displayClass,productId:plan.salesProductId,productName:plan.salesProductName,mainPlanName:plan.salesProductName,unitflag:plan.unitFlag,paymentPeriodHtml:paymentPeriodHtml,guaranteePeriodHtml:guaranteePeriodHtml,dutyHtml:dutyHtml,benefitLevelHtml:benefitLevelHtml,dutyShow:dutyShow,showAnnuity:showAnnuity,annuityHtml:annuityHtml,isAnnuity:isAnnuityProduct});
           }else{
               tempHtml = self.unitFlag6Tpl({insType:1,displayClass:displayClass,productId:plan.salesProductId,productName:plan.salesProductName,mainPlanName:plan.salesProductName,unitflag:plan.unitFlag,dutyHtml:dutyHtml,dutyShow:dutyShow,isAnnuity:isAnnuityProduct});
           }
           return tempHtml;
       },
        //根据险种拼接Html-附加险  isFromAdditionalList是否来自附加险列表
        getAdditionalPlanInputHtml:function(plan,isFromAdditionalList){
            var tempHtml = "";
            var self = this;
            if(!plan)return tempHtml;
            //交费期限
            var paymentPeriodHtml = "";
            //保障期限
            var guaranteePeriodHtml = "";
            var productId =  plan.salesProductId;
            var productName =  plan.salesProductName;
            //档次下拉框   修改成后台取的9.12 12:05
            var benefitLevelHtml = "";
            if(plan.benefitLevelList && plan.benefitLevelList.length > 0){
                for(i = 0; i < plan.benefitLevelList.length; i++){
                    var num = plan.benefitLevelList[i].benefitLevel || "";
                    var levelName = plan.benefitLevelList[i].levelDesc || "";
                    benefitLevelHtml += '<option value="'+num+'">'+levelName+'</option>';
                }
            }
            //是否豁免型附加险
            var isExemption = plan.isWaiver=="Y"; //默认不是豁免型
            var showProperty = "";
            if(isExemption){
                showProperty = 'style="display:none;"';
            }
            //年金
            var annuityHtml = "";
            var showAnnuity = "style='display:none'";
            var isAnnuityProduct = plan.isAnnuityProduct;
            if(isAnnuityProduct == "Y"){
                showAnnuity = "";
            }
            if(plan.unitFlag == 6) { //保额
                var minAmount = utils.defaultMinAmount, maxAmount = utils.defaultMaxAmount;
                if(plan.amountLimit){
                    minAmount = plan.amountLimit.minAmount;
                    maxAmount = plan.amountLimit.maxAmount;
                }
                tempHtml = self.additionalUnitFlag1Tpl({showProperty:showProperty,insType:2,productId:productId,additionalName:productName,unitflag:plan.unitFlag,paymentPeriodHtml:paymentPeriodHtml,guaranteePeriodHtml:guaranteePeriodHtml,minAmount:minAmount,maxAmount:maxAmount,showAnnuity:showAnnuity,annuityHtml:annuityHtml,isAnnuity:isAnnuityProduct});
            }else if(plan.unitFlag == 7) {//保费
                tempHtml = self.additionalUnitFlag2Tpl({showProperty:showProperty,insType:2,productId:productId,additionalName:productName,unitflag:plan.unitFlag,paymentPeriodHtml:paymentPeriodHtml,guaranteePeriodHtml:guaranteePeriodHtml,showAnnuity:showAnnuity,annuityHtml:annuityHtml,isAnnuity:isAnnuityProduct});
            }else if(plan.unitFlag == 1) {//份数
                tempHtml = self.additionalUnitFlag3Tpl({showProperty:showProperty,insType:2,productId:productId,additionalName:productName,unitflag:plan.unitFlag,paymentPeriodHtml:paymentPeriodHtml,guaranteePeriodHtml:guaranteePeriodHtml,showAnnuity:showAnnuity,annuityHtml:annuityHtml,isAnnuity:isAnnuityProduct});
            }else if(plan.unitFlag == 3) {//份数 档次
                tempHtml = self.additionalUnitFlag4Tpl({showProperty:showProperty,insType:2,productId:productId,additionalName:productName,unitflag:plan.unitFlag,paymentPeriodHtml:paymentPeriodHtml,guaranteePeriodHtml:guaranteePeriodHtml,benefitLevelHtml:benefitLevelHtml,showAnnuity:showAnnuity,annuityHtml:annuityHtml,isAnnuity:isAnnuityProduct});
            }else if(plan.unitFlag == 4) {//档次
                tempHtml = self.additionalUnitFlag5Tpl({showProperty:showProperty,insType:2,productId:productId,additionalName:productName,unitflag:plan.unitFlag,paymentPeriodHtml:paymentPeriodHtml,guaranteePeriodHtml:guaranteePeriodHtml,benefitLevelHtml:benefitLevelHtml,showAnnuity:showAnnuity,annuityHtml:annuityHtml,isAnnuity:isAnnuityProduct});
            }else{
                tempHtml = self.additionalUnitFlag6Tpl({showProperty:showProperty,insType:2,productId:productId,additionalName:productName,unitflag:plan.unitFlag,isAnnuity:isAnnuityProduct});
            }
            return tempHtml;
        },
        //增值服务
        getValueAddedHtml:function(valueAddedArr){
            var tempHtml = "";
            for(var i = 0; i < valueAddedArr.length; i++){
                tempHtml += '<div class="increment-item" data-id="'+valueAddedArr[i].valueAddedId+'">'+valueAddedArr[i].valueAddedName+'</div>';
            }
            return tempHtml;
        },
        //保险理念
        getIdeaHtml:function(ideaArr){
            var tempHtml = "";
            var checkNum = 0;//默认保险理念个数 保证有且只有一个
            for(var i = 0; i < ideaArr.length; i++){
                if(ideaArr[i].isDefaultSpirit == "Y" && checkNum == 0){
                    checkNum += 1;
                }
                if(ideaArr[i].isDefaultSpirit == "Y" && checkNum == 1) {
                    tempHtml += '<div class="idea-item idea-item-ck" data-id="' + ideaArr[i].spiritId + '"><span class="circle"><span class="circle-ck"></span></span>' + ideaArr[i].spiritName + '</div>';
                }else{
                    tempHtml += '<div class="idea-item" data-id="' + ideaArr[i].spiritId + '"><span class="circle"><span class="circle-ck"></span></span>' + ideaArr[i].spiritName + '</div>';
                }
            }
            return tempHtml;
        },
        //获取计算结果html
        getCalcResultHtml:function(){
            var tempHtml = "";
            var self = this;
            //根据销售方式 定标题
            var saName = "保险金额";
            var headHtml = ' <tr><th width="20%">险种</th><th width="20%">'+saName+'</th><th width="20%">保障期限</th>' +
                '<th width="20%">交费期限</th><th width="20%">首年保费</th></tr>';
            var tdHtml = "";
            for(var i = 0; i < self.coveragePrems.length; i++){
                tdHtml += '<tr><td>'+self.coveragePrems[i].productName+'</td> <td>'+utils.formatNumber(self.coveragePrems[i].sa)+'</td> <td>'+
                    utils.getPeriodText(2,self.coveragePrems[i].coveragePeriod.periodType,self.coveragePrems[i].coveragePeriod.periodValue)+'</td> <td>'+
                    utils.getPeriodText(1,self.coveragePrems[i].chargePeriod.periodType,self.coveragePrems[i].chargePeriod.periodValue)+'</td> <td>'+
                    utils.formatNumber(self.coveragePrems[i].firstYearPrem)+'</td> </tr>';
            }
            tempHtml = self.calcResultTpl({headHtml:headHtml, tdHtml:tdHtml});
            return tempHtml;
        },
        //根据当前的产品列表设置 三类产品（被保人，第二被保人，投保人）交集性别选项
        setGenderRange:function(){
            var self = this;
            self.insuredGender = "N";
            self.secInsuredGender = "N";
            self.policyGender = "N";
            if(!self.currPlanList || self.currPlanList.length <= 0)
                return false;
            for(var i = 0; i < self.currPlanList.length; i++){
                var plan = self.currPlanList[i];
                if(!plan.ageLimitList || plan.ageLimitList.length <= 0)continue;
                var gender = plan.ageLimitList[0].gender;
                if(plan.pointToSecInsured == "Y"){//第二被保人
                    if(gender != "N"){
                        self.secInsuredGender = gender;
                    }
                }else if(plan.pointToPH == "Y"){//投保人
                    if(gender != "N"){
                        self.policyGender = gender;
                    }
                }else{
                    if(gender != "N"){
                        self.insuredGender = gender;
                    }
                }
            }
        },
        //根据当前的险种产品列表（包括添加进来的附加险)设置 三类产品（被保人，第二被保人，投保人）年龄段对象
        setAgeRange:function(){
            var self = this;
            self.ageRangeOfLifeAssured = null;//被保人年龄段   aRange
            self.ageRangeSecondOfLifeAssured = null;//第二被保人年龄段  bRange
            self.ageRangeOfPolicyHolder = null;//投保人  cRange
            if(!self.currPlanList || self.currPlanList.length <= 0)
                return false;
            var aRangeArr = [], bRangeArr = [], cRangeArr = [];
            for(var i = 0; i < self.currPlanList.length; i++){
                var plan = self.currPlanList[i];
                var rangeStr = JSON.stringify(plan.ageRange);
                if(plan.pointToSecInsured == "Y"){//第二被保人
                    if(plan.ageRange) {
                        bRangeArr.push(JSON.parse(rangeStr));
                    }
                }else if(plan.pointToPH == "Y"){//投保人
                    if(plan.ageRange) {
                        cRangeArr.push(JSON.parse(rangeStr));
                    }
                }else{
                    if(plan.ageRange) {
                        aRangeArr.push(JSON.parse(rangeStr));
                    }
                }
            }
            //分别获取交集年龄段对象  注意：此处已将所有单位为天的年龄转成了年，当然，value也重置为0了，计划书显示只需要显示0岁，所以没有什么问题。
            var aRange = null;
            if(aRangeArr.length > 0){
                aRange = aRangeArr[0];
                if(aRange.minUnit == utils.AGE_5) {
                    aRange.minAge = 0;
                    aRange.minUnit = utils.AGE_1;
                }
                if(aRange.maxUnit == utils.AGE_5)  {
                    aRange.maxAge = 0;
                    aRange.maxUnit = utils.AGE_1;
                }
            }
            for(var i = 1; i < aRangeArr.length; i++){
                var temMin = aRangeArr[i].minAge;
                var temMax = aRangeArr[i].maxAge;
                //如果单位是“天”，值为0岁
                if(aRangeArr[i].minUnit == utils.AGE_5)temMin = 0;
                if(aRangeArr[i].maxUnit == utils.AGE_5)temMax = 0;
                aRange.minAge = Math.max(aRange.minAge, temMin);
                aRange.maxAge = Math.min(aRange.maxAge, temMax);
            }
            if(aRange && aRange.minAge != aRange.maxAge){
                self.ageRangeOfLifeAssured = aRange;
            }
            var bRange = null;
            if(bRangeArr.length > 0){
                bRange = bRangeArr[0];
                if(bRange.minUnit == utils.AGE_5) {
                    bRange.minAge = 0;
                    bRange.minUnit = utils.AGE_1;
                }
                if(bRange.maxUnit == utils.AGE_5)  {
                    bRange.maxAge = 0;
                    bRange.maxUnit = utils.AGE_1;
                }
            }
            for(i = 1; i < bRangeArr.length; i++){
                var temMin = bRangeArr[i].minAge;
                var temMax = bRangeArr[i].maxAge;
                //如果单位是“天”，值为0岁
                if(bRangeArr[i].minUnit == utils.AGE_5)temMin = 0;
                if(bRangeArr[i].maxUnit == utils.AGE_5)temMax = 0;
                bRange.minAge = Math.max(bRange.minAge, temMin);
                bRange.maxAge = Math.min(bRange.maxAge, temMax);
            }
            if(bRange && bRange.minAge != bRange.maxAge){
                self.ageRangeSecondOfLifeAssured = bRange;
            }
            var cRange = null;
            if(cRangeArr.length > 0){
                cRange = cRangeArr[0];
                if(cRange.minUnit == utils.AGE_5) {
                    cRange.minAge = 0;
                    cRange.minUnit = utils.AGE_1;
                }
                if(cRange.maxUnit == utils.AGE_5)  {
                    cRange.maxAge = 0;
                    cRange.maxUnit = utils.AGE_1;
                }
            }
            for(i = 1; i < cRangeArr.length; i++){
                var temMin = cRangeArr[i].minAge;
                var temMax = cRangeArr[i].maxAge;
                //如果单位是“天”，值为0岁
                if(cRangeArr[i].minUnit == utils.AGE_5)temMin = 0;
                if(cRangeArr[i].maxUnit == utils.AGE_5)temMax = 0;
                cRange.minAge = Math.max(cRange.minAge, temMin);
                cRange.maxAge = Math.min(cRange.maxAge, temMax);
            }
            if(cRange && cRange.minAge != cRange.maxAge){
                self.ageRangeOfPolicyHolder = cRange;
            }
            self.ageRangeOfLifeAssuredHtml = "";//被保人
            self.ageRangeSecondOfLifeAssuredHtml = "";//第二被保人
            self.ageRangeOfPolicyHolderHtml = "";//投保人
            if(self.ageRangeOfLifeAssured) {
                var minAge = self.ageRangeOfLifeAssured.minAge;
                if(self.ageRangeOfLifeAssured.minUnit == utils.AGE_5){
                    minAge = 0;
                }
                var maxAge = self.ageRangeOfLifeAssured.maxAge;
                if(self.ageRangeOfLifeAssured == utils.AGE_5){
                    maxAge = 0;
                }
                for (var i = minAge; i <= maxAge; i++) {
                    self.ageRangeOfLifeAssuredHtml += '<option value="' + i + '">' + i + '</option>';
                }
            }
            if(self.ageRangeOfPolicyHolder) {
                var minAge = self.ageRangeOfPolicyHolder.minAge;
                if(self.ageRangeOfPolicyHolder.minUnit == utils.AGE_5){
                    minAge = 0;
                }
                var maxAge = self.ageRangeOfPolicyHolder.maxAge;
                if(self.ageRangeOfPolicyHolder == utils.AGE_5){
                    maxAge = 0;
                }
                for (i = minAge; i <= maxAge; i++) {
                    self.ageRangeOfPolicyHolderHtml += '<option value="' + i + '">' + i + '</option>';
                }
            }
            if(self.ageRangeSecondOfLifeAssured) {
                var minAge =  self.ageRangeSecondOfLifeAssured.minAge;
                if(self.ageRangeSecondOfLifeAssured.minUnit == utils.AGE_5){
                    minAge = 0;
                }
                var maxAge = self.ageRangeSecondOfLifeAssured.maxAge;
                if(self.ageRangeSecondOfLifeAssured == utils.AGE_5){
                    maxAge = 0;
                }
                for (i = minAge; i <= maxAge; i++) {
                    self.ageRangeSecondOfLifeAssuredHtml += '<option value="' + i + '">' + i + '</option>';
                }
            }
        },
        /**
         * 设置全局相关属性 否存在第二被保人、是否与被保人吸烟有关、是否与被保人职业有关、是否与被保人社保有关
         * 根据险种产品列表 重置被保人年龄段、第二被保人年龄段、投保人年龄段html
          * @returns {boolean}
         */
        setRelevantProperty:function(){
            var self = this;
            self.hasPolicyHolder = false;//投保人
            self.hasSecInsured = false;
            self.smokingType = 0;//和吸烟无关  1下拉框 2下拉框
            self.hasJob = false;//是否与被保人职业有关
            self.hasSocialInsure = false;//是否与被保人社保有关
            //重置被保人、二被保人、投保人性别
            self.insuredGender = "N";
            self.secInsuredGender = "N";
            self.policyGender = "N";
            if(!self.currPlanList)
                self.currPlanList = [];
            self.setAgeRange(); //根据当前产品列表 重置年龄段对象 并拼接下拉Html
            self.setGenderRange();//取性别交集 如A产品 男女  B产品男  则只能选男
            var mainPlanNum = 0;
            self.secInsuredPlanIdArr = [];
            self.insuredPlanIdArr = [];
            self.policyPlanIdArr = [];
            //设置当前主险个数，
            for(var i = 0; i < self.currPlanList.length; i++){
                if(self.currPlanList[i].insType == 1){
                    mainPlanNum += 1;
                }
                if(self.currPlanList[i].pointToPH == "Y"){
                    self.hasPolicyHolder = true;
                    self.policyPlanIdArr.push(self.currPlanList[i].salesProductId);
                }else if(self.currPlanList[i].pointToSecInsured == "Y")//第二被保人
                {
                    self.hasSecInsured = true;
                    self.secInsuredPlanIdArr.push(self.currPlanList[i].salesProductId);
                }else{
                    self.insuredPlanIdArr.push(self.currPlanList[i].salesProductId);
                }
                if(self.smokingType == 0) {
                    self.smokingType = self.currPlanList[i].smokingIndi;
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
            //主险个数
            self.mainPlanNum = mainPlanNum;
            //设置职位下拉选项、吸烟下拉选项
            self.occupationListHtml = "";
            self.smokingListHtml = "";
            self.smokingList2Html = "";
            for(i = 0; i < self.occupationList.length;i++){
                self.occupationListHtml += '<option value="'+self.occupationList[i].id+'">'+self.occupationList[i].name+'</option>';
            }
            for(i = 0; i < self.smokingList1.length; i++){
                self.smokingListHtml += '<option value="'+self.smokingList1[i].id+'">'+self.smokingList1[i].name+'</option>';
            }
            for(i = 0; i < self.smokingList2.length; i++){
                self.smokingList2Html += '<option value="'+self.smokingList2[i].id+'">'+self.smokingList2[i].name+'</option>';
            }
        },
        //监听添加附加险
        onAddAdditional:function(obj){
            var self = this;
            if(!self.currPlanList)
                self.currPlanList = [];
            obj.insType = 2;//附加险
            var tempHtml = self.getAdditionalPlanInputHtml(obj,1);
            if(tempHtml != "")
            {
                self.additionalIdArr.push(obj.salesProductId);
            }
            self.ui.additionalPlanInput.append($(tempHtml));
            self.currPlanList.push(obj);
            //添加险种 重置 被保人、第二被保人、投保人
            self.resetAllInput();
            //根据附加险类型取对应保人年龄
            var age = self.getCurSecAge(obj);
            self.resetPlanInput(self.ui.additionalPlanInput.find(".additional-item:last"),age);
        },
        //点击返回
        clickTopTitleLeftHandler: function(e){
            e.stopPropagation();
            e.preventDefault();
            //返回重置当前产品计划ID，返回进入重置所有
            this.currProductId = 0;
            app.goBack();
        },
        //点击单选框
        clickRadioHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var target = $(event.target);
            var self = this;
            if(!target.hasClass("property-radio-item"))return;
            if(target.hasClass("property-radio-item-ck")){
                return;
            }
            target.siblings(".property-radio-item").removeClass("property-radio-item-ck");
            target.addClass("property-radio-item-ck")
            target.parent().attr("data-val",target.attr("data-val"));

            //判断 如果点击的是投保人性别，跟页面底部“先生 女士”下拉性别选项同步
            if(target.parents("#make-plan-policy-holder").size() > 0){
                if(target.attr("data-val") == "F"){
                    self.ui.sendSex.val("1");
                }else{
                    self.ui.sendSex.val("0");
                }
            }
        },
        changeSexHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            if(self.ui.sendSex.val() == "1"){//女士F  policyHolder
                self.ui.policyHolder.find(".insured-sex").attr("data-val","F");
                self.ui.policyHolder.find(".property-radio-item").removeClass("property-radio-item-ck");
                self.ui.policyHolder.find(".property-radio-item:eq(1)").addClass("property-radio-item-ck");
            }else{ //先生
                self.ui.policyHolder.find(".insured-sex").attr("data-val","M");
                self.ui.policyHolder.find(".property-radio-item").removeClass("property-radio-item-ck");
                self.ui.policyHolder.find(".property-radio-item:eq(0)").addClass("property-radio-item-ck");
            }
        },
        //点击查看增值服务详情
        clickIncrementHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var target = $(e.target);
            var valueAddedId = target.data("id") || "null";
            app.navigate("in/increment/"+valueAddedId,{replace:true, trigger:true});
        },
        //年龄下拉更新
        changeOldHandler:function(e){
            var self = this;
            var target = $(e.target);
            var age = target.val();
            //表示被保人年龄更新
            if(target.parents(".first-insured").size() > 0){
                //第一被保人相关的  主险main-insured-item 附加险 additional-item
                self.ui.makePlanInput.find(".main-insured-item").each(function(){
                    if(self.insuredPlanIdArr.indexOf($(this).data("productid")) >= 0){
                        self.resetPlanInput($(this),age);
                    }
                })
                //第一被保人相关的  主险main-insured-item 附加险 additional-item
                self.ui.additionalPlanInput.find(".additional-item").each(function(){
                    if(self.insuredPlanIdArr.indexOf($(this).data("productid")) >= 0){
                        self.resetPlanInput($(this),age);
                    }
                })
            }else if(target.parents(".second-insured").size() > 0){//第二被保人年龄更新
                //第一被保人相关的  主险main-insured-item 附加险 additional-item
                self.ui.makePlanInput.find(".main-insured-item").each(function(){
                    if(self.secInsuredPlanIdArr.indexOf($(this).data("productid")) >= 0){
                        self.resetPlanInput($(this),age);
                    }
                })
                //第一被保人相关的  主险main-insured-item 附加险 additional-item
                self.ui.additionalPlanInput.find(".additional-item").each(function(){
                    if(self.secInsuredPlanIdArr.indexOf($(this).data("productid")) >= 0){
                        self.resetPlanInput($(this),age);
                    }
                })
            }else if(target.parents(".policy-holder").size() > 0){//第二被保人年龄更新
                //第一被保人相关的  主险main-insured-item 附加险 additional-item
                self.ui.makePlanInput.find(".main-insured-item").each(function(){
                    if(self.policyPlanIdArr.indexOf($(this).data("productid")) >= 0){
                        self.resetPlanInput($(this),age);
                    }
                });
                //第一被保人相关的  主险main-insured-item 附加险 additional-item
                self.ui.additionalPlanInput.find(".additional-item").each(function(){
                    if(self.policyPlanIdArr.indexOf($(this).data("productid")) >= 0){
                        self.resetPlanInput($(this),age);
                    }
                })
            }
            e.stopPropagation();
            e.preventDefault();
        },
        //根据产品ID 重置下拉选项 及保额/保费/份数范围
        resetPlanInput:function(target,currAge){
            var self = this;
            var planId = target.data("productid");
            var plan = self.getPlanById(planId);
            if(!plan){
                console.log("plan=null");
                return;
            }
            //根据年龄 重置交费期间
            var paymentPeriodHtml = "";
            var isPackageProduct = plan.isPackageProduct;//是否组合计划
            var prdtTermChargeList = self.getChargeListByAge(plan,currAge);
            var firstCharge = null;//交费下拉第一个
            if(plan.insType == 1) {//主险
                if (prdtTermChargeList && prdtTermChargeList.length > 0) {
                    firstCharge = prdtTermChargeList[0];
                    for (var i = 0; i < prdtTermChargeList.length; i++) {
                        var typeName = "";
                        typeName = utils.getPeriodText(1, prdtTermChargeList[i].periodType, prdtTermChargeList[i].periodValue);
                        paymentPeriodHtml += '<option data-type="' + prdtTermChargeList[i].periodType + '" value="' + prdtTermChargeList[i].periodValue + '">' + typeName + '</option>';
                    }
                }
            }
            if(plan.insType == 2) {//附加险
                if (prdtTermChargeList && prdtTermChargeList.length > 0) {
                    //根据当前是否计划内、当前选中主险交费方式 获取当前合适的选中项
                    //主险选中年龄
                    var mp = self.getFirstMainPlan();
                    var mpAge = self.getCurSecAge(mp);
                    //主险当前选中交费方式
                    var type = self.ui.makePlanInput.find(".main-insured-item:eq(0)").find(".payment-period").find("option:selected").data("type");
                    var value = self.ui.makePlanInput.find(".main-insured-item:eq(0)").find(".payment-period").find("option:selected").val();
                    firstCharge = self.getSecCharge(isPackageProduct, mpAge, currAge, prdtTermChargeList, {periodType: type, periodValue: value});
                    for (var i = 0; i < prdtTermChargeList.length; i++) {
                        var typeName = "";
                        typeName = utils.getPeriodText(1, prdtTermChargeList[i].periodType, prdtTermChargeList[i].periodValue);
                        paymentPeriodHtml += '<option data-type="' + prdtTermChargeList[i].periodType + '" value="' + prdtTermChargeList[i].periodValue + '">' + typeName + '</option>';
                    }
                }
            }
            target.find(".payment-period").html($(paymentPeriodHtml));
            if(firstCharge && firstCharge.periodType){
                target.find(".payment-period").val(firstCharge.periodValue);
            }else{
                target.find(".payment-period").val(-1);
            }
            var minAmount = utils.defaultMinAmount, maxAmount = utils.defaultMaxAmount; //保额、保费、份数区间限制
            if(plan.unitFlag == 6) {//保额
               var amount = self.getAmountLimit(plan,currAge);
               if(amount){
                   minAmount = parseInt(amount.minAmount);
                   maxAmount = parseInt(amount.maxAmount);
               }
               target.find(".insured-sa").attr("min",minAmount);
               target.find(".insured-sa").attr("max",maxAmount);
            }else if(plan.unitFlag == 7) {//保费区间需根据年龄加交费方式
                var amount = self.getPremLimit(plan,currAge,firstCharge);
                if(amount){
                    minAmount = parseInt(amount.minInitialPrem);
                    maxAmount = parseInt(amount.maxInitialPrem);
                }
                target.find(".insured-premium").attr("min",minAmount);
                target.find(".insured-premium").attr("max",maxAmount);
            }else if(plan.unitFlag == 1 || plan.unitFlag == 3) {//份数
                var amount = self.getAmountLimit(plan,currAge);
                if(amount){
                    minAmount = parseInt(amount.minAmount);
                    maxAmount = parseInt(amount.maxAmount);
                }
                target.find(".insured-unit").attr("min",minAmount);
                target.find(".insured-unit").attr("max",maxAmount);
            }
            target.find(".payment-period").change();
        },
        //交费期间下拉更新
        changeChargeHandler:function(e){
            var self = this;
            var target = $(e.target);
            var planId;
            var parent;
            var guaranteePeriodHtml = "";
            if(target.parents(".main-insured-item").size() > 0){
                parent = target.parents(".main-insured-item");
                planId = target.parents(".main-insured-item").data("productid");
            }else{
                parent = target.parents(".additional-item");
                planId = target.parents(".additional-item").data("productid");
            }
            var plan = self.getPlanById(planId);
            if(!plan){
                return;
            }
            var isPackageProduct = plan.isPackageProduct;
            var currAge = self.getCurSecAge(plan);
            //选中交费期间
            var firstCharge = {periodType:target.find("option:selected").attr("data-type"), periodValue:target.val()};//选中保费
            var firstCoverage = null;//保障下拉第一个
            var prdtTermCoverageList = self.getCoverageListByAge(plan, currAge, firstCharge);
            if(plan.insType == 1) {//主险
                if (prdtTermCoverageList && prdtTermCoverageList.length > 0) {
                    firstCoverage = prdtTermCoverageList[0];
                    for (var j = 0; j < prdtTermCoverageList.length; j++) {
                        var typeName = "";
                        typeName = utils.getPeriodText(2, prdtTermCoverageList[j].periodType, prdtTermCoverageList[j].periodValue);
                        guaranteePeriodHtml += '<option data-type="' + prdtTermCoverageList[j].periodType + '" value="' + prdtTermCoverageList[j].periodValue + '">' + typeName + '</option>';
                    }
                }
                //如果主险交费下拉为趸交，移除豁免附加险
                if(firstCharge.periodType == 1){
                    self.removeWaiverRider();
                }
            }
            if(plan.insType == 2) {//附加险
                if (prdtTermCoverageList && prdtTermCoverageList.length > 0) {
                    //根据当前是否计划内、当前选中主险交费方式 获取当前合适的选中项
                    //主险选中年龄
                    var mp = self.getFirstMainPlan();
                    var mpAge = self.getCurSecAge(mp);
                    //主险当前选中保障期间
                    var type = self.ui.makePlanInput.find(".main-insured-item:eq(0)").find(".guarantee-period").find("option:selected").data("type");
                    var value = self.ui.makePlanInput.find(".main-insured-item:eq(0)").find(".guarantee-period").find("option:selected").val();
                    firstCoverage = self.getSecCoverage(isPackageProduct, mpAge, currAge, prdtTermCoverageList, {periodType: type, periodValue: value});
                    for (var i = 0; i < prdtTermCoverageList.length; i++) {
                        var typeName = "";
                        typeName = utils.getPeriodText(2, prdtTermCoverageList[i].periodType, prdtTermCoverageList[i].periodValue);
                        guaranteePeriodHtml += '<option data-type="' + prdtTermCoverageList[i].periodType + '" value="' + prdtTermCoverageList[i].periodValue + '">' + typeName + '</option>';
                    }
                }
            }
            parent.find(".guarantee-period").html($(guaranteePeriodHtml));
            if(firstCoverage && firstCoverage.periodType){
                parent.find(".guarantee-period").val(firstCoverage.periodValue);
            }else{
                parent.find(".guarantee-period").val(-1);
            }
            //如果销售方式 为保费，更新后仍须更新保费输入范围
            if(plan.unitFlag == 7){//保费
                var minAmount = utils.defaultMinAmount, maxAmount = utils.defaultMaxAmount;
                var amount = self.getPremLimit(plan,currAge,firstCharge);
                if(amount){
                    minAmount = parseInt(amount.minInitialPrem);
                    maxAmount = parseInt(amount.maxInitialPrem);
                }
                parent.find(".insured-premium").attr("min",minAmount);
                parent.find(".insured-premium").attr("max",maxAmount);
            }
            parent.find(".guarantee-period").change();
            //如果当前是主险，重置附加险交费下拉
            if(plan.insType == 1){
                self.changeRidersCharge(firstCharge);
            }else if(plan.insType == 2){//附加险 需验证 组合需等于主险输入  非组合需小于主险
                self.checkRiders(parent,plan,1);
            }
            e.stopPropagation();
            e.preventDefault();
        },
        /**
         * 主险的交费期间下拉更新，重置所有附加险的交费下拉
         * @param mainCharge 主险选中交费期间对象 {periodType:periodType,periodValue:periodValue}
         */
        changeRidersCharge:function(mainCharge){
            var self = this;
            //循环所有附加险
            self.ui.additionalPlanInput.find(".additional-item").each(function(){
                var planId = $(this).data("productid");
                var plan = self.getPlanById(planId);
                if(!plan)return false;
                var currAge = self.getCurSecAge(plan);
                var isPackageProduct = plan.isPackageProduct;//组合计划
                var firstCharge = null;
                var paymentPeriodHtml = "";
                if(plan && plan.isWaiver && plan.isWaiver != "Y") { //如果计划存在 并且不是豁免产品
                    //此处逻辑同函数changeChargeHandler下 附加险交费列表重置片段
                    var prdtTermChargeList = self.getChargeListByAge(plan, currAge);
                    if (prdtTermChargeList && prdtTermChargeList.length > 0) {
                        //根据当前是否计划内、当前选中主险交费方式 获取当前合适的选中项
                        //主险选中年龄
                        var mp = self.getFirstMainPlan();
                        var mpAge = self.getCurSecAge(mp);
                        //主险当前选中交费方式
                        firstCharge = self.getSecCharge(isPackageProduct, mpAge, currAge, prdtTermChargeList, mainCharge);
                        for (var i = 0; i < prdtTermChargeList.length; i++) {
                            var typeName = "";
                            typeName = utils.getPeriodText(1, prdtTermChargeList[i].periodType, prdtTermChargeList[i].periodValue);
                            paymentPeriodHtml += '<option data-type="' + prdtTermChargeList[i].periodType + '" value="' + prdtTermChargeList[i].periodValue + '">' + typeName + '</option>';
                        }
                    }
                    $(this).find(".payment-period").html($(paymentPeriodHtml));
                    if(firstCharge && firstCharge.periodType){
                        $(this).find(".payment-period").val(firstCharge.periodValue);
                    }else{
                        $(this).find(".payment-period").val(-1);
                    }
                    $(this).find(".payment-period").change();
                }
            });
        },
        /**
         * 验证当前附加险交费期间 保障期间
         * 如果是组合计划 需等于主险输入
         * 如果非组合计划 需小于等于主险输入
         * @param parent 附加险项html对象
         * @param plan 产品数据对象
         * @param periodType 1验证交费  2验证保障   （必传，因数初始化设置附加险下拉时也会触发验证，此时保障还没初始化，验证保障必错，而初始化时验证无疑不妥）
         */
        checkRiders:function(parent,plan,periodType){
            //当前主险选中年龄
            var self = this;
            var mp = self.getFirstMainPlan();
            var mpAge = self.getCurSecAge(mp);
            var currAge = self.getCurSecAge(plan);
            var isPackageProduct = plan.isPackageProduct;//是否组合计划
            //主险当前选中保障期间
            var type = self.ui.makePlanInput.find(".main-insured-item:eq(0)").find(".payment-period").find("option:selected").data("type");
            var value = self.ui.makePlanInput.find(".main-insured-item:eq(0)").find(".payment-period").find("option:selected").val();
            if(periodType == 2){
                type = self.ui.makePlanInput.find(".main-insured-item:eq(0)").find(".guarantee-period").find("option:selected").data("type");
                value = self.ui.makePlanInput.find(".main-insured-item:eq(0)").find(".guarantee-period").find("option:selected").val();
            }
            //验证交费期间项
            if(periodType == 1){
                var periodType = parent.find(".payment-period").find("option:selected").data("type");
                var periodValue = parent.find(".payment-period").find("option:selected").val();
                if(isPackageProduct == "Y"){
                    if(value != periodValue){
//                        MsgBox.alert(errorMsg.makePlanMsg12);//不好提示
                        parent.find(".payment-period").val(value);
                        return;
                    }
                }else{
                    if(utils.compareCharge(type,value,mpAge,periodType,periodValue,currAge) == 0){
//                        MsgBox.alert(errorMsg.makePlanMsg13);//不好提示
                        parent.find(".payment-period option").each(function(){
                            var tempType = $(this).data("type");
                            var tempValue = $(this).attr("value");
                            if(utils.compareCharge(type,value,mpAge,tempType,tempValue,currAge) == 1){
                                parent.find(".payment-period").val(tempValue);
                                return false;
                            }
                        });
                        return;
                    }
                }
            }else if(periodType == 2){//验证保障期间项
                var periodType = parent.find(".guarantee-period").find("option:selected").data("type");
                var periodValue = parent.find(".guarantee-period").find("option:selected").val();
                if(isPackageProduct == "Y"){
                    if(value != periodValue){
                        parent.find(".guarantee-period").val(value);
                        return;
                    }
                }else{
                    if(utils.compareCoverage(type,value,mpAge,periodType,periodValue,currAge) == 0){
                        parent.find(".guarantee-period option").each(function(){
                            var tempType = $(this).data("type");
                            var tempValue = $(this).attr("value");
                            if(utils.compareCoverage(type,value,mpAge,tempType,tempValue,currAge) == 1){
                                parent.find(".guarantee-period").val(tempValue);
                                return false;
                            }
                        });
                        return;
                    }
                }
            }
        },
        /**
         * 主险的保障期间下拉更新，重置所有附加险的保障期间下拉
         * @param mainCoverage
         */
        changeRidersCoverage:function(mainCoverage){
            var self = this;
            //循环所有附加险
            self.ui.additionalPlanInput.find(".additional-item").each(function(){
               //直接触发所有附加险交费下拉更新事件
                $(this).find(".payment-period").change();
            });
        },
        //保障更新
        changeCoverageHandler:function(e){
            var self = this;
            var target = $(e.target);
            var planId;
            var parent;
            var annuityHtml = "";
            if(target.parents(".main-insured-item").size() > 0){
                parent = target.parents(".main-insured-item");
                planId = target.parents(".main-insured-item").data("productid");
            }else{
                parent = target.parents(".additional-item");
                planId = target.parents(".additional-item").data("productid");
            }
            var plan = self.getPlanById(planId);
            if(!plan){
                return;
            }
            var currAge = self.getCurSecAge(plan);
            var isAnnuityProduct = plan.isAnnuityProduct;//是否年金产品
            var showAnnuity = "";//是否显示年金下拉框
            var firstCharge = {periodType: parent.find(".payment-period").find("option:selected").attr("data-type"), periodValue: parent.find(".payment-period").val()};//选中保费
            var firstCoverage = {periodType: target.find("option:selected").attr("data-type"), periodValue: target.val()};//选中保障期间
            //是年金产品
            if(isAnnuityProduct == "Y") {
                var payPeriod = self.getPayListByAge(plan, currAge, firstCharge, firstCoverage);
                if (payPeriod && payPeriod.length > 0) {
                    for (var i = 0; i < payPeriod.length; i++) {
                        if (!payPeriod[i])continue;
                        var typeName = utils.getAnnuityText(payPeriod[i].periodType, payPeriod[i].periodValue);
                        annuityHtml += '<option data-type="' + payPeriod[i].periodType + '" value="' + payPeriod[i].periodValue + '">' + typeName + '</option>';
                    }
                    //如果列表只有1个，也不显示，但值需要(改为只要1个就不显示12:07)
//                   if(plan.payPeriod.length == 1 && (plan.payPeriod[0].periodType == "1" || plan.payPeriod[0].periodType == "4" || plan.payPeriod[0].periodType == "5")){
                    if (payPeriod.length == 1) {
                        showAnnuity = "style='display:none'";
                    }
                }
                parent.find(".annuity").html($(annuityHtml));
                if(showAnnuity != ""){
                    parent.find(".annuity").parents(".insured-property-item").css("display","none");
                }else{
                    parent.find(".annuity").parents(".insured-property-item").css("display","block");
                }
            }
            //如果当前是主险，重置附加险保障下拉
            if(plan.insType == 1){
                self.changeRidersCoverage(firstCoverage);
            }else if(plan.insType == 2){//附加险 需验证 组合需等于主险输入  非组合需小于主险
                self.checkRiders(parent,plan,2);
            }
            e.stopPropagation();
            e.preventDefault();
        },
        //保额输入框失去焦点
        blurInsuredSAHandler:function(e){
            var target = $(e.target);
            var max = parseFloat(target.attr("max") || 0);
            var min = parseFloat(target.attr("min") || 0);
            var val = parseFloat(target.val());
            if(isNaN(val)){
                MsgBox.alert(errorMsg.makePlanMsg5);
            }else if(val < min || val > max){
                MsgBox.alert("保额区间"+min+"~"+max);
            }else{
                return;
            }
            target.focus();
        },
        //保费输入框失去焦点
        blurInsuredPremiumHandler:function(e){
            var target = $(e.target);
            var max = parseFloat(target.attr("max") || 0);
            var min = parseFloat(target.attr("min") || 0);
            var val = target.val() && parseFloat(target.val());
            if(val < min || val > max){
                MsgBox.alert("保费区间"+min+"~"+max);
                target.focus();
            }
        },
        //份数输入框失去焦点
        blurInsuredUnitHandler:function(e){
            var target = $(e.target);
            var max = parseInt(target.attr("max") || 0);
            var min = parseInt(target.attr("min") || 0);
            var val = parseFloat(target.val());
            if(isNaN(val)){
                MsgBox.alert(errorMsg.makePlanMsg8);
            }else if(!utils.isPositiveNum(val)){
                MsgBox.alert(errorMsg.makePlanMsg9);
            }else if(val < min || val > max){
                MsgBox.alert("份数区间"+min+"~"+max);
            }else{
                return;
            }
            target.focus();
        },
        getValueAddedById:function(id){
            var self = this;
            if(self.valueadded && self.valueadded.length > 0){
                for(var i = 0; i < self.valueadded.length; i++){
                    if(self.valueadded[i].valueAddedId == id){
                        return self.valueadded[i];
                    }
                }
            }
            return {};
        },
        //点击可选责任
        clickLiabilityHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var target = $(e.currentTarget);
            target.toggleClass("duty-item-left-ck");
        },
        //点击展开/收起 可选责任
        clickDutyTipHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var target = $(e.currentTarget);
            if(target.hasClass("duty-open")){ //点击收起
                target.removeClass("duty-open").addClass("duty-stop");
                target.parents(".duty-title").next(".duty-list").slideUp();

            }else{  //点击展开
                target.addClass("duty-open").removeClass("duty-stop");
                target.parents(".duty-title").next(".duty-list").slideDown();
            }
        },
        //增值服务、留言 勾选框
        clickCheckHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var target = $(e.target);
            target.toggleClass("increment-check-ck");
        },
        //点击展开/收起 计算结果table
        clickFirstYearTipHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var target = $(e.target);
            if(target.hasClass("first-year-open")){//点击展开
                target.removeClass("first-year-open").addClass("first-year-stop");
                target.siblings(".first-year-table").slideDown();
            }else{
                target.removeClass("first-year-stop").addClass("first-year-open");
                target.siblings(".first-year-table").slideUp();
            }
        },
        //手风琴 增值服务、保险理念 共享
        clickAccordionHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var target = $(e.target);
            if(target.hasClass("title-stop")){//点击收起
                target.removeClass("title-stop").addClass("title-open");
                target.parents(".insured-title").siblings(".accordion-list").slideUp();
            }else{
                target.removeClass("title-open").addClass("title-stop");
                target.parents(".insured-title").siblings(".accordion-list").slideDown();
            }
        },
        //根据输入获取计划书详情
        getPlanByInput:function(){
            var self = this;
            var responseData = {};
            var plan = {};
            self.focusInput = null;
            responseData.encryptedUserData = utils.userObj.id;
            plan.packageId = self.currProductId;//产品计划ID
            var insureds = [];//被保人数组
            //第一被保人
            var insured = {};
            insured.id = "0";//自己填写的被保人信息 无ID
            insured.name = self.ui.firstInsured.find(".insured-name").val();
            insured.age = self.ui.firstInsured.find(".insured-old").val();
            if(!insured.age && errorMsg.makePlanMsg1 != ""){      //验证第一被保人
                MsgBox.alert(errorMsg.makePlanMsg1);
                self.ui.firstInsured.find(".insured-old").focus();
                return false;
            }
            insured.gender = self.ui.firstInsured.find(".insured-sex").attr("data-val");
            insured.jobCateId = self.ui.firstInsured.find(".insured-job").val();//职位
            insured.socialInsuranceIndi = self.ui.firstInsured.find(".insured-social").attr("data-val");//社保
            insured.smoking = self.ui.firstInsured.find(".insured-smoking").val();//吸烟
            insureds.push(insured);
            //是否存在第二被保人
            if(self.ui.secondInsured.find(".insured-name").size() > 0) {
                //第二被保人
                var secInsured = {};
                secInsured.id = 0;
                secInsured.name = self.ui.secondInsured.find(".insured-name").val();
                secInsured.age = self.ui.secondInsured.find(".insured-old").val();
                if(!secInsured.age && errorMsg.makePlanMsg1 != ""){  //验证第二被保人
                    MsgBox.alert(errorMsg.makePlanMsg1);
                    self.ui.secondInsured.find(".insured-old").focus();
                    return false;
                }
                secInsured.gender = self.ui.secondInsured.find(".insured-sex").attr("data-val");
                secInsured.jobCateId = self.ui.secondInsured.find(".insured-job").val();//职位
                secInsured.socialInsuranceIndi = self.ui.secondInsured.find(".insured-social").attr("data-val");//社保
                secInsured.smoking = self.ui.secondInsured.find(".insured-smoking").val();//吸烟
                insureds.push(secInsured);
            }
            plan.insureds = insureds;
            //投保人
            var proposer = {};
            proposer.name = self.ui.sendName.val();
            proposer.age = self.ui.policyHolder.find(".insured-old").val();
            proposer.gender = self.ui.policyHolder.find(".insured-sex").attr("data-val");
            plan.proposer = proposer;

            //主险数据
            var mainCoverages = [];
            var validateErrMsg = "";
            self.ui.makePlanInput.find(".main-insured-item").each(function(){
                var mainCoverage = {};
                mainCoverage.productId = $(this).data("productid");
                mainCoverage.unitFlag = $(this).data("unitflag");
                mainCoverage.sa = $(this).find(".insured-sa").val();
                var pName = "主险";//$(this).data("productname"); //暂时默认只一个主险，这里显示名字意思不大 一个主险时也看不到名字，无法定位
                if(mainCoverage.sa == ""){
                    validateErrMsg = pName+errorMsg.makePlanMsg5;
                    self.focusInput = $(this).find(".insured-sa");
                    return false;
                }
                if(mainCoverage.sa){
                    var max = parseFloat($(this).find(".insured-sa").attr("max"));
                    var min = parseFloat($(this).find(".insured-sa").attr("min"));
                   if(parseFloat(mainCoverage.sa) < min || parseFloat(mainCoverage.sa) > max){
                       validateErrMsg = pName+"保额区间"+min+"~"+max;
                       self.focusInput = $(this).find(".insured-sa");
                       return false;
                   }
                }
                //保额需验证最小值 最大值
                mainCoverage.premium = $(this).find(".insured-premium").val();
                if(mainCoverage.premium == ""){
                    validateErrMsg = pName+errorMsg.makePlanMsg6;
                    self.focusInput = $(this).find(".insured-premium");
                    return false;
                }
                if(mainCoverage.premium){
                    var max = parseFloat($(this).find(".insured-premium").attr("max"));
                    var min = parseFloat($(this).find(".insured-premium").attr("min"));
                    if(parseFloat(mainCoverage.premium) < min || parseFloat(mainCoverage.premium) > max){
                        validateErrMsg = pName+"保费区间"+min+"~"+max;
                        self.focusInput = $(this).find(".insured-premium");
                        return false;
                    }
                }
                mainCoverage.unit = $(this).find(".insured-unit").val();
                if(mainCoverage.unit == ""){
                    validateErrMsg = pName+errorMsg.makePlanMsg7;
                    self.focusInput = $(this).find(".insured-unit");
                    return false;
                }
                if(mainCoverage.unit && !utils.isPositiveNum(mainCoverage.unit)){
                    validateErrMsg = pName+errorMsg.makePlanMsg9;
                    self.focusInput = $(this).find(".insured-unit");
                    return false;
                }
                if(mainCoverage.unit){
                    var max = parseInt($(this).find(".insured-unit").attr("max"));
                    var min = parseInt($(this).find(".insured-unit").attr("min"));
                    if(parseInt(mainCoverage.unit) < min || parseInt(mainCoverage.unit) > max){
                        validateErrMsg = pName+"份数区间"+min+"~"+max;
                        self.focusInput = $(this).find(".insured-unit");
                        return false;
                    }
                }
                mainCoverage.benefitlevel = $(this).find(".insured-benefitlevel").val();
                //为null表示 有此下拉选项 但无值
                if(mainCoverage.benefitlevel == null && typeof mainCoverage.benefitlevel == "object"){
                    validateErrMsg = pName+errorMsg.makePlanMsg8;
                    self.focusInput = $(this).find(".insured-benefitlevel");
                    return false;
                }else{
                    //存在档次时，如果份数=null,赋值=1   *****重要****
                    if(!mainCoverage.unit || isNaN(mainCoverage.unit)){
                        mainCoverage.unit = 1;
                    }
                }

                //交费期限
                var chargePeriod = {};
                var type = $(this).find(".payment-period").find("option:selected").data("type");
                chargePeriod.periodType = type;
                chargePeriod.periodValue = parseInt($(this).find(".payment-period").find("option:selected").val());
                mainCoverage.chargePeriod = chargePeriod;
                if($(this).find(".payment-period").size() > 0 && isNaN(chargePeriod.periodValue)){
                    validateErrMsg = pName+errorMsg.makePlanMsg4;
                    self.focusInput = $(this).find(".payment-period");
                    return false;
                }
                //保障期限
                var  coveragePeriod = {};
                type = $(this).find(".guarantee-period").find("option:selected").data("type");
                coveragePeriod.periodType = type;
                coveragePeriod.periodValue = parseInt($(this).find(".guarantee-period").find("option:selected").val());
                mainCoverage.coveragePeriod = coveragePeriod;
                if($(this).find(".guarantee-period").size() > 0 && isNaN(coveragePeriod.periodValue)){
                    validateErrMsg = pName+errorMsg.makePlanMsg3;
                    self.focusInput = $(this).find(".guarantee-period");
                    return false;
                }
                //年金领取时间 判断是否函年金选项
                if($(this).data("annuity") == "Y") {
                    var payPeriod = {};
                    type = $(this).find(".annuity").find("option:selected").data("type");
                    payPeriod.periodType = type;
                    payPeriod.periodValue = parseInt($(this).find(".annuity").find("option:selected").val());
                    mainCoverage.payPeriod = payPeriod;
                    if ($(this).find(".annuity").size() > 0 && isNaN(payPeriod.periodValue)) {
                        validateErrMsg = pName + errorMsg.makePlanMsg11;
                        self.focusInput = $(this).find(".annuity");
                        return false;
                    }
                }else {
                    mainCoverage.payPeriod = null;
                }
                //责任数组
                var planLiabilityList = [];
                $(this).find(".duty-item").each(function(index){
                    var planLiability = {};
                    planLiability.unitFlag = mainCoverage.unitFlag;
                    if($(this).find(".duty-item-left-ck").size() > 0){
                        planLiability.liabId = $(this).find(".duty-item-left-ck").data("liabid");
                        if($(this).find(".insured-benefitlevel").size() > 0){
                            planLiability.value = $(this).find(".insured-benefitlevel").val();
                        }else {
                            planLiability.value = $(this).find(".duty-item-input").val();
                        }
                        planLiabilityList.push(planLiability);
                    }
                });
                mainCoverage.planLiabilityList = planLiabilityList;
                mainCoverage.insuredIds = [insured.id]; //险种对应被保人ID 跟后台商量一致 统一传“0”
                mainCoverages.push(mainCoverage);
            });
            if(validateErrMsg != ""){
                MsgBox.alert(validateErrMsg);
                self.focusInput && self.focusInput.focus();
                return false;
            }
            plan.mainCoverages = mainCoverages;
            //附加险数据
            var riderCoverages = [];
            self.ui.additionalPlanInput.find(".additional-item").each(function(index){
                var riderCoverage = {};
                riderCoverage.productId = $(this).data("productid");
                riderCoverage.unitFlag = $(this).data("unitflag");
                //是否豁免附加险  默认不是,是的话不需要验证输入
                var isWaiver = false;
                if($(this).find(".insured-property")[0] && $(this).find(".insured-property")[0].style.display == "none"){
                    isWaiver = true;
                }
                if(!isWaiver) {
                    riderCoverage.sa = $(this).find(".insured-sa").val();
                    var rName = $(this).find(".additional-name-span").html();
                    if (riderCoverage.sa == "") {
                        validateErrMsg = rName + errorMsg.makePlanMsg5;
                        self.focusInput = $(this).find(".insured-sa");
                        return false;
                    }
                    if (riderCoverage.sa) {
                        var max = parseFloat($(this).find(".insured-sa").attr("max"));
                        var min = parseFloat($(this).find(".insured-sa").attr("min"));
                        if (parseFloat(riderCoverage.sa) < min || parseFloat(riderCoverage.sa) > max) {
                            validateErrMsg = rName + "保额区间" + min+"~"+max;
                            self.focusInput = $(this).find(".insured-sa");
                            return false;
                        }
                    }
                    riderCoverage.premium = $(this).find(".insured-premium").val();
                    if (riderCoverage.premium == "") {
                        validateErrMsg = rName + errorMsg.makePlanMsg6;
                        self.focusInput = $(this).find(".insured-premium");
                        return false;
                    }
                    if (riderCoverage.premium) {
                        var max = parseFloat($(this).find(".insured-premium").attr("max"));
                        var min = parseFloat($(this).find(".insured-premium").attr("min"));
                        if (parseFloat(riderCoverage.premium) < min || parseFloat(riderCoverage.premium) > max) {
                            validateErrMsg = rName + "保费区间" + min+"~"+max;
                            self.focusInput = $(this).find(".insured-premium");
                            return false;
                        }
                    }
                    riderCoverage.unit = $(this).find(".insured-unit").val();
                    if (riderCoverage.unit == "") {
                        validateErrMsg = rName + errorMsg.makePlanMsg7;
                        self.focusInput = $(this).find(".insured-unit");
                        return false;
                    }
                    if (riderCoverage.unit && !utils.isPositiveNum(riderCoverage.unit)) {
                        validateErrMsg = rName + errorMsg.makePlanMsg9;
                        self.focusInput = $(this).find(".insured-unit");
                        return false;
                    }
                    if (riderCoverage.unit) {
                        var max = parseFloat($(this).find(".insured-unit").attr("max"));
                        var min = parseFloat($(this).find(".insured-unit").attr("min"));
                        if (parseFloat(riderCoverage.unit) < min || parseFloat(riderCoverage.unit) > max) {
                            validateErrMsg = rName + "份数区间" + min+"~"+max;
                            self.focusInput = $(this).find(".insured-unit");
                            return false;
                        }
                    }
                    riderCoverage.benefitlevel = $(this).find(".insured-benefitlevel").val();
                    //为null表示 有此下拉选项 但无值
                    if (riderCoverage.benefitlevel == null && typeof riderCoverage.benefitlevel == "object") {
                        validateErrMsg = rName + errorMsg.makePlanMsg8;
                        self.focusInput = $(this).find(".insured-benefitlevel");
                        return false;
                    } else {
                        //存在档次时，如果份数=null,赋值=1   *****重要****
                        if (!riderCoverage.unit || isNaN(riderCoverage.unit)) {
                            riderCoverage.unit = 1;
                        }
                    }

                    //交费期限
                    var chargePeriod = {};
                    var type = $(this).find(".payment-period").find("option:selected").data("type");
                    chargePeriod.periodType = type
                    chargePeriod.periodValue = parseInt($(this).find(".payment-period").find("option:selected").val());
                    riderCoverage.chargePeriod = chargePeriod;
                    if ($(this).find(".payment-period").size() > 0 && isNaN(chargePeriod.periodValue)) {
                        validateErrMsg = rName + errorMsg.makePlanMsg4;
                        self.focusInput = $(this).find(".payment-period");
                        return false;
                    }
                    //保障期限
                    var coveragePeriod = {};
                    type = $(this).find(".guarantee-period").find("option:selected").data("type");
                    coveragePeriod.periodType = type
                    coveragePeriod.periodValue = parseInt($(this).find(".guarantee-period").find("option:selected").val());
                    riderCoverage.coveragePeriod = coveragePeriod;
                    if ($(this).find(".guarantee-period").size() > 0 && isNaN(!coveragePeriod.periodValue)) {
                        validateErrMsg = rName + errorMsg.makePlanMsg3;
                        self.focusInput = $(this).find(".guarantee-period");
                        return false;
                    }
                    //年金领取时间 判断是否函年金选项
                    if($(this).data("annuity") == "Y") {
                        var payPeriod = {};
                        type = $(this).find(".annuity").find("option:selected").data("type");
                        payPeriod.periodType = type;
                        payPeriod.periodValue = parseInt($(this).find(".annuity").find("option:selected").val());
                        riderCoverage.payPeriod = payPeriod;
                        if ($(this).find(".annuity").size() > 0 && isNaN(payPeriod.periodValue)) {
                            validateErrMsg = rName + errorMsg.makePlanMsg11;
                            self.focusInput = $(this).find(".annuity");
                            return false;
                        }
                    }else {
                        riderCoverage.payPeriod = null;
                    }
                    riderCoverage.insuredIds = [insured.id];
                }
                riderCoverages.push(riderCoverage);
            });
            if(validateErrMsg != ""){
                MsgBox.alert(validateErrMsg);
                self.focusInput && self.focusInput.focus();
                return false;
            }
            plan.riderCoverages = riderCoverages;
            //增值服务在计划书是否显示
            plan.showValueAdded = "N";
            if(self.ui.incrementCon.find(".increment-check").hasClass("increment-check-ck")){
                plan.showValueAdded = "Y";
            }
            //增值服务列表
            var valueAddedIds = [];
            self.ui.incrementCon.find(".accordion-list .increment-item").each(function(){
                valueAddedIds.push($(this).data("id"));
            });
            plan.valueAddedIds = valueAddedIds;
            //保险理念ID
            var insuranceSpirit = 0;
            insuranceSpirit = self.ui.ideaCon.find(".accordion-list .idea-item-ck").data("id");
            plan.insuranceSpirit = insuranceSpirit;
            //留言
            plan.showAdvice = "N";
            plan.advice = self.ui.commentTxt.val();
            if(self.ui.incrementCheck.find(".increment-check").hasClass("increment-check-ck")){
                plan.showAdvice = "Y";
            }
            if(plan.advice == ""){//输入为空 不显示留言  必须从此处返回N，保障计划页如果空会返回默认推荐理由 分享用。
                plan.showAdvice = "N";
            }
//            else{ //不管是否勾选 留言都要传 计划书分享描述要用 9.19 16:10
//                plan.advice = "";
//            }
            responseData.plan = plan;
            return responseData;
        },
        //保险理念列表 单选
        clickIdeaItemHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var target = $(e.currentTarget);
            target.addClass("idea-item-ck");
            target.siblings().removeClass("idea-item-ck");
        },
        //点击计算保费
        clickCalcPremiumHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var responseData = self.getPlanByInput();
            if(!responseData)return;
            console.log("*********计算保费 请求数据**********");
            console.log(responseData);
            LoadingCircle && LoadingCircle.start();
            planModel.calcFirstYearPremium(responseData,function(data){
                LoadingCircle && LoadingCircle.end();
                console.log("************计算结果**************");
                console.log(data);
                self.totalFirstYearPrem = data.totalFirstYearPrem;
                self.coveragePrems = data.coveragePrems;
                self.ui.totalFirstYearPremium.html(utils.formatNumber2(self.totalFirstYearPrem));
                var resultHtml = self.getCalcResultHtml();
                self.ui.calcResultCon.find(".first-year-table").remove();
                self.ui.calcResultCon.prepend($(resultHtml));
                self.isCalcOver = true;
                self.renderValueAdded(data.valueAddedList);
            },function(err){
                LoadingCircle && LoadingCircle.end();
                MsgBox.alert("计算保费失败");
                console.log(err);
            });
        },
        //点击生成计划书
        clickMakePlanHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var responseData = self.getPlanByInput();
            if(!responseData)return;
            if(!self.isCalcOver){
                MsgBox.alert("请先计算保费");
                return;
            }
            console.log("*********计划书生成 请求数据**********");
            console.log(responseData);
            LoadingCircle && LoadingCircle.start();
            planModel.savePlan(responseData,function(data){
                LoadingCircle && LoadingCircle.end();
                if(!data.quotationId)
                    data.quotationId = "null";
                utils.planHonorific = "尊敬的"+responseData.plan.proposer.name+(responseData.plan.proposer.gender=="F"?"女士":"先生");
                app.navigate("in/plan/"+data.quotationId,{replace:true, trigger:true})
            },function(err){
                LoadingCircle && LoadingCircle.end();
                MsgBox.alert("计划书生成失败");
            });
        },
        //点击添加附加险 指向附加险列表
        addAdditionalPlanHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            //取第一个主险
            var target = self.ui.makePlanInput.find(".main-insured-item:eq(0)");
            //点击添加附加险 验证主险输入项
            utils.currMainPlanInfo = [];//重置
            utils.currMainPlanInsured = null;//重置
            var mainCoverage = {};//主险对象
            mainCoverage.productId = target.data("productid");
            mainCoverage.unitFlag = target.data("unitflag");
            mainCoverage.sa = target.find(".insured-sa").val();
            var insured = {};//对应保人（三种之一）对应的个人信息
            var mainPlan = self.getPlanById(mainCoverage.productId);
            var pName = "主险";//target.data("productname");
            if(mainCoverage.sa == ""){
                MsgBox.alert(pName+errorMsg.makePlanMsg5);
                target.find(".insured-sa").focus();
                return;
            }
            if(mainCoverage.sa){
                var max = parseInt(target.find(".insured-sa").attr("max"));
                var min = parseInt(target.find(".insured-sa").attr("min"));
                if(parseInt(mainCoverage.sa) < min || parseInt(mainCoverage.sa) > max){
                    MsgBox.alert(pName+"保额区间"+min+"~"+max);
                    target.find(".insured-sa").focus();
                    return;
                }
            }
            //保费需验证最小值 最大值
            mainCoverage.premium = target.find(".insured-premium").val();
            if(mainCoverage.premium == ""){
                MsgBox.alert(pName+errorMsg.makePlanMsg6);
                target.find(".insured-premium").focus();
                return;
            }
            if(mainCoverage.premium){
                var max = parseInt(target.find(".insured-premium").attr("max"));
                var min = parseInt(target.find(".insured-premium").attr("min"));
                if(parseInt(mainCoverage.premium) < min || parseInt(mainCoverage.premium) > max){
                    MsgBox.alert(pName+"保费区间"+min+"~"+max);
                    target.find(".insured-premium").focus();
                    return;
                }
            }
            mainCoverage.unit = target.find(".insured-unit").val();
            if(mainCoverage.unit == ""){
                MsgBox.alert(pName+errorMsg.makePlanMsg7);
                target.find(".insured-unit").focus();
                return;
            }
            if(mainCoverage.unit && !utils.isPositiveNum(mainCoverage.unit)){
                MsgBox.alert(pName+errorMsg.makePlanMsg9);
                target.find(".insured-unit").focus();
                return;
            }
            if(mainCoverage.unit){
                var max = parseInt(target.find(".insured-unit").attr("max"));
                var min = parseInt(target.find(".insured-unit").attr("min"));
                if(parseInt(mainCoverage.unit) < min || parseInt(mainCoverage.unit) > max){
                    MsgBox.alert(pName+"份数区间"+min+"~"+max);
                    target.find(".insured-unit").focus();
                    return;
                }
            }
            mainCoverage.benefitlevel = target.find(".insured-benefitlevel").val();
            //为null表示 有此下拉选项 但无值
            if(mainCoverage.benefitlevel == null && typeof mainCoverage.benefitlevel == "object"){
                MsgBox.alert(pName+errorMsg.makePlanMsg8);
                target.find(".insured-benefitlevel").focus();
                return;
            }else{
                //存在档次时，如果份数=null,赋值=1   *****重要****
                if(!mainCoverage.unit || isNaN(mainCoverage.unit)){
                    mainCoverage.unit = 1;
                }
            }

            //交费期限
            var chargePeriod = {};
            var type = target.find(".payment-period").find("option:selected").data("type");
            chargePeriod.periodType = type;
            chargePeriod.periodValue = parseInt(target.find(".payment-period").find("option:selected").val());
            mainCoverage.chargePeriod = chargePeriod;
            if(target.find(".payment-period").size() > 0 && isNaN(chargePeriod.periodValue)){
                MsgBox.alert(pName+errorMsg.makePlanMsg4);
                target.find(".payment-period").focus();
                return;
            }
            //保障期限
            var  coveragePeriod = {};
            type = target.find(".guarantee-period").find("option:selected").data("type");
            coveragePeriod.periodType = type;
            coveragePeriod.periodValue = parseInt(target.find(".guarantee-period").find("option:selected").val());
            mainCoverage.coveragePeriod = coveragePeriod;
            if(target.find(".guarantee-period").size() > 0 && isNaN(coveragePeriod.periodValue)){
                MsgBox.alert(pName+errorMsg.makePlanMsg3);
                target.find(".guarantee-period").focus();
                return;
            }
            //年金领取时间 判断是否函年金选项
            if(target.data("annuity") == "Y") {
                var payPeriod = {};
                type = target.find(".annuity").find("option:selected").data("type");
                payPeriod.periodType = type;
                payPeriod.periodValue = parseInt(target.find(".annuity").find("option:selected").val());
                mainCoverage.payPeriod = payPeriod;
                if (target.find(".annuity").size() > 0 && isNaN(payPeriod.periodValue)) {
                    MsgBox.alert(pName + errorMsg.makePlanMsg11);
                    target.find(".annuity").focus();
                    return;
                }
            }else {
                mainCoverage.payPeriod = null;
            }
            var targetInsured;
            if(mainPlan.pointToSecInsured == "Y"){
                targetInsured = self.ui.secondInsured;
            }else if(mainPlan.pointToPH == "Y"){
                targetInsured = self.ui.policyHolder;
            }else{
                targetInsured = self.ui.firstInsured;
            }
            insured.age = targetInsured.find(".insured-old").val();
            insured.gender = targetInsured.find(".insured-sex").attr("data-val");
            if(mainPlan.pointToPH == "Y"){
                insured.name = self.ui.sendName.val();
            }else {
                insured.name = targetInsured.find(".insured-name").val();
                insured.jobCateId = targetInsured.find(".insured-job").val();//职位
                insured.socialInsuranceIndi = targetInsured.find(".insured-social").attr("data-val");//社保
                insured.smoking = targetInsured.find(".insured-smoking").val();//吸烟
            }
            utils.currMainPlanInfo.push(mainCoverage);
            utils.currMainPlanInsured = insured;

            var exitsAdditionalIds = self.additionalIdArr.join(",");
            if(exitsAdditionalIds != "") {
                exitsAdditionalIds = utils.myEncodeURIComponent(exitsAdditionalIds);
                app.navigate("#in/additional/"+self.currProductId+"/"+exitsAdditionalIds,{replace:true,trigger:true});
            }else{
                app.navigate("#in/additional/"+self.currProductId,{replace:true,trigger:true});
            }
        },
        //移除豁免附加险
        removeWaiverRider:function(){
            var self = this;
            self.ui.additionalPlanInput.find(".additional-item").each(function(){
                var parent = $(this);
                var productId = parent.data("productid");
                var plan = self.getPlanById(productId);
                if(plan.isWaiver == "Y"){
                    var index = productId ? self.additionalIdArr.indexOf(productId) : -1;
                    if (index >= 0) {
                        self.additionalIdArr.splice(index, 1);
                        self.delPlan(productId,2);
                    }
                    parent.slideUp(function () {
                        parent.remove();
                    });
                }
            })
        },
        //点击删除附加险/主险
        delAdditionPlanHandler:function(e){
            var self  = this;
            e.stopPropagation();
            e.preventDefault();
            var target = $(e.target);
            if(!target.hasClass("additional-del"))return;
            //1主险（不能全部删除，得留 一个）  2附加险
            var insType = target.data("insured-type");
            if(insType == 1){
                if(self.mainPlanIdArr.length <= 1){
                    MsgBox.alert(errorMsg.makePlanMsg10);
                    return;
                }
                MsgBox.ask("确定删除该主险吗？", "", function (type) {
                    if (type == 2) { //确定  0=取消
                        var parent = $(e.target).parents(".main-insured-item");
                        var productId = parseInt(parent.data("productid"));//待删除主险ID
                        var index = productId ? self.mainPlanIdArr.indexOf(productId) : -1;
                        if (index >= 0) {
                            self.mainPlanIdArr.splice(index, 1);
                            self.delPlan(productId,1);
                        }
                        parent.slideUp(function () {
                            parent.remove();
                        });
                    }
                    if (type == 0) {
                        console.log("取消删除");
                    }
                });
            }else if(insType == 2) {
                MsgBox.ask("确定删除该附加险吗？", "", function (type) {
                    if (type == 2) { //确定  0=取消
                        var parent = $(e.target).parents(".additional-item");
                        var additionalId = parseInt(parent.data("productid"));//待删除附加险ID
                        var index = additionalId ? self.additionalIdArr.indexOf(additionalId) : -1;
                        if (index >= 0) {
                            self.additionalIdArr.splice(index, 1);
                            self.delPlan(additionalId,2);
                        }
                        parent.slideUp(function () {
                            parent.remove();
                        });
                    }
                    if (type == 0) {
                        console.log("取消删除");
                    }
                });
            }
        },
        /**
         * 删除险种产品
         * @param productId
         * @param type 1主险  2附加险
         */
        delPlan:function(productId,type){
            var self = this;
            var has = false;
            for(var i = 0; self.currPlanList.length; i++){
                var pType = self.currPlanList[i].insType;
                var pId = self.currPlanList[i].salesProductId;
                if(pId == productId && pType == type){
                    self.currPlanList.splice(i,1);
                    has = true;
                    break;
                }
            }
            if(has){//险种列表有变化 需重置 被保人、第二被保人、投保人
                self.resetAllInput();
            }
        },
        //点击客户导入
        clickImportHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var type = 1;//第一被保人   2第二被保人
            var target = $(e.target);
            if(target.parents(".second-insured").size() > 0){
                type = 2;
            }
            app.navigate("in/personalCustomer/"+type,{trigger:true, replace:true});
//            self.onImportUser();
        },
        //监听客户导入
        onImportUser:function(obj){ 
            var self = this;
            //依产品定义 客户导入只用名称 性别，不导入年龄
            var target = self.ui.secondInsured;
            if(obj.optionType == 1) {
                target = self.ui.firstInsured;
            }
            target.find(".insured-name").val(obj.name);
            if(target.find(".insured-sex").attr("data-val") != obj.gender) {
                target.find(".insured-sex").attr("data-val", obj.gender);
                target.find(".insured-sex .property-radio-item").each(function(){
                    $(this).removeClass("property-radio-item-ck");
                    if($(this).attr("data-val") == obj.gender){
                        $(this).addClass("property-radio-item-ck");
                    }
                });
            }
        },
        //从当前险种列表获取第一个主险对象(组合附件险依赖主险 默认依赖第一个)暂时也只有一个主险
        getFirstMainPlan:function(){
            var self = this;
            for(var i = 0;i < self.currPlanList.length; i++){
                if(self.currPlanList[i].insType == 1){
                    return self.currPlanList[i];
                }
            }
            return null;
        },
        //根据ID获取产品对象
        getPlanById:function(id){
            var self = this;
            for(var i = 0;i < self.currPlanList.length; i++){
                if(self.currPlanList[i].salesProductId == id){
                    return self.currPlanList[i];
                }
            }
            return null;
        },
        //根据产品类型获取对应被保人（、第二被保人、投保人）当前年龄
        getCurSecAge:function(plan){
            var currAge = 0;
            var self = this;
            if(plan.pointToSecInsured == "Y"){
                currAge = self.ui.secondInsured.find(".insured-old").val();
            }else if(plan.pointToPH == "Y"){
                currAge = self.ui.policyHolder.find(".insured-old").val();
            }else{
                currAge = self.ui.firstInsured.find(".insured-old").val();
            }
            return currAge;
        },
        /**
         * 根据年龄获取当前年龄下交费列表
         * @param plan
         * @param age
         */
        getChargeListByAge:function(plan,age){
            var ageLimitList = plan.ageLimitList || [];
            var chargeList = [];
            var self = this;
            for(var i = 0; i < ageLimitList.length; i++){
                if(age >= ageLimitList[i].minInsdAge && age <= ageLimitList[i].maxInsdAge){
                    var periodType = ageLimitList[i].chargePeriod || 0;
                    var periodValue = ageLimitList[i].chargeYear || 0;
                    if(!self.existsCharge(chargeList,{periodType: periodType, periodValue: periodValue})) {//已存在 不添加
                        chargeList.push({periodType: periodType, periodValue: periodValue});
                    }
                }
            }
            return chargeList;
        },
        //数组内是否存在 交费期间/保障期间对象
        existsCharge:function(chargeList,charge){
            var exists = false;
            for(var i = 0; i < chargeList.length; i++){
                if(chargeList[i].periodType == charge.periodType && chargeList[i].periodValue == charge.periodValue){
                    exists = true;
                    break;
                }
            }
            return exists;
        },
        /**
         * 根据年龄及交费选中项 获取保障列表
         * @param plan
         * @param currAge
         * @param currCharge
         */
        getCoverageListByAge:function(plan,age,currCharge){
            var coverageList = [];
            var self = this;
            var ageLimitList = plan.ageLimitList || [];
            if(!currCharge.periodType || !currCharge.periodValue)return coverageList;//交费下拉为空，保障自然也为空
            for(var i = 0; i < ageLimitList.length; i++){
                if(age >= ageLimitList[i].minInsdAge && age <= ageLimitList[i].maxInsdAge){
                    var periodType = ageLimitList[i].coveragePeriod || 0;
                    var periodValue = ageLimitList[i].coverageYear || 0;
                    if(ageLimitList[i].chargePeriod == currCharge.periodType && ageLimitList[i].chargeYear == currCharge.periodValue) {
                        if(!self.existsCharge(coverageList,{periodType: periodType, periodValue: periodValue})) {//已存在 不添加
                            coverageList.push({periodType: periodType, periodValue: periodValue});
                        }
                    }
                }
            }
            return coverageList;
        },
        /**
         * 根据年龄及交费选中项保障选中项  获取年金列表
         * @param plan
         * @param currAge
         * @param currCharge
         */
        getPayListByAge:function(plan,age,currCharge,currCoverage){
            var ageLimitList = plan.ageLimitList || [];
            var payList = [];
            if(!currCharge.periodType || !currCharge.periodValue || !currCoverage.periodType || !currCoverage.periodValue)return payList;//交费下拉为空，保障自然也为空
            for(var i = 0; i < ageLimitList.length; i++){
                if(age >= ageLimitList[i].minInsdAge && age <= ageLimitList[i].maxInsdAge){
                    var periodType = ageLimitList[i].payPeriod || 0;
                    var periodValue = ageLimitList[i].payYear || 0;
                    if(ageLimitList[i].chargePeriod == currCharge.periodType && ageLimitList[i].chargeYear == currCharge.periodValue) {
                        if(ageLimitList[i].coveragePeriod == currCoverage.periodType && ageLimitList[i].coverageYear == currCoverage.periodValue) {
                            payList.push({periodType: periodType, periodValue: periodValue});
                        }
                    }
                }
            }
            return payList;
        },
        //获取保额、份数范围对象
        getAmountLimit:function(plan,age){
            var amountLimitList = plan.amountLimitList || [];
            for(var i = 0; i < amountLimitList.length; i++){
                if(age >= amountLimitList[i].minAge && age <= amountLimitList[i].maxAge){
                    return amountLimitList[i];
                }
            }
            return null;
        },
        //获取保费范围对象
        getPremLimit:function(plan,age,firstCharge){
            var premLimitList = plan.premLimitList || [];
            for(var i = 0; i < premLimitList.length; i++){
                if(age >= premLimitList[i].minAge && age <= premLimitList[i].maxAge){
                    if(firstCharge && firstCharge.periodType){
                        if(firstCharge.periodType == premLimitList[i].chargePeriod && firstCharge.periodValue == premLimitList[i].chargeYear) {
                            return premLimitList[i];
                        }
                    }else{
                        return premLimitList[i];
                    }
                }
            }
            return null;
        },
        /**
         * 附加险交费期限默认选中项
         * 根据 是否组合计划 主险选中交费项  从交费列表里 选中一个默认选中项
         * 如果是组合计划 附加险交费期间=主险交费期间
         * 如果不是组合计划 附加险交费期间<=主险交费期间
         * @param isPackageProduct  是否组合计划 Y  N
         * @param mpAge 当前主险对象保人年龄
         * @param currAge 当前附加险保人年龄
         * @param chargeList 当前列表
         * @param mainCharge 主险选中项
         */
        getSecCharge:function(isPackageProduct,mpAge,currAge,chargeList,mainCharge){
            if(!chargeList || chargeList.length <= 0)
                return null;
            if(isPackageProduct == "Y"){
                return mainCharge;
            }
            for(var i = 0; i < chargeList.length; i++){
                var charge = chargeList[i];
                if(utils.compareCharge(mainCharge.periodType, mainCharge.periodValue,mpAge,charge.periodType,charge.periodValue,currAge) == 1){
                    return charge;
                }
            }
            return null;
        },
        /**
         * 附加险交费期限默认选中项
         * @param isPackageProduct   是否组合计划 主险选中保障项  从可选保障期间列表里 选中一个默认选中项
         * @param mpAge 主险年龄
         * @param currAge 当前附加险年龄
         * @param coverageList 可选保障期间列表
         * @param mainCoverage  主险选中保障期间对象
         */
        getSecCoverage:function(isPackageProduct,mpAge,currAge,coverageList,mainCoverage){
            if(!coverageList || coverageList.length <= 0)
                return null;
            if(isPackageProduct == "Y"){
                return mainCoverage;
            }
            for(var i = 0; i < coverageList.length; i++){
                var coverage = coverageList[i];
                if(utils.compareCoverage(mainCoverage.periodType, mainCoverage.periodValue,mpAge,coverage.periodType,coverage.periodValue,currAge) == 1){
                    return coverage;
                }
            }
            return null;
        },
        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            LoadingCircle && LoadingCircle.end();
        },

        //当页面销毁时触发
        onDestroy : function(){
//            console.log("footer destroy");
        }

    });
    return makePlanView;
});