/**
 * Created by GYY on 2016/8/22.
 * 主产品信息页面
 */
define([
    'common/base/base_view',
    'text!module/productDetails/templates/productDetails.html',
    'module/productDetails/model/productDetailsModel',
    "msgbox",
    'module/personalCollect/model/personalCollectModel',
    'common/views/circle'
],function(BaseView, Tpl, productDetailsModel, MsgBox, personalCollectModel, loadingCircle){
    var ProductDetailsView = BaseView.extend({
        template: _.template(Tpl),
        id:"product-details-container",
        currentUserId : "",     //当前用户ID
        productId : "",         //售卖产品ID
        packageName: "",        //产品名称
        forever: true,
        suggestReason: "",      //分享理由
        // forever: true,
        ui:{
            topCon : ".top-title",
            backBtn : ".top-title-left", //点击返回
            shareBtn : ".top-title-right-1",              //分享按钮
            collectBtn : ".top-title-right-2",            //收藏按钮
            detailsInfoTop : ".details-info-top",       // 产品名称和公司LOGO
            productDetailsPv : ".product-details-pv",   //产品PV
            insureAge : "#insure-age span:last-child",                      //投保年龄
            limitCoverage : "#limit-coverage span:last-child",             //最低保额
            paymentRange : "#payment-range span:last-child",             //交费期间
            safeguardRange : "#safeguard-range span:last-child",             //保障期间
            productDetailsMain : "#product-details-main",
            summaryContent : ".insure-summary-content" ,     //保障概览
            productInsureFeature: ".product-insure-feature", //产品特色容器
            featureContent : ".insure-feature-content",     //产品特色
            dutyTitle : ".insure-duty-title",               //责任标题
            dutyTitleBtn : ".insure-duty-title .pull-icon-big", //责任下拉按钮
            dutyContent : ".insure-duty-content",           //保险责任
            planTitle : ".insure-plan-title",               //计划标题
            planTitleBtn : ".insure-plan-title .pull-icon-big", //计划下拉按钮
            planContent : ".insure-plan-content",           //产品组合计划列表
            productInsurePlan: ".product-insure-plan",    //产品组合计划表容器
            subjoinTitle : ".insure-subjoin-title",         //附加标题
            subjoinTitleBtn : ".insure-subjoin-title .pull-icon-big",   //附加下拉按钮
            subjoinContent : ".insure-subjoin-content",     //推荐附加险
            productInsureSubjoin: ".product-insure-subjoin", //附加险容器
            insureMake : ".product-insure-make",        //制作企划书
            productCompanyLogo: ".product-company-logo"   //公司logo
        },
        events:{
            "tap @ui.backBtn":"onBackBtnHandler",
            "tap @ui.shareBtn":"onShareInsureHandler",      //分享保险
            "tap @ui.collectBtn":"onCollectInsureHandler",        //收藏保险
            "tap @ui.dutyTitleBtn":"onToggleDutyContentHandler",
            "tap @ui.dutyContent" :  "onToggleDutyItemSummaryHandler",
            "tap @ui.planTitleBtn":"onTogglePlanContentHandler",
            "tap @ui.planContent" :  "onGoToPlanItemHandler",
            "tap @ui.subjoinTitleBtn":"onToggleSubjoinContentHandler",
            "tap @ui.subjoinContent" : "onGoToSubjoinItemHandler",
            "tap .product-insure-make" : "onGoToInsureMakeHandler",        //去制作
            "tap @ui.productCompanyLogo": "onDetailsInfoTopHandler"            //去公司详情
        },

        // 去公司详情
        onDetailsInfoTopHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            if(utils.clickLock()){
                return;
            }
            this.companyId = this.companyId || "null";
            app.navigate("in/companyIntro/" + this.companyId, {replace : true, trigger : true});
        },
        initialize:function(){

        },
        onRender:function(){
            var self = this;
            if(device.ios()){
                self.ui.topCon.css("padding-top",utils.toolHeight+"px");
            }
            setTimeout(function(){
                var height = self.ui.topCon.outerHeight(true);
                self.ui.productDetailsMain.css({height: "-webkit-calc(100% - " + height + "px)"});
            }, 0)

            // self.productId = self.getOption("productId");   //获取产品ID
            // console.log(self.productId);
            //根据用户ID 和保险售卖ID查询数据
            self._initView = self.initView.bind(self);
        },
        show: function(){
            var self = this;
            if(utils.isShare){
            //     backBtn : ".top-title-left", //点击返回
            // shareBtn : ".top-title-right-1",              //分享按钮
            // collectBtn : ".top-title-right-2", 
            // insureMake
                self.ui.backBtn.css("visibility", "hidden");
                self.ui.shareBtn.css("visibility", "hidden");
                self.ui.collectBtn.css("visibility", "hidden");
                self.ui.insureMake.css("visibility", "hidden");
            }
            var productId = self.getOption("productId")
            if(self.productId == productId){
                return;
            }
            self.productId = productId;   //获取产品ID
            // console.log(self.productId);
            //根据用户ID 和保险售卖ID查询数据
            // self._initView = self.initView.bind(self);
            var options =  {
                "encryptedUserData": utils.userObj.id,
                "salesPackageId": self.productId
            };
            LoadingCircle && LoadingCircle.start();
            productDetailsModel.getProductInfo(options, self._initView, function(err){
                console.log(err);
                setTimeout(function(){
                    MsgBox.alert("数据获取失败");
                }, 350);
                LoadingCircle && LoadingCircle.end();
            });


        },
        pageIn:function(){
            var self = this;

        },
        /**
         * 初始化界面的动态数据
         * @param data
         */
        initView : function(data){
            if(data.status !== "0"){
                console.log("error", data);
                setTimeout(function(){
                        MsgBox.alert("数据获取失败");
                }, 350);
                return;
            }
            console.log(data);
            var self = this;
            self.companyId = data.company && data.company.listId;
            self.companyId += "";

            if(data.isCollected == "Y"){
                self.ui.collectBtn.attr("class", "top-title-right-2 hasCollection");
            }else if(data.isCollected == "N"){
                self.ui.collectBtn.attr("class", "top-title-right-2")
            }
            //分享理由
            self.suggestReason = data.suggestReason;
            //设置用户信息
            self.packageName = data.packageName; //保险名称
            var organLogo =  utils.serverConfig.serverUrl + data.company.organLogo;    //公司logo
            var totalVisitCount = data.totalVisitCount; //总PV数
            self.initInfoView(self.packageName, organLogo, totalVisitCount);
            //设置投保条件
            var amountLimit = data.saPremInfo; //保额限制
            var ageRange = data.ageRange; //年龄区间
            var prdtTermChargeList = data.prdtTermChargeList; //费用期间
            var prdtTermCoverageList = data.prdtTermCoverageList; //保障期间
            self.initConditionView(amountLimit, ageRange, prdtTermChargeList, prdtTermCoverageList);
            //设置保障概览
            var salesRightsList = data.salesRightsList; //保障概览
            self.initSummaryView(salesRightsList);
            //设置产品特色
            var productFeatureList = data.productFeatureList; //产品特色
            self.initFeatureView(productFeatureList);
            //设置保险责任
            var salesLiabilityList = data.salesLiabilityList;
            self.initDutyView(salesLiabilityList);
            //组合计划
            var productList = data.productList;
            self.initPlanView(productList);
            //附加险
            var attachProductList = data.attachProductList;
            self.initSubjoinView(attachProductList);
            LoadingCircle && LoadingCircle.end();
        },
        /**
         * 初始化投保信息
         * @param packageName
         * @param organLogo
         * @param totalVisitCount
         */
        initInfoView : function(packageName, organLogo, totalVisitCount){
            var self = this;
            self.ui.detailsInfoTop.text(packageName);
            self.ui.productCompanyLogo.css({"background" : "url("+organLogo+") 100% center no-repeat"});
            // self.ui.detailsInfoTop.css({"background" : "url("+organLogo+") 100% center no-repeat"});
            self.ui.productDetailsPv.text(totalVisitCount);
        },
        /**
         * 初始化投保条件
         * @param amountLimit   obj{}
         * @param ageRange  obj{}
         * @param prdtTermChargeList [obj,obj]
         * @param prdtTermCoverageList [obj,obj]
         */
        initConditionView : function (amountLimit, ageRange, prdtTermChargeList, prdtTermCoverageList){
            var self = this;
            //投保年龄
            var minAge = (ageRange && ageRange.minAge);       //最小年龄
            var minAgeUnitStr = "";
            if(ageRange.minUnit == "1"){
                minAgeUnitStr = "周岁";
            }else if(ageRange.minUnit == "5"){
                minAgeUnitStr = "天";
            }
            minAge = minAge == null ? "" : minAge;
            // var minAgeUnit = ageRange.minUnit;  //最小年龄单位
            var maxAge = (ageRange && ageRange.maxAge);       //最小年龄
            var maxAgeUnitStr = "";
            if(ageRange.maxUnit == "1"){
                maxAgeUnitStr = "周岁";
            }else if(ageRange.maxUnit == "5"){
                maxAgeUnitStr = "天";
            }
            maxAge = maxAge == null ? "" : maxAge;
            // var maxAgeUnit = ageRange.maxUnit;  //最小年龄单位
            self.ui.insureAge.text(minAge+minAgeUnitStr+"-"+maxAge+maxAgeUnitStr);
            // //最低保额
            // var minAmount = (amountLimit && amountLimit.minAmount);      //最低保额
            // minAmount = minAmount == null ? "" : minAmount;
            // var limitUnit = (amountLimit && amountLimit.limitUnit);      //保额单位
            // var limitUnitStr = "";
            // if(limitUnit == "1"){
            //     limitUnitStr = "元";
            // }
            // if(limitUnit == "2"){
            //     limitUnitStr = "份";
            // }
            // limitUnit = limitUnit == null ? "" : limitUnit;
            // console.log(amountLimit);
            // amountLimit = "lksjdksjdkjk";
            if(amountLimit){
                // console.log(amountLimit);
                // console.log();
                // amountLimit = '<span style="color: #666;">最低保额:</span>1万元';
                self.ui.limitCoverage.html(amountLimit);
                self.ui.limitCoverage.parent().show();
            }else{
                self.ui.limitCoverage.parent().hide();
            }
            //交费期间
            var paymentStr = "";
            for(var i = 0; prdtTermChargeList&&i<prdtTermChargeList.length; i++){
                var obj1 = prdtTermChargeList[i];
                if(i){
                    paymentStr += "/";
                }
                if(obj1.periodType == 1){
                    // if(!obj1.periodValue ){
                        obj1.periodValue = "";
                    // }
                    paymentStr += obj1.periodValue + "趸交";
                }
                if(obj1.periodType == 2){
                    paymentStr += obj1.periodValue + "年";
                }
                if(obj1.periodType == 3){
                    paymentStr += "至" + obj1.periodValue + "周岁";
                }
                if(obj1.periodType == 4){
                    paymentStr += "终身";
                }
            }
            self.ui.paymentRange.text(paymentStr);
            //保障期间
            var safeguardStr = "";
            for(var j = 0; prdtTermCoverageList&&j<prdtTermCoverageList.length; j++){
                var obj2 = prdtTermCoverageList[j];
                if(j == 0){
                    safeguardStr += "";
                }else{
                    safeguardStr += "、";
                }
                if(obj2.periodType == 1){
                    safeguardStr += "终身";
                }
                if(obj2.periodType == 2){
                    safeguardStr += obj2.periodValue + "年";
                }
                if(obj2.periodType == 3){
                    safeguardStr += "至" + obj2.periodValue + "周岁";
                }
                if(obj2.periodType == 4){
                    safeguardStr += obj2.periodValue + "月";
                }
                if(obj2.periodType == 5){
                    safeguardStr += obj2.periodValue + "天";
                }
            }
            self.ui.safeguardRange.text(safeguardStr);
        },
        /**
         * 设置保障概览
         * @param salesRightsList  保障列表
         */
        initSummaryView : function(salesRightsList) {
            var self = this;
            var summaryTemp = '<div class="insure-summary-item">{rightName}</div>';
            var summaryStr = "";
            for(var i = 0; i < salesRightsList.length; i++){
                var obj = salesRightsList[i];
                var realTemp = summaryTemp.replace("{rightName}", obj.rightName);
                summaryStr += realTemp;
            }
            summaryStr += '<div class="clear"></div>';      //最后添加一个清除浮动
            self.ui.summaryContent.html(summaryStr);
        },
        /**
         * 设置产品特色
         * @param productFeatureList  特色列表
         * <div class="insure-feature-item">
         * <img  src="./images/insurance/long.png"/>
         * <span>长期保障期限：各项责任统统保障终身</span>
         * </div>
         */
        initFeatureView : function (productFeatureList) {
            var self = this;

            if(!productFeatureList || productFeatureList.length==0){
                self.ui.productInsureFeature.hide();
                console.log("没有产品特色");
                return;
            }else{
                self.ui.productInsureFeature.show();
            }

            // var featureTemp = '<div class="insure-feature-item" style="background: url({feature-pic}) no-repeat center"></div>';
            var featureTemp = '<img style="width: 100%" src="{feature-pic}"></img>';
            var featureStr = "";
            for(var i = 0; i < productFeatureList.length; i++){
                var obj = productFeatureList[i];
                var realTemp = featureTemp.replace("{feature-pic}", utils.serverConfig.serverUrl + obj.featurePic);
                featureStr += realTemp;
            }
            self.ui.featureContent.html(featureStr);
        },
        /**
         * 设置保险责任
         * @param salesLiabilityList  特色列表
         * <div class="insure-duty-item">
         *<div class="duty-item-title on">
         *<span>身故赔付已交保费</span>
         *<span class="pull-icon-small"></span>
         *</div>
         *<div class="duty-item-content">
         *未满18周岁，因意外或者90天等待期后因非意外导致身故，给付1.5倍保费，或者90天等待期内因非意外导致身故，给付已交保费；
         *18周岁后，因意外或者90天等待期后因非意外导致身故，给付保额，或者90天等待期内因非意外导致身故，给付已交保费。
         *</div>
         *</div>
         */
        initDutyView : function (salesLiabilityList) {
            var self = this;
            var dutyTemp = '<div class="insure-duty-item">'+
                    '<div class="duty-item-title">'+
                    '<span class="duty-item-title-span">{liabName}</span>'+
                    '<span class="pull-icon-small"></span>'+
                    '</div>'+
                    '<div class="duty-item-content">{liabDesc}</div>'+
                    '</div>';
            var dutyStr = "";
            for(var i = 0; i < salesLiabilityList.length; i++){
                var obj = salesLiabilityList[i];
                var realTemp = dutyTemp.replace("{liabName}", obj.liabDesc).replace(/\{liabDesc\}/g, obj.liabDescProd);
                dutyStr += realTemp;
            }
            self.ui.dutyTitle.attr("class", "insure-duty-title");
            self.ui.dutyContent.hide();
            self.ui.dutyContent.html(dutyStr);
        },
        /**
         * 设置组合计划险
         * @param productList
         */
                /**
         * 设置组合计划险
         * @param productList
         */
        initPlanView : function (productList){
            var self = this;
            var planTemp =  '<div class="insure-plan-item" data-instype="{insType}" data-productId="{productId}" data-salesProductId="{salesProductId}">'+
                                '<span class="duty-item-title-span" data-instype="{insType}" data-productId="{productId}" data-salesProductId="{salesProductId}">{salesProductName}</span>'+
                                '<span class="pull-icon-next" data-instype="{insType}" data-productId="{productId}" data-salesProductId="{salesProductId}"></span>'+
                            '</div>';
            if(!productList || productList.length==0){
                self.ui.productInsurePlan.hide();
                console.log("没有计划组合");
                return;
            }else if(productList.length==1){
                self.ui.productInsurePlan.find(".insure-plan-title").hide();
                var obj = productList[0];
                var str = planTemp.replace("{salesProductName}", "详细说明").replace(/\{productId\}/g, obj.productId).replace(/\{salesProductId\}/g, obj.salesProductId).replace(/\{insType\}/g, obj.insType);
                self.ui.planContent.html(str);
                self.ui.planContent.show();
            }else{
                var planStr = "";
                for(var i = 0; i < productList.length; i++){
                    var obj = productList[i];
                    var realTemp = planTemp.replace("{salesProductName}", obj.salesProductName).replace(/\{productId\}/g, obj.productId).replace(/\{salesProductId\}/g, obj.salesProductId).replace(/\{insType\}/g, obj.insType);;
                    planStr += realTemp;
                }
                self.ui.planContent.html(planStr);
                self.ui.productInsurePlan.find(".insure-plan-title").show();
                self.ui.productInsurePlan.show();
                self.ui.planContent.hide();
            }
            self.ui.planTitle.attr("class", "insure-plan-title");
            
        },
        /**
         * 设置附加险
         * @param attachProductList
         */
        initSubjoinView : function (attachProductList){
            var self = this;

            if(!attachProductList || attachProductList.length==0){
                self.ui.productInsureSubjoin.hide();
                console.log("没有附加险");
                return;
            }else{
                self.ui.productInsureSubjoin.show();
            }

            var subjoinTemp = '<div class="insure-subjoin-item" data-instype="{insType}" data-productId="{productId}" data-salesProductId="{salesProductId}">'+
                '<span class="duty-item-title-span" data-instype="{insType}" data-productId="{productId}" data-salesProductId="{salesProductId}">{salesProductName}</span>'+
                '<span class="pull-icon-next" data-instype="{insType}" data-productId="{productId}" data-salesProductId="{salesProductId}"></span>'+
                '</div>';
            var subjoinStr = "";
            for(var i = 0; attachProductList&&i<attachProductList.length; i++){
                var obj = attachProductList[i];
                var realTemp = subjoinTemp.replace("{salesProductName}", obj.attachProductName).replace(/\{productId\}/g, obj.attachId).replace(/\{salesProductId\}/g, obj.salesProductId).replace(/\{insType\}/g, obj.insType);
                subjoinStr += realTemp;
            }
            self.ui.subjoinTitle.attr("class", "insure-subjoin-title");
            self.ui.subjoinContent.hide();

            self.ui.subjoinContent.html(subjoinStr);
        },
        /**
         * 点击返回
         * @param e
         */
        onBackBtnHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            if(utils.clickLock()){
                return;
            }
            //进入寿险列表查询也是否需要重新加载数据
            utils.isLifeInsuranceRefresh = false;
            //是否初始化查询条件
            // utils.isInitOption = true;
            app.goBack();
        },
        /**
         * 分享保险
         * @param e
         */
        onShareInsureHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            if(utils.clickLock()){
                return;
            }
            var self = this;
            utils.shareProduct(self.packageName, self.suggestReason, window.location.href);
            // MsgBox.alert("点击了分享保险");
            // var options = {
            //     "packageId": parseInt(self.productId),
            //     "linkUrl": window.location.href,
            //     "encryptedUserData": utils.userObj.id
            // };
            // // console.log(options);
            // productDetailsModel.sharePackage(options, function(data){
            //     console.log("success", data);
            //     if(data.status == "0"){

            //     }else{
            //         MsgBox.alert("分享失败");
            //     }
            // }, function(error){
            //     MsgBox.alert("分享失败");
            //     console.log(error);
            // });
        },
        /**
         * 收藏保险
         * @param e
         */
        onCollectInsureHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            if(utils.clickLock()){
                return;
            }
            var self = this;
            if(!utils.userObj.id || utils.userObj.id == ""){
                utils.toLogin();
                return;
            }
            console.log("xxxxxxxxx");
            var $target = $(e.target);
            var options = {
                "encryptedUserData": utils.userObj.id,
                "packageId": parseInt(self.productId)
            }
            if($target.hasClass("hasCollection")){      //取消收藏
                LoadingCircle && LoadingCircle.start();
                personalCollectModel.deleteCollectProduct(options, function(data){
                    console.log(data);
                    if(data.status == "0"){
                        $target.toggleClass("hasCollection");
                        MsgBox.alert("取消收藏成功");
                    }else{
                        MsgBox.alert("取消收藏失败");
                    }
                    LoadingCircle && LoadingCircle.end();
                }, function(error){
                    MsgBox.alert("取消收藏失败");
                    LoadingCircle && LoadingCircle.end();
                });

                return;
            }

            // 收藏
            LoadingCircle && LoadingCircle.start();
            productDetailsModel.collectProduct(options, function(data){
                console.log("success", data);
                if(data.status == "0"){
                    $target.toggleClass("hasCollection");
                    MsgBox.alert("收藏成功");
                }else{
                    MsgBox.alert("收藏失败");
                }
                LoadingCircle && LoadingCircle.end();
            }, function(error){
                console.log(error);
                MsgBox.alert("收藏失败");
                LoadingCircle && LoadingCircle.end();
            });
            // MsgBox.alert("点击了收藏保险");
        },
        /**
         *点击显示或者隐藏保险责任
         * @param e
         */
        onToggleDutyContentHandler : function(e) {
            e.stopPropagation();
            e.preventDefault();
            if(utils.clickLock()){
                return;
            }
            var self = this;
            self.ui.dutyTitle.toggleClass("on");
            self.ui.dutyTitle.next().slideToggle(function(){
                if(e.pageY > 800 && self.ui.dutyTitle.next().css("display") == "block"){
                    self.ui.productDetailsMain.animate({
                        scrollTop: self.ui.productDetailsMain.scrollTop() + 350
                    }, 600);

                }
            });
        },
        /**
         *点击显示或者隐藏保险责任列表的简介
         * @param e
         */
        onToggleDutyItemSummaryHandler : function(event) {
            event.stopPropagation();
            event.preventDefault();
            if(utils.clickLock()){
                return;
            }
            var self = this;
            var target = event.target;
            var $target = $(target);
            var parent = null;
            if($target.hasClass("pull-icon-small")){
                parent = $target.parent();
            }
            if(parent){
                parent.toggleClass("on");
                // parent.next().slideToggle();
                parent.next().slideToggle(function(){
                    if(event.pageY > 800 && parent.next().css("display") == "block"){
                        self.ui.productDetailsMain.animate({
                            scrollTop: self.ui.productDetailsMain.scrollTop() + 350
                        }, 600);

                    }
                });
            }
        },
        /**
         *点击显示或者隐藏保险计划列表
         * @param e
         */
        onTogglePlanContentHandler : function(e) {
            e.stopPropagation();
            e.preventDefault();
            if(utils.clickLock()){
                return;
            }
            var self = this;
            self.ui.planTitle.toggleClass("on");
            self.ui.planTitle.next().slideToggle(function(){
                if(e.pageY > 800 && self.ui.planTitle.next().css("display") == "block"){
                    self.ui.productDetailsMain.animate({
                        scrollTop: self.ui.productDetailsMain.scrollTop() + 350
                    }, 600);

                }
            });
        },
        /**
         * 跳转到计划组合列表的选项页
         * @param e
         */
        onGoToPlanItemHandler : function(e) {
            e.stopPropagation();
            e.preventDefault();
            if(utils.clickLock()){
                return;
            }
            var self = this;
            var target = e.target;
            var $target = $(target);
            // var dataType = $target.attr("data-type");
            // if(dataType){
                // MsgBox.alert("计划组合列表");
                var packageId = self.productId;
                var productId = $target.attr("data-productid");
                var salesProductId = $target.attr("data-salesproductid");
                var isMain = $target.attr("data-instype");
                if(isMain == "1"){     //如果是主险需要显示案例说明
                    utils.isShowExample = true;
                }else{                  //不是主险则隐藏案例说明
                    utils.isShowExample = false;
                }
                packageId = packageId || "null";
                productId = productId || "null";
                salesProductId = salesProductId || "null";

                if(packageId&&productId&&salesProductId){
                    app.navigate("in/attachDetails/"+packageId+"/"+productId+"/"+salesProductId, {replace : true, trigger : true}); 
                }
                // console.log(self.productId, $target.attr("data-productid"), $target.attr("data-salesproductid"));
                // app.navigate("in/attachDetails/9100001/1004001/100001", {replace : true, trigger : true})
            // }
        },
        /**
         *点击显示或者隐藏附加险
         * @param e
         */
        onToggleSubjoinContentHandler : function(e) {
            e.stopPropagation();
            e.preventDefault();
            if(utils.clickLock()){
                return;
            }
            var self = this;
            self.ui.subjoinTitle.toggleClass("on");
            self.ui.subjoinTitle.next().slideToggle(function(){
                if(e.pageY > 800 && self.ui.subjoinTitle.next().css("display") == "block"){
                    self.ui.productDetailsMain.animate({
                        scrollTop: self.ui.productDetailsMain.scrollTop() + 350
                    }, 600);

                }
            });
        },
        /**
         * 跳转到附加险列表的选项页
         * @param e
         */
        onGoToSubjoinItemHandler : function(e) {
            e.stopPropagation();
            e.preventDefault();
            if(utils.clickLock()){
                return;
            }
            var self = this;
            var target = e.target;
            var $target = $(target);
            // var dataType = $target.attr("data-type");
            // if(dataType){
                //MsgBox.alert("推荐附加险列表");
                var packageId = self.productId;
                var productId = $target.attr("data-productid");
                var salesProductId = $target.attr("data-salesproductid");
                var isMain = $target.attr("data-instype");
                if(isMain == "1"){     //如果是主险需要显示案例说明
                    utils.isShowExample = true;
                }else{                  //不是主险则隐藏案例说明
                    utils.isShowExample = false;
                }
                packageId = packageId || "null";
                productId = productId || "null";
                salesProductId = salesProductId || "null";

                if(packageId&&productId&&salesProductId){
                    app.navigate("in/attachDetails/"+packageId+"/"+productId+"/"+salesProductId, {replace : true, trigger : true}); 
                }
                //console.log(self.productId, $target.attr("data-productid"), $target.attr("data-salesproductid"));
                // app.navigate("#in/attachDetails/"+dataType, {replace : true, trigger : true});
            // }
        },
        /**
         * 跳转到附加险列表的选项页
         * @param e
         */
        onGoToInsureMakeHandler : function(e) {
            e.stopPropagation();
            e.preventDefault();
            if(utils.clickLock()){
                return;
            }
            var self = this;
            self.productId = self.productId || "null";
            if(!utils.userObj.id || utils.userObj.id == ""){
                utils.toLogin();
            }else {
                app.navigate("in/makePlan/" + self.productId, {replace: true, trigger: true});
            }
            // MsgBox.alert("去制作");in/makePlan/:productId
        },
        close:function(){
            var self = this;
            // self._initView = null;
            // self.remove();
            if(MsgBox && MsgBox.isShow()) {
                MsgBox.clear();
            }
        }
    });
    return ProductDetailsView;
});
