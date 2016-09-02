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
        },

        events:{
        },

        initialize:function(){
        },

        show : function(){
        }
    });
    return planBookView;
});