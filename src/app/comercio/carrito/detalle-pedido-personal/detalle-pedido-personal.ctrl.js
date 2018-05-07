(function() {
	'use strict';

	angular.module('chasqui').controller('DetallePedidoPersonalController',
		DetallePedidoPersonalController);

	/** @ngInject */
	function DetallePedidoPersonalController($log, $state, $scope, URLS, REST_ROUTES, $rootScope,
                                              ToastCommons, $mdDialog, dialogCommons, 
                                              productoService, perfilService, gccService,
		                                      vendedorService, contextPurchaseService, us) {
		$log.debug('DetallePedidoController ..... ', $scope.pedido);

		$scope.urlBase = URLS.be_base;
		$scope.idVendedor = perfilService.idVendedor;
		$scope.productoEliminar;
		$scope.comentario = "";
        
		$scope.confirmarClick = confirmar;
        
        
        
        
        ///////////////////////////////////////
        
		function confirmar() {	
            var actions = {
                doOk: confirmarDomicilio,
                doNotOk: ignorarAccion
            };
            
            dialogCommons.selectDeliveryAddress(actions);
		};
        
        function confirmarDomicilio(direccionSelected, puntoEntregaSelected) {
			$log.debug('callConfirmar', $scope.pedido);

			function doOk(response) {
				$log.debug("--- confirmar pedido response ", response.data);
				ToastCommons.mensaje(us.translate('PEDIDO_CONFIRMADO_MSG'));
				$rootScope.$emit('order-confirmed');
			}

			var params = {};
			params.idPedido = $scope.pedido.id;			
			params.comentario = $scope.comentario;
            
			completarParamsSegunMetodoDeEntrega(direccionSelected, puntoEntregaSelected, params);
		
			productoService.confirmarPedidoIndividual(params).then(doOk);
		}
        
        function ignorarAccion(){
			$log.debug('close');
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
        
		function popUpConfirmarAccion(templateUrl) {
            //dialogCommons.confirm(titulo, texto, textOk, textCancel, doOk, doNoOk) 
			$log.debug(templateUrl);
			$mdDialog.show({
				templateUrl: templateUrl,
				scope: $scope,
				preserveScope: true
			});
		}
        
		$scope.cancelar= function(){
			popUpConfirmarAccion('dialog-cancelar-pedido.html');
		}

		$scope.cancelarPedido = function(event) {
			$log.debug('DetallePedidoController , cancelar', $scope.pedido);

			function doOk(response) {
				$log.debug("--- cancelar pedido response ", response.data);
				ToastCommons.mensaje(us.translate('CANCELADO'));
				contextPurchaseService.refreshPedidos().then(
					function() {
						$state.reload();
					});
				$log.debug('close');
				$mdDialog.hide();
			}

			productoService.cancelarPedidoIndividual($scope.pedido.id).then(doOk);
		}
		
		$scope.irAPerfil = function(){
			$mdDialog.hide();
			$state.go('catalog.profile');
        };
		
	}

})();
