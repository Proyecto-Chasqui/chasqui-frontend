(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('ProductoDialogController',
			ProductoDialogController);

	/** @ngInject 
	 * Es solo un lugar para hacer pruebas*/
	function ProductoDialogController($scope, $log, productoService, URLS, REST_ROUTES, productSelected, $mdDialog) {
		//	$log.debug('ProductoDialogController ..... ') 
		$log.debug("productSelected", productSelected)

		$scope.urlBase = URLS.be_base;
		$scope.producto = productSelected;
		$scope.imagenes = productSelected.imagenes;
		$scope.imageSelect = productSelected.imagenPrincipal;
		$scope.class = "";

		$scope.cerrarDialogo = function() {
			$mdDialog.hide();
		}

		$scope.cambiarImagen = function(imagen) {
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
    
    // function init(){
    //   function setImagenes(response) {
    //     $log.debug("imagenProducto", response);
    //     $scope.imagenes = response.data;
    //   }
	//   //setImagenes($scope.producto.imagenes)
    //   productoService.imagenProducto($scope.producto.idVariante).then(setImagenes);
    // }
    
    init();

	}
})();
