(function() {
	'use strict';

	angular.module('chasqui').service('vendedorService', vendedorService);

	function vendedorService($log, REST_ROUTES, StateCommons, promiseService, $stateParams, contextPurchaseService) {
		var vm = this;
		var nombreVendedor;
		var sellerPromiseConfig;
		var sellerPromisePageConfig;

		vm.verPuntosDeEntrega = function(){
			function filldata(response){
				nombreVendedor = response.nombreCorto;
				return promiseService.doGetPrivate(REST_ROUTES.verPuntosDeEntrega(nombreVendedor), {});
			}	
			return contextPurchaseService.getSelectedCatalog().then(filldata);			
		}

		vm.obtenerConfiguracionVendedor = function(){
			if(sellerPromiseConfig == null){
				nombreVendedor = $stateParams.catalogShortName;
				sellerPromiseConfig = promiseService.doGetPrivate(REST_ROUTES.seller(nombreVendedor), {});
				return sellerPromiseConfig;
			}else{
				return sellerPromiseConfig;
			}
		
		}

		vm.verDatosDePortada = function(){
			if(sellerPromisePageConfig == null){
				nombreVendedor = $stateParams.catalogShortName;
				sellerPromisePageConfig = promiseService.doGetPrivate(REST_ROUTES.datosDePortada(nombreVendedor), {});
				return sellerPromisePageConfig;
			}else{
				return sellerPromisePageConfig;
			}
		}

	}
})(); // anonimo
