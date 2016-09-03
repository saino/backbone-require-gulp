define([], function(){
	var browseRecordsModel = function(){};

	browseRecordsModel.prototype.getProductBrowseHistory = function(options, cb_ok, cb_err){

		var url = utils.serverConfig.serverUrl + "/ls/services/dt/productService/getProductBrowseHistory";
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
	browseRecordsModel.prototype.clearBrowseHistory = function(options, cb_ok, cb_err){

		var url = utils.serverConfig.serverUrl + "/ls/services/dt/productService/clearBrowseHistory";
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

	return new browseRecordsModel();
});