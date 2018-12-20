(function() {
	'use strict';

	angular.module('chasqui').controller('ProductosPedidoController',
		ProductosPedidoController);

	/** @ngInject */
	function ProductosPedidoController($log, $state, $scope, URLS, REST_ROUTES, ToastCommons, toastr, dialogCommons, productoService, 
                                        contextPurchaseService, us, modifyVarietyCount, contextOrdersService) {
    
		$log.debug('DetallePedidoController ..... ', $scope.pedido);

		$scope.urlBase = URLS.be_base;
    $scope.modifyVarietyCount = modifyVarietyCount.modifyDialog;
	
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
				toastr.info(us.translate('QUITO_PRODUCTO'), us.translate('AVISO_TOAST_TITLE'));
                
                contextOrdersService.modifyOrder(contextPurchaseService.getCatalogContext(), $scope.pedido, function(order){
                    var index = order.productosResponse.map(function(p){return p.idVariante}).indexOf($scope.productoEliminar.idVariante);                    
                    order.productosResponse.splice(index, 1);
                    order.montoActual -= $scope.productoEliminar.cantidad * $scope.productoEliminar.precio
                    return order;
                });
				
			}

			var params = {};
			params.idPedido = $scope.pedido.id;
			params.idVariante = $scope.productoEliminar.idVariante;
			params.cantidad = $scope.productoEliminar.cantidad;

			productoService.quitarProductoIndividual(params).then(doOk)
		}
        
		
	}

})();
