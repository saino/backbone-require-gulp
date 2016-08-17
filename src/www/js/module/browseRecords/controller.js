define([
    'module/browseRecords/views/browseRecords'
], function(browseRecordsView){
    return {
        browseRecords : function(){
            app.page.show(browseRecordsView);
        }
    }
});