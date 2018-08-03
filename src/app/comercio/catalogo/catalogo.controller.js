(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('CatalogoController', CatalogoController);

	/**
	 * Pagina donde se muestran los productos. Contiene los filtros y el
	 * contexto de compra , pero NO la lista de productos la cual se incluye
	 */
	function CatalogoController($scope, $rootScope, $log, URLS, REST_ROUTES, $timeout, StateCommons, productorService,
		productoService, ToastCommons, gccService, us, $mdSidenav, $state, usuario_dao, navigation_state, contextPurchaseService) {

		$log.debug("CatalogoController ..... grupoSelected");

		navigation_state.goCatalogTab();
		var vm = this;

		vm.toggleLeft = buildToggler('left');
		vm.toggleRight = buildToggler('right');

		function buildToggler(componentId) {
			return function() {
				$mdSidenav(componentId).toggle();
			};
		}

		vm.isLogued = usuario_dao.isLogged();

		// vm.categorias = ['categorias 1', 'categorias 2 ', 'categorias 3', 'categorias
		// 4'];
		vm.categorias = [];
		vm.productores = [];
		vm.medallas = [];
		vm.medallasProductor = [];
		vm.query = '';


		vm.paginaProducto;
		vm.tipoFiltro = 'CATEGORIA'; // PRODUCTOR / MEDALLA / QUERY
		vm.queryText;
		vm.categoriaSelect;
		vm.productorSelect;
		vm.medallaSelect; // Lista de sellos en un futuro.
		vm.medallaProductorSelect;
		vm.sinFiltroSelect;

		vm.urlBase = URLS.be_base;

		vm.filtrar = function() {
			filtrarMultiple();
		}

		vm.limpiarFiltros = function limpiarFiltros(){
			vm.categoriaSelect = null;
			vm.productorSelect = null;
			vm.medallaSelect = null;
			vm.sinFiltroSelect = null;
			vm.medallaProductorSelect = null;
			vm.queryText = null;
			filtrarMultiple();
		}

		function filtrarMultiple(){
			var filtros = {};
			filtros.query = vm.queryText;
			filtros.categoria = vm.categoriaSelect;
			filtros.productor = vm.productorSelect;
			filtros.sello = vm.medallaSelect;
			filtros.selloProductor = vm.medallaProductorSelect;
			doFiltrar(filtros);
		};

		var doFiltrar = function(valor) {
			$rootScope.$broadcast('filterEvent', valor); // llama al evento del
			// list-producto-controller
		}


		// / CALL REST

		function callCategorias() {
			productoService.getCategorias()
				.then(function(response) {
					vm.categorias = response.data;
				})

		}

		function callProductores() {
			productorService.getProductores()
				.then(function(response) {
					vm.productores = response.data;
				})
		}

		function callMedallas() {
			productoService.getMedallas()
				.then(function(response) {
					vm.medallas = vm.medallas.concat(response.data);
				})
		}

		function callMedallasProductores() {
			productoService.getMedallasProductor()
				.then(function(response) {
					vm.medallasProductor = response.data;
				})
		}

		callCategorias();
		callProductores();
		callMedallas();
		callMedallasProductores();

	}
})();
