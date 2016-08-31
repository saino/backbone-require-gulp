define([
    'module/makePlan/views/makePlanView'
],function(MakePlanView){
    return {
        makePlan: function(){
            app.page.show(MakePlanView);
        }
    }
});