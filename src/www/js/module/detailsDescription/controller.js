define([
    'module/detailsDescription/views/detailsDescription'
], function(detailsDescriptionView){
    return {
        detailsDescription : function(detailsDescriptionId){
            app.page.show(detailsDescriptionView, {detailsDescriptionId: detailsDescriptionId});
        }
    }
});