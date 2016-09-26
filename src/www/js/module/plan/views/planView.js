// 文件名称: 计划书页 
//
// 创建日期: 2016/8/24
// 描    述: 包含保障计划、保险理念、公司介绍
define([
    'common/base/base_view',
    'text!module/plan/templates/plan.html',
    'module/plan/views/planCompanyView',
    'marionette',
    "msgbox",
    'module/plan/views/planBookView',
    'module/plan/views/insuranceConceptView',
    'module/plan/model/planModel'
],function(BaseView, tpl, planCompanyView, mn, MsgBox, PlayBookView, InsuranceConceptView,planModel) {
    return BaseView.extend({
        id: "plan-container",
        template : _.template(tpl),
        _mouseLock : false,
        forever : true,
        currTab:1,
        mouseLock:false,//按钮锁
        ui : {
            "topCon":"#top-title",
            "titleLeft":"#top-title-left",
            "titleShare":"#top-title-right-1",
            "planMain":"#plan-main",
            menuTab : "#plan-menu"
        },
        regions:{
            "planMain":"#plan-main"
        },
        //事件添加
        events : {
            "tap #top-title-left":"_clickBackHandler",
            "tap .menu-item" : "onTabClickHandler",
            "tap #top-title-right-1":"clickShareHandler"
        },

        /**初始化**/
        initialize : function(){
            var planId = this.getOption("planId");

        },

        //在开始渲染模板前执行，此时当前page没有添加到document
        onBeforeRender : function(){
        },

        //渲染完模板后执行,此时当前page没有添加到document
        onRender : function(){
            var self = this;
            if(device.ios()){
                self.ui.topCon.css("padding-top",utils.toolHeight+"px");
                self.ui.planMain.css("height","-webkit-calc(100% - "+(183+utils.toolHeight)+"px)");
            }
        },

        //页间动画已经完成，当前page已经加入到document
        pageIn : function(){
            var self = this;
            self.shareName = this.ui.planMain.find(".plan-book-company").html()+"-计划书演示";
            self.shareAdvice = this.ui.planMain.find(".plan-book-company").attr("data-advice");
            console.log("pageIn planView");
        },
        show:function(){
            var self = this;
            if(utils.isShare){
                self.ui.titleLeft.css("visibility","hidden");
                self.ui.titleShare.css("visibility","hidden");
            }else{
                self.ui.titleLeft.css("visibility","visible");
                self.ui.titleShare.css("visibility","visible");
            }
            var tempPlanId = self.getOption("planId");
            app.on("plan:exit", this._goBackHandler,this);
            if(self.planId == tempPlanId)
                return;
            //动画播放
            var dom = $("#plan-cover");
            if(!dom || dom.length <= 0) {
                self.ui.menuTab.after('<div id="plan-cover"></div>');
                dom = $("#plan-cover");
            }
            var index = 0;
            var iframe = document.createElement("iframe");
            dom.append(iframe);
            if(!utils.planHonorific || utils.planHonorific == ""){
                utils.planHonorific = "尊敬的xxx先生";//TODO
            }
            iframe.src = "planCover/index.html?text="+encodeURI(utils.planHonorific);
            $(iframe).css({
                position: "absolute",
                width:"100%",
                height:"100%",
                margin:"0",
                padding:"0"
            });
            self.planId = tempPlanId;
            self.changeMenuTab(self.currTab);
        },
        onTabClickHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this, target  = e.currentTarget;
            if(self.mouseLock)return;
            self.mouseLock = true;
            setTimeout(function(){
                self.mouseLock = false;
            },300);
            var tabIndex = target.dataset.id;
            if(tabIndex){
                self.currTab = tabIndex;
                self.changeMenuTab(tabIndex);
            }
        },
        //分享计划书
        clickShareHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            if(self.mouseLock)return;
            self.mouseLock = true;
            setTimeout(function(){
                self.mouseLock = false;
            },300);
            if(!self.shareName || self.shareName == "" || !self.shareAdvice || self.shareAdvice == ""){
                MsgBox.alert("分享标题与描述不能为空!");
            }else{
                utils.shareProduct(self.shareName,self.shareAdvice,window.location.href);
            }
        },
        changeMenuTab : function(tabIndex){
            var self = this;
            if(tabIndex == 1){
                self.showPlan();
            }else if(tabIndex == 2){
                self.showInsuranceConcept();
            }else if(tabIndex == 3){
                self.showCompany();
            }
            self.ui.menuTab.find(".menu-item[data-id="+tabIndex+"]").addClass("menu-item-ck").siblings(".menu-item").removeClass("menu-item-ck")
        },

        showCompany : function(){
            var self = this;
            debugger;
            self.planCompanyView = new planCompanyView();
            self.getRegion("planMain").show(self.planCompanyView);
            self.planCompanyView.setHeight(self.ui.planMain[0].offsetHeight, self.planId);
        },

        showPlan : function(){
            var self = this;
            self.planBookView = new PlayBookView();
            self.getRegion("planMain").show(self.planBookView);
            self.planBookView.show(self.planId);
        },
        //显示保险理念
        showInsuranceConcept:function(){
            var self = this;
            self.insuranceConceptView = new InsuranceConceptView();
            self.getRegion("planMain").show(self.insuranceConceptView);
            self.insuranceConceptView.show(self.planId);
        },
        //点击返回
        _clickBackHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            if(self.mouseLock)return;
            self.mouseLock = true;
            setTimeout(function(){
                self.mouseLock = false;
            },300);
            //点击返回时 清理本地缓存
            if(self.planId) {
                utils.delLocalStorageObject("planObject", self.planId);
                utils.delLocalStorageObject("planObjectIllus", self.planId);//对应利益演示部份
            }
            app.goBack();
        },
        //物理返回
        _goBackHandler:function(e){
            var self = this;
            //点击返回时 清理本地缓存
            if(self.planId) {
                utils.delLocalStorageObject("planObject", self.planId);
                utils.delLocalStorageObject("planObjectIllus", self.planId);//对应利益演示部份
            }
            app.goBack();
        },
        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            var self = this;
            if(MsgBox && MsgBox.isShow()){
                MsgBox.clear();
            }
            app.off("plan:exit", self._goBackHandler,this);
        },
        /*点击事件不可以重复点*/
        _checkMouseLock : function () {
            var self = this;
            if (self._mouseLock) return true;
            self._mouseLock = true;
            setTimeout(function () {
                self._mouseLock = false;
            }, 200);
            return false;
        },

        //当页面销毁时触发
        onDestroy : function(){
        }
    });
});