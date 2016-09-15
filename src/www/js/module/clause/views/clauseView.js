/**
 * Created by GYY on 2016/8/22.
 * 条款页面
 */
define([
    'common/base/base_view',
    'text!module/clause/templates/clause.html',
    'module/clause/model/clauseModel',
    'msgbox'
],function(BaseView, ClauseTpl, clauseModel, MsgBox){
    var ClauseView = BaseView.extend({
        template: _.template(ClauseTpl),
        id:"clause-container",
        pdfUrl: "",
        ui:{
            "topCon":"#top-title",
            "btnBack":"#top-title-left", //点击返回
            "termSearchText": "#term-search-text",  //搜索框
            "termTextClear": "#term-text-clear",  //搜索词删除
            "termSearchIcon": "#term-search-icon",  //搜索按钮
            "infoDiv" : "#clause-main",
            "topTitleRight": "#top-title-down"
        },
        events:{
            "tap #top-title-left":"_clickBackHandler",
            "input @ui.termSearchText": "inputTextHandler",
            "tap @ui.termTextClear": "clickTermTextClearHandler",
            "tap @ui.termSearchIcon": "clickTermSearchIconHandler",
            "tap @ui.topTitleRight": "clickTopTitleRightHandler"
        },
        clickTopTitleRightHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            var self = this;
            // window.open(utils.serverConfig.serverUrl+self.pdfUrl, "_blank", "Download");
            window.open("http://media.winbaoxian.com/static%2Fpdf%2Fhuaxia%2Fflm2016.pdf?ob=1", "_blank", "Download");
            // console.log("llll");
        },
        inputTextHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            if(this.ui.termSearchText[0].value){
                this.ui.termTextClear.show();
            }else{
                this.ui.termTextClear.hide();
            }
        },
        clickTermTextClearHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            this.ui.termSearchText[0].value = "";
            this.ui.termTextClear.hide();
        },
        clickTermSearchIconHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            var keyWord = this.ui.termSearchText[0].value;
            if(keyWord){
                console.log("搜索"+keyWord);
            }
            
        },
        initialize:function(){

        },
        onRender:function(){
            var self = this;
            if(device.ios()){
                self.ui.topCon.css("padding-top",utils.toolHeight+"px");
                self.ui.infoDiv.css("height","-webkit-calc(100% - "+(utils.toolHeight+85)+"px)");
            }

            var productId = self.getOption("productId");
            clauseModel.getTermInfo(productId, function(data){
                console.log(data);
                if(data.status == "0"){
                    self.initData(data);
                }else{
                    setTimeout(function(){
                        MsgBox.alert("数据获取失败");
                    }, 350);
                    
                }
                
            }, function(){
                setTimeout(function(){
                        MsgBox.alert("数据获取失败");
                    }, 350);
                self.initData({});
            })
        },

        initData : function(data){
            if(!data || !data.itemDesc){
                this.ui.infoDiv.html("");
                return;
            }
            this.pdfUrl = data.pdfUrl;
            this.ui.infoDiv.html(data.itemDesc);
        },


        pageIn:function(){},
        //点击返回
        _clickBackHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            app.goBack();
        },
        close:function(){

        }
    });
    return ClauseView;
});
