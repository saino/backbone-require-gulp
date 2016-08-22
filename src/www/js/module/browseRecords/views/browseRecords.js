define([
    'common/base/base_view',
    'marionette',
    'text!module/browseRecords/templates/browseRecords.html',
    'msgbox'
], function(BaseView, mn, tpl, MsgBox) {
    return BaseView.extend({
        id: "browseRecordsPage",
        template : _.template(tpl),
        forever : false,

        ui: {
            back: "#browse-records-title-left"
        },

        events: {
            "tap @ui.back": "clickBackHandler"
        },

        clickBackHandler: function(event){
            event.stopPropagation();
            event.preventDefault();

            app.goBack();
        },

        initialize: function(){
            console.log("initialize!!!");
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