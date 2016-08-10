// 文件名称: MsgBox
//
// 创 建 人: chenshy
// 创建日期: 2015/1/24 15:04
// 描    述: MsgBox
define([
    'common/views/MsgBoxUI',
    'common/views/RegistAlertUI',
    'common/views/ToastBoxUI'
],function(MsgBoxUI,RegistAlertUI, ToastBoxUI) {

    var className = "app-msg-box";

    var MsgBox = {
        init : function(){
            this._container = $("<div class='app-msg-box-container'>");
            $(document.body).append(this._container.get(0));
            this._container.hide();
            this._arrBox = [];

            this.meBeansContainer = $('<div id="meBeans-msg-box-container" class="meBeansAni"></div>');
            $(document.body).append(this.meBeansContainer.get(0));
            this.meBeansContainer.hide();
            this._meBeansMsgArr = [];
        },
        /**
         * 弹出窗口,包含一个"确定"按钮
         * @param	strMsg          需要显示的信息
         * @param	strTitle			信息提示的title
         * @param	skinClassName   自定义的外观，传null或者空字符串使用默认外观
         * @param	_callBack  点击“是”或者点击“否”按钮后的回调函数，
         * @param	params  要在回调时事件中传递的参数集合
         * @return
         */
        alert : function(strMsg,strTitle,_callBack,params,skinClassName,uiClass){
            uiClass = uiClass || MsgBoxUI;
            skinClassName = skinClassName || className;
            var msgBox = new uiClass(skinClassName, MsgBox.OK);
            msgBox.setCallBack(_callBack,params);
            msgBox.setText(strMsg, strTitle);
            msgBox.show(true);
            return msgBox;
        },
        /**
         * 消息显示框，以toast形式显示  2016-3-7 11:03
         * @param strMsg        需要显示的信息
         * @param isSuccess     成功或者失败的，对应显示不同的logo，成功true, 失败false
         * @param skinClassName 自定义的外观，传null或者空字符串使用默认外观
         * @returns {ToastBoxUI}
         */
        toast : function(strMsg, isSuccess, skinClassName){
            skinClassName = skinClassName || "app-toast-box";
            var msgBox = new ToastBoxUI(skinClassName, isSuccess);
            msgBox.setText(strMsg);
            msgBox.show(true);
            return msgBox;
        },
        /**
         * ME豆添加淡出窗口提示
         * @param num
         * add by guYY 2015/12/21 11:00
         */
        addMeBeans : function(type,num){
            if(type == "" || num <= 0)return;
            var self = this;
            this._meBeansMsgArr.push(type+";"+num);
            if(self._meBeansShow)
                return;
            this._showMeBeans();
        },
        //strArr :["点赞",3]; add by guYY 2015/12/21 11:00
        _showMeBeans : function(){
            var self = this;
            if(this._meBeansMsgArr.length <= 0){
                this._meBeansShow = false;
            }else {
                this._meBeansShow = true;
                var strArr = this._meBeansMsgArr.shift();
                var arr = strArr.split(';');
                this.meBeansContainer.html('<img src="images/userZone/works_list/icon02.png"/><p>' + arr[0] + '</p><p>+' + arr[1] + 'M豆</p>');
                this.meBeansContainer.show();
                self.meBeansTimer = setTimeout(function(){
                    self.meBeansContainer.hide();
                },2500);
                self.meBeansTimer = setTimeout(function(){
                    self._showMeBeans();
                },2600);
            }
        },
        /**
         * 弹出询问窗口,包含一个"是"和一个"否"按钮
         * @param	strMsg          需要显示的信息
         * @param	strTitle			信息提示的title
         * @param	skinClassName   自定义的外观，传null或者空字符串使用默认外观
         * @param	_callBack  回调函数
         * @param	params  要在回调时事件中传递的参数集合
         * @return
         */
        ask : function(strMsg,strTitle,_callBack,params,skinClassName,uiClass){
            uiClass = uiClass || MsgBoxUI;
            skinClassName = skinClassName || className;
            var msgBox = new uiClass(skinClassName, MsgBox.YES | MsgBox.NO);
            msgBox.setCallBack(_callBack,params);
            msgBox.setText(strMsg, strTitle);

            msgBox.show(true);
            return msgBox;
        },
        //检测版本更新 type 0 不能信 1 更新
        checkVersion:function(is,callback){
         var self = this;
         var html = '<div class="version-title"></div><div class="version-content"></div><div class="version-footer"><div class="version-btn no-prompt">不再提示</div><div class="version-btn not-update">暂不更新</div><div class="version-btn go-update">立即更新</div></div>';
         var mask = $('<div class="app-msg-box">'); 
         var verDom = $('<div class="version-box">');
             verDom.append(html); 
         var domTitle =verDom.find(".version-title");
         var prompt =  verDom.find(".no-prompt");
         var verContent = verDom.find(".version-content");
         var notUpdate =  verDom.find(".not-update");
         var goUpdate =  verDom.find(".go-update");
   

         var appVserInfo = JSON.parse(appConfig.get("app_current_version"));//获取版本信息
         var appCon = appVserInfo.content;//app更新内容
         var appVser = appVserInfo.version+"";
         var appTitle=""; //app标题
//             appTitle = appVser.split("");
//             appTitle = appTitle.join(".")+"版本更新";
            appTitle = appVserInfo.versionName


          if(is){ 
             domTitle.html(appTitle); 
          }else{ 
             prompt.remove();
             domTitle.remove();
          } 

           var contentTitle='<p class="v-p">'+ appTitle +'</p>';
           if(appVserInfo.size)  contentTitle +='<p class="v-p">新版本大小'+ appVserInfo.size +'</p>';
           contentTitle='<div class="v-section">'+contentTitle+'</div>';
 
          var conLen = appCon.length;
          if(conLen){
              var chtml="";
              for(var i=0;i<conLen;i++){
                  chtml +='<p class="v-p">'+appCon[i]+'</p>';
              };
              chtml='<div class="v-section">'+chtml+'</div>';
              console.log(chtml);
          }
           //填充内容
          verContent.append(contentTitle);
          verContent.append(chtml);
         //填充描述
         if(appVserInfo.hint){
            var hint = '<div class="v-section">'+appVserInfo.hint+'</div>';
            verContent.append(hint);
         }

          //暂不更新 事件
          notUpdate.on("tap",function(ev){
             ev.stopPropagation();
             ev.preventDefault();
             callback&&callback(0);
             self.clear();
             self._container.hide(); 
          });
         
          //立即更新 事件
          goUpdate.on("tap",function(ev){
             ev.stopPropagation();
             ev.preventDefault();
             callback&&callback(1);
             self.clear();
             self._container.hide(); 
          });
          
          //暂不提示事件
          prompt.on("tap",function(ev){
            ev.stopPropagation();
            ev.preventDefault();
            utils.setLocalStorageObject("versionPrompt",1); //记录是否提示版本更新 有值就不提示
            self.clear();
            self._container.hide();
          });
          mask.append(verDom);
          this._container.html(mask);
          this._container.show();  
        },
        /**
         * 注册弹窗
         * @param	strMsg          需要显示的信息
         * @param	strTitle			信息提示的title
         * @param	skinClassName   自定义的外观，传null或者空字符串使用默认外观
         * @param	_callBack  点击“是”或者点击“否”按钮后的回调函数，
         * @param	params  要在回调时事件中传递的参数集合
         * @return
         */
        regAlert : function(strMsg,strTitle,_callBack,params,skinClassName,uiClass){
            uiClass = uiClass || RegistAlertUI;
            skinClassName = skinClassName || "app-regist-alert";
            var msgBox = new uiClass(skinClassName, MsgBox.OK);
            msgBox.setCallBack(_callBack,params);
            msgBox.setText(strMsg, strTitle);

            msgBox.show(true);
            return msgBox;
        },

        add : function(msgBox){
            this._arrBox.push(msgBox);
            this._container.show();
            this._container.append(msgBox.el);
        },

        remove : function(msgBox){
            for(var i = 0;i < this._arrBox.length;i++){
                if(this._arrBox[i] == msgBox){
                    this._arrBox.splice(i,1);
                    break;
                }
            }

//            console.log("remove");
            msgBox.$el.remove();

            if(this._arrBox.length == 0){
                this._container.hide();
            }
        },
        //显示的情况下就清除
        clear : function(){
            this._container.html("");
            this._container.hide();
            this._arrBox.length = 0;
        },
        //判断是否显示alert框
        isShow : function(){
            if(this._arrBox.length > 0){
                return true;
            }
            return false;
        }
    };

    /**
     * "否"按钮及其返回值
     */
    MsgBox.NO = 0;

    /**
     * "是"按钮及其返回值
     */
    MsgBox.YES = 2;

    /**
     * "确定"按钮及其返回值
     */
    MsgBox.OK = 4;

    /**
     * "取消"按钮及其返回值
     */
    MsgBox.CANCEL = 8;

    /**
     * 空白处点击其返回值
     */
    MsgBox.ABORT = 10;



    MsgBox.init();

//    app.views.MsgBox = MsgBox;

    return MsgBox;
});
