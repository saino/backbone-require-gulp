define([], function(){
	var lifeInsuranceModel = function(){};

	lifeInsuranceModel.prototype.getLifeInsuranceCard = function(options, successCB, errorCB){
		var url = utils.serverConfig.serverUrl + "/ls/services/dt/productService/searchProducts";
		// var options = { 
		// 	"encryptedUserData": "QKHoHCHlTFwrBzCO8oY0l3S/TYOEKh66n5TxkNeVCuA3wOlrnDesxD7eOFE1VqVToOYrXB5X5CkCx3huc3yXfvknChUaBEjKeGyYfJSKzUVZA+1gisIy5aUmEZZSZimrHKT0NWJ9IwnRQxCdPsXKSK5k1noMI7C3LxZYwl2dcm0=",
		// 	"searchWords": "安行无忧",
		// 	"saleTypeIds": null,  //选填，种类ID，来自高级过滤接口的返回值
		// 	"examPremOrder": "desc",	//选填，示例保费排序方式。asc:升序，desc: 降序
		// 	"rightIds": null,		//选填，权益ID，来自高级过滤接口的返回值
		// 	"companyIds": null,	//选填，公司ID，来自高级过滤接口的返回值
		// 	"sortOption": 1     //选填，排序选项。2：按浏览量排序，3：按上架时间排序
		// };
		// console.log(options);
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(options),
			contentType: "application/json",
			dataType: "json",
			processData: false,
			success: function(data){
				successCB && successCB(data);
			},
			error: function(data){
				errorCB && errorCB(data);
			}
		});

    };



	return new lifeInsuranceModel();
});