(function() {
	'use strict';

	angular.module('chasqui').service('productoService', productoService);

	function productoService(restProxy, $q, $log, REST_ROUTES, StateCommons, promiseService, ToastCommons, $stateParams, catalogs_dao) {
		var vm = this;

		vm.getCategorias = function() {
			$log.debug(" service getCategorias ");
			return promiseService.doGet(REST_ROUTES.categorias(catalogs_dao.getCatalogByShortName($stateParams.catalogShortName).id), {});
		}

		vm.getMedallas = function() {
			$log.debug(" service getMedallas ");
			return promiseService.doGet(REST_ROUTES.medallasProducto, {});
		}

		vm.getMedallasProductor = function() {
			$log.debug(" service getMedallasProdcutor ");
			return promiseService.doGet(REST_ROUTES.medallasProductor, {});
		}

		vm.getProductosDestacados = function() {
			$log.debug(" service getProductosDestacados ");
			return promiseService.doGet(REST_ROUTES.productosDestacadosByVendedor(catalogs_dao.getCatalogByShortName($stateParams.catalogShortName).id), {});
		}
		//crear funcion de REST
		vm.getProductosByMultiplesFiltros = function(params){
			$log.debug(" service getProductosByMultiplesFiltros ");
			return promiseService.doPostPublic(REST_ROUTES.productosByMultiplesFiltros(catalogs_dao.getCatalogByShortName($stateParams.catalogShortName).id), params);
		}

		vm.getProductosSinFiltro = function(params) {
			$log.debug(" service getProductosSinFiltro ");
			return promiseService.doPostPublic(REST_ROUTES.productosSinFiltro(catalogs_dao.getCatalogByShortName($stateParams.catalogShortName).id), params);
		}

		vm.getProductosByCategoria = function(params) {
			$log.debug(" service getProductosByCategoria ");
			return promiseService.doPostPublic(REST_ROUTES.productosByCategoria, params);
		}

		vm.getProductosByProductor = function(params) {
			$log.debug(" service getProductosByProductor ");
			return promiseService.doPostPublic(REST_ROUTES.productosByProductor, params);
		}

		vm.getProductosByMedalla = function(params) {
			$log.debug(" service getProductosByMedalla ");
			return promiseService.doPostPublic(REST_ROUTES.productosByMedalla, params);
		}

		vm.getProductosByMedallaProductor = function(params) {
			$log.debug(" service getProductosByMedallaProductor ");
			return promiseService.doPostPublic(REST_ROUTES.productosByMedallaProductor, params);
		}

		vm.getProductosByQuery = function(params) {
			$log.debug(" service getProductosByQuery ");
			return promiseService.doPostPublic(REST_ROUTES.productosByQuery, params);
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

			return promiseService.doPut(REST_ROUTES.agregarPedidoIndividual, params, doNoOk);
		}

		vm.crearPedidoIndividual = function(params, doNoOK) {
			$log.debug(" service crearPedidoIndividual ");

			return promiseService.doPost(REST_ROUTES.crearPedidoIndividual, params, doNoOK);
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

			return promiseService.doGetPrivate(REST_ROUTES.verPedidoIndividual(catalogs_dao.getCatalogByShortName($stateParams.catalogShortName).id), {}, doNoOk);
		}

		vm.quitarProductoIndividual = function(params) {
			$log.debug(" service quitarProductoIndividual ");
			return promiseService.doPut(REST_ROUTES.quitarProductoIndividual, params);
		}

		vm.cancelarPedidoIndividual = function(id) {
			$log.debug(" service cancelarPedidoIndividual ");
			return promiseService.doDelete(REST_ROUTES.cancelarPedidoIndividual(id), {});
		}

		vm.verDirecciones = function(params) {
			$log.debug(" service verDirecciones ");
			return promiseService.doGetPrivate(REST_ROUTES.verDirecciones, {});
		}

		vm.imagenProducto = function(id) {
			$log.debug(" service verDirecciones ");
			return promiseService.doGet(REST_ROUTES.imagenProducto(id), {});
		}

		vm.confirmarPedidoIndividual = function(params) {
			return promiseService.doPost(REST_ROUTES.confirmarPedidoIndividual, params);
		}

	} // function
})(); // anonimo
