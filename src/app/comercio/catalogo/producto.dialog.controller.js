(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('ProductoDialogController',
			ProductoDialogController);

	/** @ngInject 
	 * Es solo un lugar para hacer pruebas*/
	function ProductoDialogController($log, StateCommons, productoService, CTE_REST, parm, $mdDialog) {
		//	$log.debug('ProductoDialogController ..... ') 
		console.log("parm")
		console.log(parm)

		var vm = this;
		vm.urlBase = CTE_REST.url_base;
		vm.producto = parm;
		vm.imagenes = [];
		//vm.imagenSelect={nombre : "1",path :"http://lorempixel.com/400/200/abstract/1"}
		vm.imagenSelect = {};
		vm.class = "";

		vm.cerrariDalogo = function() {
			$mdDialog.hide();
		}

		vm.cambiarImagen = function(imagen) {
			//vm.class="zoomIn animated";
			//vm.class=undefined;		
			vm.imagenSelect = imagen;
		}

		vm.mostrarDecimales = function(parteDecimal) {
			var res = Number(parteDecimal).toFixed(0).toString();
			if (res.length == 1) res += "0";
			return res;
		}

		////////////


		function doOkPedido(response) {
			$log.debug("imagenProducto", response);
			vm.imagenes = response.data;

			//TODO : SACAR imagenes de prueba 
			/*
			vm.imagenes.push({nombre : "1",path :"http://lorempixel.com/400/200/abstract/1"})
			vm.imagenes.push({nombre : "1",path :"http://lorempixel.com/400/200/abstract/2"})
			vm.imagenes.push({nombre : "1",path :"http://lorempixel.com/400/200/abstract/3"})
			*/

		}

		productoService.imagenProducto(vm.producto.idVariante).then(doOkPedido);

	}
})();
