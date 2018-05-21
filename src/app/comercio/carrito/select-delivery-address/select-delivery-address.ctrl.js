(function() {
	'use strict';

	angular.module('chasqui').controller('SelectDeliveryAddressController', SelectDeliveryAddressController);

	/** @ngInject */
	function SelectDeliveryAddressController($scope, contextPurchaseService, $log, vendedorService, perfilService,
                                             actions, $mdDialog, $state) {
        
        $scope.catalog = null;
        
        $scope.addresses = [];
        $scope.deliveryPoints = [];
		$scope.selectedAddress = null;
		$scope.selectedDeliveryPoint = null;
        $scope.setSelectedAddress = setSelectedAddress;
        $scope.setSelectedDeliveryPoint = setSelectedDeliveryPoint;
        $scope.irAPerfil = irAPerfil;
        $scope.showSelectAddressError = false;
        
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
            $scope.showSelectAddressError = false;
            $scope.inputAddress.selectedAddress.$valid = true;
        }
        
        function setSelectedDeliveryPoint(newDeliveryPoint){
            $scope.selectedDeliveryPoint = newDeliveryPoint;
            $scope.showSelectAddressError = false;
            $scope.inputAddress.selectedAddress.$valid = true;
        }
        
        function setDeliveryType(deliverySelected){
            $scope.deliveryTypes = $scope.deliveryTypes.map(function(d){d.show = d.label == deliverySelected.label; return d});
            $scope.selectedAddress = null;
            $scope.selectedDeliveryPoint = null;
            $scope.showSelectAddressError = false;
            $scope.inputAddress.selectedAddress.$valid = false;
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
            if(!$scope.mostrarSeleccionMultiple){
                $scope.deliveryTypes[0].show = $scope.catalog.few.seleccionDeDireccionDelUsuario;
                $scope.deliveryTypes[1].show = $scope.catalog.few.puntoDeEntrega;
            }
		}
        
        
        $scope.okAction = function(){
            console.log($scope.inputAddress.selectedAddress.$valid);
            if($scope.inputAddress.selectedAddress.$valid){
                actions.doOk($scope.deliveryTypes[0].show? $scope.selectedAddress : null, 
                             $scope.deliveryTypes[1].show? $scope.selectedDeliveryPoint : null);
                $mdDialog.hide();                
            }else{
                $scope.showSelectAddressError = true;   
            }
        }
        
        
        $scope.cancelAction = function(){
            actions.doNotOk();
            $mdDialog.hide();
        }
        
        
        
		function irAPerfil(){
			$mdDialog.hide();
			$state.go('catalog.profile');
        };
        
        
        init();
	}

})();