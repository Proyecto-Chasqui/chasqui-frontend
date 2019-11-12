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
    $scope.getAddressZone = getAddressZone;
    $scope.validated = false;
    $scope.modeDefined = false;
    $scope.addressDefined = false;
    $scope.zoneDefined = false;
    $scope.deliveryPointDefined = false;
    $scope.zonesMap = "";
    $scope.minPrice = 0;
    $scope.showMinPriceWarn = false;
    $scope.advertencia = "Su pedido no supera el monto minimo, solo puede pasar a retirar el pedido";

        
    /////////////////////////////////////
    
    function init(){
        contextPurchaseService.getSelectedCatalog().then(function(selectedCatalog){
            $scope.zonesMap = $sce.trustAsResourceUrl(selectedCatalog.urlMapa);
            $log.debug($scope.zonesMap);
            callDirecciones(selectedCatalog);
            loadZones(selectedCatalog.id);
            initAdress();
        })
        vendedorService.obtenerConfiguracionVendedor().then(
            function(response){
                $scope.minPrice = response.data.montoMinimo;
            }
        );
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
        $log.debug(newComments);
        $scope.addressParticularities = newComments;
    }
    
    function setSelectedDeliveryPoint(newDeliveryPoint){
        $scope.selectedDeliveryPoint = newDeliveryPoint;
    }
    
    
            
    function formatDate(date){
      return date.slice(0,2) + "/" + date.slice(3,5) + "/" + date.slice(6,10);
    }
    
    function getAddressZone(address){

      function doOk(response){
        $scope.addressZone = response.data;
        $scope.addressZone.fechaCierrePedidos = formatDate($scope.addressZone.fechaCierrePedidos);
      }

      function doNoOk(response){
        $scope.addressZone = {
          descripcion: "La dirección del domicilio no está asociada con ninguna zona de entrega del vendedor. Por favor comuniquese con el adminsitrador del catálogo para confirmar los detalles de la compra."
        }
      }

      sellerService.getAddressZone(contextPurchaseService.getCatalogContext(), address.idDireccion, doNoOk).then(doOk);
    }
    

    function loadZones(catalogId){
        
        function doOk(response){
            $scope.zones = response.data.map(function(z){z.fechaCierrePedidos = formatDate(z.fechaCierrePedidos); return z;});
        }
            
        sellerService.getSellerZones(catalogId).then(doOk);
    }
        
    function callDirecciones(catalog) {
			$log.debug('call direcciones ');

			function fillUserAddresses(response) {
        console.log('call direcciones ', response.data);
        $scope.addresses = response.data;
        if($scope.order.idDireccion){
          $scope.address.selected = $scope.addresses.filter(function(address){return address.idDireccion == $scope.order.idDireccion})[0];
          getAddressZone($scope.address.selected);
        }
        showMultipleSelection(catalog);
			}

			function fillDeliveryPoints(response) {
        $log.debug('call delivery points ', response.data);
				$scope.deliveryPoints = response.data.puntosDeRetiro;
			}
      		
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

      if($scope.minPrice > $scope.order.montoActual){
          if($scope.mostrarSeleccionMultiple){
              $scope.mostrarSeleccionMultiple = false
          }
          $scope.deliveryTypes[0].show = false;
          $scope.deliveryTypes[1].show = catalog.few.puntoDeEntrega;
          $scope.showGoProfile = false;
          if(catalog.few.seleccionDeDireccionDelUsuario && catalog.few.puntoDeEntrega){                 
              $scope.advertencia = "Su pedido no supera el monto minimo de $" +String($scope.minPrice) + ", solo puede pasar a retirar el pedido";
              $scope.showMinPriceWarn = true;
          }
          if(catalog.few.seleccionDeDireccionDelUsuario && !catalog.few.puntoDeEntrega){
              $scope.advertencia = "No puede confirmar este pedido debido a que no supera el monto minimo de $" +String($scope.minPrice);
              $scope.showMinPriceWarn = true;
          }
      }

      if(!catalog.few.seleccionDeDireccionDelUsuario && !catalog.few.puntoDeEntrega){
          $scope.advertencia = "Por el momento las ventas estan deshabilitadas, vuelva a intentar mas tarde.";
          $scope.showMinPriceWarn = true;
      }
		}
        
        
    function validInformation(){
        return ($scope.address.selected != null &&
                (($scope.deliveryTypes[0].show && $scope.address.zone != null) || 
                $scope.deliveryTypes[1].show)) || (
                  $scope.order.type == "NODE" && $scope.address.selected != null
                );
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