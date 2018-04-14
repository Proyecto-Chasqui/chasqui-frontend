(function() {
	'use strict';

	angular.module('chasqui').controller('ListaProductosDestacadosController',
		ListaProductosDestacadosController);

	/** @ngInject */
	function ListaProductosDestacadosController($log, $scope, URLS,
		REST_ROUTES, productoService, $state, $mdDialog, $rootScope, us, dialogCommons, gccService) {
		$log.log('ListaProductosDestacadosController ..... ');

		var vm = this;
		vm.urlbase = URLS.be_base;
		vm.productos = [];
		vm.medallaSelect = undefined;

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

		function findProductos() {
			productoService.getProductosDestacados()
				.then(function(response) {
					vm.productos = response.data.productos;
                    console.log("Productos destacados: ", vm.productos);
				})
		}

		findProductos();

		vm.mostrarDecimales = function(parteDecimal) {
			var res = Number(parteDecimal).toFixed(0).toString();
			if (res.length == 1) res += "0";
			return res;
		}
        
        vm.ir = function(page) {
			$log.debug("ir a ..... ", page);
            $state.go(page);
        };
	}
})();
