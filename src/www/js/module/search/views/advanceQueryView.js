/**
 * 产品高级筛选页
 * add by guYY 2016/8/25
 */
define([
    'common/base/base_view',
    'text!module/search/templates/advanceQuery.html',
    'module/search/model/searchModel',
    'msgbox'
],function(BaseView, queryTpl, searchModel, MsgBox){
    var AdvanceQueryView = BaseView.extend({
        id:"advance-query-container",
        template: _.template(queryTpl),
        ui:{
           "topCon":"#top-title",
           "advanceQueryContent":"#advanceQuery-main",
            productList : "#product-type-list",
            rightsInfoList : "#rightsInfo-list",
            companyList : "#company-list",
            btnReset : "#btnReset",
            btnConfirm : "#btnOk"
        },
        events:{
            "tap #top-title-left":"_clickBackHandler",
            "tap @ui.productList" : "onListClickHandler",
            "tap @ui.rightsInfoList" : "onListClickHandler",
            "tap @ui.companyList" : "onListClickHandler",
            "tap @ui.btnReset" : "onResetClickHandler",
            "tap @ui.btnConfirm" : "onConfirmClickHandler"
        },
        onRender:function(){
            var self = this;
            if(device.ios()){
                self.ui.topCon.css("padding-top",utils.toolHeight+"px");
                self.ui.advanceQueryContent.css("height","-webkit-calc(100% - "+(utils.toolHeight+85)+"px)");
            }

            searchModel.getAdvancedFilters(function(data){
                console.log(data);
                if(data.status == "0"){
                    self.initProductList(data.salesTypeInfo);
                    self.initRightsInfoList(data.rightsInfo);
                    self.initCompanyList(data.companyVo);
                }else{
                    setTimeout(function(){
                        MsgBox.alert("数据获取失败");
                    }, 350);
                }
            }, function(){
                setTimeout(function(){
                        MsgBox.alert("数据获取失败");
                }, 350);
            })
        },

        initProductList : function(list){
            var self = this;
            var i, len = list.length, html = '';
            if(utils.advanceSaleTypeIds.length == 0){
                html = '<div class="type-item type-all type-item-ck">全部</div>';
                self.ui.productList.find('.list-item').remove();
                for(i=0; i < len; i++){
                    var obj = list[i];
                    html += '<div class="type-item list-item" data-id='+obj.listId+'>'+ obj.typeName +'</div>'
                }
            }else{
                html = '<div class="type-item type-all">全部</div>';
                self.ui.productList.find('.list-item').remove();
                for(i=0; i < len; i++){
                    var obj = list[i];
                    for(var j=0; j<utils.advanceSaleTypeIds.length; j++){
                        if(obj.listId == utils.advanceSaleTypeIds[j]){
                            html += '<div class="type-item list-item type-item-ck" data-id='+obj.listId+'>'+ obj.typeName +'</div>';
                            break;
                        }
                    }
                    if(j == utils.advanceRightIds.length){
                        html += '<div class="type-item list-item" data-id='+obj.listId+'>'+ obj.typeName +'</div>';
                    }
                    // html += '<div class="type-item list-item" data-id='+obj.listId+'>'+ obj.typeName +'</div>'
                }
            }
            self.ui.productList.append(html);
        },

        initRightsInfoList : function(list){
            var self = this;
            var i, len = list.length, html = '';
            if(utils.advanceRightIds.length == 0){
                 html = '<div class="type-item type-all type-item-ck">全部</div>';
                self.ui.rightsInfoList.find('.list-item').remove();
                for(i=0; i < len; i++){
                    var obj = list[i];
                    html += '<div class="type-item list-item" data-id='+obj.rightId+'>'+ obj.rightName +'</div>'
                }
            } else{
                html = '<div class="type-item type-all">全部</div>';
                self.ui.rightsInfoList.find('.list-item').remove();
                for(i=0; i < len; i++){
                    var obj = list[i];
                    for(var j=0; j<utils.advanceRightIds.length; j++){
                        if(obj.rightId == utils.advanceRightIds[j]){
                            html += '<div class="type-item list-item type-item-ck" data-id='+obj.rightId+'>'+ obj.rightName +'</div>';
                            break;
                        }
                    }
                    if(j == utils.advanceRightIds.length){
                        html += '<div class="type-item list-item" data-id='+obj.rightId+'>'+ obj.rightName +'</div>';
                    }
                }
            }
           
            self.ui.rightsInfoList.append(html);
        },

        initCompanyList : function(list){
            var self = this;
            var i, len = list.length,html = '';
            if(utils.advancedCompanyId.length == 0){
                if(utils.companyId == "all"){
                    html = '<div class="type-item type-all type-item-ck">全部</div>';
                    for(i=0; i < len; i++){
                        var obj = list[i];
                        html += '<div class="type-item list-item" data-id='+obj.listId+'>'+ obj.abbrName +'</div>';
                    }
                }else{
                    html = '<div class="type-item type-all">全部</div>';
                    for(i=0; i < len; i++){
                        var obj = list[i];
                        if(utils.companyId == obj.listId){
                            html += '<div class="type-item list-item type-item-ck" data-id='+obj.listId+'>'+ obj.abbrName +'</div>';
                        }else{
                            html += '<div class="type-item list-item" data-id='+obj.listId+'>'+ obj.abbrName +'</div>';
                        }
                    }
                }
            }else{
                html = '<div class="type-item type-all">全部</div>';
                for(i=0; i<len; i++){
                    var obj = list[i];
                    for(var j=0; j<utils.advancedCompanyId.length; j++){
                        if(utils.advancedCompanyId[j] == obj.listId || utils.companyId == obj.listId){
                            html += '<div class="type-item list-item type-item-ck" data-id='+obj.listId+'>'+ obj.abbrName +'</div>';
                            break;
                        }
                    }
                    if(j == utils.advancedCompanyId.length){
                        html += '<div class="type-item list-item" data-id='+obj.listId+'>'+ obj.abbrName +'</div>';
                    }
                }
            }

            self.ui.companyList.find('.list-item').remove();

            self.ui.companyList.append(html);
        },

        pageIn:function(){
           
        },
        close: function(){
            //是否初始化保险公司
            utils.isInitCompany = true;
            utils.companyId = "all";
        },

        /**
         * 重置事件
         */
        onResetClickHandler : function(e){
            e.stopPropagation();
            e.preventDefault();

            var self = this;
            self.ui.productList.find(".type-all").addClass("type-item-ck");
            self.ui.productList.find(".list-item").removeClass("type-item-ck");
            self.ui.rightsInfoList.find(".type-all").addClass("type-item-ck");
            self.ui.rightsInfoList.find(".list-item").removeClass("type-item-ck");
            self.ui.companyList.find(".type-all").addClass("type-item-ck");
            self.ui.companyList.find(".list-item").removeClass("type-item-ck");
        },

        /**
         * 确认事件
         */
        onConfirmClickHandler : function(e){
            e.stopPropagation();
            e.preventDefault();

            var self = this;
            var productLists = [], infoLists = [], companyLists = [];
            productLists = self.getIdList(self.ui.productList);
            infoLists = self.getIdList(self.ui.rightsInfoList);
            companyLists = self.getIdList(self.ui.companyList);


            //种类ID
            utils.lifeInsuranceOptions.saleTypeIds = productLists;
            utils.advanceSaleTypeIds = productLists;
            //权益ID
            utils.lifeInsuranceOptions.rightIds = infoLists;
            utils.advanceRightIds = infoLists;
            //公司ID
            utils.lifeInsuranceOptions.companyIds = companyLists;
            // utils.advanceCompanyLists = companyLists;
            // console.log(companyLists);
            utils.advancedCompanyId = companyLists;
            //进入寿险列表查询也是否需要重新加载数据
            utils.isLifeInsuranceRefresh = true;
            //是否初始化查询条件
            utils.isInitOption = false;
            //是否初始化保险公司
            utils.isInitCompany = true;
            utils.companyId = "all";

            app.goBack();
            // console.log(productLists);
            // console.log(infoLists);
            // console.log(companyLists);
        },

        getIdList : function(parent){
            var list = parent.find(".type-item-ck");
            var res = [], i, len = list.length;
            for(i = 0; i < len; i++){
                var obj = list[i];
                var id = obj.getAttribute("data-id");
                if(id) res.push(parseInt(id));
            }
            return res;
        },

        /**
         * 筛选点击事件
         * @param e
         */
        onListClickHandler : function(e){
            e.stopPropagation();
            e.preventDefault();

            var target  = e.target;
            var $target = $(target);

            if(target.className.indexOf("type-item-ck")>=0 ){
                $target.removeClass("type-item-ck");
            }else{
                $target.addClass("type-item-ck");
                if(target.className.indexOf("type-all") >= 0){
                    $target.parent().find(".list-item").removeClass("type-item-ck");
                }else{
                    $target.parent().find(".type-all").removeClass("type-item-ck");
                }
            }
        },

        //点击返回
        _clickBackHandler:function(e){
            e.stopPropagation();
            e.preventDefault();

            //进入寿险列表查询也是否需要重新加载数据
            utils.isLifeInsuranceRefresh = false;
            //是否初始化查询条件
            utils.isInitOption = false;
            //是否初始化保险公司
            utils.isInitCompany = true;
            utils.companyId = "all";
            app.goBack();
        }
    });
    return AdvanceQueryView;
});