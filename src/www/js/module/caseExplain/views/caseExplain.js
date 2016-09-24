
define([
    'common/base/base_view',
    'text!module/caseExplain/templates/caseExplain.html',
    'marionette'
],function(BaseView, tpl, mn) {
    return BaseView.extend({
        id : "case-explain-page",

        template : _.template(tpl),

        _mouseLock : false,
        _isShow : false,

        // key : selector
        ui : {
        	"topTitle": "#top-title",
        	"caseExplainContent": "#case-explain-content"
        },
        //事件添加
        events : {
        	"tap @ui.topTitle": "clickTopTitleHandler"
        },
		clickTopTitleHandler: function(event){
			event.stopPropagation();
			event.preventDefault();
			app.goBack();

		},
        /**初始化**/
        initialize : function(){
        },
        //在开始渲染模板前执行，此时当前page没有添加到document
        onBeforeRender : function(){

        },
        //渲染完模板后执行,此时当前page没有添加到document
        onRender : function(){

        },
        show: function(){
        	var self = this;
 			if(device.ios()){
                self.ui.topTitle.css("padding-top",utils.toolHeight+"px");
                self.ui.caseExplainContent.css("height", "-webkit-calc(100% - 84px - "+utils.toolHeight+"px)");
            }
        	if(utils.caseExplain){
                var imgHtml = "";
                for(var i=0; i<utils.caseExplain.length; i++){
                    imgHtml += '<img style="width: 100%" src="'+ utils.serverConfig.serverUrl + utils.caseExplain[i] +'"/>';
                }
        		self.ui.caseExplainContent.html(imgHtml);
        	}else{
        		self.ui.caseExplainContent.html("");
        	}
        },
        //页间动画已经完成，当前page已经加入到document
        pageIn : function(){
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
        	utils.caseExplain = "";
        },

        //当页面销毁时触发
        onDestroy : function(){
//            console.log("footer destroy");
        }

    });
});