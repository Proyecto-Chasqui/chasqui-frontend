(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('MedallaController', MedallaController);

	/** @ngInject */
	function MedallaController($log, $stateParams, URLS, REST_ROUTES, $state, StateCommons, productoService) {
		$log.debug('MedallaController ..... ', $stateParams.idMedalla);
		StateCommons.ls.itemMenuSelect = 'medalla'; // TODO cambiar al generar DAOs (mensaje del 11/10)
		var vm = this

		vm.urlBase = URLS.be_base;
		vm.idMedalla = $stateParams.idMedalla; // usar en caso de tener mas
		// datos que mostrar . Vista
		// indivudual
		vm.medalla;
		vm.medallas;
		vm.isVistaUnica = false;
		/*
		 * TODO : caso de mostrar una sola medalla if(vm.idMedalla){
		 * vm.isVistaUnica=true; }
		 */
		vm.verMas = function(item) {
			$log.debug("---ver mas ---", item);

			$state.go('emprendedores', {
				id: item.idVendedor
			});
		}

		// ///////////////




		// /// TODO: en realidad deberia venir dentro del productor
		function callMedallas() {
			productoService.getMedallas()
				.then(function(response) {

					vm.medallas = response.data;

				})

		}

		// ///////////////



		callMedallas();





	}
})();
