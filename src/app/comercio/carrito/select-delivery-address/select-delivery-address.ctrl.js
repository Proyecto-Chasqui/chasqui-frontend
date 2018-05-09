(function() {
	'use strict';

	angular.module('chasqui').controller('SelectDeliveryAddressController', SelectDeliveryAddressController);

	/** @ngInject */
	function SelectDeliveryAddressController($scope, contextPurchaseService, $log, vendedorService, perfilService,
                                             actions, $mdDialog) {
        
        $scope.catalog = null;
        
        $scope.addresses = [];
        $scope.deliveryPoints = [];
		$scope.selectedAddress = null;
		$scope.selectedDeliveryPoint = null;
        $scope.setSelectedAddress = setSelectedAddress;
        $scope.setSelectedDeliveryPoint = setSelectedDeliveryPoint;
        
        $scope.deliveryTypes = [
            {
                label: "A domicilio",
                show: false
            },{
                label: "Paso a retirar",
                show: false
            }
        ];
        $scope.setDeliveryType = setDeliveryType;
        $scope.comentario = "";
                
        /////////////////////////////////////
        
        function init(){
            contextPurchaseService.getSelectedCatalog().then(function(selectedCatalog){
                $scope.catalog = selectedCatalog;
                callDirecciones();
            })
        }
        
        /////////////////////////////////////
        
        function setSelectedAddress(newAddress){
            $scope.selectedAddress = newAddress;
        }
        
        function setSelectedDeliveryPoint(newDeliveryPoint){
            $scope.selectedDeliveryPoint = newDeliveryPoint;
        }
        
        function setDeliveryType(deliverySelected){
            $scope.deliveryTypes = $scope.deliveryTypes.map(function(d){d.show = d.label == deliverySelected.label; return d});
        }
        
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
        
        
        $scope.okAction = function(){
            actions.doOk($scope.deliveryTypes[0].show? $scope.selectedAddress : null, 
                         $scope.deliveryTypes[1].show? $scope.selectedDeliveryPoint : null);
            $mdDialog.hide();
        }
        
        
        $scope.cancelAction = function(){
            actions.doNotOk();
            $mdDialog.hide();
        }
        
        init();
	}

})();