/**
 * 计划书-保障计划
 * add by guYY 2016//9/3
 */
define([
    'common/base/base_view',
    'module/plan/model/planModel',
    'text!module/plan/templates/planBookView.html',
    'text!module/plan/templates/planLiability.html',
    'text!module/plan/templates/planLiabilityItem.html',
    'text!module/plan/templates/planLiabilityItemItem.html',
    'msgbox'
],function(BaseView, planModel, tpl,planLiabilityTpl,planLiabilityItemTpl,planLiabilityItemItemTpl,MsgBox){
    var planBookView = BaseView.extend({
        id:"plan-book-container",
        template: _.template(tpl),
        planLiabilityTpl: _.template(planLiabilityTpl),
        planLiabilityItemTpl: _.template(planLiabilityItemTpl),
        planLiabilityItemItemTpl: _.template(planLiabilityItemItemTpl),
        inited : false,       //初始化完毕
        currPlanId:0,       //当前已生成计划 ID
        planBook:{},            //当前计划书对象
        productInfoList:[],     //主险附加险名称等存放处
        //利益演示相关
        interestDemonstration:{}, //利益演示数据列表 属性“1”低级  “2”中级  “3”高级
        interestAgeArr:[],   //利益演示年龄段数组
        currInterset : [],//当前级别下列表
//        currAgeindex:0,      //当前年龄索引
        currAge:0,      //当前年龄
        currLevel:"1",  //当前等级  “1”低级  “2”中级  “3”高级
//        forever:true,
        ui:{
            //banner
            planBannerName : ".plan-book-company",//产品计划名称
            panBannerTitle : ".plan-book-title",//谁的计划书
            //banner end
            //Insured 被投保人信息
            paymentDate : ".payment-date",
            guaranteeDate : ".guarantee-date",
            coverageTotal : ".coverage-total-txt",
            coverageFirst : ".coverage-first-txt",
            sexTxt : ".sex-txt",
            ageTxt : ".age-txt",
            //Insured end
            btnRangeReduce : ".btn-range-reduce",
            btnRangeAdd : ".btn-range-add",
            rangeInput : ".input-range",
            calcResultTable:"#calcResultTable", //计算结果显示容器
            featureImgList:"#featureImgList",  //产品特色容器
            guaranteeList:".guarantee-list",  //保障概览容器
            valueAddedList:".added-service-list",  //增值服务
            commentCon:".plan-message-txt",      //留言
            btnClause:".btn-clause",     //条款按钮
            liabilityList:".plan-obligation-list",//保险责任
            ageSelect:".demo-age-select", //年龄段下拉框
            userName:".contact-name",
            userPhone:".contact-phone"
        },

        events:{
            "tap .btn-clause":"clickClauseHandler", //点击打开条款列表
            "tap @ui.btnRangeAdd" : "onRangeAddHandler",
            "tap @ui.btnRangeReduce" : "onRangeReduceHandler",
            "tap .added-service-item-button":"clickShowValueAddedHandler",//点击查看增值服务详情
            "tap .type-button":"clickStopHandler",  //点击收起/展开险种保费表格
            "tap .btn-icon":"clickLiabilityHandler",  //点击收起/展开责任列表
            "tap .item-right-btn":"clickOpenDescHandler", //点击展开/收起责任详情
            "tap .plan-level-item":"clickLevenHandler",  //点击 利益演示低档、中档、高档
            "change .input-range":"changeRandeHandler",     //滑动条滑动
            "change .demo-age-select":"changeSelectHandler" //年龄段下拉框更新
        },

        initialize:function(){
        },

        show : function(planId){
            var self = this;
            if(self.currPlanId == planId)return;
            self.currPlanId = planId;
            //length置0 确保清空
            utils.productInfoList = [];
            utils.productInfoList.length = 0;

            self.initInterestDemonstration({
                "1":[{
                    insuredAge:36,
                    policyYear:1,
                    deathBenefit:5000
                },{
                    insuredAge:37,
                    policyYear:1,
                    deathBenefit:5000
                },{
                    insuredAge:38,
                    policyYear:1,
                    deathBenefit:5000
                },{
                    insuredAge:39,
                    policyYear:1,
                    deathBenefit:5000
                },{
                    insuredAge:40,
                    policyYear:1,
                    deathBenefit:5000
                },{
                    insuredAge:41,
                    policyYear:1,
                    deathBenefit:5000
                },{
                    insuredAge:42,
                    policyYear:1,
                    deathBenefit:5000
                }],
                "2":[],
                "3":[]
            });//TODO 测试
return;
            planModel.getPlanInfo(planId, function(data){
                console.log(data);
                self.planBook = data.planInfo;
                self.productInfoList = self.planBook.productInfoList;
                utils.productInfoList = self.productInfoList;
                var plan = self.planBook.plan;
                self.ui.planBannerName.html(self.planBook.packageName);
                self.initBannerData(plan);
                self.initInsuredData(plan);
                if(plan.mainCoverages &&plan.mainCoverages.length > 0) {
                    self.initMainCoverages(plan.mainCoverages[0]);//初始化主险
                }
                //初始化险种保费说明表
                self.showInsuredTable(plan);
                //产品特色
                self.initFeature(self.planBook.feature);
                //保障概览
                self.initRights(self.planBook.rights);
                //增值服务
                self.initValueAdded(self.planBook.salesValueAdded);
                if(plan.showAdvice=="Y" && plan.advice != "")
                {
                    self.ui.commentCon.html(plan.advice);
                }
                //初始化责任列表
                self.initLiability(self.planBook.planLiability);
                //初始化利益演示
                self.initInterestDemonstration(self.planBook.illustrationList);
                self.ui.userName.html(self.planBook.userName);//userPhone
                self.ui.userPhone.html('<a href="tel:'+self.planBook.userPhone+'">'+self.planBook.userPhone+'</a>');
            }, function(){

            })
        },
        /***
         * initBanner
         * @param e
         */
        initBannerData : function(data){
            var self = this;
            //被保人的计划书
            //第一被保人
            var firstInsured;
            if(data.insureds && data.insureds.length > 0){
                firstInsured = data.insureds[0];
            }
            if(firstInsured){
                self.ui.panBannerTitle.html(firstInsured.name+"的计划书");
            }
        },
        /***
         * 初始化被保人
         */
        initInsuredData : function(data){
            var self = this, insureds = data.insureds;
            if(insureds.length){
                var insuredObj = insureds[0];
                var age = insuredObj.age + "岁";
                var sex = insuredObj.gender == "F" ? "女" : "男";
                self.ui.ageTxt.html(age);
                self.ui.sexTxt.html(sex);
            }
        },
        //初始化主险
        initMainCoverages:function(mainCoverage){
            var self = this;
//            self.ui.paymentDate.html(utils.paymentPeriodArr[parseInt(mainCoverage.chargePeriod.periodValue)]);//交费期限
            self.ui.paymentDate.html(utils.getPeriodText(1,mainCoverage.chargePeriod.periodType,mainCoverage.chargePeriod.periodValue));//交费期限
            self.ui.guaranteeDate.html(utils.getPeriodText(2,mainCoverage.coveragePeriod.periodType,mainCoverage.coveragePeriod.periodValue));//保障期限
            self.ui.coverageTotal.html(utils.formatNumber2(mainCoverage.sa));//此处只显示SA 不管哪种销售方式
            self.ui.coverageFirst.html(utils.formatNumber2(mainCoverage.firstYearPrem));//首年保费
        },
        //初始化险种保费说明表
        showInsuredTable:function(plan){
            var self = this;
            var tempHtml = '<div class="type-title"><span>险种</span><span>保险金额</span><span>保障期限</span>' +
                '<span>交费期限</span><span>首年保费</span></div>';
            if(plan.mainCoverages && plan.mainCoverages.length > 0){
                for(var i = 0; i < plan.mainCoverages.length; i++){
                    var item = plan.mainCoverages[i];
                    var productName = self.getProductName(item.productId);
                    tempHtml += '<div class="type-td" data-id="'+item.productId+'"><span>'+productName+'</span>' +
                        '<span>'+utils.formatNumber(item.sa)+'</span><span>'+utils.getPeriodText(2,item.coveragePeriod.periodType,item.coveragePeriod.periodValue)+'</span>' +
                        '<span>'+utils.getPeriodText(1,item.chargePeriod.periodType,item.chargePeriod.periodValue)+'</span><span>'+utils.formatNumber(item.firstYearPrem)+'</span></div>'

                }
                for(i = 0; i < plan.riderCoverages.length; i++){
                    var item = plan.riderCoverages[i];
                    var productName = self.getProductName(item.productId);
                    tempHtml += '<div class="type-td" data-id="'+item.productId+'"><span>'+productName+'</span>' +
                        '<span>'+utils.formatNumber(item.sa)+'</span><span>'+utils.getPeriodText(2,item.coveragePeriod.periodType,item.coveragePeriod.periodValue)+'</span>' +
                        '<span>'+utils.getPeriodText(1,item.chargePeriod.periodType,item.chargePeriod.periodValue)+'</span><span>'+utils.formatNumber(item.firstYearPrem)+'</span></div>'
                }
            }
            self.ui.calcResultTable.html($(tempHtml));
        },
        //初始化
        initFeature:function(featureList){
            var imgHtml = '', self = this;
            if(featureList && featureList.length>0){
                for(var i = 0; i <featureList.length; i++){
                    if(featureList[i].featurePic) {
                        imgHtml += '<img src="'+featureList[i].featurePic+'" alt="" class="featureImg" data-id="' + featureList[0].listId + '"/>';
                    }
                }
            }
            self.ui.featureImgList.html($(imgHtml));
        },
        //保障概览
        initRights:function(rightsList){
            var tempHtml = "", self = this;
            var equityLabelWidth = (self.$el.width() - 100)/3;
            if(rightsList && rightsList.length > 0){
                for(var i = 0; i <rightsList.length; i++){
                    var currentEquityLabelWidth = rightsList[i].rightName.length * 26 + 55;
                    var n = Math.ceil(currentEquityLabelWidth / equityLabelWidth);
                    n = n > 3 ? 3 : n;
                    n = n * 33.3333333333333;
                    tempHtml += '<div class="equity-label" style="width: '+ n +'%;"><div class="equity-label-select"></div>' +
                        '<div class="equity-label-name">'+rightsList[i].rightName+'</div></div>';
                }
            }
            self.ui.guaranteeList.html($(tempHtml));
        },
        //增值服务
        initValueAdded:function(valueAddedList){
            var tempHtml = "", self = this;
            if(valueAddedList && valueAddedList.length > 0){
                for(var i = 0; i < valueAddedList.length; i++){
                    tempHtml += '<div class="added-service-item"><div class="added-service-item-txt">'+valueAddedList[i].valueAddedName+'</div>' +
                        '<div class="added-service-item-button" data-id="'+valueAddedList[i].valueAddedId+'">查看详情</div></div>';
                }
            }
            self.ui.valueAddedList.html($(tempHtml));
        },
        //责任
        initLiability:function(planLiability){
//            var packageId = planLiability.packageId;
            var liabCateList = planLiability.liabCateList;
            var tempHtml = "", self = this;
            //嵌套三层循环，需求之复杂 只可意会 不可言传
            for(var i = 0; i < liabCateList.length; i++)
            {
                var liabilityListHtml = "";
                //只有是1时，参与计算，才有amount。否则取liabCalcMethod描述
                var libCalcType = liabCateList[i].libCalcMethod;
                for(var j =0 ; j < liabCateList[i].simpleLiabList.length; j++){
                    var obj = liabCateList[i].simpleLiabList[j];
                    var liabilityList2Html = "";
                    var totalAmount = "";
                    if(libCalcType == 1){
                        totalAmount = obj.totalAmount;
                    }
                    for(var k = 0; k < obj.liabList.length; k++){
                        var itemObj = obj.liabList[k];
                        var liabAmount = itemObj.libCalcType;
                        var packageId = itemObj.packageId;
                        var rightClass = "";
                        if(libCalcType == 1){
                            rightClass = "item-right-mr88"; //显示金额时需距离右边88px
                            liabAmount = itemObj.liabAmount;
                        }
                        var libId = itemObj.libId;
                        var productId = itemObj.productId;
                        liabilityList2Html += self.planLiabilityItemItemTpl({liabDisplayName:itemObj.liabDisplayName,liabAmount:liabAmount,libDescQuote:itemObj.libDescQuote,rightClass:rightClass});
                    }
                    liabilityListHtml += self.planLiabilityItemTpl({liabDisplayName:obj.liabDisplayName,totalAmount:totalAmount,liabilityList2Html:liabilityList2Html});
                }
                tempHtml += self.planLiabilityTpl({categoryName:liabCateList[i].categoryName,liabilityListHtml:liabilityListHtml});
            }
        },
        //初始化利益演示
        initInterestDemonstration:function(interestDemonstration){
            var self = this;
            self.interestDemonstration = interestDemonstration;
            self.currLevel = "1";//初始化低级
            self.interestAgeArr = [];
            self.currInterset = [];//当前级别下列表
            self.currAge = -1;
            self.initInterestByLevel(self.currLevel);
        },
        /**
         * 根据利益演示等级 初始化年龄段下拉框等
         * @param currLevel  当前等级 "1" "2" "3"
         */
        initInterestByLevel:function(currLevel){
            console.log(currLevel+"等级下数据");
            var self = this;
            self.currAge = -1;
            self.interestAgeArr = [];//TODO 测试
            self.currInterset = [];//当前级别下列表
            self.ui.ageSelect.html("");
            self.ui.rangeInput.attr("min",0);
            self.ui.rangeInput.attr("max",0);
            if(self.interestDemonstration[self.currLevel] && self.interestDemonstration[self.currLevel].length >0) {
                self.currInterset = self.interestDemonstration[self.currLevel];
                for (var i = 0; i < self.currInterset.length; i++) {
                    if(i==0){
                        self.ui.rangeInput.attr("min",self.currInterset[i].insuredAge);
                    }
                    if(i == self.currInterset.length-1){
                        self.ui.rangeInput.attr("max",self.currInterset[i].insuredAge);
                    }
                    self.interestAgeArr.push(self.currInterset[i].insuredAge);
                }
                self.currAge = self.interestAgeArr.length > 0 ? self.interestAgeArr[0]:-1;
                //初始化年龄下拉框 self.interestAgeArr
                var optionsHtml = '';
                for(i = 0; i < self.interestAgeArr.length; i++){
                    optionsHtml += '<option value="'+self.interestAgeArr[i]+'">'+self.interestAgeArr[i]+'</option>';
                }
                self.ui.ageSelect.html($(optionsHtml));
            }else{
                console.log("当前等级下无年龄段数据"+self.currLevel);
            }
            self.setRangeValue(self.currAge);
        },
        getProductName:function(id){
            var self = this;
            if(!self.productInfoList)return "";
            for(var i = 0; i < self.productInfoList.length; i++){
                if(self.productInfoList[i].productId == id){
                    return self.productInfoList[i].productName;
                }
            }
            return "";
        },
        //点击查看条款列表
        clickClauseHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
//            var self = this;
//            var target = $(e.target);
//            if(target.data("id")){
                app.navigate("in/clauseList",{trigger:true, replace:true});
//            }
        },
        //滑动条滑动
        changeRandeHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            self.setRangeValue($(e.target).val());
        },
        //年龄段下拉框
        changeSelectHandler:function(e){
            var self = this;
            e.stopPropagation();
            e.preventDefault();
            self.setRangeValue(self.ui.ageSelect.val());
        },
        //加1
        onRangeAddHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var val = parseInt(self.ui.rangeInput.val()) + 1;
            if(val > self.ui.rangeInput.attr("max"))
                val = self.ui.rangeInput.attr("max")
            self.setRangeValue(val);
        },
        //减1
        onRangeReduceHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var val = parseInt(self.ui.rangeInput.val()) - 1;
            if(val < self.ui.rangeInput.attr("min"))
                val = self.ui.rangeInput.attr("min")
            self.setRangeValue(val);
        },
        //点击查看增值服务详情
        clickShowValueAddedHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var target = $(e.target),self = this;
            console.log(target.data("id"));
            var valueAdded = self.getValueAddedById(target.data("id"));
            utils.currValueAdded = valueAdded;
            app.navigate("in/increment",{replace:true, trigger:true});
        },
        //根据增值服务ID获取对象
        getValueAddedById:function(id){
            var self = this;
            if(!self.planBook.salesValueAdded || self.planBook.salesValueAdded.length<=0)
                return null;
            for(var i = 0; i < self.planBook.salesValueAdded.length; i++){
                if(self.planBook.salesValueAdded[i].valueAddedId == id)
                    return self.planBook.salesValueAdded[i];
            }
        },
        clickStopHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var target = $(e.target);
            target.toggleClass("down");
            if(target.hasClass("down")){//点击展开
                target.siblings("#calcResultTable").slideUp();
            }else{//点击收起
                target.siblings("#calcResultTable").slideDown();
            }
        },
        //展开、收起保险责任
        clickLiabilityHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var target = $(e.target);
            var self = this;
            target.toggleClass("down");
            if(target.hasClass("down")){//点击展开
                self.ui.liabilityList.slideDown();
            }else{//点击收起
                self.ui.liabilityList.slideUp();
            }
        },
        //点击展开或收起责任描述
        clickOpenDescHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var target = $(e.target);
            if(!target.hasClass("item-right-btn")){
                target = target.find(".item-right-btn");
            }
            target.toggleClass("down");
            if(target.hasClass("down")){//点击收起
                target.parents(".info-btn-div").next(".info-desc").slideDown();
            }else{//点击展开
                target.parents(".info-btn-div").next(".info-desc").slideUp();
            }
        },
        //点击利益演示 低档 中档 高档
        clickLevenHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var target = $(e.target), self = this;
            if(target.hasClass("plan-level-item-ck")){
                return;
            }
            target.addClass("plan-level-item-ck");
            target.siblings(".plan-level-item").removeClass("plan-level-item-ck");
            self.currLevel = target.data("level");
            self.initInterestByLevel(self.currLevel);
        },
        //当前年龄 显示数据
        setRangeValue : function(age){
            var self = this;
            if(self.currAge == age)
                return;
            if(age < 0){
                MsgBox.alert("年龄数据为空");
                return;
            }
            self.ui.rangeInput.val(age);
            self.ui.ageSelect.val(age);
            self.currAge = age;
            console.log("加载年龄下数据"+age);
            var item = self.getIntersetByAgeAndLevel(self.currAge);
            if(item){
                //TODO 渲染对象数据  demo-list
            }
        },
        //根据当前年龄 取当前级别列表数据下的对应
        getIntersetByAgeAndLevel:function(age){
            var self = this;
            for(var i = 0; i < self.currInterset.length; i++){
                if(self.currInterset[i].insuredAge == age){
                    return self.currInterset[i];
                }
            }
            return null;
        },
        close:function(){
            utils.productInfoList.length = 0;
            utils.productInfoList = [];
        }
    });
    return planBookView;
});