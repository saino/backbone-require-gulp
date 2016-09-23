/**
 * Created by fishYu on 2016/9/5.
 * 我的客户页面
 */
define([
    'common/base/base_view',
    'text!module/personalCustomer/templates/personalCustomer.html',
    'module/personalCustomer/model/personalCustomerModel',
    "msgbox"
], function (BaseView, Tpl, personalCustomerModel, MsgBox) {
    var customerItemTemp = '<div class="personal-customer-item">'+
        '<div class="personal-customer-item-title" id={data-filter}>{data-filter}</div>'+
        '<div class="personal-customer-item-content">'+
            '{customerItems}' + //<p>588464</p>
        '</div>'+
    '</div>';
    var PersonalCustomerView = BaseView.extend({
        template: _.template(Tpl),
        id:"personal-customer-container",
        currentUserId: "",     //当前用户ID
        initListData : [],     //初始化数据列表
        currentListData : [],     //当前用户数据的列表
        optionType: "",   //路由参数类型
        ui:{
            topCon : ".top-title",
            backBtn : ".top-title-left", //点击返回
            customerSearchContainer : ".personal-customer-search-container",    //搜索框
            personalCustomerMain: "#personal-customer-main",
            customerFilter : "#customer-filter",           //右边的过滤器
            customerSearchTxt: ".customer-search-txt",        //搜索内容框
            customerSearchBtn : ".customer-search-icon"      //搜索按钮
        },
        events:{
            "tap @ui.backBtn":"onBackBtnHandler",
            "tap @ui.customerSearchBtn": "onCustomerSearchBtnHandler",      //搜索按钮
            // "input @ui.customerSearchTxt": "onCustomerSearchInputHandler",      //输入内容实时搜索
            "tap @ui.customerFilter": "onCustomerFilterBtnHandler"     , //过滤定位
            "tap @ui.personalCustomerMain": "onPersonalCustomerMainHandler"     //点击客户容器
        },

        onPersonalCustomerMainHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            var self = this;
            var $target = $(event.target);
            var customerObj = {};
            if($target.attr("data-type") == "customer"){
                customerObj.name = $target.attr("data-name");
                customerObj.gender = $target.attr("data-gender");
                customerObj.age = $target.attr("data-age");
                customerObj.optionType = self.optionType;
                app.triggerMethod("common:import:user", customerObj);
                app.goBack();
            }
            // console.log(event.target);
        },


        initialize:function(){

        },
        onRender:function(){
            var self = this;
            if(device.ios()){
                self.ui.topCon.css("padding-top",utils.toolHeight+"px");
            }
            setTimeout(function(){
                var height = self.ui.topCon.outerHeight(true) + self.ui.customerSearchContainer.outerHeight(true);
                self.ui.personalCustomerMain.css({height: "calc(100% - " + height + "px)"});
                self.ui.customerFilter.css({height: "calc(100% - " + height + "px)", top : height + "px"});
            }, 0);
        },
        loadData: function(options){
            var self = this;
            // console.log(options,"sssss");
            personalCustomerModel.queryAgentCustomers(options, function(data){
                console.log(data);
                if(data.status == "0"){
                    var customers = data.customers;
                    // var customers = {"A": [{"id": 0, "name": "A0", "age": 19, "gender": "女"}, {"id": 1, "name": "A1", "age": 19, "gender": "女"}, {"id": 2, "name": "A2", "age": 19, "gender": "女"}], "B": [{"id": 3, "name": "B3", "age": 19, "gender": "女"}], "S": [{"id": 4, "name": "S4", "age": 19, "gender": "女"}], "H": [{"id": 5, "name": "H5", "age": 19, "gender": "女"}, {"id": 6, "name": "H6", "age": 19, "gender": "女"}, {"id": 7, "name": "H7", "age": 19, "gender": "女"}], "E": [{"id": 8, "name": "E8", "age": 19, "gender": "女"},{"id": 9, "name": "E9", "age": 19, "gender": "女"}]};

                    var customersArry = new Array(26);
                    for(key in customers){
                        customersArry[key.charCodeAt() - 65] = customers[key];
                    }
                    var customerItemStr = "";
                    for(var i=0; i<customersArry.length; i++){
                        if(customersArry[i]){
                            var obj = customersArry[i];
                            var key = String.fromCharCode(i+65);
                            var customerItems = "";
                            for(var j=0; j<obj.length; j++){
                                customerItems += '<p data-type="customer" data-name="'+obj[j].name+'" data-gender="'+obj[j].gender+'" data-age="'+obj[j].age+'">'+obj[j].name+'</p>';
                            }
                            var realItemTemp = "";
                            if(obj.length){
                                realItemTemp = customerItemTemp.replace(/\{data-filter\}/g, key)
                                .replace("{customerItems}", customerItems);
                            }
                            customerItemStr += realItemTemp;
                        }
                            // console.log(String.fromCharCode(i+65),customersArry[i]);
                    }
                    if(customersArry.length == 0){
                        customerItemStr = '<div class="plan-item-noting">暂无用户数据</div>';
                    }
                    self.ui.personalCustomerMain.html(customerItemStr);
                }else{
                    customerItemStr = '<div class="plan-item-noting">暂无用户数据</div>';
                    self.ui.personalCustomerMain.html(customerItemStr);
                    console.log("数据返回错误", data);
                }
            }, function(error){
                customerItemStr = '<div class="plan-item-noting">暂无用户数据</div>';
                self.ui.personalCustomerMain.html(customerItemStr);
                console.log("数据查询异常", error);
            });
        },

        show: function(){
            // console.log("ccccccc");
            var self = this;
            var options = { 
                "name": "",
                "queryAll": true,
                "encryptedUserData": utils.userObj.id,
            };
            self.loadData(options);
            self.optionType = self.getOption("type");
        },
        pageIn:function(){
            var self = this;

        },
        /**
         * 初始化界面的动态数据
         * @param data
         */
        initView : function(data){
            var self = this;
            var list = data;
            self.currentListData = list;
            var customerItemStr = "";
            if (list.length > 0){
                for (var i = 0; i < list.length; i++){
                    var obj = list[i];
                    var key = "";
                    var values = [];
                    for(key in obj){
                        values = obj[key];
                    }
                    var customerItems = "";
                    for(var j = 0; j < values.length; j++){
                        customerItems += '<p>'+values[j][0]+'</p>'
                    }
                    var realItemTemp = customerItemTemp.replace(/\{data-filter\}/g, key)
                        .replace("{customerItems}", customerItems);
                    customerItemStr += realItemTemp;
                }
                self.ui.personalCustomerMain.html(customerItemStr);
            }else{
                self.ui.personalCustomerMain.html('<div class="plan-item-noting">暂无浏览记录</div>');
            }
            
        },
        /**
         * 点击返回
         * @param e
         */
        onBackBtnHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            app.goBack();
        },
        /**
         *搜索按钮点击事件
         */
        onCustomerSearchInputHandler :function(e){
            var self = this;
            var text = self.ui.customerSearchTxt.val();
            if (text){
                self.customerSearchOperation(text);
            }
        },
        /**
         *搜索按钮点击事件
         */
        onCustomerSearchBtnHandler :function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var text = self.ui.customerSearchTxt.val();
            // if (text){
            //     self.customerSearchOperation(text);
            // }
            console.log(text);
            var options = { 
                "name": text,
                "queryAll": false,
                "encryptedUserData": utils.userObj.id,
            };
            self.loadData(options);
        },
        /**
         *具体搜索实现函数
         */
        customerSearchOperation: function (text) {
            var self = this;
            var data = self.searchNameOrPhoneNumber(text);
            self.initView(data);
        },
        /**
         * 定位快捷标题
         * @param e
         */
        onCustomerFilterBtnHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var target = e.target;
            var $target = $(target);
            var dataTo = $target.attr("data-to");
            //锚点定位
            if(dataTo){
                var obj = document.getElementById(dataTo);
                obj && obj.scrollIntoView();
            }
        },
        /**
         * 模糊搜索，手机号码 或者名字
         */
        searchNameOrPhoneNumber : function(text){
            var self = this;
            var results = [];
            for(var i = 0; i < self.initListData.length; i++){
                var obj = self.initListData[i];
                var valus = [];
                for(var key in obj){
                    valus = obj[key];
                }
                for(var j = 0; j < valus.length; j++){
                    var tem = valus[j];
                    if(tem.toString().indexOf(text) > -1) {
                        results.push(obj);
                        break;
                    }
                }
            }
            return results;
        },
        close:function(){
            var self = this;
            self.remove();
            if(MsgBox && MsgBox.isShow()) {
                MsgBox.clear();
            }
        }
    });
    return PersonalCustomerView;
});
