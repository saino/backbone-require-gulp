/**
 * 产品搜索页
 * add by guYY 2016/8/25
 */
define([
    'common/base/base_view',
    'text!module/search/templates/search.html',
    'module/search/model/searchModel',
    'msgbox',
    'common/views/circle'
],function(BaseView,searchTpl, searchModel, MsgBox, loadingCircle){
    var HistoryTpl = '<div class="history-item">' +
                            '<div class="history-item-name">{0}</div>' +
                             '<img class="history-item-del" src="images/delete2.png" alt="">' +
                    '</div>';

    var SearchView = BaseView.extend({
        id:"search-container",
        template: _.template(searchTpl),
        defaultSearchWordObj : null,


        ui:{
           "topCon":"#top-title",
           "historyContent":"#history-main",
            "hotWordList" : "#hot-word-list",         //热搜词容器
            "hotWordInnerList": "#hot-word-inner-list",     //热搜词内部容器
            "historyList" : "#history-list",

            "btnClearHistory" : "#clear-history",
            "searchInput" : ".search-key",
            "btnSearch" : ".search-btn",
            "hotWordCon": "#hot-word-con", //热搜词
            "historyCon": "#history-con" //历史记录容器
        },
        events:{
            "tap #top-title-left-2":"_clickBackHandler",
            "tap @ui.btnClearHistory" : "onClearHistoryHandler",
            "tap @ui.btnSearch" : "onBtnSearchHandler",
            "tap .history-item-del" : "onDeleteHistoryItemHandler",
            "tap @ui.hotWordCon": "clickHotWordConHandler",      //点击热搜词
            "tap .history-item-nsearchInputme": "onHistoryItemName",       //点击历史收拾记录词
            // "input @ui.searchInput": "onSearchInput"    //输入搜索词事件
        },
        // onSearchInput: function(event){
        //     event.stopPropagation();
        //     event.preventDefault();
        //     console.log(this.ui.searchInput[0].value);

        // },
        onRender:function(){
            var self = this;
            var hotWordListWidth = $(window).width() - 60;
            var hotWordInnerListWidth = hotWordListWidth - hotWordListWidth%205;
            self.ui.hotWordInnerList.css("width", hotWordInnerListWidth+"px");
            if(device.ios()){
                self.ui.topCon.css("padding-top",utils.toolHeight+"px");
                self.ui.historyContent.css("height","-webkit-calc(100% - "+(utils.toolHeight+85)+"px)");
            }
            LoadingCircle && LoadingCircle.start();
            searchModel.getSearchHistoryAndHotKeywords(function(data){
                console.log(data)
                if(data.status == "0"){
                    self.initHotWordsList(data.hotkeywordsList || []);
                    self.initHistoryList(data.searchHistoryList || []);
                    self.initDefaultSearchWord(data.defaultSearchWords)
                }else{
                    setTimeout(function(){
                        MsgBox.alert("数据获取失败");
                    }, 350);
                }
                LoadingCircle && LoadingCircle.end();
            }, function(){
                setTimeout(function(){
                        MsgBox.alert("数据获取失败");
                }, 350);
                LoadingCircle && LoadingCircle.end();
            })
        },

        //点击热搜词
        clickHotWordConHandler: function(event){
            event.stopPropagation();
            event.preventDefault();

            var sefl = this;

            if(event.target.getAttribute("class") == "hot-word-item"){
                utils.lifeInsuranceOptions.searchWords = event.target.innerHTML || "";
                //进入寿险列表查询也是否需要重新加载数据
                utils.isLifeInsuranceRefresh = true;

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
                //是否初始化查询条件
                utils.isInitOption = false;
                app.goBack();
            }

        },

        initHistoryList : function(list){
            var self = this;
            var i, len = list.length, html="";
            for(i = 0; i < len; i++){
                var obj = list[i];
                html += HistoryTpl.replace("{0}", obj.searchwords);
            }
            self.ui.historyList.html(html);
            if(len == 0){
                self.ui.historyCon.hide();
            }else{
                self.ui.historyCon.show();
            }
        },

        initHotWordsList : function(list){
            var self = this;
            var i, len = list.length, html="";

            list.sort(function(a, b){
                if(a.displayOrder >= b.displayOrder) return 1;
                return -1;
            });
            for(i = 0; i < len; i++){
                var obj = list[i];
                html += "<div class='hot-word-item'>"+obj.keyWords+"</div>";
            }
            self.ui.hotWordInnerList.html(html);
        },

        initDefaultSearchWord : function(obj){
            var self = this;
            self.defaultSearchWordObj = obj;
            if(utils.searchText){
                self.ui.searchInput.attr("value", utils.searchText);
            }
            //todo 阿里云 guyy
            self.ui.searchInput.attr("placeholder", obj.hotKeyWords);
            
        },

        pageIn:function(){
        },

        /**
         * 点击搜索按钮
         * @param e
         */
        onBtnSearchHandler : function(e){
            e.stopPropagation();
            e.preventDefault();

            var self = this;
            var keywords = self.ui.searchInput.val();
            utils.searchText = keywords;
            if(keywords == "" && self.defaultSearchWordObj){
                keywords = self.defaultSearchWordObj.actualSearchWords;
            }
            utils.lifeInsuranceOptions.searchWords = keywords || "";
            //进入寿险列表查询也是否需要重新加载数据
            utils.isLifeInsuranceRefresh = true;

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

            //是否初始化查询条件
            utils.isInitOption = false;
            app.goBack();
        },

        // 点击历史记录词
        onHistoryItemName: function(event){
            event.stopPropagation();
            event.preventDefault();
            var searchWords = event.target.innerHTML;

            utils.lifeInsuranceOptions.searchWords = searchWords;
            //进入寿险列表查询也是否需要重新加载数据
            utils.isLifeInsuranceRefresh = true;

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

            //是否初始化查询条件
            utils.isInitOption = false;
            app.goBack();
        },

        /**
         * 删除某一个搜索历史
         * @param e
         */
        onDeleteHistoryItemHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var target = $(e.currentTarget);
            var searchWords = target.parent().find(".history-item-name").html();
            if(searchWords){
                console.log(searchWords);
                LoadingCircle && LoadingCircle.start();
                searchModel.clearSearchHistory(searchWords, function(data){
                    console.log(data);
                    if(data.status == "0"){
                        target.parent().remove();
                        // var pparent = target.parent().parent();
                        if($.find("#history-list")[0].children.length == 0){
                            self.ui.historyCon.hide();
                        };
                    }else{
                        Msgbox.alert("删除失败");
                    }
                    LoadingCircle && LoadingCircle.end();
                }, function(){
                    Msgbox.alert("删除失败");
                    LoadingCircle && LoadingCircle.end();
                });
            }
         },

         /***
         * 清空搜索记录按钮事件
         */
        onClearHistoryHandler : function(e){
            e.stopPropagation();
            e.preventDefault();

            var self = this;
            LoadingCircle && LoadingCircle.start();
            searchModel.clearSearchHistory("", function(data){
                if(data.status == "0"){
                    self.ui.historyList.html("");
                    self.ui.historyCon.hide();
                }else{
                    Msgbox.alert("删除失败");
                }
                LoadingCircle && LoadingCircle.end();
            }, function(){
                Msgbox.alert("删除失败");
                LoadingCircle && LoadingCircle.end();
            });
        },

        //点击返回
        _clickBackHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            //进入寿险列表查询也是否需要重新加载数据
            utils.isLifeInsuranceRefresh = false;
            //是否初始化查询条件
            utils.isInitOption = false;

            app.goBack();
        }
    });
    return SearchView;
});