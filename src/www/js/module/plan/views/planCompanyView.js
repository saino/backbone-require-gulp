/**
 * 计划书-公司介绍
 * add by guYY 2016/8/24
 */
define([
    'common/base/base_view',
    'module/plan/model/planModel',
    'text!module/plan/templates/planCompany.html'
],function(BaseView, planModel, planCompanyTpl){
    var planCompanyView = BaseView.extend({
        id:"plan-company-container",
        template: _.template(planCompanyTpl),
        inited:false,       //初始化完毕
        currIndex:0,        //默认显示服务商对象
        serverCompany:{},   //服务商对象
        underwriterCompnay :{}, //承保商对象
        underwriterTpl:_.template('<div class="line"></div><div class="intro"><%=introHtml %></div><%=vipContentHtml %><%=vipStandardHtml%>'),
        ui:{
            "planCompanyCon":"#plan-company-content",
            "planCompanyLogo":"#plan-company-logo",
            "serverCompanyCon":".service-provider-content", //服务商内容区域
            "underwriterCompanyCon":".underwriter-content"  //承保商内容区域
        },
        events:{
            "tap .menu-item":"_clickMenuItemHandler"
        },
        initialize:function(){
            this.showCompany(0);//默认显示服务商
        },
        _clickMenuItemHandler:function(e){
            var target = e.target;            
            $(target).addClass("menu-item-ck").siblings().removeClass("menu-item-ck");
            this.currIndex = $(target).data("index");
            this.showCompany(this.currIndex);            
        },
        /**
         * 根据索引显示公司信息
         * @index 索引 0服务商   1承保商
         */
        showCompany:function(index){
            var self = this;
            if(!self.inited)return;
            var company = index == 0 ? self.serverCompany:self.underwriterCompnay;
            if(company.logo && company.logo != ""){
                this.ui.planCompanyLogo.html('<img src="'+company.logo+'" alt="">');
            }            
            if(index == 0){
                self.ui.serverCompanyCon.addClass("content-ck");
                self.ui.underwriterCompanyCon.removeClass("content-ck");
            }else{
                self.ui.underwriterCompanyCon.addClass("content-ck");
                self.ui.serverCompanyCon.removeClass("content-ck");                
            }
            
        },
        //设置内容区域高度
        setHeight:function(hei){
            //hei为所放容易高度  - 70(切换tab高度) - 139（logo高度）
            var self = this;
            self.inited = true;
            self.ui.planCompanyCon.css({"height":(hei-70-139)+"px"});
            //查询服务商对象、承保商对象
            planModel.getCompanyInfo(function(arr){
                self.serverCompany = arr[0];
                self.underwriterCompnay = arr[1];
                self.ui.serverCompanyCon.html(self.serverCompany.content);
                var vipContentHtml = '';
                var vipStandardHtml = '';
                if(self.underwriterCompnay.vipContent){
                    vipContentHtml = '<div class="vip-increment-content vip-content"><div class="title">VIP增值服务内容</div><div class="vip-increment-content-main">'+self.underwriterCompnay.vipContent+'</div></div>';
                }
                if(self.underwriterCompnay.vipStandard){
                    vipStandardHtml = '<div class="vip-increment-standard vip-content"><div class="title">VIP增值服务标准</div><div class="vip-increment-content-main">'+self.underwriterCompnay.vipStandard+'</div></div>';
                }
                self.ui.underwriterCompanyCon.html(self.underwriterTpl({introHtml:self.underwriterCompnay.content,vipContentHtml:vipContentHtml,vipStandardHtml:vipStandardHtml}));
                self.showCompany(this.currIndex);
            });
        }

    });
    return planCompanyView;
});