define([
    'module/makePlan/views/makePlanView'
],function(MakePlanView){
    return {
        makePlan: function(productId){
            app.page.show(MakePlanView,{productId:productId});
        }
    }
});