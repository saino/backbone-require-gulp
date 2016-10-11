define([
    'common/base/base_view',
    'marionette',
    'text!module/lifeInsurance/templates/lifeInsurance.html',
    'msgbox',
    'module/lifeInsurance/model/lifeInsurance',
    'common/views/circle'
], function(BaseView, mn, tpl, MsgBox, lifeInsuranceModel, loadingCircle) {
    return BaseView.extend({
        id: "lifeInsurancePage",
        template: _.template(tpl),
        forever: true,
        actualSearchWords: "", //搜索框对应搜索词
        companys: [],   //保险公司
        maxScrollTop: 0,
        startPos: 0,    //查询数据起始位置(0为第一条)
        pageIndex: 0,   //下次要查询第几页
        pageSize: 5,    //每页查询多少条数据 
        isLoading: false,   //是否真正加载数据
        mouseLock:false, //按钮锁
        isCanLoad: true,
        dataFinish:false,//数据加载完成  add by guYY 10/10 11:17
        ui: {
            topTitle: "#top-title",
            back: "#top-title-left",
            topRitleRight: "#top-title-right",
            productInsureDuty: ".product-insure-duty",
            searchDefaultSort: "#search-default-sort",                  //默认排序
            defaultSortLayoutFloat: "#default-sort-layout-float",       //默认排序浮层
            defaultSortContent: ".default-sort-content",                //排序选项容器

            insuranceCompanyFloat: "#insurance-company-float",        //保险公司浮层
            insuranceCompanyContent: "#insurance-company-content",      //保险公司容器
            insuranceCompanyInnerContent: "#insurance-company-inner-content", //保险公司内部容器
            // defaultSortContent: ".default-sort-content",
            searchText: "#search-text",                                 //搜索框
            searchAdvancedScreening: "#search-advanced-screening",      //高级筛选
            searchInsuranceCompany: "#search-insurance-company",        //保险公司
            lifeInsuranceContent: "#life-insurance-content",            //寿险容器
            lifeInsuranceInnerContent: "#life-insurance-inner-content", //寿险内部容器
            searchIcon: "#search-icon",                                 //搜索框的放大镜
            samplePremium: ".sample-premium",
            samplePremiumMessage: ".sample-premium-message"    
            // insuranceCompanyNameSelected: ".insurance-company-name-selected" //被选中的公司
        },

        events: {
            "tap @ui.back": "clickBackHandler",
            "tap @ui.productInsureDuty": "clickProductInsureDutyHandler",
            "tap @ui.searchDefaultSort": "clickSearchDefaultSortHandler",
            "tap @ui.defaultSortLayoutFloat": "clickDefaultSortLayoutFloatHandler",
            "tap @ui.searchText": "clickSearchTextHandler",
            "tap @ui.searchAdvancedScreening": "clickSearchAdvancedScreeningHandler",
            "tap @ui.searchInsuranceCompany": "clickSearchInsuranceCompanyHandler",
            "tap @ui.searchIcon": "clickSearchIconHandler",
            "tap @ui.insuranceCompanyFloat": "clickInsuranceCompanyFloatHandler",
            "tap @ui.lifeInsuranceContent": "clickLifeInsuranceContentHandler",
            "tap @ui.topRitleRight": "clickTopRitleRightHandler",
            "tap @ui.samplePremium":"clickSampleHandler", //点击示例保费
        },

        //点击右上角浏览记录
        clickTopRitleRightHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            if(utils.clickLock()){
                return;
            }
            var self = this;
            if(self.mouseLock)return;
            self.mouseLock = true;
            setTimeout(function(){
                self.mouseLock = false;
            },300);
            app.navigate("home/browseRecords", {replace: true, trigger: true});
        },
        //点击示例保费的例子
        clickSampleHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            if(utils.clickLock()){
                return;
            }
            var self = this;
            if(self.mouseLock)return;
            self.mouseLock = true;
            setTimeout(function(){
                self.mouseLock = false;
            },300);
            var $target = $(e.target);
            $target.parent().find(".sample-premium-message").toggle();
            // this.ui.samplePremiumMessage.hide();
            // console.log("点击示例保费");
        },
        //点击寿险容器
        clickLifeInsuranceContentHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            if(utils.clickLock()){
                return;
            }
            var self = this;
            if(self.mouseLock)return;
            self.mouseLock = true;
            setTimeout(function(){
                self.mouseLock = false;
            },300);
            var $target = $(event.target);
            var lifeInsuranceCard = $target.parents(".life-insurance-card")[0];
            if(lifeInsuranceCard){
                var lifeInsuranceCardId = lifeInsuranceCard.getAttribute("data-id");
                lifeInsuranceCardId = lifeInsuranceCardId || "null";
                app.navigate("in/productDetails/"+ lifeInsuranceCardId, {replace: true, trigger: true});
            }

        },
        //点击保险公司浮层
        clickInsuranceCompanyFloatHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            if(utils.clickLock()){
                return;
            }
            var self = this;
            if(self.mouseLock)return;
            self.mouseLock = true;
            setTimeout(function(){
                self.mouseLock = false;
            },300);
            var target = event.target;
            if(target.getAttribute("class") == "insurance-company-name button"){

                self.ui.insuranceCompanyContent.find(".insurance-company-name-selected").attr("class", "insurance-company-name button");
                target.setAttribute("class", "insurance-company-name button insurance-company-name-selected");
                utils.companyId = target.getAttribute("data-id");
                if(utils.companyId == "all"){
                    utils.lifeInsuranceOptions.companyIds = utils.advancedCompanyId;
                }else{
                    utils.lifeInsuranceOptions.companyIds = [];
                    utils.lifeInsuranceOptions.companyIds[0] = -1;
                    utils.companyId = parseInt(utils.companyId);
                    if(utils.advancedCompanyId.length == 0){
                        utils.lifeInsuranceOptions.companyIds[0] = utils.companyId;
                    }
                    for(var i=0; i<utils.advancedCompanyId.length; i++){
                        if(utils.companyId == utils.advancedCompanyId){
                            utils.lifeInsuranceOptions.companyIds[0] = utils.companyId;
                            break;
                        }
                    }
                }
                self.loadData();
                self.ui.insuranceCompanyFloat.hide();
                // console.log("lllll");
            } else if(event.target.getAttribute("id") == "insurance-company-float"){
                self.ui.insuranceCompanyFloat.hide();
            }
        },

        //点击搜索框的放大镜
        clickSearchIconHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            if(utils.clickLock()){
                return;
            }
            var self = this;
            if(self.mouseLock)return;
            self.mouseLock = true;
            setTimeout(function(){
                self.mouseLock = false;
            },300);
            var searchWords = self.ui.searchText.attr("value");
            // if(searchWords)
            // utils.lifeInsuranceOptions.searchWords = self.ui.searchText.attr("value") || self.ui.searchText.attr("placeholder") || "";
            utils.lifeInsuranceOptions.searchWords = searchWords ? searchWords : self.actualSearchWords || "";
            utils.toSearchText = searchWords;
            // self.ui.searchText.attr("value", "");
            utils.advanceSaleTypeIds = [];
            utils.advanceRightIds = [];
            utils.companyId = "all";
            utils.advancedCompanyId = [];
            utils.preSortOption = null;
            utils.lifeInsuranceOptions.examPremOrder = null;
            utils.lifeInsuranceOptions.saleTypeIds = []
            utils.lifeInsuranceOptions.rightIds  = []
            utils.lifeInsuranceOptions.companyIds = [],  //选填，种类ID，来自高级过滤接口的返回值
            utils.lifeInsuranceOptions.sortOption = null;

            //是否为关键字查询;
            utils.isKeyWordSearch = true;


            self.loadData();

        },


        //点击保险公司
        clickSearchInsuranceCompanyHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            if(utils.clickLock()){
                return;
            }
            var self = this;
            if(self.mouseLock)return;
            self.mouseLock = true;
            setTimeout(function(){
                self.mouseLock = false;
            },300);
            self.ui.insuranceCompanyFloat.show();
            if(utils.isInitCompany){
                if(self.companys.length == 0){
                    LoadingCircle && LoadingCircle.start();
                    lifeInsuranceModel.getCompanies(function(data){
                        console.log(data);
                        if(data.status == "0"){
                            self.companys = data.company;
                            var insuranceCompanyNameHtml = '<div class="insurance-company-name button insurance-company-name-selected" data-id="all">全部</div>';
                            for(var i=0; self.companys&&i<self.companys.length; i++){
                                insuranceCompanyNameHtml += '<div class="insurance-company-name button" data-id="'+self.companys[i].listId+'">'+ self.companys[i].abbrName +'</div>';
                            }

                            self.ui.insuranceCompanyInnerContent.html(insuranceCompanyNameHtml);
                        } else {
                            console.log("数据返回错误", data.errorMessages)
                        }
                        LoadingCircle && LoadingCircle.end();
                    }, function(error){
                        LoadingCircle && LoadingCircle.end();
                        console.log("数据查询失败", error);
                    });
                }
                else{
                    var insuranceCompanyNameHtml = '<div class="insurance-company-name button  insurance-company-name-selected" data-id="all">全部</div>';
                    for(var i=0; self.companys&&i<self.companys.length; i++){
                        insuranceCompanyNameHtml += '<div class="insurance-company-name button" data-id="'+self.companys[i].listId+'">'+ self.companys[i].abbrName +'</div>';
                    }
                    self.ui.insuranceCompanyInnerContent.html(insuranceCompanyNameHtml);
                }
                //是否初始化保险公司
                utils.isInitCompany = false;
            }
        },

        // 点击高级筛选
        clickSearchAdvancedScreeningHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            if(utils.clickLock()){
                return;
            }
            var self = this;
            if(self.mouseLock)return;
            self.mouseLock = true;
            setTimeout(function(){
                self.mouseLock = false;
            },300);
            app.navigate("in/advanceQuery", {replace: true, trigger: true});
        },

        // 点击输入框
        clickSearchTextHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            if(utils.clickLock()){
                return;
            }
            var self = this;
            if(self.mouseLock)return;
            self.mouseLock = true;
            setTimeout(function(){
                self.mouseLock = false;
            },300);
            app.navigate("in/search", {replace: true, trigger: true});
        },

        // 点击返回
        clickBackHandler: function (event) {
            event.stopPropagation();
            event.preventDefault();
            if(utils.clickLock()){
                return;
            }
            var self = this;
            if(self.mouseLock)return;
            self.mouseLock = true;
            setTimeout(function(){
                self.mouseLock = false;
            },300);
            //进入寿险列表查询也是否需要重新加载数据
            utils.isLifeInsuranceRefresh = true;
            //是否初始化查询条件
            utils.isInitOption = true;

            //返回
            if(!utils.toFinish()){
                app.goBack();
            }
        },

        // 点击保险责任
        clickProductInsureDutyHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            if(utils.clickLock()){
                return;
            }
            var self = this;
            if(self.mouseLock)return;
            self.mouseLock = true;
            setTimeout(function(){
                self.mouseLock = false;
            },300);

            var target = event.target;
            var $target = $(target);
            var parent = null;
            if($target.hasClass("pull-icon-small")){
                parent = $target.parent();
                parent.toggleClass("on-small");
                //$target.css({"background-image":})
            }
            if($target.hasClass("pull-icon-big")){
                parent = $target.parent();
                parent.toggleClass("on-big");
            }
            if(parent){
                parent.next().slideToggle(function(){
                    if(event.pageY > 1000 && parent.next().css("display") == "block"){
                        self.isCanLoad = false;
                        self.ui.lifeInsuranceContent.animate({
                            scrollTop: self.ui.lifeInsuranceContent.scrollTop() + 350
                        }, 600, function(){
                            // console.log("xxx");
                            setTimeout(function(){
                                self.isCanLoad = true;
                            }, 100);
                        });

                    }
                });
            }
        },

        clickSearchDefaultSortHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            if(utils.clickLock()){
                return;
            }
            var self = this;
            if(self.mouseLock)return;
            self.mouseLock = true;
            setTimeout(function(){
                self.mouseLock = false;
            },300);
            this.ui.defaultSortLayoutFloat.show();

        },

        clickDefaultSortLayoutFloatHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            // if(utils.clickLock()){
            //     return;
            // }
            var self = this;
            if(self.mouseLock)return;
            self.mouseLock = true;
            setTimeout(function(){
                self.mouseLock = false;
            },300);

            //self.ui.defaultSortLayoutFloat.hidden();

            var target = event.target;
            var $target = $(target);
            if($target.attr("class") == "default-sort-item button"){
                self.ui.defaultSortLayoutFloat.find(".default-sort-item-selected").attr("class", "default-sort-item button");
                $target.attr("class","default-sort-item button default-sort-item-selected");

                if(target.innerHTML == "推荐排序" || target.innerHTML == "默认排序"){
                    utils.lifeInsuranceOptions.sortOption = 1;
                    utils.preSortOption = 1;
                }
                if(target.innerHTML == "浏览量"){
                    utils.lifeInsuranceOptions.sortOption = 2;
                    utils.preSortOption = 2;
                }
                if(target.innerHTML == "上架时间"){
                    utils.lifeInsuranceOptions.sortOption = 3;
                    utils.preSortOption = 3;
                }
                self.ui.searchDefaultSort.find(".screening-condition-name").html(target.innerHTML);
                self.loadData();      
            }
            self.ui.defaultSortLayoutFloat.hide();
        },

        /**初始化**/
        initialize : function(){
            console.log("2016.9.28 18:00");
        },


        //在开始渲染模板前执行，此时当前page没有添加到document
        onBeforeRender : function(){

        },
        //渲染完模板后执行,此时当前page没有添加到document
        onRender : function(){
            // console.log("onRender...");
            // var options = {

            // };
            var self = this;
//            self.ui.topRitleRight.css({"background-image":"url(images/history.png)","background-repeat":"no-repeat"});
            self.ui.topRitleRight.css({"background":'url("images/history.png") no-repeat center'});
            self._scrolling = self.scrolling.bind(self);
            var insuranceCompanyContentWidth = $(window).width() - 28;
            var insuranceCompanyInnerContentWidth = insuranceCompanyContentWidth - insuranceCompanyContentWidth%175;
            self.ui.insuranceCompanyInnerContent.css("width", insuranceCompanyInnerContentWidth+"px");
            // console.log($(window).width() - 28);
            // myCustomerModel.queryAgentCustomers(options, function(data){
            //     console.log(data);
            // }, function(error){
            //     console.log(error);
            // });
        },


        // 根据条件查找并加载数据
        loadData: function(isAdd){
            var self = this;
            if(self.isLoading){      //如果已经正在加载则返回
                return;         
            }
            self.isLoading = true;

            if(!isAdd){         //如果不是追加查询，则重置查询位置
                self.pageIndex = 0;
                utils.lifeInsuranceOptions.startPos = 0;
                self.dataFinish = false;//update by guYY 10/10 11:15
            }
            //数据加载完毕 停止加载 update by guYY 10/10 11:15
            if(self.dataFinish){
                self.isLoading = false;
                return;
            }
            console.log(utils.lifeInsuranceOptions);
            LoadingCircle && LoadingCircle.start();
            lifeInsuranceModel.getLifeInsuranceCard(utils.lifeInsuranceOptions, function(data){
                console.log(data);
                var lifeInsuranceContentHtml = "";
                if(data.status == "0"){  
                    var salesPackages = data.salesPackages;
                    if(data.defaultSearchWords){
                        //todo 阿里云 guyy
                        self.ui.searchText.attr("placeholder", data.defaultSearchWords.hotKeyWords);
                        // console.log("")
                        self.ui.searchText.attr("value", utils.toSearchText);
                        self.actualSearchWords = data.defaultSearchWords.actualSearchWords;
                    }

                    for(var i=0; salesPackages&&i<salesPackages.length; i++){
                        lifeInsuranceContentHtml += '<div class="life-insurance-card" data-id="'+ salesPackages[i].packageId +'">' +
                                                        '<div class="life-insurance-name">';
                        var lifeInsuranceFlagHtml = "";
                        for(var j=0; salesPackages[i].labels&&j<salesPackages[i].labels.length; j++){
                            //推荐
                            if(salesPackages[i].labels[j].listId == 1){
                                lifeInsuranceFlagHtml += '<div class="life-insurance-flag life-insurance-label-1"></div>';
                            }

                            //热销
                            if(salesPackages[i].labels[j].listId == 2){
                                lifeInsuranceFlagHtml += '<div class="life-insurance-flag life-insurance-label-2"></div>';
                            }
                        }
                        // 最新
                        if(salesPackages[i].isNew){
                            lifeInsuranceFlagHtml += '<div class="life-insurance-flag life-insurance-label-3"></div>';
                        }
                        lifeInsuranceContentHtml += lifeInsuranceFlagHtml;
                        lifeInsuranceContentHtml += '<div class="life-insurance-name-title">'+ salesPackages[i].packageName +'</div>'+
                                                    '</div>';
                        if(salesPackages[i].examPrem){
                            lifeInsuranceContentHtml += '<div class="life-insurance-label">'+
                                                            '<div class="life-insurance-label-name">示例保费：</div>'+
                                                            // '<div class="life-insurance-label-message">'+ salesPackages[i].examPrem +'</div>'+
                                                            '<div class="life-insurance-label-message">'+ salesPackages[i].examPrem + '元'+
                                                                '<img class="sample-premium button" src="./images/tip.png"/>'+
                                                                '<div class="sample-premium-message"><img class="sample-tip-icon" src="./images/tipIcon.png">30岁，男性，20年交，保额10万的示例保费</div>'+
            
                                                            '</div>'+
                                                        '</div>';
                        }
                        var minAgeUnitStr = "";
                        if(salesPackages[i].minAgeUnit == 1){
                            minAgeUnitStr = "周岁";
                        }else if(salesPackages[i].minAgeUnit == 5){
                            minAgeUnitStr = "天";
                        }
                        var maxAgeUnitStr = "";
                         if(salesPackages[i].maxAgeUnit == 1){
                            maxAgeUnitStr = "周岁";
                        }else if(salesPackages[i].maxAgeUnit == 5){
                            maxAgeUnitStr = "天";
                        }

                        lifeInsuranceContentHtml += '<div class="life-insurance-label">'+
                                                        '<div class="life-insurance-label-name">年龄：</div>'+
                                                        '<div class="life-insurance-label-message">'+ salesPackages[i].minAge+ minAgeUnitStr+'-'+salesPackages[i].maxAge+maxAgeUnitStr+'</div>'+
                                                    '</div>';
                        var lifeInsuranceLabelMessageHtml = "";
                        for(var v=0; salesPackages[i].coveragePeriods&&v<salesPackages[i].coveragePeriods.length; v++){

                            if(v){
                                lifeInsuranceLabelMessageHtml += "、";
                            }else{
                                lifeInsuranceLabelMessageHtml += "";        //取消以 至 开头  使用 为 代替
                            }
                            if(salesPackages[i].coveragePeriods[v].periodType == 1){
                                lifeInsuranceLabelMessageHtml += "终身";
                            }
                            if(salesPackages[i].coveragePeriods[v].periodType == 2){
                                lifeInsuranceLabelMessageHtml += salesPackages[i].coveragePeriods[v].periodValue + "年";
                            }
                            if(salesPackages[i].coveragePeriods[v].periodType == 3){
                                lifeInsuranceLabelMessageHtml += "至" + salesPackages[i].coveragePeriods[v].periodValue + "周岁";
                            }
                            if(salesPackages[i].coveragePeriods[v].periodType == 4){
                                lifeInsuranceLabelMessageHtml += salesPackages[i].coveragePeriods[v].periodValue + "月";
                            }
                            if(salesPackages[i].coveragePeriods[v].periodType == 5){
                                lifeInsuranceLabelMessageHtml += salesPackages[i].coveragePeriods[v].periodValue + "天";
                            }
                        }

                        if(!lifeInsuranceLabelMessageHtml){
                            lifeInsuranceLabelMessageHtml = "未知";
                        }
                        lifeInsuranceContentHtml += '<div class="life-insurance-label">'+
                                                        '<div class="life-insurance-label-name">保障期限：</div>'+
                                                        '<div class="life-insurance-label-message">'+lifeInsuranceLabelMessageHtml+'</div>'+
                                                    '</div>';

                        lifeInsuranceContentHtml += '<div class="life-insurance-equity-label">';
                        var equityLabelHtml = "";
                        var equityLabelWidth = (self.$el.width() - 100)/3;
                        for(var t=0; salesPackages[i].rights&&t<salesPackages[i].rights.length; t++){
                            var currentEquityLabelWidth = salesPackages[i].rights[t].rightName.length * 26 + 55;
                            var n = Math.ceil(currentEquityLabelWidth / equityLabelWidth);
                                n = n > 3 ? 3 : n;
                                n = n * 33.3333333333333;
                            equityLabelHtml += '<div class="equity-label" style="width: '+ n +'%;">'+
                                                    '<div class="equity-label-select"></div>'+
                                                    '<div class="equity-label-name">'+salesPackages[i].rights[t].rightName+'</div>'+
                                                '</div>';
                        }
                        lifeInsuranceContentHtml += equityLabelHtml;                                
                        lifeInsuranceContentHtml += '</div>'+
                                                    '<div class="life-insurance-look-pv">'+
                                                        '<div class="insurance-product-card-look-pv">'+
                                                            '<div class="insurance-product-card-pv">'+ salesPackages[i].visitNum +'</div>'+
                                                            '<div class="insurance-product-card-eye"></div>'+
                                                        '</div>'+
                                                    '</div>';
                        lifeInsuranceContentHtml += '<div class="product-insure-duty">'+
                                                        '<div class="insure-duty-title">'+
                                                            '<span>主要保险责任</span>'+        
                                                            '<span class="pull-icon-big button"></span>'+
                                                        '</div>'+
                                                        '<div class="insure-duty-content">';
                        var insureDutyItemHtml = "";
                        for(var k=0; salesPackages[i].liabilities&&k<salesPackages[i].liabilities.length; k++){
                            insureDutyItemHtml += '<div class="insure-duty-item">'+
                                                    '<div class="duty-item-title">'+
                                                        '<span class="duty-item-title-span">'+salesPackages[i].liabilities[k].liabDesc+'</span>'+
                                                        '<span class="pull-icon-small button"></span>'+
                                                    '</div>'+
                                                    '<div class="duty-item-content">'+salesPackages[i].liabilities[k].liabDescProd+'</div>'+
                                                  '</div>';
                        }
                        lifeInsuranceContentHtml += insureDutyItemHtml;

                            lifeInsuranceContentHtml += '</div>';
                        lifeInsuranceContentHtml += '</div>';

                
            
                        lifeInsuranceContentHtml += '</div>'; 
                    }

                    // if((!salesPackages) || (salesPackages.length == 0) && (!isAdd)){
                    //    lifeInsuranceContentHtml = '<div id="browse-records-noting">没有找到您想找的产品</div>';
                    // }



                    //下一次要加载的页数
                    if(salesPackages && salesPackages.length){     //如果本页加载到了数据，则默认还有下一页
                        //如果大于等于每页个数，表示还有下一页 update by guYY 10/10 15:46
                        if(salesPackages.length >= self.pageSize) {
                            self.pageIndex++;
                        }else{
                            self.dataFinish = true; //否则表示加载结束 update by guYY 10/10 15:46
                        }
                        self.isLoading = false;

                    }else{                                         //本页没有加载到数据
                        self.dataFinish = true;   // 数据为NULL表示加载结束 update by guYY 10/10 15:46
                        if(isAdd){
                            // MsgBox.alert("没有更多产品了", "", function(){
                                self.isLoading = false;
                            // });
                            lifeInsuranceContentHtml = "";
                        }else{
                            self.isLoading = false;
                            lifeInsuranceContentHtml = '<div id="browse-records-noting">没有找到您想找的产品</div>';
                        }
                        // lifeInsuranceContentHtml = isAdd ? "" : '<div id="browse-records-noting">没有找到您想找的产品</div>';
                    }
                    utils.lifeInsuranceOptions.startPos = self.pageSize * self.pageIndex;
                    if(isAdd){      //如果是追加的数据则append到容器内
                        
                        console.log("追加数据。。。....");
                        self.ui.lifeInsuranceInnerContent.append(lifeInsuranceContentHtml);

                        self.ui.lifeInsuranceContent.animate({
                            scrollTop: self.ui.lifeInsuranceContent.scrollTop() + 200
                        }, 600);
                        // self.isLoading = false;
                    }else{          //否则重置容器内的数据
                        console.log("重置数据");
                        self.ui.lifeInsuranceContent.get(0).scrollTop = 0;
                        self.ui.lifeInsuranceInnerContent.html(lifeInsuranceContentHtml);
                        // self.isLoading = false;
                    }

                    
                    //当前能滑到的最大距离
                    self.maxScrollTop = self.ui.lifeInsuranceInnerContent.get(0).offsetHeight - self.ui.lifeInsuranceContent.get(0).offsetHeight;
                } else{
                    // self.ui.lifeInsuranceInnerContent = 0;
                    lifeInsuranceContentHtml = '<div id="browse-records-noting">没有找到您想找的产品</div>';
                    self.ui.lifeInsuranceInnerContent.html(lifeInsuranceContentHtml);
                    setTimeout(function(){
                        MsgBox.alert("数据获取失败", "", function(){
                            self.isLoading = false;
                        });
                    }, 350);
                    self.maxScrollTop = 0;
                    console.log("数据返回错误", data.errorMessages);
                }
                // self.isLoading = false;
                if(utils.isKeyWordSearch){   //如果是关键字搜出来的，需重置查询条件的UI状态
                    utils.isKeyWordSearch = false;
                    self.ui.searchDefaultSort.find(".screening-condition-name").html("默认排序");
                    self.ui.defaultSortContent.find(".default-sort-item-selected").attr("class", "default-sort-item");
                    self.ui.defaultSortContent.children()[0].setAttribute("class", "default-sort-item default-sort-item-selected");

                    utils.isInitCompany = true;
                }
                LoadingCircle && LoadingCircle.end();
            }, function(error){
                // self.ui.lifeInsuranceInnerContent = 0;
                lifeInsuranceContentHtml = '<div id="browse-records-noting">没有找到您想找的产品</div>';
                self.ui.lifeInsuranceInnerContent.html(lifeInsuranceContentHtml);
                setTimeout(function(){
                    MsgBox.alert("数据获取失败", "", function(){
                        self.isLoading = false;
                    });
                }, 350);
                self.maxScrollTop = 0;
                LoadingCircle && LoadingCircle.end();
                // console.log("数据查询失败", error);
                // self.isLoading = false;
                if(utils.isKeyWordSearch){   //如果是关键字搜出来的，需重置查询条件的UI状态
                    utils.isKeyWordSearch = false;
                    self.ui.searchDefaultSort.find(".screening-condition-name").html("默认排序");
                    self.ui.defaultSortContent.find(".default-sort-item-selected").attr("class", "default-sort-item");
                    self.ui.defaultSortContent.children()[0].setAttribute("class", "default-sort-item default-sort-item-selected");

                    utils.isInitCompany = true;
                }
            });
        },

        show: function(){
            // LoadingCircle && LoadingCircle.start();
            var self = this;
            if(device.ios()){
                self.ui.topTitle.css("padding-top",utils.toolHeight+"px");
                self.ui.lifeInsuranceContent.css({"height": "-webkit-calc(100% - "+(255+utils.toolHeight)+"px)","height": "calc(100% - "+(255+utils.toolHeight)+"px)"});
            }
            if(utils.searchText){

            }
            //TODO
            if(utils.isLifeInsuranceRefresh){
                if(utils.isInitOption){

                    self.pageIndex = 0;
                    self.startPos = 0;

                    utils.lifeInsuranceOptions.encryptedUserData = utils.userObj.id;
                    utils.lifeInsuranceOptions.searchWords = "";
                    utils.lifeInsuranceOptions.saleTypeIds = [];  //选填，种类ID，来自高级过滤接口的返回值
                    utils.lifeInsuranceOptions.examPremOrder = null;    //选填，示例保费排序方式。asc:升序，desc: 降序
                    utils.lifeInsuranceOptions.rightIds = [];       //选填，权益ID，来自高级过滤接口的返回值
                    utils.lifeInsuranceOptions.companyIds = []; //选填，公司ID，来自高级过滤接口的返回值
                    utils.lifeInsuranceOptions.sortOption = 1;     //选填，排序选项。2：按浏览量排序，3：按上架时间排序
                    utils.lifeInsuranceOptions.startPos = self.pageSize * self.pageIndex;      //查询起始位置
                    utils.lifeInsuranceOptions.pageSize = self.pageSize;      //每页查询多少条
                    utils.preSortOption = 1;
                    utils.advanceSaleTypeIds = [];
                    utils.advanceRightIds = [];
                    utils.advancedCompanyId = [];

                    console.log("initOption");
                }
                console.log("reloadData");
                self.loadData();

            }
            utils.isLifeInsuranceRefresh = false;
            utils.isInitOption = false;

            // if(utils.isKeyWordSearch){
            //     utils.isKeyWordSearch = false;
            //     self.ui.searchDefaultSort.find(".screening-condition-name").html("默认排序");
            //     self.ui.defaultSortContent.find(".default-sort-item-selected").attr("class", "default-sort-item");
            //     self.ui.defaultSortContent.children()[0].setAttribute("class", "default-sort-item default-sort-item-selected");
            //     self.ui.insuranceCompanyContent.find(".insurance-company-name-selected").attr("class", "insurance-company-name");
            //     self.ui.insuranceCompanyContent.children()[0].setAttribute("class", "insurance-company-name insurance-company-name-selected");               
            // }
// console.log();
        },

        scrolling: function(event){
            // console.log(event.target.offsetHeight, event.target.scrollTop, event.target.children[0].offsetHeight);
            // console.log("kjlaskjdl");
            var self = this;
            if(!self.isCanLoad){
                return;
            }
            if(self.preScrollTop && (event.target.scrollTop - self.preScrollTop > 0)){
                // self.preScrollTop
                // console.log("上滑，加载", event.target.scrollTop - self.preScrollTop);
                if((event.target.scrollTop + 100) > self.maxScrollTop){
                    // console.log("加载，加载，加载！！！");
                    self.loadData(true);
                }
            }else{
//                console.log("下滑，不加载", event.target.scrollTop - self.preScrollTop);
            }
            self.preScrollTop = event.target.scrollTop;

        },

        //页间动画已经完成，当前page已经加入到document
        pageIn : function(){
            // utils.toLogin();
            var self = this;
//            alert(self.$el.height()+","+self.ui.lifeInsuranceContent.height());//todo 周一看一下 安卓VIVO手机无法滚动的问题
            app.on("insurance:exit", this._goBackHandler,this);
            self.ui.lifeInsuranceContent.scroll(self._scrolling);
        },
        _goBackHandler: function(){
            //退出H5 add by guYY 9.20 13:25
            if(!utils.toFinish()){
                app.goBack();
            }
        },
        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            app.off("insurance:exit", this._goBackHandler,this);
        },

        //当页面销毁时触发
        onDestroy : function(){
//            console.log("footer destroy");
        }
    });
});