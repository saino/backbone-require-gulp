// 文件名称: controllers.js
//
// 创 建 人: guyy
// 创建日期: 2016/8/22
// 描    述: controllers.js
define([
    'module/disease/views/diseaseView',
    'module/disease/views/incrementView',
    'module/disease/views/companyIntroView'
],function(DiseaseView,IncrementView,CompanyIntroView){
    return {
        disease : function(packageId,productId,libId){       //病种详情
            var opt = {};
            opt.packageId = packageId;
            opt.productId = productId;
            opt.libId = libId;
            app.page.show(DiseaseView, opt);
        },
        increment: function(valueAddedId){      //增值服务详情
            app.page.show(IncrementView,{valueAddedId:valueAddedId});
        },
        companyIntro:function(id){    //寿险-公司简介
            var opt = {};
            opt.organId = id;
            app.page.show(CompanyIntroView, opt);
        }
    };
});