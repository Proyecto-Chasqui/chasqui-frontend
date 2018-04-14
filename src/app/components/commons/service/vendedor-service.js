(function() {
	'use strict';

	angular.module('chasqui').service('vendedorService', vendedorService);

	function vendedorService($log, REST_ROUTES, StateCommons, promiseService) {
		var vm = this;
		//este valor esta disponible para multicatalogo
		//debe obtenerse de alguna manera dinamica
		//ya que con el mismo se obtienen los contextos de los vendedores.
		var nombreVendedor = "demo"; 

		vm.verPuntosDeEntrega = function(){
			$log.debug(" service verPuntosDeEntrega ");
			return promiseService.doGetPrivate(REST_ROUTES.verPuntosDeEntrega(nombreVendedor), {});
		}

		vm.obtenerConfiguracionVendedor = function(){
			return promiseService.doGetPrivate(REST_ROUTES.seller(nombreVendedor), {});
		}
	}
})(); // anonimo
