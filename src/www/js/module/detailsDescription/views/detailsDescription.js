define([
    'common/base/base_view',
    'marionette',
    'text!module/detailsDescription/templates/detailsDescription.html',
    'msgbox'
], function(BaseView, mn, tpl, MsgBox) {
    return BaseView.extend({
        id: "detailsDescriptionPage",
        template: _.template(tpl),
        forever: false,

        ui: {
            back: "#top-title-left"
            //browseRecordsContent: "#browse-records-content",
            //browseRecordsTitleRight: "#browse-records-title-right"
        },

        events: {
            "tap @ui.back": "clickBackHandler"
            //"tap @ui.browseRecordsContent": "clickDeleteHandler",
            //"tap @ui.browseRecordsTitleRight": "clickDeleteAllHandler"
        },

        clickBackHandler: function(event){
            event.stopPropagation();
            event.preventDefault();

            app.goBack();
        },

        initialize: function(){
            console.log("initialize!!!");
            //console.log(this.getOption("detailsDescriptionId"));
        },

        onBeforeRender: function(){
            console.log("onBeforeRender!!!");
        },

        onRender: function(){
            console.log("render!!!ww");
        },

        show: function(){
            console.log("show!!!");

        },
        pageIn: function(){
            console.log("pageIn!!!");
        },

        close: function(){
            console.log("close!!!");
        },

        onDestroy: function(){
            console.log("destroy!!!");
        }
    });
});