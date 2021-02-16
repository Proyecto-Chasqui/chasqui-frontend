(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('CatalogoController', CatalogoController);

	/**
	 * Pagina donde se muestran los productos. Contiene los filtros y el
	 * contexto de compra , pero NO la lista de productos la cual se incluye
	 */
	function CatalogoController($scope, $rootScope, $log, URLS, REST_ROUTES, $timeout, productorService,
		productoService, ToastCommons, webSocketService, gccService, us, $mdSidenav, $state, usuario_dao, navigation_state, contextPurchaseService) {

		$log.debug("CatalogoController ..... grupoSelected");

		navigation_state.goCatalogTab();
		var vm = this;
		vm.webSocketService = webSocketService;
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
		vm.medallasSelected = {
      product: [],
      producer: []
    };
    vm.diffIdMedalla = 10000;
		vm.sinFiltroSelect;

    vm.urlBase = URLS.be_base;
    
    vm.setMedallaSelect = function(id, type){
      var medalla = vm.medallasSelected[type].filter(function(m){
        return m.id == id;
      })[0];

      medalla.selected = !medalla.selected;
      filtrarMultiple();
    }

    vm.getMedallaSelect = function(id, type){
      return vm.medallasSelected[type].filter(function(m){
        return m.id == id;
      })[0].selected;
    }

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
      vm.medallasSelected.product = vm.medallas.map(function(m){
        return {
          id: m.idMedalla,
          selected: false
        }
      })
      vm.medallasSelected.producer = vm.medallasProductor.map(function(m){
        return {
          id: m.idMedalla,
          selected: false
        }
      })
			filtrarMultiple();
		}

		function filtrarMultiple(){
			var query = {};
			query.query = vm.queryText;
			query.categoria = vm.categoriaSelect;
			query.productor = vm.productorSelect;
			query.sello = vm.medallasSelected.product.filter(function(m){
        return m.selected
      }).map(function(m){
        return m.id
      })
      query.selloProductor = vm.medallasSelected.producer.filter(function(m){
        return m.selected
      }).map(function(m){
        return m.id
      })
			doFiltrar(query);
		}

		var doFiltrar = function(query) {
			$rootScope.$broadcast('filterEvent', query); // llama al evento del
			// list-producto-controller
		}


		// / CALL REST

		function callCategorias() {
			productoService.getCategorias()
				.then(function(response) {
					
					vm.categorias = response.data.data.map((data) => productoService.normalizadorCategorias(data));
					//vm.categorias = response.data;
				})

		}

		function callProductores() {
			productorService.getProductores()
				.then(function(response) {
					vm.productores = response.data.data.map((data) => productorService.normalizarProductores(data));
				})
		}

		function callMedallas() {
			productoService.getMedallas()
				.then(function(response) {
					vm.medallas = response.data.data.map((data) => productoService.normalizadorMedallas(data));
          			vm.medallasSelected.product = vm.medallas.map(function(m){
					return {
					id: m.idMedalla,
					selected: false
					}
				})
			})
		}

		function callMedallasProductores() {
			productoService.getMedallasProductor()
				.then(function(response) {
					vm.medallasProductor = response.data.data.map((data) => productoService.normalizadorMedallas(data));
					vm.medallasSelected.producer = vm.medallasProductor.map(function(m){
						return {
						id: m.idMedalla,
						selected: false
						}
					})
				})
		}

		callCategorias();
		callProductores();
		callMedallas();
		callMedallasProductores();

	}
})();
