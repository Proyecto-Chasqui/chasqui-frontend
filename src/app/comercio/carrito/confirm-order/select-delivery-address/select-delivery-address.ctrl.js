(function() {
	'use strict';

	angular.module('chasqui').controller('SelectDeliveryAddressController', SelectDeliveryAddressController);

	/** @ngInject */
	function SelectDeliveryAddressController($scope, $rootScope, contextPurchaseService, $log, vendedorService, sellerService, 
                                              perfilService, contextCatalogObserver) {
        
        
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
    $scope.setSelectedZone = setSelectedZone;
    $scope.setAddressParticularities = setAddressParticularities;
    $scope.setSelectedDeliveryPoint = setSelectedDeliveryPoint;
    $scope.getAddressZone = getAddressZone;
    $scope.validated = false;
    $scope.modeDefined = false;
    $scope.addressDefined = false;
    $scope.minPrice = 0;
    $scope.showMinPriceWarn = false;
    $scope.advertencia = "Su pedido no supera el monto minimo, solo puede pasar a retirar el pedido";

    $scope.validateAndNext = validateAndNext;

        
    /////////////////////////////////////
    
    function init(){
      contextCatalogObserver.observe(function(){
        contextPurchaseService.getSelectedCatalog()
        .then(function(selectedCatalog){
          callDirecciones(selectedCatalog);
          console.log("domicilio pre-seleccionado", $scope.getAddress());
          initAdress();
          console.log($scope.order);
        })
        vendedorService.obtenerConfiguracionVendedor().then(
            function(response){
                $scope.minPrice = response.data.montoMinimo;
            }
        )
      });
    }
    

    function initAdress(){
      if(!$scope.getAddress()){
        $scope.address = {
          type: "",
          selected: null,
          zone: null,
          particularities: ""
        }
      }
    }
    

    function callDirecciones(catalog) {
			$log.debug('call direcciones ');

			function fillUserAddresses(response) {
        $scope.addresses = response.data;
        console.log("id direccion", $scope.getAddress());
        // if($scope.order.idDireccion){
        if($scope.getAddress()){
          $scope.address = $scope.getAddress();

          $scope.address.selected = $scope.addresses.filter(function(address){return address.idDireccion == $scope.address.selected.idDireccion})[0];
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
     
    /////////////////////////////////////
        
    function setDeliveryType(deliverySelected){
        $scope.deliveryTypes = $scope.deliveryTypes.map(function(d){d.show = d.label == deliverySelected.label; return d});
        $scope.showGoProfile = $scope.deliveryTypes[0] == deliverySelected && $scope.addresses.length == 0;
        initAdress();
        $scope.validated = false;
    }
    
    function setSelectedZone(newZone){
        $scope.selectedZone = newZone;
    }
    
    function setAddressParticularities(newComments){
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
        $scope.address.zone = $scope.addressZone;
      }

      function doNoOk(response){
        $scope.addressZone = {
          descripcion: "La dirección del domicilio no está asociada con ninguna zona de entrega del vendedor. Por favor comuniquese con el administrador del catálogo para confirmar los detalles de la compra."
        }
        $scope.address.zone = $scope.addressZone;
      }

      sellerService.getAddressZone(contextPurchaseService.getCatalogContext(), address.idDireccion, doNoOk).then(doOk);
    }
        
       

    function validateAndNext(){
      $scope.validated = true;
      if(validInformation()){
        $scope.address.type = $scope.deliveryTypes[0].show? "address" : "deliveryPoint";
        $scope.next($scope.address);
      }
    }
        
    function validInformation(){
        return ($scope.address.selected != null 
              && (($scope.deliveryTypes[0].show) || $scope.deliveryTypes[1].show))
              || ($scope.order.type == "NODE" && $scope.address.selected != null);
    }
    
    $scope.$on("check-direccion", function(){
        if(validInformation()){
            $scope.validated = false;
            $scope.okAction($scope.address);
        }
    })
    
    // $rootScope.$on('order-loaded-suc', function(event, order){
      // console.log("order-loaded-suc 2", order);
      // $scope.order = order;
      // init();
    // });
    
    init();
	}

})();