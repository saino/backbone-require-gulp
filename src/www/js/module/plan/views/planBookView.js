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

        show : function(){
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