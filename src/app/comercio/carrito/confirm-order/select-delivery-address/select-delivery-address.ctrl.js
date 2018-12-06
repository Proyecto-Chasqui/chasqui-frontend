(function() {
	'use strict';

	angular.module('chasqui').controller('SelectDeliveryAddressController', SelectDeliveryAddressController);

	/** @ngInject */
	function SelectDeliveryAddressController($scope, contextPurchaseService, $log, vendedorService, sellerService, 
                                              perfilService, $mdDialog, $state, $sce) {
        
        
        $scope.addresses = [];
        $scope.deliveryPoints = [];
        $scope.address = {};
        
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
        $scope.setSelectedAddress = setSelectedAddress;
        $scope.setSelectedZone = setSelectedZone;
        $scope.setAddressParticularities = setAddressParticularities;
        $scope.setSelectedDeliveryPoint = setSelectedDeliveryPoint;
                
        $scope.validated = false;
        $scope.modeDefined = false;
        $scope.addressDefined = false;
        $scope.zoneDefined = false;
        $scope.deliveryPointDefined = false;
        $scope.zonesMap = "";
        
        /////////////////////////////////////
        
        function init(){
            contextPurchaseService.getSelectedCatalog().then(function(selectedCatalog){
                $scope.zonesMap = $sce.trustAsResourceUrl(selectedCatalog.urlMapa);
                console.log($scope.zonesMap);
                callDirecciones(selectedCatalog);
                loadZones(selectedCatalog.id);
                initAdress();
            })
        }
    
        function initAdress(){
          $scope.address = {
            type: "",
            selected: null,
            zone: null,
            particularities: ""
          }
        }
        
        /////////////////////////////////////
        
        function setDeliveryType(deliverySelected){
            $scope.deliveryTypes = $scope.deliveryTypes.map(function(d){d.show = d.label == deliverySelected.label; return d});
            $scope.showGoProfile = $scope.deliveryTypes[0] == deliverySelected && $scope.addresses.length == 0;
            initAdress();
            $scope.validated = false;
        }
        
        function setSelectedAddress(newAddress){
            $scope.selectedAddress = newAddress;
        }
        
        function setSelectedZone(newZone){
            $scope.selectedZone = newZone;
        }
        
        function setAddressParticularities(newComments){
            console.log(newComments);
            $scope.addressParticularities = newComments;
        }
        
        function setSelectedDeliveryPoint(newDeliveryPoint){
            $scope.selectedDeliveryPoint = newDeliveryPoint;
        }
        
        
        
        function loadZones(catalogId){
            
            function formatDate(date){
                return date.slice(0,2) + "/" + date.slice(3,5) + "/" + date.slice(6,10);
            }
            
            function doOk(response){
                $scope.zones = response.data.map(function(z){z.fechaCierrePedidos = formatDate(z.fechaCierrePedidos); return z;});
            }
                
            sellerService.getSellerZones(catalogId).then(doOk);
        }
        
        function callDirecciones(catalog) {
			$log.debug('call direcciones ');

			function fillUserAddresses(response) {
                $log.debug('call direcciones ', response.data);
				$scope.addresses = response.data;
			}

			function fillDeliveryPoints(response) {
                $log.debug('call delivery points ', response.data);
				$scope.deliveryPoints = response.data.puntosDeRetiro;
			}
      		showMultipleSelection(catalog);
			vendedorService.verPuntosDeEntrega().then(fillDeliveryPoints);
			perfilService.verDirecciones().then(fillUserAddresses);
		}
        
        
        function showMultipleSelection(catalog){
            $scope.mostrarSeleccionMultiple = catalog.few.seleccionDeDireccionDelUsuario && catalog.few.puntoDeEntrega;
            if(!$scope.mostrarSeleccionMultiple){
                $scope.deliveryTypes[0].show = catalog.few.seleccionDeDireccionDelUsuario;
                $scope.showGoProfile = $scope.deliveryTypes[0].show && $scope.addresses.length == 0;
              
                $scope.deliveryTypes[1].show = catalog.few.puntoDeEntrega;
            }
		}
        
        
        function validInformation(){
            return $scope.address.selected != null &&
                   (($scope.deliveryTypes[0].show && $scope.address.zone != null) || 
                    $scope.deliveryTypes[1].show);
        }
        
        function riseErrors(){
            $scope.validated = true;
            $scope.modeDefined = $scope.deliveryTypes.reduce(function(r,t){return r || t.show}, false);
            $scope.addressDefined = $scope.deliveryTypes[0].show && $scope.address.selected != null;
            $scope.zoneDefined = $scope.deliveryTypes[0].show && $scope.address.zone != null;
            $scope.deliveryPointDefined = $scope.deliveryTypes[1].show && $scope.address.selected != null;
        }
        
        $scope.$on("check-direccion", function(){
            if(validInformation()){
                $scope.validated = false;
                $scope.address.type = $scope.deliveryTypes[0].show? "address" : "deliveryPoint";
                $scope.okAction($scope.address);              
            }else{
                riseErrors();
            }
        })
                
        
        init();
	}

})();