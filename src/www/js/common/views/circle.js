// 文件名称: circle.js
//
// 创 建 人: zhao
// 创建日期: 2015/11/13 12:47
// 描    述: circle.js
(function(){
    /*var template = '<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">'
                + '<path fill="#FF6700" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z" transform="rotate(157.651 25 25)">'
                + '<animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"></animateTransform>'
                + '</path>'
                + '</svg>"';*/
    var template = '<img src="images/loading.svg" style="width:44px; vertical-align: middle;margin-right: 10px;">';

    var loading = null;
    var maskContainer = null;
    var clipContainer = null;
    var LoadingCircle = function(){
        this.dom = LoadingCircle.getDom();
    };

    LoadingCircle.start = function(txt){
        txt =  txt ? txt : "";
        if(!loading){
            loading = new LoadingCircle();
            maskContainer = document.createElement("div");
            clipContainer = document.createElement("div");

            maskContainer.className = "loading-circle-mask";
            clipContainer.className = "loading-circle-clip";

            maskContainer.appendChild(clipContainer);
            maskContainer.appendChild(loading.dom);
        }

        if(!maskContainer.parentNode){
            document.body.appendChild(maskContainer);
        }

        clipContainer.style.top = "0px";
        loading.dom.innerHTML = txt + template;

        return loading;
    };

    LoadingCircle.end = function(){
         if(loading && maskContainer.parentNode){
            maskContainer.parentNode.removeChild(maskContainer);
        }
    };

    LoadingCircle.getDom = function(){
        var dom = document.createElement("div");
        dom.className = "loading-circle";
        dom.innerHTML = template;
        return dom;
    };

    var cssArr = [];
    cssArr.push(
             ".loading-circle{ " +
             "color: #fff;"+
             "font-size: 28px;"+
             "margin: auto;" +
             "position:relative;" +
             "top:50%;"+
             "text-align: center;"+
             "-webkit-transform: translate3d(0,-50%,0);"+
            "}"
    );


    cssArr.push(
            ".loading-circle-mask{ " +
            "position: absolute; " +
            "top:0;left:0;z-index:9999;width:100%;height:100%" +
            "}"
    );

    cssArr.push(
            ".loading-circle-clip{ " +
            "background:#000;" +
            "opacity:0.5;position:absolute;width:100%;height:100%;" +
            "}"
    );

    if(!document.getElementById("style-loading-circle-animation")) {
        var styleNode = document.createElement("style");
        styleNode.type = "text/css";
        styleNode.id = "style-loading-circle-animation";
        styleNode.innerHTML = cssArr.join("");
        document.head.appendChild(styleNode);
    }

    window.LoadingCircle = LoadingCircle;
})();