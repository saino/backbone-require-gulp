define([
    'common/base/base_view',
    'marionette',
    'text!module/lifeInsurance/templates/lifeInsurance.html',
    'msgbox',
    'module/lifeInsurance/model/lifeInsurance'
    // 'module/myCustomer/model/myCustomer'
], function(BaseView, mn, tpl, MsgBox, lifeInsuranceModel, myCustomerModel) {
    return BaseView.extend({
        id: "lifeInsurancePage",
        template: _.template(tpl),
        forever: true,
        actualSearchWords: "", //搜索框对应搜索词
        companys: [],   //保险公司
        ui: {
            topTitle: "#top-title",
            back: "#top-title-left",
            topRitleRight: "#top-title-right",
            productInsureDuty: ".product-insure-duty",
            searchDefaultSort: "#search-default-sort",                  //默认排序
            defaultSortLayoutFloat: "#default-sort-layout-float",       //默认排序浮层

            insuranceCompanyFloat: "#insurance-company-float",        //保险公司浮层
            insuranceCompanyContent: "#insurance-company-content",      //保险公司容器
            // defaultSortContent: ".default-sort-content",
            searchText: "#search-text",                                 //搜索框
            searchAdvancedScreening: "#search-advanced-screening",      //高级筛选
            searchInsuranceCompany: "#search-insurance-company",        //保险公司
            lifeInsuranceContent: "#life-insurance-content",            //寿险容器
            searchIcon: "#search-icon",                                 //搜索框的放大镜
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
            "tap .sample":"clickSampleHandler" //点击示例保费
        },

        //点击右上角浏览记录
        clickTopRitleRightHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            app.navigate("home/browseRecords", {replace: true, trigger: true});
        },
        //点击示例保费的例子
        clickSampleHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            console.log("点击示例保费");
        },
        //点击寿险容器
        clickLifeInsuranceContentHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
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
            var self = this;
            var target = event.target;
            if(target.getAttribute("class") == "insurance-company-name"){

                self.ui.insuranceCompanyContent.find(".insurance-company-name-selected").attr("class", "insurance-company-name");
                target.setAttribute("class", "insurance-company-name insurance-company-name-selected");
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
            var self = this;
            // utils.lifeInsuranceOptions.searchWords = self.ui.searchText.attr("value") || self.ui.searchText.attr("placeholder") || "";
            utils.lifeInsuranceOptions.searchWords = self.actualSearchWords || "";
            self.loadData();

        },


        //点击保险公司
        clickSearchInsuranceCompanyHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            var self = this;
            self.ui.insuranceCompanyFloat.show();

            if(utils.isInitCompany){
                if(self.companys.length == 0){
                    lifeInsuranceModel.getCompanies(function(data){
                        console.log(data);
                        if(data.status == "0"){
                            self.companys = data.company;
                            var insuranceCompanyNameHtml = '<div class="insurance-company-name insurance-company-name-selected" data-id="all">全部</div>';
                            for(var i=0; self.companys&&i<self.companys.length; i++){
                                insuranceCompanyNameHtml += '<div class="insurance-company-name" data-id="'+self.companys[i].listId+'">'+ self.companys[i].abbrName +'</div>';
                            }

                            self.ui.insuranceCompanyContent.html(insuranceCompanyNameHtml);
                        } else {
                            console.log("数据返回错误", data.errorMessages)
                        }
                    }, function(error){
                        console.log("数据查询失败", error);
                    });
                }
                else{
                    var insuranceCompanyNameHtml = '<div class="insurance-company-name  insurance-company-name-selected" data-id="all">全部</div>';
                    for(var i=0; self.companys&&i<self.companys.length; i++){
                        insuranceCompanyNameHtml += '<div class="insurance-company-name" data-id="'+self.companys[i].listId+'">'+ self.companys[i].abbrName +'</div>';
                    }
                    self.ui.insuranceCompanyContent.html(insuranceCompanyNameHtml);
                }
                //是否初始化保险公司
                utils.isInitCompany = false;
            }
        },

        // 点击高级筛选
        clickSearchAdvancedScreeningHandler: function(event){
            event.stopPropagation();
            event.preventDefault();

            app.navigate("in/advanceQuery", {replace: true, trigger: true});
        },

        // 点击输入框
        clickSearchTextHandler: function(event){
            event.stopPropagation();
            event.preventDefault();

            app.navigate("in/search", {replace: true, trigger: true});
        },

        // 点击返回
        clickBackHandler: function (event) {
            event.stopPropagation();
            event.preventDefault();

            //进入寿险列表查询也是否需要重新加载数据
            utils.isLifeInsuranceRefresh = true;
            //是否初始化查询条件
            utils.isInitOption = true;

            if(window.kbFinish){
                window.kbFinish.toFinish();
            }else{
                app.goBack();
            }
            // app.goBack();
        },

        // 点击保险责任
        clickProductInsureDutyHandler: function(event){
            event.stopPropagation();
            event.preventDefault();

            var self = this;
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
                        self.ui.lifeInsuranceContent.animate({
                            scrollTop: self.ui.lifeInsuranceContent.scrollTop() + 350
                        }, 600);

                    }
                });
            }
        },

        clickSearchDefaultSortHandler: function(event){
            event.stopPropagation();
            event.preventDefault();

            this.ui.defaultSortLayoutFloat.show();

        },

        clickDefaultSortLayoutFloatHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            var self = this;

            //self.ui.defaultSortLayoutFloat.hidden();

            var target = event.target;
            var $target = $(target);
            if($target.attr("class") == "default-sort-item"){
                self.ui.defaultSortLayoutFloat.find(".default-sort-item-selected").attr("class", "default-sort-item");
                $target.attr("class","default-sort-item default-sort-item-selected");

                if(target.innerHTML == "推荐排序" || target.innerHTML == "默认排序"){
                    utils.lifeInsuranceOptions.sortOption = 1;
                }
                if(target.innerHTML == "浏览量"){
                    utils.lifeInsuranceOptions.sortOption = 2;
                }
                if(target.innerHTML == "上架时间"){
                    utils.lifeInsuranceOptions.sortOption = 3;
                }
                self.ui.searchDefaultSort.find(".screening-condition-name").html(target.innerHTML);
                self.loadData();      
            }
            self.ui.defaultSortLayoutFloat.hide();
        },

        /**初始化**/
        initialize : function(){
        },


        //在开始渲染模板前执行，此时当前page没有添加到document
        onBeforeRender : function(){

        },
        //渲染完模板后执行,此时当前page没有添加到document
        onRender : function(){
            // console.log("onRender...");
            var options = {

            };
            this.ui.topRitleRight.css("background-image","url(images/history.png)");
            // myCustomerModel.queryAgentCustomers(options, function(data){
            //     console.log(data);
            // }, function(error){
            //     console.log(error);
            // });
        },

        // 根据条件查找并加载数据
        loadData: function(){
            var self = this;
            console.log(utils.lifeInsuranceOptions);
            lifeInsuranceModel.getLifeInsuranceCard(utils.lifeInsuranceOptions, function(data){
                console.log(data);
                var lifeInsuranceContentHtml = "";
                if(data.status == "0"){  
                    var salesPackages = data.salesPackages;
                    if(data.defaultSearchWords){
                        // console.log('sssss');
                        self.ui.searchText.attr("placeholder", data.defaultSearchWords.hotKeyWords);
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
                        // if(salesPackages[i].examPrem){
                            // lifeInsuranceContentHtml += '<div class="life-insurance-label">'+
                            //                                 '<div class="life-insurance-label-name">示例保费：</div>'+
                            //                                 // '<div class="life-insurance-label-message">'+ salesPackages[i].examPrem +'</div>'+
                            //                                 '<div class="life-insurance-label-message">'+ "你好你好0099" +
                            //                                     '<img class="sample-premium" src="./images/tip.png"/>'+
                            //                                     '<div class="sample-premium-message">你好你好0099你好你好0099</div>'+
                            //                                 '</div>'+
                            //                             '</div>';
                        // }
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
                                lifeInsuranceLabelMessageHtml += "至";
                            }
                            if(salesPackages[i].coveragePeriods[v].periodType == 1){
                                lifeInsuranceLabelMessageHtml += "终身";
                            }
                            if(salesPackages[i].coveragePeriods[v].periodType == 2){
                                lifeInsuranceLabelMessageHtml += salesPackages[i].coveragePeriods[v].periodValue + "年";
                            }
                            if(salesPackages[i].coveragePeriods[v].periodType == 3){
                                lifeInsuranceLabelMessageHtml += salesPackages[i].coveragePeriods[v].periodValue + "周岁";
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
                                                        '<div class="life-insurance-label-name">保障期间：</div>'+
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
                                                            '<span>保险责任</span>'+        
                                                            '<span class="pull-icon-big"></span>'+
                                                        '</div>'+
                                                        '<div class="insure-duty-content">';
                        var insureDutyItemHtml = "";
                        for(var k=0; salesPackages[i].liabilities&&k<salesPackages[i].liabilities.length; k++){
                            insureDutyItemHtml += '<div class="insure-duty-item">'+
                                                    '<div class="duty-item-title">'+
                                                        '<span class="duty-item-title-span">'+salesPackages[i].liabilities[k].liabDesc+'</span>'+
                                                        '<span class="pull-icon-small"></span>'+
                                                    '</div>'+
                                                    '<div class="duty-item-content">'+salesPackages[i].liabilities[k].liabDescProd+'</div>'+
                                                  '</div>';
                        }
                        lifeInsuranceContentHtml += insureDutyItemHtml;

                            lifeInsuranceContentHtml += '</div>';
                        lifeInsuranceContentHtml += '</div>';

                
            
                        lifeInsuranceContentHtml += '</div>'; 
                    }

                    if(!salesPackages || salesPackages.length == 0){
                       lifeInsuranceContentHtml = '<div id="browse-records-noting">没有找到您想找的产品</div>';
                    }

                    self.ui.lifeInsuranceContent.html(lifeInsuranceContentHtml);
                } else{
                    lifeInsuranceContentHtml = '<div id="browse-records-noting">没有找到您想找的产品</div>';
                    self.ui.lifeInsuranceContent.html(lifeInsuranceContentHtml);
                    setTimeout(function(){
                        MsgBox.alert("数据获取失败");
                    }, 350);
                    console.log("数据返回错误", data.errorMessages);
                }
            }, function(error){
                lifeInsuranceContentHtml = '<div id="browse-records-noting">没有找到您想找的产品</div>';
                self.ui.lifeInsuranceContent.html(lifeInsuranceContentHtml);
                setTimeout(function(){
                    MsgBox.alert("数据获取失败");
                }, 350);
                console.log("数据查询失败", error);
            });
        },

        show: function(){
            var self = this;
            if(device.ios()){
                self.ui.topTitle.css("padding-top",utils.toolHeight+"px");
                self.ui.lifeInsuranceContent.css("height", "calc(100% - 255px - "+utils.toolHeight+"px)");
            }
            //TODO
            if(utils.isLifeInsuranceRefresh){
                if(utils.isInitOption){
                    utils.lifeInsuranceOptions.encryptedUserData = utils.userObj.id;
                    utils.lifeInsuranceOptions.searchWords = "";
                    utils.lifeInsuranceOptions.saleTypeIds = null;  //选填，种类ID，来自高级过滤接口的返回值
                    utils.lifeInsuranceOptions.examPremOrder = "desc";    //选填，示例保费排序方式。asc:升序，desc: 降序
                    utils.lifeInsuranceOptions.rightIds = null;       //选填，权益ID，来自高级过滤接口的返回值
                    utils.lifeInsuranceOptions.companyIds = null; //选填，公司ID，来自高级过滤接口的返回值
                    utils.lifeInsuranceOptions.sortOption = 1;     //选填，排序选项。2：按浏览量排序，3：按上架时间排序

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

        },
        //页间动画已经完成，当前page已经加入到document
        pageIn : function(){
            // utils.isInitOption = false;
            // utils.isLifeInsuranceRefresh = false;
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            //是否初始化保险公司
             // utils.isInitCompany = true;
        },

        //当页面销毁时触发
        onDestroy : function(){
//            console.log("footer destroy");
        }
    });
});