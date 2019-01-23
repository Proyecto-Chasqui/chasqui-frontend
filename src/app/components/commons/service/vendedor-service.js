(function() {
	'use strict';

	angular.module('chasqui').service('vendedorService', vendedorService);

	function vendedorService($log, REST_ROUTES, StateCommons, promiseService, $stateParams, contextPurchaseService) {
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
				nombreVendedor = $stateParams.catalogShortName;
				return promiseService.doGetPrivate(REST_ROUTES.seller(nombreVendedor), {});		
		}

		vm.verDatosDePortada = function(){
				nombreVendedor = $stateParams.catalogShortName;
				return promiseService.doGetPrivate(REST_ROUTES.datosDePortada(nombreVendedor), {});
		}

	}
})(); // anonimo
