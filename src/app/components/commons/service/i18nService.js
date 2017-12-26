(function() {
	'use strict';

	angular.module('chasqui').service('i18nService', i18nService);

	function i18nService($filter) {
		var vm = this;

		vm.get = function(val) {
			return $filter('translate')(val);
		}

	} // function
})(); // anonimo
