define([], function(){
	var myCustomerModel = function(){};
	myCustomerModel.prototype.queryAgentCustomers = function(options, cb_ok, cb_err){
		var url = utils.serverConfig.serverUrl + "/ls/services/dt/productService/getClientList";
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(options),
			contentType: "application/json",
			dataType: "json",
			processData: false,
			success: function(data){
				cb_ok && cb_ok(data);
			},
			error: function(data){
				cb_err && cb_err(data);
			}
		});

	};

	return new myCustomerModel();
});