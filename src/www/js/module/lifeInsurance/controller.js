define([
    'module/lifeInsurance/views/lifeInsurance',
], function(lifeInsuranceView){
    return {
        lifeInsurance: function(){
            app.page.show(lifeInsuranceView);
        }
    };
});