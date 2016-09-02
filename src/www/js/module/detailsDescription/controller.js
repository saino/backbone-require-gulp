define([
    'module/detailsDescription/views/detailsDescription'
], function(detailsDescriptionView){
    return {
        detailsDescription : function(detailsDescriptionId, organId){
            app.page.show(detailsDescriptionView, {detailsDescriptionId: detailsDescriptionId, organId:organId});
        }
    }
});