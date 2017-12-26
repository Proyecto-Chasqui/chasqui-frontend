(function() {
	'use strict';

	angular.module('chasqui').service('us', us);

	function us(i18nService) {
		var vm = this;

		vm.isUndefinedOrNull = function(val) {
			return angular.isUndefined(val) || val === null;
		}

		vm.isEmpty = function(val) {
			return angular.isUndefined(val) || val === null || val.trim().length === 0;
		}

		vm.contieneCadena = function(stringA, stringB) {
			return stringA.indexOf(stringB) != -1;
		}

		vm.translate = function(key) {
			return i18nService.get(key);
		}

	} // function
})(); // anonimo
