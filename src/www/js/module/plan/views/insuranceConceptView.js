/**
 * 计划书-保险理念页
 * add guyy 2016/9/3
 */
define([
    'common/base/base_view',
    'text!module/plan/templates/insuranceConcept.html',
    'module/plan/model/planModel'
],function(BaseView,tpl,planModel){
    var insuranceConceptView = BaseView.extend({
        id:"insurance-concept-container",
        template: _.template(tpl),
        initialize:function(){

        },
        show:function(planId){
            var self = this;
            planModel.getInsuranceConcept(planId,function(data){
                self.url = data.spritDescPic;
                console.log(self.url);
            },function(err){

            })
        }
    });
    return insuranceConceptView;
});