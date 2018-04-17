(function() {
	'use strict';

	angular.module('chasqui').service('vendedorService', vendedorService);

	function vendedorService($log, REST_ROUTES, StateCommons, promiseService, contextPurchaseService) {
		var vm = this;
		var nombreVendedor;

		function filldata(response){
			nombreVendedor = response.nombreCorto;
		}
		
		contextPurchaseService.getSelectedCatalog().then(filldata);

		vm.verPuntosDeEntrega = function(){
			return promiseService.doGetPrivate(REST_ROUTES.verPuntosDeEntrega(nombreVendedor), {});
		}

		vm.obtenerConfiguracionVendedor = function(){
			return promiseService.doGetPrivate(REST_ROUTES.seller(nombreVendedor), {});
		}

	}
})(); // anonimo
