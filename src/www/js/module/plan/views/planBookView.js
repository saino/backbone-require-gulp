/**
 * 计划书-公司介绍
 * add by guYY 2016/8/24
 */
define([
    'common/base/base_view',
    'module/plan/model/planModel',
    'text!module/plan/templates/planBookView.html'
],function(BaseView, planModel, tpl){
    var planBookView = BaseView.extend({
        id:"plan-book-container",
        template: _.template(tpl),
        inited : false,       //初始化完毕

        ui:{
            planTitle : ".plan-book-title",

            //banner
            planBannerName : ".plan-book-company",
            panBannerTitle : ".plan-book-title",
            //banner end

            //Insured 被投保人信息
            paymentDate : ".payment-date",
            guaranteeDate : ".guarantee-date",
            coverageTotal : ".coverage-total-txt",
            coverageFirst : ".coverage-first-txt",
            sexTxt : ".sex-txt",
            ageTxt : ".age-txt",
            //Insured end

            btnRangeReduce : ".btn-range-reduce",
            btnRangeAdd : ".btn-range-add",
            rangeInput : ".input-range"
        },

        events:{
            "tap @ui.btnRangeAdd" : "onRangeAddHandler",
            "tap @ui.btnRangeReduce" : "onRangeReduceHandler"
        },

        initialize:function(){
        },

        show : function(planId){
            var self = this;
            planModel.getPlanInfo(planId, function(data){
                var planInfo = data.planInfo;
                var plan = planInfo.plan;
                self.initBannerData(plan);
                self.initInsuredData(plan);
            }, function(){

            })
        },

        /***
         * initBanner
         * @param e
         */
        initBannerData : function(data){
            var self = this;
            //暂无
            //var title =
            var name = data.proposer.name + "的计划书";
            self.ui.planBannerName.html("");
            self.ui.panBannerTitle.html(name);
        },

        /***
         * 初始化被投保人
         */
        initInsuredData : function(data){
            var self = this, insureds = data.insureds;
            if(insureds.length){
                var insuredObj = insureds[0];
                var age = insuredObj.age + "岁";
                var sex = insuredObj.gender == "F" ? "男" : "女";
                self.ui.ageTxt.html(age);
                self.ui.sexTxt.html(sex);
            }
        },

        onRangeAddHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var val = parseInt(self.ui.rangeInput.val()) + 1;
            self.setRangeValue(val);
        },

        onRangeReduceHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var val = parseInt(self.ui.rangeInput.val()) - 1;
            self.setRangeValue(val);
        },

        setRangeValue : function(val){
            var self = this;
            self.ui.rangeInput.val(val);
        }
    });
    return planBookView;
});