(function() {
	'use strict';

	angular.module('chasqui').controller('ProductosPedidoController',
		ProductosPedidoController);

	/** @ngInject */
	function ProductosPedidoController($log, $state, $scope, CTE_REST, ToastCommons, dialogCommons, productoService, 
                                        contextoCompraService, us, ModifyVarietyCount) {
		$log.debug('DetallePedidoController ..... ', $scope.pedido);

		$scope.urlBase = CTE_REST.url_base;
	
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
	
		function doEliminar() {
			$log.debug('DetallePedidoController , eliminar ', $scope.productoEliminar);

			function doOk(response) {
				$log.debug("--- eliminar pedido response ", response.data);
				ToastCommons.mensaje(us.translate('QUITO_PRODUCTO'));
                
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
        
        $scope.modifyVarietyCount = function(variety){
          ModifyVarietyCount.modifyDialog(variety);
      }

		
	}

})();
