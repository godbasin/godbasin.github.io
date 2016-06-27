'use strict';

app.factory('CommonInfo', function() {
	var data = '';
	return {
		set: function(data) {
			data = data;
		},
		get: function() {
			return data;
		}
	};
});