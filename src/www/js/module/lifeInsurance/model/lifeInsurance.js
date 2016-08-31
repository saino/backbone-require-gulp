define([], function(){
	var lifeInsuranceModel = function(){};

	lifeInsuranceModel.prototype.getLifeInsuranceCard = function(errorCB, successCB){
		var url = utils.serverConfig.serverUrl + "/ls/services/dt/productService/searchProducts";
		var options = { 
			"encryptedUserData": "QKHoHCHlTFwrBzCO8oY0l3S/TYOEKh66n5TxkNeVCuA3wOlrnDesxD7eOFE1VqVToOYrXB5X5CkCx3huc3yXfvknChUaBEjKeGyYfJSKzUVZA+1gisIy5aUmEZZSZimrHKT0NWJ9IwnRQxCdPsXKSK5k1noMI7C3LxZYwl2dcm0=",
			"searchWords": "健康人生计划",
			// "saleTypeIds": [],  //选填，种类ID，来自高级过滤接口的返回值
			// "examPremOrder": "desc",	//选填，示例保费排序方式。asc:升序，desc: 降序
			// "rightIds": [],		//选填，权益ID，来自高级过滤接口的返回值
			// "companyIds": [],	//选填，公司ID，来自高级过滤接口的返回值
			"sortOption": 2     //选填，排序选项。2：按浏览量排序，3：按上架时间排序
		};
		// $.post(url, options, function(data){
		// 	console.log(data);
		// })

		
		$.ajax({
			type: "POST",
			url: url,
			data: options,
			// dataType: "jsonp",
			success: function(){
				console.log("success!!!");
			},
			error: function(){
				console.log("error");
			}

		});
	};

	return new lifeInsuranceModel();
});