/**
 * Created by GYY on 2016/8/22.
 * 条款页面
 */
define([
    'common/base/base_view',
    'text!module/personalPlan/templates/personalPlan.html',
    'module/personalPlan/model/personalPlanModel',
    'common/views/circle',
    "msgbox"
], function (BaseView, Tpl, personalPlanModel,loadingCircle, MsgBox) {
    var planItemTemp = '<div class="personal-plan-item" data-id="{planId}" data-proposer="{proposerName}" data-gender="{proposerGender}">' +
        '<div class="personal-plan-item-title">' +
        '<div class="personal-plan-item-name"><img class="avatar-icon" src="./images/plan/icon12.png" /><span>{applicantName}</span></div>' +
        '<span class="personal-plan-item-date">{itemDate}</span>' +
        '</div>' +
        '<div class="personal-plan-item-content">' +
        '<p>{planName}</p>' +
        '<p>{recognizeeInfo}</p>' +
        '<p>{costInfo}</p>' +
        '</div>' +
        '<div class="personal-plan-item-delete" data-id="{dataId}"></div>' +
        '</div>';
    var PersonalPlanView = BaseView.extend({
        template: _.template(Tpl),
        id:"personal-plan-container",
//        currentListData : [],     //当前计划书数据的列表
        initListData : [],      //初始化的
        forever:true,
        mouseLock:false, //鼠标锁
        ui:{
            topCon : ".top-title",
            backBtn : ".top-title-left", //点击返回
            clearBtn: ".top-title-right",              //清除按钮
            planSearchContainer : ".plan-search-container",    //搜索框
            personalPlanMain: "#personal-plan-main",
            planSearchTxt: ".plan-search-txt",        //搜索内容框
            planSearchBtn : ".plan-search-icon"      //搜索按钮
        },
        events:{
            "tap @ui.backBtn":"onBackBtnHandler",
            "tap @ui.clearBtn": "onClearPlanHandler",      //清空计划书
            "tap @ui.planSearchBtn": "onPlanSearchBtnHandler",      //搜索计划书
            "input @ui.planSearchTxt": "onPlanSearchInputHandler",      //输入内容实时搜索
            "tap .personal-plan-item":"clickPlanHandler"  //点击查看计划书详情-保障计划
        },
        initialize:function(){

        },
        onRender:function(){
            var self = this;
            if(device.ios()){
                self.ui.topCon.css("padding-top",utils.toolHeight+"px");
            }
            setTimeout(function(){
                var height = self.ui.topCon.outerHeight(true) + self.ui.planSearchContainer.height();
                self.ui.personalPlanMain.css({height: "-webkit-calc(100% - " + height + "px)"});
            }, 0)
            console.log("查询我的计划书列表")
            LoadingCircle && LoadingCircle.start();
            personalPlanModel.getPlanItemList(function(data){
                LoadingCircle && LoadingCircle.end();
                console.log(data);
                var list = data.planCardList;
                self.initListData = list;
                self.initView(list);
            }, function(err){
                LoadingCircle && LoadingCircle.end();
                console.log("计划书列表查询失败,"+err);
            });

        },
        pageIn:function(){
            var self = this;
            app.on("personalPlan:exit", self._goBackHandler,this);
        },
        /**
         * 初始化界面的动态数据
         * @param data
         */
        initView : function(list){
            var self = this;
            var planItemStr = "";
            if (list && list.length > 0){
                for (var i = 0; i < list.length; i++){
                    var obj = list[i];
                    var date = utils.formattime(obj.generateDate, "yyyy年MM月dd日");      //格式最后需要转换
                    var applicantName = "投保人：" + obj.phName; //投保人名称
                    var planId = obj.quotationId;
                    var planName = obj.packageName;    //计划书名称
                    var proposerName = obj.phName || "";
                    var gender = obj.phGender || "M";
                    var chargePeriod = obj.mainCoverage.chargePeriod;        //交费期限
                    var chargePeriodStr = utils.getPeriodText(1, chargePeriod.periodType, chargePeriod.periodValue);
                    var coveragePeriod = obj.mainCoverage.coveragePeriod;    //保障期限
                    var coveragePeriodStr = utils.getPeriodText(2, coveragePeriod.periodType, coveragePeriod.periodValue);
                    var recognizeeInfo = obj.insured.name + " " + (obj.insured.gender == "M" ? "男" : "女") + " " +
                    obj.insured.age + "岁 " + chargePeriodStr + " " + coveragePeriodStr;             //被保人信息
                    var costInfo = "保额" + utils.formatNumber2(obj.mainCoverage.sa) + " 首年保费" + utils.formatNumber2(obj.totalFirstYearPrem);      //费用信息
                    var objectId = obj.quotationId;    //计划ID
                    var realItemTemp = planItemTemp.replace("{applicantName}", applicantName).replace("{itemDate}", date)
                        .replace("{planName}", planName).replace("{recognizeeInfo}", recognizeeInfo)
                        .replace("{costInfo}", costInfo).replace("{dataId}", objectId)
                        .replace("{planId}",planId)
                        .replace("{proposerGender}",gender)
                        .replace("{proposerName}",proposerName);
                    planItemStr += realItemTemp;
                }
                self.ui.personalPlanMain.html(planItemStr);
            }else{
                self.ui.personalPlanMain.html('<div class="plan-item-noting">暂无浏览记录</div>');
            }
            
        },
        /**
         * 点击返回
         * @param e
         */
        onBackBtnHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            if(self.mouseLock)return;
            self.mouseLock = true;
            setTimeout(function(){
                self.mouseLock = false;
            },300);
            //退出H5 add by guYY 9.20 13:25
            if(!utils.toFinish()){
                app.goBack();
            }
        },
        //物理返回
        _goBackHandler:function(){
            //退出H5 add by guYY 9.20 13:25
            if(!utils.toFinish()){
                app.goBack();
            }
        },
        /**
         *搜索按钮点击事件
         */
        onPlanSearchInputHandler :function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            if(self.mouseLock)return;
            self.mouseLock = true;
            setTimeout(function(){
                self.mouseLock = false;
            },300);
            var text = self.ui.planSearchTxt.val();
            self.planSearchOperation(text);
        },
        //点击指向保障计划
        clickPlanHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            if(self.mouseLock)return;
            self.mouseLock = true;
            setTimeout(function(){
                self.mouseLock = false;
            },300);
            var target = $(e.target);
            if(target.hasClass("personal-plan-item-delete")){//删除单项
                self.onDeletePlanItemHandler(target.parents(".personal-plan-item"));
                return;
            }
            if(!target.hasClass("personal-plan-item")){
                target = target.parents(".personal-plan-item");
            }
            var id = target.data("id")||"null";
            target.css("opacity",".5")
            setTimeout(function(){
                target.css("opacity","1")
            },30);
            var proposerName = target.data("proposer");
            var gender = target.data("gender")=="F"?"女士":"先生";
            utils.planHonorific = "尊敬的"+proposerName+""+gender;
            app.navigate("in/plan/"+id,{trigger:true,replace:true});
        },
        /**
         *搜索按钮点击事件
         */
        onPlanSearchBtnHandler :function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            if(self.mouseLock)return;
            self.mouseLock = true;
            setTimeout(function(){
                self.mouseLock = false;
            },300);
            var text = self.ui.planSearchTxt.val();
            if (text){
                self.planSearchOperation(text);
            }
        },
        /**
         *具体搜索实现函数
         */
        planSearchOperation: function (text) {
            var self = this;
            var searchData = utils.searchObjectArray(self.initListData, text, ["packageName", "phName", "insured|name"]);
            self.initView(searchData);
        },
        /**
         * 点击清空所有计划书
         * @param e
         */
        onClearPlanHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            if(self.mouseLock)return;
            self.mouseLock = true;
            setTimeout(function(){
                self.mouseLock = false;
            },300);
            //有子项的时候
            if (self.initListData.length > 0) {
                //清空，我的所有计划书
                MsgBox.ask("你确定要清空所有计划书吗？", "", function (type) {
                    if (type == 2) { //确定  0=取消
                        self.ui.personalPlanMain.html('<div class="plan-item-noting">暂无浏览记录</div>');
                        //清空缓存数组
                        self.initListData = [];
                        personalPlanModel.delPlan(0,0,function(){
                            console.log("清除成功");
                        },function(err){
                            console.log("清除失败");
                        })
                    }
                    if (type == 0) {
                        console.log("取消清除");
                    }
                });
            }    
        },
        /**
         * 点击删除单条计划书
         * @param e
         */
        onDeletePlanItemHandler:function(parent){
            var self = this;
            //删除单条计划书
            var dataId = parent.attr("data-id");
//            var parent = "";
            if (dataId){
//                parent = target.parent();
                if (parent) {
                    MsgBox.ask("你确定要删除该计划书吗？","",function(type){
                        if(type == 2) { //确定  0=取消
                            var pparent = parent.parent();
                            parent.slideUp(function(){
                                parent.remove();
                                if (!(pparent.children().length)) {
                                    self.initListData = [];
                                    self.ui.personalPlanMain.html('<div class="plan-item-noting">暂无浏览记录</div>');
                                }else{
                                    //清除缓存
                                    self.delPlanFromCache(dataId);
                                }
                            });
                            personalPlanModel.delPlan(1,dataId,function(){
                                console.log("删除成功");
                            },function(err){
                                console.log("删除失败");
                            })
                        }
                        if(type == 0) {
                            console.log("取消删除");
                        }
                    });  
                }
            }
        },
        delPlanFromCache:function(id){
            var self = this;
            for(var i = 0 ; i < self.initListData.length; i++){
                if(self.initListData[i].quotationId == id){
                    self.initListData.splice(i,1);
                    break;
                }
            }
        },
        close:function(){
            var self = this;
            LoadingCircle && LoadingCircle.end();
//            self.remove(); //update by guYY 此处什么意思？这样会导致无法常驻页面
            app.off("personalPlan:exit", self._goBackHandler,this);
            if(MsgBox && MsgBox.isShow()) {
                MsgBox.clear();
            }
        }
    });
    return PersonalPlanView;
});
