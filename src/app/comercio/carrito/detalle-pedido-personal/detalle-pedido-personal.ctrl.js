(function() {
	'use strict';

	angular.module('chasqui').controller('DetallePedidoPersonalController',
		DetallePedidoPersonalController);

	/** @ngInject */
	function DetallePedidoPersonalController($log, $state, $scope, URLS, REST_ROUTES, $rootScope,
                                              ToastCommons, $mdDialog, dialogCommons, contextOrdersService,
                                              productoService, perfilService, gccService,
		                                      vendedorService, contextPurchaseService, us) {
		$log.debug('DetallePedidoController ..... ', $scope.pedido);
      
		$scope.confirmOrder = confirmOrder;
        $scope.cancelOrder = cancelOrder;
        
        
        ///////////////////////////////////////
        
		function confirmOrder() {	
            var actions = {
                doOk: doConfirmOrder,
                doNotOk: ignoreAction
            };
            
            dialogCommons.selectDeliveryAddress(actions);
		};
        
        function doConfirmOrder(direccionSelected, puntoEntregaSelected) {
			$log.debug('callConfirmar', $scope.pedido);

			function doOk(response) {
				ToastCommons.mensaje(us.translate('PEDIDO_CONFIRMADO_MSG'));
                contextOrdersService.setStateConfirmed(contextPurchaseService.getCatalogContext(), $scope.pedido);
				$rootScope.$emit('order-confirmed');
			}

			var params = {};
			params.idPedido = $scope.pedido.id;			
			params.comentario = $scope.comentario;
            
			completarParamsSegunMetodoDeEntrega(direccionSelected, puntoEntregaSelected, params);
		
			productoService.confirmarPedidoIndividual(params).then(doOk);
		}
        

		function completarParamsSegunMetodoDeEntrega(direccionSelected, puntoEntregaSelected, param){
			console.log(direccionSelected);
			if(direccionSelected === null || direccionSelected === undefined){
				param.idDireccion = null;
			}else{
				param.idDireccion = direccionSelected.idDireccion;
			}

			if(puntoEntregaSelected === null || puntoEntregaSelected === undefined){
				param.idPuntoDeRetiro = null; 
			}else{
				param.idPuntoDeRetiro = puntoEntregaSelected.id;
			}
		}


        /////////////////////////////////////////////
        
        
        function cancelOrder(){
            dialogCommons.confirm("¿Cancelar pedido?", 
                                  "¿Está seguro que quiere cancelarlo?", 
                                  "Si", 
                                  "No", 
                                  doCancelOrder, 
                                  ignoreAction);
		}
        

		function doCancelOrder(){
			$log.debug('DetallePedidoController , cancelar', $scope.pedido);

			function doOk(response) {
				$log.debug("--- cancelar pedido response ", response.data);
				ToastCommons.mensaje(us.translate('CANCELADO'));
				contextOrdersService.setStateCancel(contextPurchaseService.getCatalogContext(), $scope.pedido);
				$log.debug('close');
				$mdDialog.hide();
                $rootScope.$emit('order-cancelled');
			}

			productoService.cancelarPedidoIndividual($scope.pedido.id).then(doOk);
		}
		
        function ignoreAction(){
            $mdDialog.hide();
        }
		
	}

})();
