/**
 * 计划书-保险理念页
 * add guyy 2016/9/3
 */
define([
    'common/base/base_view',
    'text!module/plan/templates/insuranceConcept.html',
    'module/plan/model/planModel'
],function(BaseView,tpl,planModel){
    var insuranceConceptView = BaseView.extend({
        id:"insurance-concept-container",
        template: _.template(tpl),
        ui: {
            pageswitchContent: "#pageswitch-content",
            allPageNum: "#all-page-num",
            curPageNum: "#cur-page-num"
        },
        initialize:function(){

        },
        show:function(planId){
            var self = this;
            self.ui.pageswitchContent.css("height","100%");
            self.ui.pageswitchContent.css("width",(self.ui.pageswitchContent.height()*0.6349)+"px");
            planModel.getInsuranceConcept(planId,function(data){
                console.log("***************保险理念数据**************");
                console.log(data);
                self.url = data.spritDescPic;
            },function(err){
                console.log("保险理念获取失败")
            });
            var pw = new pageSwitch(self.ui.pageswitchContent[0], {
                duration:600,           //int 页面过渡时间
                direction:1,            //int 页面切换方向，0横向，1纵向
                start:0,                //int 默认显示页面
                loop:true,             //bool 是否循环切换
                ease:'ease',            //string|function 过渡曲线动画，详见下方说明
                transition:'scrollY',     //string|function转场方式，详见下方说明
                freeze:false,           //bool 是否冻结页面（冻结后不可响应用户操作，可以通过 `.freeze(false)` 方法来解冻）
                mouse:true,             //bool 是否启用鼠标拖拽
                mousewheel:false,       //bool 是否启用鼠标滚轮切换
                arrowkey:false,         //bool 是否启用键盘方向切换
                autoplay:false         //bool 是否自动播放幻灯 新增
                // interval:int            //bool 幻灯播放时间间隔 新增
            });
            pw.on("after", function(){
                var currentIndex = pw.current + 1;
                self.ui.curPageNum.html(currentIndex);
            });
        }
    });
    return insuranceConceptView;
});