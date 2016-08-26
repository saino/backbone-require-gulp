define([
    'common/base/base_view',
    'marionette',
    'text!module/lifeInsurance/templates/lifeInsurance.html',
    'msgbox'
], function(BaseView, mn, tpl, MsgBox) {
    return BaseView.extend({
        id: "lifeInsurancePage",
        template: _.template(tpl),
        forever: false,

        ui: {
            back: "#top-title-left",
            browseRecordsContent: "#browse-records-content",
            browseRecordsTitleRight: "#top-title-right"
        },

        events: {
            "tap @ui.back": "clickBackHandler",
            "tap @ui.browseRecordsContent": "clickDeleteHandler",
            "tap @ui.browseRecordsTitleRight": "clickDeleteAllHandler"
        },

        clickBackHandler: function (event) {
            event.stopPropagation();
            event.preventDefault();

            app.goBack();
        }
    });
});