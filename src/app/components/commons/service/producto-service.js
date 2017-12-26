(function() {
	'use strict';

	angular.module('chasqui').service('productoService', productoService);

	function productoService(restProxy, $q, $log, CTE_REST, StateCommons, promiseService, ToastCommons) {
		var vm = this;

		vm.getCategorias = function() {
			$log.debug(" service getCategorias ");
			return promiseService.doGet(CTE_REST.categorias(StateCommons.vendedor().id), {});
		}

		vm.getMedallas = function() {
			$log.debug(" service getMedallas ");
			return promiseService.doGet(CTE_REST.medallasProducto, {});
		}

		vm.getMedallasProductor = function() {
			$log.debug(" service getMedallasProdcutor ");
			return promiseService.doGet(CTE_REST.medallasProductor, {});
		}

		vm.getProductosDestacados = function() {
			$log.debug(" service getProductosDestacados ");
			return promiseService.doGet(CTE_REST.productosDestacadosByVendedor(StateCommons.vendedor().id), {});
		}
		//crear funcion de REST
		vm.getProductosByMultiplesFiltros = function(params){
			$log.debug(" service getProductosByMultiplesFiltros ");
			return promiseService.doPostPublic(CTE_REST.productosByMultiplesFiltros(StateCommons.vendedor().id), params);
		}

		vm.getProductosSinFiltro = function(params) {
			$log.debug(" service getProductosSinFiltro ");
			return promiseService.doPostPublic(CTE_REST.productosSinFiltro(StateCommons.vendedor().id), params);
		}

		vm.getProductosByCategoria = function(params) {
			$log.debug(" service getProductosByCategoria ");
			return promiseService.doPostPublic(CTE_REST.productosByCategoria, params);
		}

		vm.getProductosByProductor = function(params) {
			$log.debug(" service getProductosByProductor ");
			return promiseService.doPostPublic(CTE_REST.productosByProductor, params);
		}

		vm.getProductosByMedalla = function(params) {
			$log.debug(" service getProductosByMedalla ");
			return promiseService.doPostPublic(CTE_REST.productosByMedalla, params);
		}

		vm.getProductosByMedallaProductor = function(params) {
			$log.debug(" service getProductosByMedallaProductor ");
			return promiseService.doPostPublic(CTE_REST.productosByMedallaProductor, params);
		}

		vm.getProductosByQuery = function(params) {
			$log.debug(" service getProductosByQuery ");
			return promiseService.doPostPublic(CTE_REST.productosByQuery, params);
		}

		vm.agregarPedidoIndividual = function(params) {
			$log.debug(" service agregarPedidoIndividual ");

			function doNoOk(response) {
				if (response.status == 404) {
					ToastCommons.mensaje(response.data.error);
				} else {
					ToastCommons.mensaje("algo fallo !");
				}
			}

			return promiseService.doPut(CTE_REST.agregarPedidoIndividual, params, doNoOk);
		}

		vm.crearPedidoIndividual = function(params, doNoOK) {
			$log.debug(" service crearPedidoIndividual ");

			return promiseService.doPost(CTE_REST.crearPedidoIndividual, params, doNoOK);
		}

		vm.verPedidoIndividual = function(params) {
			$log.debug(" service verPedidoIndividual ");

			function doNoOk(response) {
				$log.debug("--- callPedidoIndividual ", response.data);

				if (response.status == 404) {
					ToastCommons.mensaje("Noy  hay pedidos !");
				} else {
					ToastCommons.mensaje("algo fallo !");
				}
			}

			return promiseService.doGetPrivate(CTE_REST.verPedidoIndividual(StateCommons.vendedor().id), {}, doNoOk);
		}

		vm.quitarProductoIndividual = function(params) {
			$log.debug(" service quitarProductoIndividual ");
			return promiseService.doPut(CTE_REST.quitarProductoIndividual, params);
		}

		vm.cancelarPedidoIndividual = function(id) {
			$log.debug(" service cancelarPedidoIndividual ");
			return promiseService.doDelete(CTE_REST.cancelarPedidoIndividual(id), {});
		}

		vm.verDirecciones = function(params) {
			$log.debug(" service verDirecciones ");
			return promiseService.doGetPrivate(CTE_REST.verDirecciones, {});
		}

		vm.imagenProducto = function(id) {
			$log.debug(" service verDirecciones ");
			return promiseService.doGet(CTE_REST.imagenProducto(id), {});
		}

		vm.confirmarPedidoIndividual = function(params) {
			return promiseService.doPost(CTE_REST.confirmarPedidoIndividual, params);
		}
		/////////////////////////////////////
		//////////// M O C K S 
		/*	
		vm.productosPedidoByUser = function (params) {
			$log.debug(" service agregarPedidoIndividual ");

	        var defered = $q.defer();
	        var promise = defered.promise;
	        
	        restProxy.get(CTE_REST.productosPedidoByUser(StateCommons.vendedor().id), {},      
	        		function doOk(response) {defered.resolve(response);},
					function doNoOk(response) {defered.reject(response);}
	        );
		 	 
	        return promise;
	    }*/


	} // function
})(); // anonimo
