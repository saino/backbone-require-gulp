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

        },
        show:function(){
            var self = this;
            console.log("utils.isShare="+utils.isShare);//todo
            //分享进入 顶部返回按钮 分享按钮需隐藏
            alert("utils.isShare="+utils.isShare);
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
            self.planId = tempPlanId;
            self.changeMenuTab(self.currTab);
        },
        onTabClickHandler : function(e){
            var self = this, target  = e.currentTarget;
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
            var name = this.ui.planMain.find(".plan-book-company").html()+"-计划书演示";
            var advice = this.ui.planMain.find(".plan-book-company").attr("data-advice");
            alert(name+","+advice+","+window.location.href);//todo
            if(name == "" || advice == ""){
                MsgBox.alert("分享标题与描述不能为空!");
            }else{
                utils.shareProduct(name,"分享计划",window.location.href);
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