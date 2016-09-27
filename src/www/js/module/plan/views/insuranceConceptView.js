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
            baseImage1: "#base-image-1",
            baseImage2: "#base-image-2",
            middleImage1: "#middle-image-1",
            middleImage2: "#middle-image-2",
            advancedImage1: "#advanced-image-1",
            advancedImage2: "#advanced-image-2",
            allPageNum: "#all-page-num",
            curPageNum: "#cur-page-num"
        },
        initialize:function(){

        },
        show:function(planId){
            var self = this;
            self.ui.pageswitchContent.css("height","100%");
            self.ui.pageswitchContent.css("width",(self.ui.pageswitchContent.height()*0.6349)+"px");
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
            planModel.getInsuranceConcept(planId,function(data){
                console.log("***************保险理念数据**************");
                console.log(data);
                if(data.status == "0"){
                    if(data.listId==1 || data.listId==2 || data.listId==7 || data.listId==11){
                        console.log("基础风险");
                        pw.remove(7);
                        pw.remove(6);
                        pw.remove(5);
                        pw.remove(4);
                        self.ui.allPageNum.html(6);
                    }else if(data.listId==3 || data.listId==4 || data.listId==5 || data.listId==8 || data.listId==12){
                        console.log("中端风险");
                        pw.remove(7);
                        pw.remove(6);
                        pw.remove(3);
                        pw.remove(2);
                        self.ui.allPageNum.html(6);
                    }else if(data.listId==6 || data.listId==9){
                        console.log("高端风险");
                        pw.remove(5);
                        pw.remove(4);
                        pw.remove(3);
                        pw.remove(2);                
                        self.ui.allPageNum.html(6);
                    }else if(data.listId==10){
                        console.log("通用风险");
                        self.ui.allPageNum.html(10);

                    }else{
                        console.log("通用风险");
                        self.ui.allPageNum.html(10);
                    }
                }
                self.url = data.spritDescPic;
            },function(err){
                console.log("保险理念获取失败")
            });
        }
    });
    return insuranceConceptView;
});