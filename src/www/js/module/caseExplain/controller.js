define([
	'module/caseExplain/views/caseExplain'
], function(caseExplainView){

	return {
		caseExplain: function(){
			app.page.show(caseExplainView);
		}
	}

});