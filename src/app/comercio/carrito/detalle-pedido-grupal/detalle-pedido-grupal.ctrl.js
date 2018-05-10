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

        /////////////////////////////////////
        
        
		/// Confirm GCC's personal order
        function confirmOrder() {	
            var actions = {
                doOk: doConfirmOrder,
                doNotOk: ignoreAction
            };
            
            dialogCommons.selectDeliveryAddress(actions);
		};
        
		function doConfirmOrder(){
			function doOk(response){
				ToastCommons.mensaje(us.translate('PEDIDO_CONFIRMADO_MSG'));
                contextOrdersService.setStateConfirmed(contextPurchaseService.getCatalogContext(), $scope.pedido);
				$rootScope.$emit('order-confirmed');
			}
            gccService.confirmarPedidoIndividualGcc($scope.pedido.id).then(doOk);
		}

        /// Cancel GCC order
        function cancelOrder(){
            dialogCommons.confirm("¿Cancelar pedido?", 
                                  "¿Está seguro que quiere cancelarlo?", 
                                  "Si", 
                                  "No", 
                                  doCancelOrder, 
                                  ignoreAction);
		}
        
        function doCancelOrder(){
			function doOk(response){
				ToastCommons.mensaje(us.translate('CANCELADO'));
                contextOrdersService.setStateCancel(contextPurchaseService.getCatalogContext(), $scope.pedido);
				$rootScope.$emit('order-cancelled');
			}

			productoService.cancelarPedidoIndividual($scope.pedido.id).then(doOk);
		}
        
        function ignoreAction(){
            $mdDialog.hide();
        }
	}

})();