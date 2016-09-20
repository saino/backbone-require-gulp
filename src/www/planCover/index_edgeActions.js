/***********************
* Adobe Edge Animate Composition Actions
*
* Edit this file with caution, being careful to preserve 
* function signatures and comments starting with 'Edge' to maintain the 
* ability to interact with these actions from within Adobe Edge Animate
*
***********************/
(function($, Edge, compId){
var Composition = Edge.Composition, Symbol = Edge.Symbol; // aliases for commonly used Edge classes

   //Edge symbol: 'stage'
   (function(symbolName) {
      
      
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         var arrCss = [
         ".animated.flip {",
         "  -webkit-backface-visibility: visible;",
         "  backface-visibility: visible;",
         "  -webkit-animation-name: flip;",
         "  animation-name: flip;",
         "}",
         ".animated {",
         "  -webkit-animation-duration: 0.68s;",
         "  animation-duration: 0.68s;",
         "  -webkit-animation-fill-mode: both;",
         "-webkti-animation-timing-function:ease-out;",
         "  animation-fill-mode: both;",
         "}",
         "@-webkit-keyframes flip {",
         "  from {",
         "    -webkit-transform: perspective(1000px) rotate3d(1, 0, 0, 0deg);",
         "    transform: perspective(1000px) rotate3d(1, 0, 0, 0deg);",
         "  }",
         "  88% {",
         "    -webkit-transform: perspective(1000px)  rotate3d(1, 0, 0, 188.1deg);",
         "    transform: perspective(1000px)  rotate3d(1, 0, 0, 188.1deg);",
         "  }",
         "  to {",
         "    -webkit-transform: perspective(1000px)  rotate3d(1, 0, 0, 188deg);",
         "    transform: perspective(1000px)  rotate3d(1, 0, 0, 188deg);",
         "  }",
         "}"
         ];
         
         var strCss = arrCss.join("");
         var style = document.createElement("style");
         style.type = "text/css";
         style.innerHTML = strCss;
         document.head.appendChild(style);
         

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 1155, function(sym, e) {
         var $txt = sym.$("#Stage_Text");
                  var str = $txt.html(),index = 0,len = str.length;
         
                  $txt.html("");
                  $txt.show();
                  var timer = null;
                  var totalTime = 1080;
                  var speed = totalTime / str.length;
                  function startTyped(speed){
         
                      timer = setInterval(function(){
                          if(index === len){
                              clearInterval(timer);
                              timer = null;
                          }
         
                          $txt.append(str.charAt(index));
                          index++;
                      },speed);
                  }
         
                  startTyped(speed);

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 2360, function(sym, e) {
         var dom = document.getElementById("Stage_xint");
          if(dom){
              dom.className = dom.className + " flip animated";
          }

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 3480, function(sym, e) {
         // insert code here
      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 116, function(sym, e) {
         // insert code here
      });
      //Edge binding end

   })("stage");
   //Edge symbol end:'stage'

})(jQuery, AdobeEdge, "EDGE-21266243");