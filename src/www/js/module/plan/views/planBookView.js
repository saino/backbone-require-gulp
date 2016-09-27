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
    'common/views/circle',
    'msgbox'
],function(BaseView, planModel, tpl,planLiabilityTpl,planLiabilityItemTpl,planLiabilityItemItemTpl,loadingCircle,MsgBox){
    var planBookView = BaseView.extend({
        id:"plan-book-container",
        template: _.template(tpl),
        planLiabilityTpl: _.template(planLiabilityTpl),
        planLiabilityItemTpl: _.template(planLiabilityItemTpl),
        planLiabilityItemItemTpl: _.template(planLiabilityItemItemTpl),
        inited : false,       //初始化完毕
        insuredAge:0,           //被保人年龄
        currPlanId:0,       //当前已生成计划 ID
        planBook:{},            //当前计划书对象
        productInfoList:[],     //主险附加险名称等存放处
        //利益演示相关
        interestDemonstration:{}, //利益演示数据列表 属性“1”低级  “2”中级  “3”高级
        isULProduct:"N",    //是否高级  高级显示“低 中 高”本档
        currLevel:"1",      //当前等级  “1”低级  “2”中级  “3”高级
        advice:"", //推荐理由
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
            valueAddedCon:".plan-added-service",//增值服务区域
            valueAddedList:".added-service-list",  //增值服务
            planMessage:".plan-message", //留言区域
            commentCon:".plan-message-txt",      //留言
            btnClause:".btn-clause",     //条款按钮
            liabilityList:".plan-obligation-list",//保险责任
            ageSelect:".demo-age-select", //年龄段下拉框
            userName:".contact-name",
            userPhone:".contact-phone",
            planDemo:".plan-demo", //利益演示
            planLevel:".plan-level",  //三档
            yearTitle:".demo-first-title", //第几年度
            demoListCon:".demo-list" //利益演示列表
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
            "change .demo-age-select":"changeSelectHandler", //年龄段下拉框更新
            "tap .item-right-disease":"clickDiseaseHandler"//点击“病种”
        },

        initialize:function(){
        },

        show : function(planId){
            var self = this;
            self.advice = "";
            self.ui.planBannerName.html("");
            self.ui.planBannerName.attr("data-advice","");
            //同一个计划书 数据无需刷新
            if(self.currPlanId == planId)return;
            //新计划书 置顶
            self.currPlanId = planId;
            //length置0 确保清空
            utils.productInfoList = [];
            utils.productInfoList.length = 0;
            self.insuredAge = 0;
            self.ui.yearTitle.html("");
            self.ui.valueAddedCon.css("display","none");
            self.ui.planMessage.css("display","none");
            //利益演示默认隐藏，请求成功再显示
            self.ui.planDemo.css("display","none");
            var planFromLocalStory = utils.getLocalStorageValue("planObject",planId);
            var planIllusFromLocalStory = utils.getLocalStorageValue("planObjectIllus",planId);//利益演示部份
            //初始化基本数据，先判断缓存，没有则取服务器
            if(planFromLocalStory){
                console.log("*********保障计划 缓存数据**********");
                console.log(planFromLocalStory);
                self.renderData(planFromLocalStory);
            }else {
                LoadingCircle && LoadingCircle.start();
                console.log("*********请求保障计划**********");
                planModel.getPlanInfo(planId, function (data) {
                    LoadingCircle && LoadingCircle.end();
                    console.log("*********保障计划 返回数据**********");
                    console.log(data);
                    utils.addLocalStorageObject("planObject",planId,data);
                    self.renderData(data);
                }, function (e) {
                    LoadingCircle && LoadingCircle.end();
                    MsgBox.alert("获取保障计划信息失败");
                })
            }
            //初始化利益演示部份，先判断缓存，没有则取服务器
            if(planIllusFromLocalStory){
                console.log("*********保障计划-利益演示 缓存数据**********");
                console.log(planIllusFromLocalStory);
                self.renderIllusData(planIllusFromLocalStory);
            }else{
                console.log("*********请求保障计划利益演示**********");
                planModel.getPlanIllus(planId, function (data) {
                    console.log("*********保障计划利益演示 返回数据**********");
                    console.log(data);
                    utils.addLocalStorageObject("planObjectIllus",planId,data);
                    self.renderIllusData(data);
                }, function (e) {
                    MsgBox.alert("获取保障计划利益演示接口失败");
                })
            }
        },
        //根据计划书对象 渲染页面
        renderData:function(data){
            var self = this;
            var proposerName = "";
            var proposerGender = "先生";
            self.planBook = data.planInfo;
            self.productInfoList = self.planBook.productInfoList;
            utils.productInfoList = self.productInfoList;
            var plan = self.planBook.plan;
            if(plan){
                proposerName = plan.proposer.name;
                proposerGender = plan.proposer.gender == "F"?"女士":"先生";
            }
            self.ui.planBannerName.attr("proposerName",proposerName);
            self.ui.planBannerName.attr("proposerGender",proposerGender);
            self.ui.planBannerName.html(self.planBook.packageName);
            self.initBannerData(plan);
            self.initInsuredData(plan);
            self.ui.coverageFirst.html(utils.formatNumber2(plan.totalFirstYearPrem));//首年保费
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
            self.initValueAdded(self.planBook.salesValueAdded,plan.showValueAdded);
            self.advice = plan.advice;
            self.ui.planBannerName.attr("data-advice",self.advice);
            if(plan.showAdvice=="Y" && plan.advice != "")
            {
                self.ui.commentCon.html(plan.advice);
                self.ui.planMessage.css("display","block");
            }else{
                self.ui.commentCon.html("");
                self.ui.planMessage.css("display","none");
            }
            //初始化责任列表
            self.initLiability(self.planBook.planLiability);
            self.ui.userName.html(self.planBook.userName);//userPhone
            self.ui.userPhone.html('<a href="tel:'+self.planBook.userPhone+'">'+self.planBook.userPhone+'</a>');
        },
        //渲染利益演示部分
        renderIllusData:function(data){
            var self = this;
            if(self.currPlanId != data.quotationId)return;
            if(!data.illusMap || !data.illusMap["2"]){
                self.ui.planDemo.css("display","none");
                return;
            }else{
                self.ui.planDemo.css("display","block");
            }
            self.isULProduct = data.isULProduct;
            self.insuredAge = data.mainAssuredAge;//被保人年龄
            if(self.isULProduct == "Y"){
                self.ui.planLevel.css("display","block");
                self.currLevel = "1";
            }else{
                self.ui.planLevel.css("display","none");
                self.currLevel = "2";
            }
            self.initInterestDemonstration(data.illusMap);
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
                self.insuredAge = insuredObj.age;
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
                        imgHtml += '<img src="'+(utils.serverConfig.serverUrl+ featureList[i].featurePic)+'" alt="" class="featureImg" data-id="' + featureList[0].listId + '"/>';
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
        initValueAdded:function(valueAddedList,showValueAdded){
            var tempHtml = "", self = this;
            if(valueAddedList && valueAddedList.length > 0){
                for(var i = 0; i < valueAddedList.length; i++){
                    tempHtml += '<div class="added-service-item"><div class="added-service-item-txt">'+valueAddedList[i].valueAddedName+'</div>' +
                        '<div class="added-service-item-button" data-id="'+valueAddedList[i].valueAddedId+'">查看详情</div></div>';
                }
                if(showValueAdded == "Y")
                    self.ui.valueAddedCon.css("display","block");
                else
                    self.ui.valueAddedCon.css("display","none");
            }else{
                self.ui.valueAddedCon.css("display","none");
            }
            self.ui.valueAddedList.html($(tempHtml));
        },
        //责任
        initLiability:function(planLiability){
            var liabCateList = planLiability ? planLiability.liabCateList : [];
            var multiProduct = planLiability ? planLiability.multiProduct : true;//是否多个产品
            var tempHtml = "", self = this;
            //嵌套三层循环，逻辑之复杂 只可意会 不可言传
            for(var i = 0; i < liabCateList.length; i++)
            {
                var liabilityListHtml = "";
                //列表为空，不显示
                if(!liabCateList[i].simpleLiabList){
                    liabCateList[i].simpleLiabList = [];
                }
                for(var j =0 ; j < liabCateList[i].simpleLiabList.length; j++){
                    var obj = liabCateList[i].simpleLiabList[j];
                    if(multiProduct) {
                        //只有是1时，参与计算，才有amount。否则取liabCalcMethod描述
                        var libCalcType = obj.libCalcMethod;
                        var liabilityList2Html = "";
                        var totalAmount = "";
                        var rightClass = "";
                        if (libCalcType == 1) {
                            totalAmount = utils.formatNumber(obj.totalAmount);
                            rightClass = "item-right-mr88"; //显示金额时需距离右边88px
                        }
                        for (var k = 0; k < obj.liabList.length; k++) {
                            var itemObj = obj.liabList[k];
                            var liabAmount = itemObj.libCalcType;
                            var packageId = itemObj.packageId ? itemObj.packageId : 0;
                            var needDiseaseIndi = itemObj.needDiseaseIndi;
                            var showStyle = 'style="display:none"';
                            if (needDiseaseIndi == "Y") {
                                showStyle = "";
                            }
                            if (libCalcType == 1) {
                                rightClass = "item-right-mr88"; //显示金额时需距离右边88px
                                liabAmount = utils.formatNumber(itemObj.liabAmount);
                            }
                            var libId = itemObj.liabId ? itemObj.liabId : 0;
                            var productId = itemObj.productId ? itemObj.productId : 0;
                            liabilityList2Html += self.planLiabilityItemItemTpl({liabDisplayName: itemObj.liabDisplayName, showStyle: showStyle, liabAmount: liabAmount, libDescQuote: itemObj.libDescQuote, rightClass: rightClass, packageId: packageId, productId: productId, libId: libId,multiProductClass:""});
                        }
                        liabilityListHtml += self.planLiabilityItemTpl({liabDisplayName:obj.liabDisplayName,totalAmount:totalAmount,liabilityList2Html:liabilityList2Html, rightClass: rightClass});
                    }else{
                        var singleObj = obj.liabList[0];//单个产品取第一个
                        var libCalcType2 = singleObj.libCalcMethod;
                        var liabAmount2 = singleObj.libCalcType;
                        var liabilityList2Html = "";
                        var showStyle2 = 'style="display:none"';
                        var needDiseaseIndi = singleObj.needDiseaseIndi;
                        if (needDiseaseIndi == "Y") {
                            showStyle2 = "";
                        }
                        var rightClass2 = "";
                        if (libCalcType2 == 1) {
                            rightClass2 = "item-right-mr88"; //显示金额时需距离右边88px
                            liabAmount2 = utils.formatNumber(singleObj.liabAmount);
                        }
                        var packageId2 = singleObj.packageId ? singleObj.packageId : 0;
                        var libId2 = singleObj.liabId ? singleObj.liabId : 0;
                        var productId2 = singleObj.productId ? singleObj.productId : 0;
                       liabilityListHtml += self.planLiabilityItemItemTpl({liabDisplayName: singleObj.liabDisplayName, showStyle: showStyle2, liabAmount: liabAmount2, libDescQuote: singleObj.libDescQuote, rightClass: rightClass2, packageId: packageId2, productId: productId2, libId: libId2,multiProductClass:"info-btn-div-single"});
                    }

                }
                //列表为空，大类也不显示
                if(liabilityListHtml.trim().length > 0){
                    tempHtml += self.planLiabilityTpl({categoryName:liabCateList[i].categoryName,liabilityListHtml:liabilityListHtml});
                }
            }
            self.ui.liabilityList.html($(tempHtml));
        },
        //初始化年龄段
        initInterestAgeList:function(illusMap){
            var self = this;
            self.ui.rangeInput.attr("min",0);
            self.ui.rangeInput.attr("max",0);
            var map = illusMap[self.currLevel] || {};
            var minAge = 1, maxAge = 1;
            for(var key in map){
                minAge = Math.min(parseInt(key), minAge);
                maxAge = Math.max(parseInt(key), maxAge);
            }

            minAge = self.insuredAge + (minAge-1);//update 9/27 12:47
            maxAge =  self.insuredAge + (maxAge-1);
            var ageHtml = "";
            if(minAge != maxAge) {
                //初始化年龄段下拉
                for (var i = minAge; i <= maxAge; i++) {
                    ageHtml += '<option value="' + (i - self.insuredAge) + '">' + i + '</option>';
                }
            }
            self.ui.rangeInput.attr("min",(minAge-self.insuredAge));
            self.ui.rangeInput.attr("max",(maxAge-self.insuredAge));
            self.ui.ageSelect.html($(ageHtml));
        },
        //初始化利益演示
        initInterestDemonstration:function(illusMap){
            var self = this;
            self.interestDemonstration = illusMap||{};
            self.initInterestAgeList(illusMap||{});
            self.setRangeValue(0);//初始化第一年度信息
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
            //如果只有单个产品 直接指向条款详情、多个指向产品列表
             if(utils.productInfoList && utils.productInfoList.length == 1){
                 var id = utils.productInfoList[0].productId;
                 app.navigate("in/clause/"+id,{trigger:true,replace:true});
            }else{
                 app.navigate("in/clauseList",{trigger:true, replace:true});
             }
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
        //点击病种
        clickDiseaseHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var target = $(e.target);
            var packageId = 0, productId = 0, libId = 0;
            packageId = target.data("packageid");
            productId = target.data("productid");
            libId = target.data("libid");
            app.navigate("in/disease/"+packageId+"/"+productId+"/"+libId, {trigger:true, replace:true});
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
            var valueAddedId = target.data("id") || "null";
            app.navigate("in/increment/"+valueAddedId,{replace:true, trigger:true});
        },
        //根据增值服务ID获取对象 暂不用
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
            if(target.hasClass("down")){//收起
                self.ui.liabilityList.slideUp();
            }else{//点击收起
                self.ui.liabilityList.slideDown();
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
            self.setRangeValue(0);
        },
        //当前第num年度
        setRangeValue : function(num){
            var self = this;
            self.ui.rangeInput.val(num);
            self.ui.ageSelect.val(num);
            self.ui.yearTitle.html("第"+(num+1)+"保单年度");
            var list = [];
            if(self.interestDemonstration[self.currLevel]){
                list = self.interestDemonstration[self.currLevel][num+""] || [];
            }
            var demoHtml = "";
            if(list && list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    var type = parseInt(list[i].type);
                    var value = utils.formatNumber2(list[i].value);
                    demoHtml += '<div class="demo-list-item">'+
                        '<div class="demo-list-item-txt">'+utils.illusType[type]+'</div>'+
                    '<div class="demo-list-item-money">'+value+'</div></div>';
                }
            }
            self.ui.demoListCon.html($(demoHtml));
        },
        destroy:function(){
            utils.productInfoList.length = 0;
            utils.productInfoList = [];
        }
    });
    return planBookView;
});