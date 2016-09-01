define([], function(){
	var lifeInsuranceModel = function(){};

	lifeInsuranceModel.prototype.getLifeInsuranceCard = function(options, successCB, errorCB){
		var url = utils.serverConfig.serverUrl + "/ls/services/dt/productService/searchProducts";
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

	lifeInsuranceModel.prototype.getCompanies = function(successCB, errorCB){
		var url = utils.serverConfig.serverUrl + "/ls/services/dt/productService/getCompanies";
		$.ajax({
			method: "GET",
			url: url,
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
	}


	return new lifeInsuranceModel();
});