(function() {
	'use strict';

	angular.module('chasqui').service('soporteService', soporteService);

	function soporteService($log, REST_ROUTES, promiseService) {
		var vm = this;


		vm.solicitudArrepentimiento = function(solicitud, doNoOK) {
			return promiseService.doPost(REST_ROUTES.solicitudArrepentimiento, solicitud, doNoOK);
		}

	} // function
})(); // anonimo
