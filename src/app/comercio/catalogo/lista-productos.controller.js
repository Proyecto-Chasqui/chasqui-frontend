(function() {
	'use strict';

	angular.module('chasqui').controller('ListaProductosController',
		ListaProductosController);

	/**
	 * @ngInject Lista de productos.
	 */
	function ListaProductosController($scope, $rootScope, $log, URLS, REST_ROUTES,
		$state, ToastCommons, productoService, us, contextCatalogsService,
		$mdDialog, productorService, contextPurchaseService, contextCatalogObserver,
        usuario_dao, $stateParams, addProductService, dialogCommons) {

		$log.debug('ListaProductosController',
			$scope.$parent.$parent.catalogoCtrl.isFiltro1);

		var CANT_ITEMS = REST_ROUTES.PRODUCTOS_X_PAG; // TODO : pasar a constante

		var vm = this;

		vm.otherCtrl = $scope.$parent.$parent.catalogoCtrl.isFiltro1;

		vm.urlBase = URLS.be_base;
		vm.productos = [];
		vm.ultimoFiltro = {};
		vm.medallaSelect = undefined;
		vm.pedidoSelected = undefined;
		vm.grupoSelected = undefined;
		vm.emprendedores = [];
    vm.emprendedorSelect = {};
    vm.activeIndex = 1; // Seteado desde paginador
    vm.lastPage = undefined;

		//////// dialogo medalla
		vm.showPrerenderedDialog = function(medalla) {
			vm.medallaSelect = medalla;
			$mdDialog.show({
				contentElement: '#myDialog',
				parent: angular.element(document.body),
				//targetEvent: ev,
				clickOutsideToClose: true
			});
		};

		vm.showPrerenderedDialogProductor = function(id) {

			angular.forEach(vm.emprendedores, function(empr, key) {
				if (empr.idProductor === id)
					vm.emprendedorSelect = empr;
			});

			$mdDialog.show({
				contentElement: '#productorDialog',
				parent: angular.element(document.body),
				//targetEvent: ev,
				clickOutsideToClose: true
			});

		}

		vm.cerrarDialogoMedalla = function() {
			$mdDialog.hide();
		}

		////////////// dialogo producto

		vm.verProducto = function(productoParam) {
			$mdDialog.show({
					controller: 'ProductoDialogController',
					templateUrl: 'app/comercio/catalogo/producto.dialog.html',
					//     parent: angular.element(document.body),
					//      targetEvent: ev,
					clickOutsideToClose: true,
					fullscreen: false, // Only for -xs, -sm breakpoints.
					locals: { productSelected: productoParam }
				})
				.then(function(answer) {
					//  vm.mensaje = 'You said the information was "' + answer + '".';
				}, function() {
					//  vm.mensaje = 'You cancelled the dialog.';
				});

		}
		////////////// PAGINACION
		// vm.currentPage = 0;
		// vm.paging = {
		// 	total: 0,
		// 	current: 1,
		// 	onPageChanged: loadPages,
		// };

		// function loadPages() {
		// 	console.log('Current page is : ' + vm.paging.current);
		// 	// TODO : Load current page Data here
		// 	vm.currentPage = vm.paging.current;

		// 	findProductosPorMultiplesFiltros(vm.paging.current, CANT_ITEMS, vm.ultimoFiltro)
    // }

    vm.setLastPage = function(){
      $scope.$broadcast('setLastPage', vm.lastPage)
      $log.warn("BroadcastLastPage ", vm.lastPage)}

      $scope.$watch(vm.lastPage, vm.setLastPage());
    $scope.$on('paginatorChange', function(event, data){
      $log.warn("paginatorChange", vm.setLastPage);
      vm.activeIndex = data;
      vm.paging = {
        current: vm.activeIndex
      };
      loadPages();
  });

  //$scope.$on(vm.lastPage, vm.setLastPage());


		function loadPages() {
      console.log('Current page is : ' + vm.paging.current);
      console.log("Mi indice es:  " + vm.activeIndex);

			// TODO : Load current page Data here
			//vm.currentPage = vm.paging.current;
      findProductosPorMultiplesFiltros(vm.paging.current, CANT_ITEMS, vm.ultimoFiltro);

    }
    $scope.$watch();
		//////////////////////////////

		vm.agregar = function(variety) {

			if (usuario_dao.isLogged()) {
        contextPurchaseService.getSelectedOrder().then(function(order){
          contextPurchaseService.getOrders().then(function(orders){
            if(orders.length > 1
               && order.productosResponse.length == 0
               && contextPurchaseService.isGrupoIndividualSelected() ){
              dialogCommons.selectPurchaseContext(variety);
            }else{
              addProductService(variety);
            }
          })
        })
        
			} else {
				ToastCommons.mensaje(us.translate('INVITARMOS_INGRESAR'));
				$log.log('not logued" ', variety);
				contextPurchaseService.ls.varianteSelected = variety;
				$state.go('catalog.login');
			}
		}

		vm.mostrarDecimales = function(parteDecimal) {
			var res = Number(parteDecimal).toFixed(0).toString();
			if (res.length == 1) res += "0";
			return res;
		}

		vm.identificadorProducto = function(producto) {
			return producto.nombreProducto;
		}


		// ///////////////////////
		// / Recive el evento de filtrado

		$scope.$on('filterEvent', function(event, arg) {
			$log.debug("filterEvent", arg);
			vm.ultimoFiltro = arg;
			vm.paging.total = 0;
			vm.paging.current = 1;
      actualizar(arg);
      vm.activeIndex = 1;
      $scope.$broadcast('setLastPage', vm.lastPage) // favio 27-7-18

      loadPages();
		});

		function actualizar(arg) {
			findProductosPorMultiplesFiltros(vm.paging.current, CANT_ITEMS, arg);
		}



		// /////////// REST


		// var findProductosPorMultiplesFiltros = function(pagina, items, params){
    //         contextCatalogsService.getCatalogs().then(function(catalogs){
    //             contextCatalogObserver.observe(function(){

    //                 console.log('find productos multiples filtros');
    //                 function doOk(response) {
    //                     $log.log('findProductos Response ', response);

    //                     vm.productos = response.data.productos;

    //                     vm.paging.total = Math.ceil(response.data.total / CANT_ITEMS);
    //                     vm.paging.current = response.data.pagina;
    //                 }


    //                 var serviceParams = {
    //                     query : params.query,
    //                     idVendedor : contextPurchaseService.getCatalogContext(),
    //                     idMedalla : params.sello,
    //                     idProductor: params.productor,
    //                     idMedallaProductor: params.selloProductor,
    //                     idCategoria: params.categoria,
    //                     pagina: pagina,
    //                     cantItems: items,
    //                     precio: 'Down'
    //                 }

    //                 $log.log("parametros", serviceParams);

    //                 productoService.getProductosByMultiplesFiltros(serviceParams).then(doOk);

    //             })
    //         })
    // }

    var findProductosPorMultiplesFiltros = function(pagina, items, params){
			console.log('find productos multiples filtros');
			function doOk(response) {
				$log.log('findProductos Response ', response);

				vm.productos = response.data.productos;
        $log.warn('productos', vm.productos);
				vm.paging.total = Math.ceil(response.data.total / CANT_ITEMS);
				vm.paging.current = response.data.pagina;
				vm.paging.disponibles = Math.ceil(response.data.total / CANT_ITEMS);
				vm.pageNum = (6 <= vm.paging.disponibles)? 6 : vm.paging.disponibles;
				vm.lastPage = response.data.totalDePaginas;
				vm.setLastPage();
				$log.warn("SOY LA PRUEBA DE PAGINACION" + vm.productos.total);
				$log.warn("SOY LA ULTIMA PAGINA: " + vm.lastPage);
				//console.log(vm.prueba);
			}


			var params = {
				query : params.query,
				idVendedor : contextPurchaseService.getCatalogContext(), //StateCommons.vendedor().id,
				idMedalla : params.sello,
				idProductor: params.productor,
				idMedallaProductor: params.selloProductor,
				idCategoria: params.categoria,
				pagina: pagina,
				cantItems: items,
				precio: 'Down'
			}
      console.log("parametros",params);
			$log.log("parametros",params);

			productoService.getProductosByMultiplesFiltros(params).then(doOk);

		}
        //Posiblemente deprecado por findProductosPorMultiplesFiltros
		// var findProductos = function(pagina, items, filtro) {
    //         contextCatalogsService.getCatalogs().then(function(catalogs){
    //             contextCatalogObserver(function(){
    //                 $log.log('findProductos: ' + pagina + " " + items + " " +
    //                     filtro.tipo + " " + filtro.valor);

    //                 function doOk(response) {
    //                     $log.log('findProductos Response ', response);

    //                     vm.productos = response.data.productos;

    //                     vm.paging.total = Math.ceil(response.data.total / CANT_ITEMS);
    //                     vm.paging.current = response.data.pagina;
    //                 }

    //                 var params = {
    //                     idVendedor: contextPurchaseService.getCatalogContext(),
    //                     pagina: pagina,
    //                     cantItems: items,
    //                     precio: 'Down'
    //                 }

    //                 productoService.getProductosByMultiplesFiltros(params).then(doOk);
    //             })
    //         })
    // }

    var findProductos = function(pagina, items, filtro) {
			$log.log('findProductos: ' + pagina + " " + items + " " +
				filtro.tipo + " " + filtro.valor);

			function doOk(response) {
				$log.log('findProductos Response ', response);

				vm.productos = response.data.productos;

				vm.paging.total = Math.ceil(response.data.total / CANT_ITEMS);
				vm.paging.current = response.data.pagina;
			}

			var params = {
				idVendedor: contextPurchaseService.getCatalogContext(), //StateCommons.vendedor().id,
				pagina: pagina,
				cantItems: items,
				precio: 'Down'
			}

			productoService.getProductosByMultiplesFiltros(params).then(doOk);

		}




		function callEmprendedores() {
			$log.debug("---callEmprendedor ---");

			productorService.getProductores()
				.then(function(data) { vm.emprendedores = data.data; })
    }

    // findProductos();
		if (!us.isUndefinedOrNull(contextPurchaseService.ls.varianteSelected)) {
			$log.debug("tiene una variante seleccionda", contextPurchaseService.ls.varianteSelected)
			vm.agregar(contextPurchaseService.ls.varianteSelected)
			contextPurchaseService.ls.varianteSelected = undefined;
		}


		//vm.productos = findProductos(1,10,{});
    callEmprendedores();
    //loadPages();
	}

})();
