/**
 * 产品高级筛选页
 * add by guYY 2016/8/25
 */
define([
    'common/base/base_view',
    'text!module/search/templates/advanceQuery.html',
    'module/search/model/searchModel'
],function(BaseView, queryTpl, searchModel){
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
                self.initProductList(data.salesTypeInfo);
                self.initRightsInfoList(data.rightsInfo);
                self.initCompanyList(data.companyVo);
            }, function(){

            })
        },

        initProductList : function(list){
            var self = this;
            var i, len = list.length, html = '<div class="type-item type-all type-item-ck">全部</div>';
            self.ui.productList.find('.list-item').remove();
            for(i=0; i < len; i++){
                var obj = list[i];
                html += '<div class="type-item list-item" data-id='+obj.listId+'>'+ obj.typeName +'</div>'
            }
            self.ui.productList.append(html);
        },

        initRightsInfoList : function(list){
            var self = this;
            var i, len = list.length, html = '<div class="type-item type-all type-item-ck">全部</div>';
            self.ui.rightsInfoList.find('.list-item').remove();
            for(i=0; i < len; i++){
                var obj = list[i];
                html += '<div class="type-item list-item" data-id='+obj.rightId+'>'+ obj.rightName +'</div>'
            }
            self.ui.rightsInfoList.append(html);
        },

        initCompanyList : function(list){
            var self = this;
            var i, len = list.length,html = '';
            if(utils.companyId == "all"){
                html = '<div class="type-item type-all type-item-ck">全部</div>';
                for(i=0; i < len; i++){
                    var obj = list[i];
                    html += '<div class="type-item list-item" data-id='+obj.listId+'>'+ obj.abbrName +'</div>';
                }
                utils.advancedCompanyId = [];
            }else{
                html = '<div class="type-item type-all">全部</div>';
                for(i=0; i < len; i++){
                    var obj = list[i];
                    if(utils.companyId == obj.listId){
                        // utils.advancedCompanyId = [];
                        // utils.advancedCompanyId[0] = utils.companyId;
                        html += '<div class="type-item list-item type-item-ck" data-id='+obj.listId+'>'+ obj.abbrName +'</div>';
                    }else{
                        html += '<div class="type-item list-item" data-id='+obj.listId+'>'+ obj.abbrName +'</div>';
                    }
                }
            }
            self.ui.companyList.find('.list-item').remove();
            // for(i=0; i < len; i++){
            //     var obj = list[i];
            //     html += '<div class="type-item list-item" data-id='+obj.listId+'>'+ obj.abbrName +'</div>'
            // }
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
            //权益ID
            utils.lifeInsuranceOptions.rightIds = infoLists;
            //公司ID
            utils.lifeInsuranceOptions.companyIds = companyLists;
            console.log(companyLists);
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