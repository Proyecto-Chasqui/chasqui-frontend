(function() {
	'use strict';

	angular.module('chasqui').service('vendedorService', vendedorService);

	function vendedorService($log, REST_ROUTES, StateCommons, promiseService, contextPurchaseService) {
		var vm = this;
		var nombreVendedor;

		vm.verPuntosDeEntrega = function(){
			function filldata(response){
				nombreVendedor = response.nombreCorto;
				return promiseService.doGetPrivate(REST_ROUTES.verPuntosDeEntrega(nombreVendedor), {});
			}	
			return contextPurchaseService.getSelectedCatalog().then(filldata);			
		}

		vm.obtenerConfiguracionVendedor = function(){

			function filldata(response){
				nombreVendedor = response.nombreCorto;
				return promiseService.doGetPrivate(REST_ROUTES.seller(nombreVendedor), {});
			}	
			return contextPurchaseService.getSelectedCatalog().then(filldata);		
		}

	}
})(); // anonimo
