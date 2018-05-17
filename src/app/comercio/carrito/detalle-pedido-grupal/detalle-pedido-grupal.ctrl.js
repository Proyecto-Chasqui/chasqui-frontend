(function() {
	'use strict';

	angular.module('chasqui').controller('DetallePedidoGrupalController',
		DetallePedidoGrupalController);

	/** @ngInject */
	function DetallePedidoGrupalController($log, $state, $scope, ToastCommons, productoService, gccService, us, $rootScope,
                                           contextPurchaseService, contextOrdersService, dialogCommons) {
        
		$log.debug('DetallePedidoController ..... ', $scope.pedido);

        $scope.confirmOrder = confirmOrder;
        $scope.cancelOrder = cancelOrder;

        /////////////////////////////////////
        
        
		/// Confirm GCC's personal order
        function confirmOrder() {	
            dialogCommons.confirm("¿Confirmar el pedido?", 
                                  "Una vez confirmado su pedido individual, tiene que esperar que el administrador del grupo lo confirme para que sea preparado y entregado.", 
                                  "Confirmar", 
                                  "No", 
                                  doConfirmOrder, 
                                  ignoreAction);
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