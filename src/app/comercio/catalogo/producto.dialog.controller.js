(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('ProductoDialogController',
			ProductoDialogController);

	/** @ngInject 
	 * Es solo un lugar para hacer pruebas*/
	function ProductoDialogController($scope, $log, StateCommons, productoService, URLS, REST_ROUTES, productSelected, $mdDialog) {
		//	$log.debug('ProductoDialogController ..... ') 
		console.log("productSelected")
		console.log(productSelected)

		$scope.urlBase = URLS.be_base;
		$scope.producto = productSelected;
		$scope.imagenes = [];
		$scope.imageSelect = productSelected.imagenPrincipal;
		$scope.class = "";

		$scope.cerrariDalogo = function() {
			$mdDialog.hide();
		}

		$scope.cambiarImagen = function(imagen) {
			//$scope.class="zoomIn animated";
			//$scope.class=undefined;		
			$scope.imagenSelect = imagen;
		}

		$scope.mostrarDecimales = function(parteDecimal) {
			var res = Number(parteDecimal).toFixed(0).toString();
			if (res.length == 1) res += "0";
			return res;
		}
        
        $scope.setImageSelected = function(image){
            $scope.imageSelect = image;
        }

		////////////


		function doOkPedido(response) {
			$log.debug("imagenProducto", response);
			$scope.imagenes = response.data;
		}

		productoService.imagenProducto($scope.producto.idVariante).then(doOkPedido);

	}
})();
