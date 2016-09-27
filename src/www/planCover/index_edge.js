/**
 * Adobe Edge: symbol definitions
 */
(function($, Edge, compId){
//images folder
var im='images/';

var fonts = {};
var opts = {
    'gAudioPreloadPreference': 'auto',

    'gVideoPreloadPreference': 'auto'
};
var resources = [
];
var symbols = {
"stage": {
    version: "4.0.0",
    minimumCompatibleVersion: "4.0.0",
    build: "4.0.0.359",
    baseState: "Base State",
    scaleToFit: "both",
    centerStage: "both",
    initialState: "Base State",
    gpuAccelerate: false,
    resizeInstances: false,
    content: {
            dom: [
            {
                id: 'logo',
                type: 'image',
                rect: ['76px', '76px','274px','68px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"logo.png",'0px','0px']
            },
            {
                id: 'Text',
                display: 'block',
                type: 'text',
                rect: ['194px', '1055px','391px','68px','auto', 'auto'],
                opacity: 1,
                text: "敬请陈陈陈陈先生",
                font: ['Arial, Helvetica, sans-serif', 56, "rgba(255,255,255,1.00)", "normal", "none", ""]
            },
            {
                id: 'Group2',
                type: 'group',
                rect: ['139px', '657px','480','293','auto', 'auto'],
                c: [
                {
                    id: 'Group',
                    type: 'group',
                    rect: ['0px', '0px','480','293','auto', 'auto'],
                    c: [
                    {
                        id: 'xin',
                        type: 'image',
                        rect: ['0px', '0px','480px','293px','auto', 'auto'],
                        fill: ["rgba(0,0,0,0)",im+"xin.png",'0px','0px']
                    },
                    {
                        id: 'xint',
                        type: 'image',
                        rect: ['0px', '0px','480px','168px','auto', 'auto'],
                        fill: ["rgba(0,0,0,0)",im+"xint.png",'0px','0px']
                    }]
                },
                {
                    id: 'klogo',
                    type: 'image',
                    rect: ['199px', '112px','91px','90px','auto', 'auto'],
                    fill: ["rgba(0,0,0,0)",im+"klogo.png",'0px','0px']
                }]
            },
            {
                id: 'tCopy',
                type: 'image',
                rect: ['88px', '648px','597px','257px','auto', 'auto'],
                clip: ['rect(0px 597px 257px 0px)'],
                fill: ["rgba(0,0,0,0)",im+"t.png",'0px','0px']
            }],
            symbolInstances: [

            ]
        },
    states: {
        "Base State": {
            "${_xint}": [
                ["style", "top", '0px'],
                ["transform", "scaleY", '1'],
                ["transform", "scaleX", '1'],
                ["style", "left", '0px'],
                ["style", "-webkit-transform-origin", [0,0], {valueTemplate:'@@0@@% @@1@@%'} ],
                ["style", "-moz-transform-origin", [0,0],{valueTemplate:'@@0@@% @@1@@%'}],
                ["style", "-ms-transform-origin", [0,0],{valueTemplate:'@@0@@% @@1@@%'}],
                ["style", "msTransformOrigin", [0,0],{valueTemplate:'@@0@@% @@1@@%'}],
                ["style", "-o-transform-origin", [0,0],{valueTemplate:'@@0@@% @@1@@%'}]
            ],
            "${_Group2}": [
                ["transform", "scaleX", '4.7'],
                ["style", "opacity", '0'],
                ["transform", "scaleY", '4.7'],
                ["transform", "rotateZ", '-92deg']
            ],
            "${_klogo}": [
                ["style", "top", '112px'],
                ["style", "opacity", '1'],
                ["style", "left", '199px']
            ],
            "${_Group}": [
                ["style", "top", '0px'],
                ["style", "left", '0px']
            ],
            "${_Text}": [
                ["color", "color", 'rgba(255,255,255,1.00)'],
                ["style", "opacity", '1'],
                ["style", "left", '183px'],
                ["style", "font-size", '56px'],
                ["style", "top", '1055px'],
                ["style", "overflow", 'visible'],
                ["style", "height", '68px'],
                ["style", "display", 'block'],
                ["style", "width", '565px']
            ],
            "${_xin}": [
                ["style", "top", '0px'],
                ["style", "left", '0px']
            ],
            "${_Stage}": [
                ["color", "background-color", 'rgba(108,156,107,1.00)'],
                ["style", "overflow", 'hidden'],
                ["style", "height", '1334px'],
                ["gradient", "background-image", [50,50,true,'farthest-corner',[['rgba(146,174,245,1.00)',0],['rgba(110,149,246,1.00)',100]]]],
                ["style", "width", '750px']
            ],
            "${_logo}": [
                ["style", "top", '76px'],
                ["style", "left", '76px'],
                ["style", "clip", [0,0,68,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
            ],
            "${_tCopy}": [
                ["transform", "scaleY", '0.45'],
                ["transform", "rotateZ", '-369deg'],
                ["transform", "scaleX", '0.45'],
                ["style", "opacity", '0'],
                ["style", "clip", [0,510,257,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ],
                ["motion", "location", '386.5px 776.5px']
            ]
        }
    },
    timelines: {
        "Default Timeline": {
            fromState: "Base State",
            toState: "",
            duration: 4360,
            autoPlay: true,
            timeline: [
                { id: "eid118", tween: [ "style", "${_Text}", "width", '565px', { fromValue: '565px'}], position: 0, duration: 0 },
                { id: "eid74", tween: [ "style", "${_logo}", "clip", [0,280,68,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,0,68,0]}], position: 3960, duration: 400 },
                { id: "eid11", tween: [ "transform", "${_Group2}", "rotateZ", '0deg', { fromValue: '-92deg'}], position: 0, duration: 720, easing: "easeOutSine" },
                { id: "eid92", tween: [ "transform", "${_Group2}", "rotateZ", '0deg', { fromValue: '0deg'}], position: 760, duration: 0, easing: "easeOutSine" },
                { id: "eid103", tween: [ "transform", "${_tCopy}", "scaleY", '0.45', { fromValue: '0.45'}], position: 2840, duration: 0 },
                { id: "eid104", tween: [ "transform", "${_tCopy}", "scaleY", '1', { fromValue: '0.45'}], position: 2960, duration: 520 },
                { id: "eid106", tween: [ "motion", "${_tCopy}", [[386.5, 776.5, 0, 0],[381.5, 367.8, 0, 0]]], position: 2840, duration: 640, easing: "easeInSine" },
                { id: "eid107", tween: [ "motion", "${_tCopy}", [[381.5, 367.8, 0, 0],[380.5, 367.8, 0, 0]]], position: 4360, duration: 0 },
                { id: "eid30", tween: [ "style", "${_klogo}", "opacity", '0', { fromValue: '1'}], position: 2440, duration: 80 },
                { id: "eid84", tween: [ "color", "${_Stage}", "background-color", 'rgba(108,156,107,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(108,156,107,1.00)'}], position: 0, duration: 0 },
                { id: "eid21", tween: [ "style", "${_Group2}", "opacity", '1', { fromValue: '0'}], position: 0, duration: 440, easing: "easeInOutQuint" },
                { id: "eid90", tween: [ "style", "${_Group2}", "opacity", '0.9900000095367432', { fromValue: '1'}], position: 440, duration: 280, easing: "easeOutSine" },
                { id: "eid108", tween: [ "style", "${_tCopy}", "opacity", '1', { fromValue: '0'}], position: 2840, duration: 40 },
                { id: "eid87", tween: [ "gradient", "${_Stage}", "background-image", [50,50,true,'farthest-corner',[['rgba(146,174,245,1.00)',0],['rgba(110,149,246,1.00)',100]]], { fromValue: [50,50,true,'farthest-corner',[['rgba(146,174,245,1.00)',0],['rgba(110,149,246,1.00)',100]]]}], position: 0, duration: 0 },
                { id: "eid109", tween: [ "style", "${_tCopy}", "clip", [0,439,257,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,510,257,0]}], position: 3400, duration: 80 },
                { id: "eid110", tween: [ "style", "${_tCopy}", "clip", [0,600,257,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,439,257,0]}], position: 3480, duration: 335 },
                { id: "eid105", tween: [ "transform", "${_tCopy}", "rotateZ", '0deg', { fromValue: '-369deg'}], position: 2840, duration: 640 },
                { id: "eid8", tween: [ "transform", "${_Group2}", "scaleY", '0.77', { fromValue: '4.7'}], position: 0, duration: 800, easing: "easeOutSine" },
                { id: "eid17", tween: [ "transform", "${_Group2}", "scaleY", '0.72', { fromValue: '0.77'}], position: 800, duration: 80, easing: "easeOutSine" },
                { id: "eid27", tween: [ "transform", "${_Group2}", "scaleY", '0.44', { fromValue: '0.72'}], position: 1920, duration: 1560, easing: "easeOutSine" },
                { id: "eid120", tween: [ "style", "${_Text}", "left", '183px', { fromValue: '183px'}], position: 0, duration: 0 },
                { id: "eid79", tween: [ "style", "${_Text}", "display", 'block', { fromValue: 'block'}], position: 0, duration: 0 },
                { id: "eid111", tween: [ "transform", "${_tCopy}", "scaleX", '0.45', { fromValue: '0.45'}], position: 2840, duration: 0 },
                { id: "eid112", tween: [ "transform", "${_tCopy}", "scaleX", '1', { fromValue: '0.45'}], position: 2960, duration: 520 },
                { id: "eid7", tween: [ "transform", "${_Group2}", "scaleX", '0.77', { fromValue: '4.7'}], position: 0, duration: 800, easing: "easeOutSine" },
                { id: "eid16", tween: [ "transform", "${_Group2}", "scaleX", '0.72', { fromValue: '0.77'}], position: 800, duration: 80, easing: "easeOutSine" },
                { id: "eid26", tween: [ "transform", "${_Group2}", "scaleX", '0.44', { fromValue: '0.72'}], position: 1920, duration: 1560, easing: "easeOutSine" }            ]
        }
    }
}
};


Edge.registerCompositionDefn(compId, symbols, fonts, resources, opts);

/**
 * Adobe Edge DOM Ready Event Handler
 */
$(window).ready(function() {
     Edge.launchComposition(compId);
});
})(jQuery, AdobeEdge, "EDGE-21266243");
