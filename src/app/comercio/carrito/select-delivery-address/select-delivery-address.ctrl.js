(function() {
	'use strict';

	angular.module('chasqui').controller('SelectDeliveryAddressController', SelectDeliveryAddressController);

	/** @ngInject */
	function SelectDeliveryAddressController($scope, contextPurchaseService, $log, vendedorService, perfilService,
                                             actions, $mdDialog) {
        
        $scope.addresses = [];
        $scope.catalog;
        $scope.deliveryPoints = [];
		$scope.selectedAddress;
		$scope.puntoEntregaSelected;
        $scope.tipoentrega = ["A domicilio","Paso a retirar"];
        $scope.comentario = "";
        
        $scope.showSelection = function(){
            console.log($scope.selectedAddress, $scope.puntoEntregaSelected);
        }
        
        /////////////////////////////////////
        
        function init(){
            contextPurchaseService.getSelectedCatalog().then(function(selectedCatalog){
                $scope.catalog = selectedCatalog;
                callDirecciones();
            })
        }
        
        /////////////////////////////////////
        
        function callDirecciones() {
			$log.debug('call direcciones ');

			function fillUserAddresses(response) {
                $log.debug('call direcciones ', response.data);
				$scope.addresses = response.data;
			}

			function fillDeliveryPoints(response) {
				$scope.deliveryPoints = response.data.puntosDeRetiro;
			}
      		showMultipleSelection();
			vendedorService.verPuntosDeEntrega().then(fillDeliveryPoints);
			perfilService.verDirecciones().then(fillUserAddresses);
		}
        
        
        function showMultipleSelection(){
            $scope.mostrarSeleccionMultiple = $scope.catalog.few.seleccionDeDireccionDelUsuario && $scope.catalog.few.puntoDeEntrega;
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
			//$scope.selectedAddress = null;
			//$scope.puntoEntregaSelected = null;
		}
        
        $scope.okAction = function(){
            console.log($scope.selectedAddress, $scope.puntoEntregaSelected);
            //actions.doOk($scope.selectedAddress, $scope.puntoEntregaSelected);
            $mdDialog.hide();
        }
        
        
        $scope.cancelAction = function(){
            actions.doNotOk();
            $mdDialog.hide();
        }
        
        init();
	}

})();