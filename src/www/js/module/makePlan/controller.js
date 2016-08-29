define([
    'module/makePlan/views/makePlan'
],function(makePlanView){
    return {
        makePlan: function(){
            app.page.show(makePlanView);
        }
    }
});