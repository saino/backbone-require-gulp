/**
 * 计划书-保障计划
 * add by guYY 2016//9/3
 */
define([
    'common/base/base_view',
    'module/plan/model/planModel',
    'text!module/plan/templates/planBookView.html'
],function(BaseView, planModel, tpl){
    var planBookView = BaseView.extend({
        id:"plan-book-container",
        template: _.template(tpl),
        inited : false,       //初始化完毕
        currPlanId:0,       //当前已生成计划 ID
        planBook:{},            //当前计划书对象
        productInfoList:[],     //主险附加险名称等存放处
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
            commentCon:".plan-message-txt"      //留言
        },

        events:{
            "tap @ui.btnRangeAdd" : "onRangeAddHandler",
            "tap @ui.btnRangeReduce" : "onRangeReduceHandler",
            "tap .added-service-item-button":"clickShowValueAddedHandler",//点击查看增值服务详情
            "tap .type-button":"clickStopHandler",  //点击收起/展开险种保费表格
            "tap .item-right-btn":"clickOpenDescHandler" //点击展开/收起责任详情
        },

        initialize:function(){
        },

        show : function(planId){
            var self = this;
            if(self.currPlanId == planId)return;
            self.currPlanId = planId;
            planModel.getPlanInfo(planId, function(data){
                console.log(data);
                self.planBook = data.planInfo;
                self.productInfoList = self.planBook.productInfoList;
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
                    imgHtml += '<img src="images/temp/feature01.png" alt="" class="featureImg" data-id="'+featureList[0].listId+'"/>';
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
        initLiability:function(initLiability){
            //TODO

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
        onRangeAddHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var val = parseInt(self.ui.rangeInput.val()) + 1;
            self.setRangeValue(val);
        },

        onRangeReduceHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var val = parseInt(self.ui.rangeInput.val()) - 1;
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
        setRangeValue : function(val){
            var self = this;
            self.ui.rangeInput.val(val);
        }
    });
    return planBookView;
});