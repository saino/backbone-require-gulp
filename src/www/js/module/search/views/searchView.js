/**
 * 产品搜索页
 * add by guYY 2016/8/25
 */
define([
    'common/base/base_view',
    'text!module/search/templates/search.html',
    'module/search/model/searchModel'
],function(BaseView,searchTpl, searchModel){
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
            hotWordList : "#hot-word-list",
            historyList : "#history-list",
            btnClearHistory : "#clear-history",
            searchInput : ".search-key",
            btnSearch : ".search-btn",
            hotWordCon: "#hot-word-con" //热搜词
        },
        events:{
            "tap #top-title-left-2":"_clickBackHandler",
            "tap @ui.btnClearHistory" : "onClearHistoryHandler",
            "tap @ui.btnSearch" : "onBtnSearchHandler",
            "tap .history-item-del" : "onDeleteHistoryItemHandler",
            "tap @ui.hotWordCon": "clickHotWordConHandler"      //点击热搜词
        },

        onRender:function(){
            var self = this;
            if(device.ios()){
                self.ui.topCon.css("padding-top",utils.toolHeight+"px");
                self.ui.historyContent.css("height","-webkit-calc(100% - "+(utils.toolHeight+85)+"px)");
            }
            searchModel.getSearchHistoryAndHotKeywords(function(data){
                console.log(data)
                self.initHotWordsList(data.hotkeywordsList || []);
                self.initHistoryList(data.searchHistoryList || []);
                self.initDefaultSearchWord(data.defaultSearchWords)
            }, function(){

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
            self.ui.hotWordList.html(html);
        },

        initDefaultSearchWord : function(obj){
            var self = this;
            self.defaultSearchWordObj = obj;
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
            if(keywords == "" && self.defaultSearchWordObj){
                keywords = self.defaultSearchWordObj.actualSearchWords;
            }
            utils.lifeInsuranceOptions.searchWords = keywords || "";
            //进入寿险列表查询也是否需要重新加载数据
            utils.isLifeInsuranceRefresh = true;
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
            var target = $(e.currentTarget);
            var searchWords = target.parent().find(".history-item-name").html();
            if(searchWords){
                searchModel.clearSearchHistory(searchWords, function(){
                    target.parent().remove();
                }, function(){

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
            searchModel.clearSearchHistory("", function(){
                self.ui.historyList.html("");
            }, function(){

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