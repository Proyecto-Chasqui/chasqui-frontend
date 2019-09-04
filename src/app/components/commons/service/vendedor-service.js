(function() {
	'use strict';

	angular.module('chasqui').service('vendedorService', vendedorService);

	function vendedorService($log, REST_ROUTES, StateCommons, promiseService, $stateParams, contextPurchaseService) {
		var vm = this;
		var nombreVendedor;
		var sellerPromiseConfig = {};
		var sellerPromisePageConfig = {};

		vm.verPuntosDeEntrega = function(){
			function filldata(response){
				nombreVendedor = response.nombreCorto;
				return promiseService.doGetPrivate(REST_ROUTES.verPuntosDeEntrega(nombreVendedor), {});
			}	
			return contextPurchaseService.getSelectedCatalog().then(filldata);			
		}

		vm.obtenerConfiguracionVendedor = function(){
			nombreVendedor = $stateParams.catalogShortName;
			if(sellerPromiseConfig[nombreVendedor] == null){				
				sellerPromiseConfig[nombreVendedor] = promiseService.doGetPrivate(REST_ROUTES.seller(nombreVendedor), {});
				return sellerPromiseConfig[nombreVendedor];
			}else{
				return sellerPromiseConfig[nombreVendedor];
			}
		
		}

		vm.verDatosDePortada = function(){
			nombreVendedor = $stateParams.catalogShortName;
			if(sellerPromisePageConfig[nombreVendedor] == null){
				sellerPromisePageConfig[nombreVendedor] = promiseService.doGetPrivate(REST_ROUTES.datosDePortada(nombreVendedor), {});
				return sellerPromisePageConfig[nombreVendedor];
			}else{
				return sellerPromisePageConfig[nombreVendedor];
			}
		}

	}
})(); // anonimo
