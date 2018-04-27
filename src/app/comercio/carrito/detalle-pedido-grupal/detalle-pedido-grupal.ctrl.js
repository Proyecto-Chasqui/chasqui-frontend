(function() {
	'use strict';

	angular.module('chasqui').controller('DetallePedidoGrupalController',
		DetallePedidoGrupalController);

	/** @ngInject */
	function DetallePedidoGrupalController($log, $state, $scope, ToastCommons, productoService, gccService, us, $rootScope,
                                           contextPurchaseService, contextOrdersService) {
        
		$log.debug('DetallePedidoController ..... ', $scope.pedido);

        $scope.confirmOrder = confirmOrder;
        $scope.cancelOrder = cancelOrder;
        $scope.continueBuying = continueBuying;

        /////////////////////////////////////
        
        
		/// confirmacion individual de GCC
		function confirmOrder(){
			function doOk(response){
				ToastCommons.mensaje(us.translate('PEDIDO_CONFIRMADO_MSG'));
                contextOrdersService.setStateConfirmed(contextPurchaseService.getCatalogContext(), $scope.pedido);
				$rootScope.$emit('order-confirmed');
			}
            gccService.confirmarPedidoIndividualGcc($scope.pedido.id).then(doOk);
		}

        function cancelOrder(event){
			function doOk(response){
				ToastCommons.mensaje(us.translate('CANCELADO'));
                contextOrdersService.setStateCancel(contextPurchaseService.getCatalogContext(), $scope.pedido);
				$rootScope.$emit('order-cancelled');
			}

			productoService.cancelarPedidoIndividual($scope.pedido.id).then(doOk);
		}

        function continueBuying(){
			$state.go('catalog.products');
        }
	}

})();
