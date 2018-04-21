(function() {
	'use strict';

	angular.module('chasqui').controller('DetallePedidoPersonalController',
		DetallePedidoPersonalController);

	/** @ngInject */
	function DetallePedidoPersonalController($log, $state, $scope, URLS, REST_ROUTES, 
                                              ToastCommons, $mdDialog, dialogCommons, 
                                              productoService, perfilService, gccService,
		                                      vendedorService, contextPurchaseService, us) {
		$log.debug('DetallePedidoController ..... ', $scope.pedido);

		$scope.urlBase = URLS.be_base;
		$scope.idVendedor = perfilService.idVendedor;
		$scope.direcciones ;
		$scope.direccionSelected;
		$scope.puntosDeEntrega;
		$scope.puntoEntregaSelected;
		$scope.tipoentrega = ["A domicilio","Paso a retirar"];
		$scope.productoEliminar;
		$scope.mostrarSeleccionDomicilio = false;
		$scope.mostrarSeleccionPuntoEntrega = false;
		$scope.mostrarSeleccionMultiple = false;
		$scope.configuracionVenedor;
		$scope.isAdmin = contextPurchaseService.isAdmin($scope.pedido);
		$scope.comentario = "";
	

		
		$scope.confirmar = function() {
			
			popUpElegirDireccion();
			$scope.callDirecciones();
		};

		function callDirecciones() {
			$log.debug('call direcciones ');

			function doOk(response) {
				$log.debug('call direcciones response ', response);
				console.log('call direcciones response ');
				$scope.direcciones = response.data;
				if ($scope.direcciones.length == 0){
					popUpConfirmarAccion('dialog-sin-direccion.html');				
				}else{
					popUpElegirDireccion();
				}
			}

			function filldata(response) {
				$log.debug('call direcciones response para puntosDeEntrega ', response);
				console.log('call direcciones response para puntosDeEntrega ');
				$scope.puntosDeEntrega = response.data.puntosDeRetiro;
			}
      		showMultipleSelection();
			vendedorService.verPuntosDeEntrega().then(filldata);
			perfilService.verDirecciones().then(doOk);
		}

		function showMultipleSelection(){

			function configurarSelectores(response){
				$scope.configuracionVenedor = response.data.few;
				$scope.mostrarSeleccionMultiple = $scope.configuracionVenedor.seleccionDeDireccionDelUsuario && $scope.configuracionVenedor.puntoDeEntrega;
				if(! $scope.mostrarSeleccionMultiple){
					$scope.mostrarSeleccionDomicilio = $scope.configuracionVenedor.seleccionDeDireccionDelUsuario;
					$scope.mostrarSeleccionPuntoEntrega = $scope.configuracionVenedor.puntoDeEntrega;
				}else{
					$scope.mostrarSeleccionPuntoEntrega = false;
					$scope.mostrarSeleccionDomicilio =  false;
				}
			}
			vendedorService.obtenerConfiguracionVendedor().then(configurarSelectores); 
		}

		$scope.selectChanged = function(){
			if($scope.entregaSelected === $scope.tipoentrega[0]){
				$scope.mostrarSeleccionDomicilio = true;
			}else{
				$scope.mostrarSeleccionDomicilio = false;

			}
			if($scope.entregaSelected === $scope.tipoentrega[1]){
				$scope.mostrarSeleccionPuntoEntrega = true;
			}else{
				$scope.mostrarSeleccionPuntoEntrega = false;
			}
			$scope.direccionSelected = null;
			$scope.puntoEntregaSelected = null;
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

		function popUpConfirmarAccion(templateUrl) {
			$log.debug(templateUrl);
			$mdDialog.show({
				templateUrl: templateUrl,
				scope: $scope,
				preserveScope: true
				//targetEvent: ev
			});
		}

		/// confirmacion individual de GCC
		function confirmarPedidoIndividualGcc() {
			function doOk(response) {
				ToastCommons.mensaje(us.translate('PEDIDO_CONFIRMADO_MSG'));
				contextPurchaseService.refreshPedidos().then(
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
				contextPurchaseService.refreshPedidos().then(
			        function(pedidos) {
			          $state.reload();			          
			        });
				location.reload();// TODO: Revisar $localStorage
			}

			var params = {};
			completarParamsSegunMetodoDeEntrega(params);
			params.idPedido = $scope.pedido.id;			
			params.comentario = $scope.comentario;
		
			productoService.confirmarPedidoIndividual(params).then(doOk)
		
		}

		function completarParamsSegunMetodoDeEntrega(param){
			console.log($scope.direccionSelected);
			console.log("SCOPE");	
			if($scope.direccionSelected === null || $scope.direccionSelected === undefined){
				param.idDireccion = null;
			}else{
				param.idDireccion = $scope.direccionSelected.idDireccion;
			}

			if($scope.puntoEntregaSelected === null || $scope.puntoEntregaSelected === undefined){
				param.idPuntoDeRetiro = null; 
			}else{
				param.idPuntoDeRetiro = $scope.puntoEntregaSelected.id;
			}
		}

		function doEliminar() {
			$log.debug('DetallePedidoController , eliminar ', $scope.productoEliminar);

			function doOk(response) {
				$log.debug("--- eliminar pedido response ", response.data);
				ToastCommons.mensaje(us.translate('QUITO_PRODUCTO'));
			//	contextPurchaseService.refreshPedido();
				contextPurchaseService.refreshPedidos().then(
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
			contextPurchaseService.setContextByOrder($scope.pedido);
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

		$scope.ignorarAccion = function(){
			$log.debug('close');

			$mdDialog.hide();
		}

		function limpiarValores(){
			$scope.direcciones = null;
			$scope.direccionSelected = null;
			$scope.puntosDeEntrega = null;
			$scope.puntoEntregaSelected = null;
			$scope.mostrarSeleccionDomicilio = false;
			$scope.mostrarSeleccionPuntoEntrega = false;
			$scope.mostrarSeleccionMultiple = false;
			$scope.configuracionVenedor = null;
		}

		$scope.confirmarClick = function(){
            contextPurchaseService.setContextByOrder($scope.pedido);
			if (contextPurchaseService.isPedidoInividualSelected()){
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

		$scope.irAPerfil = function(){
			$mdDialog.hide();
			$state.go('catalog.profile');
        };
		
	}

})();
