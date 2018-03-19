(function() {
	'use strict';

	angular.module('chasqui').controller('ListaProductosController',
		ListaProductosController);

	/**
	 * @ngInject Lista de productos.
	 */
	function ListaProductosController($scope, $rootScope, $log, CTE_REST, order_context,
		$state, StateCommons, ToastCommons, dialogCommons, productoService, us,
		gccService, $mdDialog, productorService, contextPurchaseService, 
        usuario_dao, ModifyVarietyCount, $stateParams, catalogs_dao) {

		$log.debug('ListaProductosController',
			$scope.$parent.$parent.catalogoCtrl.isFiltro1);

		var CANT_ITEMS = CTE_REST.PRODUCTOS_X_PAG; // TODO : pasar a constante

		var vm = this;

		vm.otherCtrl = $scope.$parent.$parent.catalogoCtrl.isFiltro1;

		vm.urlBase = CTE_REST.url_base;
		vm.productos = [];
		vm.ultimoFiltro = {};
		vm.medallaSelect = undefined;
		vm.pedidoSelected = undefined;
		vm.grupoSelected = undefined;
		vm.emprendedores = [];
		vm.emprendedorSelect = {};

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
		vm.currentPage = 0;
		vm.paging = {
			total: 0,
			current: 1,
			onPageChanged: loadPages,
		};

		function loadPages() {
			console.log('Current page is : ' + vm.paging.current);
			// TODO : Load current page Data here
			vm.currentPage = vm.paging.current;
			findProductosPorMultiplesFiltros(vm.paging.current, CANT_ITEMS, vm.ultimoFiltro)
		}
		//////////////////////////////

		vm.agregar = function(variety) {

            console.log("GrupoSelected:", vm.grupoSelected, "pedidoSelected:", vm.pedidoSelected);
			if (usuario_dao.isLogged()) {
				agregarProducto(variety);
			} else {
				ToastCommons.mensaje(us.translate('INVITARMOS_INGRESAR'));
				$log.log('not logued" ', variety);
				contextPurchaseService.ls.varianteSelected = variety;
				$state.go('catalog.login');
			}
		}

		vm.verMedalla = function(medalla) {
			$log.debug("ver medalla", medalla);

			$state.go('medalla', {
				'idMedalla': medalla
			});
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
		});

		function actualizar(arg) {
			findProductosPorMultiplesFiltros(vm.paging.current, CANT_ITEMS, arg);
		}

		function agregarProducto(variety) {
			if (contextPurchaseService.isGrupoIndividualSelected()) {
                console.log("Agregar producto al pedido individual:", variety);
				agregarProductoIndividual(variety); // es individual
			} else {
				ModifyVarietyCount.modifyDialog(variety);
			}
		}
		function agregarProductoIndividual(variety) {
		/** Si no tiene un pedido individual lo crea */
			if (contextPurchaseService.tienePedidoInividual()) {
				ModifyVarietyCount.modifyDialog(variety);
			} else {
                
                function actualizarPedidoIndividual() {
                    function doOkPedido(response) {
                        $log.debug("setPedidoYagregarProducto", response);
                        contextPurchaseService.setContextByOrder(response.data);
                        //contextPurchaseService.refresh();
                        ModifyVarietyCount.modifyDialog(variety);
                    }

                    productoService.verPedidoIndividual().then(doOkPedido);
                }
				// crear pedido y dialog
				function doNoOK(response) {
					if (us.contieneCadena(response.data.error, CTE_REST.ERROR_YA_TIENE_PEDIDO)) {
						ToastCommons.mensaje(us.translate('AGREAR_EN_PEDIDO_EXISTENTE'));
						ModifyVarietyCount.modifyDialog(variety);
					}
				}

				var json = {};
				json.idVendedor = catalogs_dao.getCatalogByShortName($stateParams.catalogShortName).id;

				//si falla es poque ya tiene un pedido abierto TODO mejorar
				productoService.crearPedidoIndividual(json, doNoOK).then(actualizarPedidoIndividual)
			}

		}

		function callCrearPedidoGrupal(variety) { 
            // TODO mover a contexto compra service
			function doOK(response) {
				$log.debug("callCrearPedidoGrupal", response);

				contextPurchaseService.refresh();
                contextPurchaseService.getAgrupations().then(
					function(grupos) {
						contextPurchaseService.setContextByAgrupation(vm.grupoSelected);
						ModifyVarietyCount.modifyDialog(variety);
					}
				)
			}

			function doNoOK(response) {
				$log.debug("error crear gcc individual, seguramente ya tenia pedido",response);
		 		contextPurchaseService.refreshPedidos().then(
					function(pedido) {
						ModifyVarietyCount.modifyDialog(variety);
					}
				)
			}

			var params = {}
			params.idGrupo = contextPurchaseService.getAgrupationContextId();
			params.idVendedor = catalogs_dao.getCatalogByShortName($stateParams.catalogShortName).id;

			gccService.crearPedidoGrupal(params, doNoOK).then(doOK);
		}


		// /////////// REST

		
		var findProductosPorMultiplesFiltros = function(pagina, items, params){
			console.log('find productos multiples filtros');
			function doOk(response) {
				$log.log('findProductos Response ', response);
				
				vm.productos = response.data.productos;

				vm.paging.total = Math.ceil(response.data.total / CANT_ITEMS);
				vm.paging.current = response.data.pagina;
			}


			var params = {
				query : params.query,
				idVendedor : catalogs_dao.getCatalogByShortName($stateParams.catalogShortName).id,
				idMedalla : params.sello,
				idProductor: params.productor,
				idMedallaProductor: params.selloProductor,
				idCategoria: params.categoria, 
				pagina: pagina,
				cantItems: items,
				precio: 'Down'
			}

			$log.log("parametros",params);

			productoService.getProductosByMultiplesFiltros(params).then(doOk);

		}
        //Posiblemente deprecado por findProductosPorMultiplesFiltros
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
				idVendedor: catalogs_dao.getCatalogByShortName($stateParams.catalogShortName).id,
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
	}

})();
