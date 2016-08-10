// 文件名称: RegistAlertUI
//
// 创 建 人: chenshy
// 创建日期: 2015/2/1 16:37
// 描    述: 注册提示
define([
    'text!common/templates/regist_alert.html',
    "msgbox",
    "common/views/MsgBoxUI"
],function(tpl,MsgBox,MsgBoxUI) {
    if(!MsgBox){
        require(["msgbox"],function(msgbox){
            MsgBox = msgbox;
        });
    }
    var isLoging = false;
    var isPause = false;
    var RegistAlertUI = function(skinClassName,buttonType,bModal){
        var self = this;
        this._tpl = tpl;
        MsgBoxUI.call(this,skinClassName,buttonType,bModal);
        var bgImg = new Image(); 
        bgImg.src = appConfig.get("login_bgimg"); 
        bgImg.onload = function(){ //图片下载完毕时异步调用callback函数。 
           // callback.call(img); // 将callback函数this指针切换为img。
            self.$el.get(0).style["background-image"] = "url('"+bgImg.src+"')";
            setTimeout(function(){
                self.$el.get(0).style["background-size"] = "100% 100%";
            },20);
        };
        if(window.innerHeight<1000){
            this.$el.find(".regist-alert-icon").css("margin-top",60);
        }
        this._backBtn = this.$el.find(".regist-alert-back");
        this._loginBn = this.$el.find(".regist-alert-notice-login");
        this._wxLoginBn = this.$el.find("#weixin-alert-login");
        this._QQLoginBn = this.$el.find("#qq-login");
        this._sinaLoginBn = this.$el.find("#sina-login");
        if(device.ios()){
            this.$el.find(".alert_back").css({"top": "63.5px"});
        }else if(device.android()){
            this.$el.find(".alert_back").css({"top": "23.5px"});
        }
        if(isLoging){
            self.$el.find(".user-loging").css({"display":"block"});
        }else{
            self.$el.find(".user-loging").css({"display":"none"});
        }
        if(fmawr == "997" || window.fmawr == "997"){
            self.$el.find(".other-login-icon").css({"display":"none"});
            self.$el.find(".other-login").css({"display":"none"});
        }
        // if(_self.loging){
        //     console.log("chuxianchuxian");
        // }else{
        //     console.log("xiaoshixiaoshi");
        // }
        // 没有安装微信的时候，隐藏微信登录按钮 
        if(!window.checkQQAndWeixin[1]){
            this._wxLoginBn.hide();
            
            if(window.innerHeight<1000){
                this._loginBn.css({"margin": "17% auto"});
            }
            else{
                this._loginBn.css({"margin": "30% auto"});
            }
        }
        this._loginCallBack = this.__loginCallBack.bind(this);
        this._displayLoging = this.__displayLoging.bind(this);
        this._backBtn.bind("tap",function(e){
            self._hide();
            e.stopPropagation();
            e.preventDefault();
        });

        this._loginBn.bind("tap",function(e){
            e.stopPropagation();
            e.preventDefault();
            self._toLogin();
            setTimeout(function(){
                self._hide();
            },10);
        });
        this._wxLoginBn.bind("tap",function(e){
            e.stopPropagation();
            e.preventDefault();
            self.$el.find(".user-loging").css({"display":"block"});
            setTimeout(function(){
                self.$el.find(".user-loging").css({"display":"none"});
                if(!isPause&&window.checkQQAndWeixin[1]){
                    isLoging = false;
                }
                isPause = false;
            },3000);
            self._toRegist();
        });
        this._QQLoginBn.bind("tap",function(e){
            e.stopPropagation();
            e.preventDefault();
            isLoging = true;
            self.$el.find(".user-loging").css({"display":"block"});
            setTimeout(function(){
                self.$el.find(".user-loging").css({"display":"none"});
                if(!isPause&&window.checkQQAndWeixin[0]){
                    isLoging = false;
                }
                isPause = false;
            },3000);
            self._toQQLogin();
        });
        this._sinaLoginBn.bind("tap",function(e){
            e.stopPropagation();
            e.preventDefault();
            isLoging  = true;
            self.$el.find(".user-loging").css({"display":"block"});
            setTimeout(function(){
                self.$el.find(".user-loging").css({"display":"none"});
                if(!isPause&&window.checkQQAndWeixin[2]){
                    isLoging = false;
                }
                isPause = false;
            },3000);
            self._toSinaLogin();
        })

        app.on(GM.ON_PAUSE,this.__isPauseFn, this);
    };

    RegistAlertUI.prototype = Object.create(MsgBoxUI.prototype);
    RegistAlertUI.prototype.constructor = RegistAlertUI;
    RegistAlertUI.prototype.__isPauseFn = function(){
        isPause = true;
    }
    //第三方登陆成功回调函数
    RegistAlertUI.prototype.__loginCallBack = function(thirdParty,isLogined){
        var self = this;
        //登录成功或者失败的时候
        isLoging = false;
        self.$el.find(".user-loging").css({"display":"none"});
        if(!isLogined){
            // console.log("登录失败");
            return;
        }
        self._hide();
        var targetUrl = Backbone.history.getReturnUrl();
        app.navigate(targetUrl, {replace: true,trigger: true, isBack: true});
        //获取手机设备信息
        // utils.getDeviceInfoFn();
        //派发登录成功事件
        app.triggerMethod("login:ok");
    };
    RegistAlertUI.prototype.__displayLoging = function(){
        var self = this;
        isLoging = true;
        self.$el.find(".user-loging").css({"display":"block"});
    };
    //第三方app未安装函数
    RegistAlertUI.prototype.__appUnInstall = function(thirdParty){
        var self = this;
        var appName = "该应用";
        isLoging = false;
        if(thirdParty=="wx")    appName = "微信";
        if(thirdParty=="QQ")    appName = "QQ";
        if(thirdParty=="wb")    appName = "微博";
        var msgbox = MsgBox.ask("本机没有安装"+appName,"温馨提示",function(type){
            if(type == MsgBox.YES){
                app.navigate("mz/user/register", {replace: true,trigger: true, isBack: true});
            }
        });
        msgbox.bnYes.innerHTML = "手机号注册";
        msgbox.bnNo.innerHTML = "我知道了";
    };
    //微信登录
    RegistAlertUI.prototype._toRegist = function(){
        var self = this;
        // User.wxLogin(this._loginCallBack,"wx",this._displayLoging);
    };

    //手机登录
    RegistAlertUI.prototype._toLogin = function(){
        app.navigate("mz/user/login",{replace:true,trigger:true});
    };
    //QQ登陆
    RegistAlertUI.prototype._toQQLogin = function(){
        var self = this;
        // User.QQLogin(this._loginCallBack,"QQ");
    };
    //微博登陆
    RegistAlertUI.prototype._toSinaLogin = function(){
        var self = this;
        // User.wbLogin(this._loginCallBack,"wb");
    };

    RegistAlertUI.prototype._hide = function(type){
        if(type == MsgBox.ABORT) return;
        if(this._callback){
            this._callback.apply(null,[type,this._params]);
        }
        isLoging = false;
        this._backBtn.unbind("tap");
        this._loginBn.unbind("tap");
        this._wxLoginBn.unbind("tap");
        this._QQLoginBn.unbind("tap");
        this._sinaLoginBn.unbind("tap");
        if(type == MsgBox.OK){
            this._toRegist();
        }
        this._loginCallBack = null;
        this._displayLoging = null;
        app.off(GM.ON_PAUSE,this.__isPauseFn, this);
        MsgBox.remove(this);
    };
    return RegistAlertUI;
});