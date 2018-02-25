(function() {
	'use strict';

	angular.module('chasqui').controller('DetallePedidoGrupalController',
		DetallePedidoGrupalController);

	/** @ngInject */
	function DetallePedidoGrupalController($log, $state, $scope, URLS, REST_ROUTES, ToastCommons, $mdDialog, dialogCommons, productoService, perfilService, gccService,
		contextoCompraService,us) {
		$log.debug('DetallePedidoController ..... ', $scope.pedido);

		$scope.urlBase = URLS.be_base;
		$scope.direcciones ;
		$scope.direccionSelected;
		$scope.productoEliminar;
		$scope.isAdmin = contextoCompraService.isAdmin($scope.pedido);
		$scope.comentario = "";
	

		
		$scope.confirmar = function() {
			popUpElegirDireccion();
			$scope.callDirecciones();
		};

		function callDirecciones() {
			$log.debug('call direcciones ');

			function doOk(response) {
				$log.debug('call direcciones response ', response);
				$scope.direcciones = response.data;

				if ($scope.direcciones.length == 0){
					ToastCommons.mensaje(us.translate('PEDIR_DOMICILIO'));					
				}else{
					popUpElegirDireccion();
				}
			}

			perfilService.verDirecciones().then(doOk);
		}

		function popUpElegirDireccion() {
			$log.debug('confirmarDomicilioOpenDialog');
			$mdDialog.show({
				templateUrl: 'dialog-direccion.html',
				scope: $scope,
				preserveScope: true
				//targetEvent: ev
			});
		}

		/// confirmacion individual de GCC
		function confirmarPedidoIndividualGcc() {
			function doOk(response) {
				ToastCommons.mensaje(us.translate('PEDIDO_CONFIRMADO_MSG'));
				contextoCompraService.refreshPedidos().then(
					function() {						
						$state.reload();
					});				
			}

			if ($scope.pedido.idGrupo == null) {
				ToastCommons.mensaje("funcionalidad para GCC !");
			} else {
				gccService.confirmarPedidoIndividualGcc($scope.pedido.id).then(doOk)
			}
		}

		function callConfirmar() {
			$log.debug('callConfirmar   ',$scope.pedido);

			function doOk(response) {
				$log.debug("--- confirmar pedido response ", response.data);
				ToastCommons.mensaje(us.translate('PEDIDO_CONFIRMADO_MSG'));
				contextoCompraService.refreshPedidos().then(
			        function(pedidos) {
			          $state.reload();			          
			        });
				location.reload();// TODO: Revisar $localStorage
			}

			var params = {};
			params.idPedido = $scope.pedido.id;
			params.idDireccion = $scope.direccionSelected.idDireccion;
			params.comentario = $scope.comentario;
		
			productoService.confirmarPedidoIndividual(params).then(doOk)
		
		}

		function doEliminar() {
			$log.debug('DetallePedidoController , eliminar ', $scope.productoEliminar);

			function doOk(response) {
				$log.debug("--- eliminar pedido response ", response.data);
				ToastCommons.mensaje(us.translate('QUITO_PRODUCTO'));
			//	contextoCompraService.refreshPedido();
				contextoCompraService.refreshPedidos().then(
			        function(pedidos) {
			          $state.reload();			          
			        });
				//$state.reload();
			}

			var params = {};
			params.idPedido = $scope.pedido.id;
			params.idVariante = $scope.productoEliminar.idVariante;
			params.cantidad = $scope.productoEliminar.cantidad;

			productoService.quitarProductoIndividual(params).then(doOk)
		}

		$scope.comprar = function() {
			contextoCompraService.setContextoByPedido($scope.pedido);
			$state.go('catalogo')
		}

		$scope.eliminar = function(item) {
			$scope.productoEliminar = item;

			dialogCommons.confirm(us.translate('QUITAR_PRODUCTO_TIT'),
				us.translate('QUITAR_PRODUCTO_MSG'),
				us.translate('SI'),
				us.translate('NO'),
				doEliminar,
				function() {}
			);
		}

		$scope.cancelar = function(event) {
			$log.debug('DetallePedidoController , cancelar', $scope.pedido);

			function doOk(response) {
				$log.debug("--- cancelar pedido response ", response.data);
				ToastCommons.mensaje(us.translate('CANCELADO'));
				contextoCompraService.refreshPedidos().then(
					function() {
						$state.reload();
					});

			}

			productoService.cancelarPedidoIndividual($scope.pedido.id).then(doOk);
		}

		$scope.confirmarClick = function(){
            contextoCompraService.setContextoByPedido($scope.pedido);
			if (contextoCompraService.isPedidoInividualSelected()){
                console.log("Individual");
				callDirecciones();
			}else{
				confirmarPedidoIndividualGcc();
			}
		}

		$scope.confirmarDomicilio = function() {
			$log.debug('close');
			$mdDialog.hide();
			callConfirmar();
		};
		
	}

})();
